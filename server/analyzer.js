import { Chess } from 'chess.js';
import { stockfishEngine } from './engine.js';
import { explainMistake } from './explainer.js';

export function winProbability(score) {
  if (!score) return 0.5;
  if (score.type === 'mate') {
    return score.value > 0 ? 1.0 : 0.0;
  }
  const cp = score.value;
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
  const cpBefore = scoreBefore.type === 'mate' ? (scoreBefore.value > 0 ? 10000 : -10000) : scoreBefore.value * mult;
  const cpAfter = scoreAfter.type === 'mate' ? (scoreAfter.value < 0 ? 10000 : -10000) : -scoreAfter.value * mult;

  const wpBefore = winProbability({ type: 'cp', value: cpBefore });
  const wpAfter = winProbability({ type: 'cp', value: cpAfter });
  const winLoss = Math.max(0, wpBefore - wpAfter);
  const cpLoss = Math.max(0, cpBefore - cpAfter);

  if (playedMoveUci === bestMoveUci || cpLoss < 15) {
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

export async function analyzeGame({ moves = [], initialFen = null }) {
  const chess = initialFen ? new Chess(initialFen) : new Chess();
  const states = [];
  states.push({
    fen: chess.fen(),
    move: null,
    moveSan: null,
    turn: chess.turn()
  });

  for (const move of moves) {
    let result = null;
    try {
      if (move.length === 4 || move.length === 5) {
        result = chess.move({
          from: move.slice(0, 2),
          to: move.slice(2, 4),
          promotion: move.length === 5 ? move[4] : undefined
        });
      } else {
        result = chess.move(move);
      }
    } catch (e) {
      console.warn('[Analyzer] Invalid move during replay:', move, e.message);
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

  console.log(`[Analyzer] Evaluating ${states.length} positions with Stockfish 19...`);

  const evals = [];
  for (let i = 0; i < states.length; i++) {
    const s = states[i];
    const evalResult = await stockfishEngine.evaluate({ fen: s.fen, depth: 16 });
    evals.push(evalResult);
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
    const evalBefore = evals[i - 1];
    const evalAfter = evals[i];

    const playerColor = stateAfter.playerColor;
    const sideKey = playerColor === 'w' ? 'white' : 'black';

    const bestMoveUci = evalBefore.bestMove;
    let bestMoveSan = bestMoveUci;
    try {
      const cTemp = new Chess(stateBefore.fen);
      const bRes = cTemp.move({
        from: bestMoveUci.slice(0, 2),
        to: bestMoveUci.slice(2, 4),
        promotion: bestMoveUci.length > 4 ? bestMoveUci[4] : undefined
      });
      if (bRes) bestMoveSan = bRes.san;
    } catch (err) {}

    const classificationData = classifyMove({
      scoreBefore: evalBefore.primaryScore,
      scoreAfter: evalAfter.primaryScore,
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
    const cpBefore = evalBefore.primaryScore.type === 'mate'
      ? (evalBefore.primaryScore.value > 0 ? 10000 : -10000)
      : evalBefore.primaryScore.value * mult;
    const cpAfter = evalAfter.primaryScore.type === 'mate'
      ? (evalAfter.primaryScore.value < 0 ? 10000 : -10000)
      : -evalAfter.primaryScore.value * mult;

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
      explanation = explainMistake({
        fenBefore: stateBefore.fen,
        fenAfter: stateAfter.fen,
        playedMoveUci: stateAfter.moveUci,
        playedMoveSan: stateAfter.moveSan,
        bestMoveUci,
        bestMoveSan,
        scoreBefore: evalBefore.primaryScore,
        scoreAfter: evalAfter.primaryScore,
        classification,
        refutationPv: evalAfter.primaryPv,
        turn: playerColor
      });
    }

    const whiteEvalCp = evalAfter.primaryScore.type === 'mate'
      ? (evalAfter.primaryScore.value > 0 ? (stateAfter.turn === 'w' ? 1000 : -1000) : (stateAfter.turn === 'w' ? -1000 : 1000))
      : (stateAfter.turn === 'w' ? evalAfter.primaryScore.value : -evalAfter.primaryScore.value);

    // Normalize score to White's perspective (+ = White advantage, - = Black advantage)
    const normalizedScore = evalAfter.primaryScore.type === 'mate'
      ? {
          type: 'mate',
          value: stateAfter.turn === 'w' ? evalAfter.primaryScore.value : -evalAfter.primaryScore.value
        }
      : {
          type: 'cp',
          value: whiteEvalCp
        };

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
      refutationPv: evalAfter.primaryPv,
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
