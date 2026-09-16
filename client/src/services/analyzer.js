import { Chess } from 'chess.js';
import { wasmEngine } from './wasmEngine.js';
import { explainMistake } from './explainer.js';

export function scoreToCp(score) {
  if (!score) return 0;
  if (score.type === 'mate') {
    if (score.value > 0) return 10000;
    if (score.value < 0) return -10000;
    return 10000;
  }
  const val = Number(score.value);
  return isNaN(val) ? 0 : val;
}

export function winProbability(score) {
  if (!score) return 0.5;
  if (score.type === 'mate') {
    return score.value > 0 ? 1.0 : 0.0;
  }
  const cp = Number(score.value) || 0;
  return 1 / (1 + Math.pow(10, -cp / 400));
}

export function calculateMoveAccuracy(winProbBefore, winProbAfter) {
  const winLoss = Math.max(0, winProbBefore - winProbAfter);
  if (winLoss <= 0.001) return 100;
  const acc = 103.1668 * Math.exp(-0.04354 * (winLoss * 100)) - 3.1669;
  return Math.min(100, Math.max(0, Math.round(acc * 10) / 10));
}

export function classifyMove({ scoreBefore, scoreAfter, bestMoveUci, playedMoveUci, playerColor }) {
  const mult = playerColor === 'w' ? 1 : -1;
  const cpBefore = scoreToCp(scoreBefore) * mult;
  const cpAfter = scoreToCp(scoreAfter) * mult;

  const wpBefore = winProbability({ type: 'cp', value: cpBefore });
  const wpAfter = winProbability({ type: 'cp', value: cpAfter });
  const winLoss = Math.max(0, wpBefore - wpAfter);
  const cpLoss = Math.max(0, cpBefore - cpAfter);

  if (playedMoveUci && bestMoveUci && (playedMoveUci === bestMoveUci || cpLoss < 15)) {
    return { classification: 'Best', label: 'Best Move', glyph: '★', color: 'emerald' };
  }

  if (cpBefore >= 300 && cpAfter < 150) {
    return { classification: 'Missed Win', label: 'Missed Win', glyph: '✖', color: 'rose' };
  }

  if (cpLoss >= 250 || winLoss >= 0.25) {
    return { classification: 'Blunder', label: 'Blunder', glyph: '??', color: 'red' };
  }

  if (cpLoss >= 120 || winLoss >= 0.12) {
    return { classification: 'Mistake', label: 'Mistake', glyph: '?', color: 'amber' };
  }

  if (cpLoss >= 50 || winLoss >= 0.06) {
    return { classification: 'Inaccuracy', label: 'Inaccuracy', glyph: '?!', color: 'yellow' };
  }

  return { classification: 'Good', label: 'Good', glyph: '✔', color: 'blue' };
}

/**
 * Client-Side Stockfish WASM Game Analyzer
 * Runs 100% locally in the browser with 0ms network latency.
 */
export async function analyzeGame({ moves = [], initialFen = null, onProgress = null }) {
  const chess = initialFen ? new Chess(initialFen) : new Chess();
  const states = [];
  states.push({
    fen: chess.fen(),
    moveUci: null,
    moveSan: null,
    turn: chess.turn()
  });

  for (const move of moves) {
    let result = null;
    try {
      if (typeof move === 'string') {
        if (move.length === 4 || (move.length === 5 && !move.includes(' '))) {
          result = chess.move({
            from: move.slice(0, 2),
            to: move.slice(2, 4),
            promotion: move.length === 5 ? move[4] : undefined
          });
        } else {
          result = chess.move(move);
        }
      } else if (move && typeof move === 'object') {
        result = chess.move(move);
      }
    } catch (e) {
      console.warn('[WasmAnalyzer] Invalid move during replay:', move, e.message);
      break;
    }

    if (result) {
      states.push({
        fen: chess.fen(),
        moveUci: result.from + result.to + (result.promotion || ''),
        moveSan: result.san,
        turn: chess.turn(),
        playerColor: result.color
      });
    }
  }

  console.log(`[WasmAnalyzer] Evaluating ${states.length} positions with client-side Stockfish WASM...`);

  // Ensure WASM is initialized
  await wasmEngine.init();

  const evals = [];
  for (let i = 0; i < states.length; i++) {
    const s = states[i];
    if (onProgress) {
      onProgress({
        current: i + 1,
        total: states.length,
        percent: Math.round(((i + 1) / states.length) * 100)
      });
    }

    // Check if terminal position (checkmate / draw)
    let isTerminal = false;
    try {
      const posChess = new Chess(s.fen);
      if (posChess.isGameOver()) {
        isTerminal = true;
        if (posChess.isCheckmate()) {
          // Side to move has been checkmated
          // If turn is 'b', White delivered checkmate -> +1 mate from White's perspective
          // If turn is 'w', Black delivered checkmate -> -1 mate from White's perspective
          const mateVal = posChess.turn() === 'b' ? 1 : -1;
          evals.push({
            bestMove: '(none)',
            score: { type: 'mate', value: mateVal },
            pv: []
          });
        } else {
          evals.push({
            bestMove: '(none)',
            score: { type: 'cp', value: 0 },
            pv: []
          });
        }
      }
    } catch (fenErr) {
      console.warn('[WasmAnalyzer] Error validating position:', fenErr);
    }

    if (isTerminal) continue;

    const evalResult = await wasmEngine.getBestMove({
      fen: s.fen,
      depth: 12,
      movetime: 400
    });

    evals.push({
      bestMove: evalResult.bestMove || '(none)',
      score: evalResult.score || { type: 'cp', value: 0 },
      pv: evalResult.pv || []
    });
  }

  let whiteAccuracySum = 0;
  let whiteMoveCount = 0;
  let blackAccuracySum = 0;
  let blackMoveCount = 0;

  const analysisSteps = [];
  const counts = {
    white: { best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, missedWin: 0 },
    black: { best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, missedWin: 0 }
  };

  for (let i = 1; i < states.length; i++) {
    const stateBefore = states[i - 1];
    const stateAfter = states[i];
    const evalBefore = evals[i - 1] || { bestMove: '(none)', score: { type: 'cp', value: 0 }, pv: [] };
    const evalAfter = evals[i] || { bestMove: '(none)', score: { type: 'cp', value: 0 }, pv: [] };

    const playerColor = stateAfter.playerColor || (i % 2 === 1 ? 'w' : 'b');
    const sideKey = playerColor === 'w' ? 'white' : 'black';

    const bestMoveUci = evalBefore.bestMove || '(none)';
    let bestMoveSan = bestMoveUci;
    if (bestMoveUci && bestMoveUci !== '(none)' && bestMoveUci.length >= 4) {
      try {
        const cTemp = new Chess(stateBefore.fen);
        const bRes = cTemp.move({
          from: bestMoveUci.slice(0, 2),
          to: bestMoveUci.slice(2, 4),
          promotion: bestMoveUci.length > 4 ? bestMoveUci[4] : undefined
        });
        if (bRes) bestMoveSan = bRes.san;
      } catch (err) {}
    } else {
      bestMoveSan = '-';
    }

    const classificationData = classifyMove({
      scoreBefore: evalBefore.score,
      scoreAfter: evalAfter.score,
      bestMoveUci,
      playedMoveUci: stateAfter.moveUci,
      playerColor
    });

    const classification = classificationData.classification;
    if (classification === 'Best') counts[sideKey].best++;
    else if (classification === 'Good') counts[sideKey].good++;
    else if (classification === 'Inaccuracy') counts[sideKey].inaccuracy++;
    else if (classification === 'Mistake') counts[sideKey].mistake++;
    else if (classification === 'Blunder') counts[sideKey].blunder++;
    else if (classification === 'Missed Win') counts[sideKey].missedWin++;

    const mult = playerColor === 'w' ? 1 : -1;
    const cpBefore = scoreToCp(evalBefore.score) * mult;
    const cpAfter = scoreToCp(evalAfter.score) * mult;

    const wpBefore = winProbability({ type: 'cp', value: cpBefore });
    const wpAfter = winProbability({ type: 'cp', value: cpAfter });
    const accuracy = calculateMoveAccuracy(wpBefore, wpAfter);

    if (playerColor === 'w') {
      whiteAccuracySum += accuracy;
      whiteMoveCount++;
    } else {
      blackAccuracySum += accuracy;
      blackMoveCount++;
    }

    let explanation = null;
    if (['Inaccuracy', 'Mistake', 'Blunder', 'Missed Win'].includes(classification)) {
      try {
        explanation = explainMistake({
          fenBefore: stateBefore.fen,
          fenAfter: stateAfter.fen,
          playedMoveUci: stateAfter.moveUci,
          playedMoveSan: stateAfter.moveSan,
          bestMoveUci,
          bestMoveSan,
          scoreBefore: evalBefore.score,
          scoreAfter: evalAfter.score,
          classification,
          refutationPv: evalAfter.pv || [],
          turn: playerColor
        });
      } catch (expErr) {
        console.warn('[WasmAnalyzer] explainMistake fallback:', expErr);
      }
    }

    const normalizedScore = evalAfter.score || { type: 'cp', value: 0 };
    const whiteEvalCp = normalizedScore.type === 'mate'
      ? (normalizedScore.value > 0 ? 1000 : -1000)
      : (Number(normalizedScore.value) || 0);

    analysisSteps.push({
      ply: i,
      moveNumber: Math.ceil(i / 2),
      turn: playerColor,
      playedMoveUci: stateAfter.moveUci,
      playedMoveSan: stateAfter.moveSan,
      fenBefore: stateBefore.fen,
      fenAfter: stateAfter.fen,
      score: normalizedScore,
      whiteEvalCp,
      bestMoveUci,
      bestMoveSan,
      refutationPv: evalAfter.pv || [],
      classification: classificationData,
      accuracy,
      explanation
    });
  }

  const whiteAccuracy = whiteMoveCount > 0 ? Math.round((whiteAccuracySum / whiteMoveCount) * 10) / 10 : 100;
  const blackAccuracy = blackMoveCount > 0 ? Math.round((blackAccuracySum / blackMoveCount) * 10) / 10 : 100;

  return {
    accuracy: {
      white: whiteAccuracy,
      black: blackAccuracy
    },
    counts,
    steps: analysisSteps
  };
}
