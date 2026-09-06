import { Chess } from 'chess.js';

const PIECE_NAMES = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king'
};

const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3.2,
  r: 5,
  q: 9,
  k: 100
};

function pieceName(p) {
  if (!p) return 'piece';
  const type = typeof p === 'string' ? p : p.type;
  return PIECE_NAMES[type.toLowerCase()] || 'piece';
}

function findHangingPieces(chessInstance, color) {
  const hanging = [];
  const board = chessInstance.board();
  const enemyColor = color === 'w' ? 'b' : 'w';

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== color || piece.type === 'k') continue;

      const square = String.fromCharCode(97 + c) + (8 - r);
      if (chessInstance.isAttacked(square, enemyColor)) {
        hanging.push({ square, piece: piece.type, value: PIECE_VALUES[piece.type] });
      }
    }
  }
  return hanging;
}

function detectFork(chessAfterMove) {
  const moverColor = chessAfterMove.turn() === 'w' ? 'b' : 'w';
  const opponentColor = chessAfterMove.turn();

  const board = chessAfterMove.board();
  const attackedValuablePieces = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== opponentColor) continue;

      const sq = String.fromCharCode(97 + c) + (8 - r);
      if (chessAfterMove.isAttacked(sq, moverColor)) {
        if (piece.type === 'k' || PIECE_VALUES[piece.type] >= 3) {
          attackedValuablePieces.push({ square: sq, piece: piece.type });
        }
      }
    }
  }

  return attackedValuablePieces.length >= 2 ? attackedValuablePieces : null;
}

export function explainMistake({
  fenBefore,
  fenAfter,
  playedMoveUci,
  playedMoveSan,
  bestMoveUci,
  bestMoveSan,
  scoreBefore,
  scoreAfter,
  classification,
  refutationPv = [],
  turn
}) {
  const chessBefore = new Chess(fenBefore);
  const chessAfter = new Chess(fenAfter);

  const playerColor = turn;
  const opponentColor = turn === 'w' ? 'b' : 'w';
  const opponentSide = opponentColor === 'w' ? 'White' : 'Black';

  const fromSq = playedMoveUci.slice(0, 2);
  const toSq = playedMoveUci.slice(2, 4);
  const movedPiece = chessBefore.get(fromSq);

  const bestFromSq = bestMoveUci ? bestMoveUci.slice(0, 2) : '';
  const bestToSq = bestMoveUci ? bestMoveUci.slice(2, 4) : '';
  const bestMovedPiece = bestFromSq ? chessBefore.get(bestFromSq) : null;

  let whySummary = '';
  let whyBetter = '';
  const motifs = [];
  let refutationExplanation = '';

  // 1. Check for Forced Checkmate
  if (scoreAfter && scoreAfter.type === 'mate' && scoreAfter.value > 0) {
    const mateIn = scoreAfter.value;
    motifs.push('Allowed Forced Checkmate');
    if (mateIn === 1) {
      whySummary = `${playedMoveSan} blunders immediate checkmate! Stockfish can deliver checkmate on the next move.`;
    } else {
      whySummary = `${playedMoveSan} leaves your king without shelter, permitting Stockfish to force checkmate in ${mateIn} moves.`;
    }
    whyBetter = `${bestMoveSan} prevents the checkmate net by creating an escape square or blocking the attack.`;
  }

  // 2. Refutation analysis from Stockfish's PV
  if (refutationPv && refutationPv.length > 0) {
    const punishUci = refutationPv[0];
    const punishFrom = punishUci.slice(0, 2);
    const punishTo = punishUci.slice(2, 4);

    try {
      const chessPunish = new Chess(fenAfter);
      const punishMove = chessPunish.move({
        from: punishFrom,
        to: punishTo,
        promotion: punishUci.length > 4 ? punishUci[4] : undefined
      });

      if (punishMove) {
        if (chessPunish.isCheckmate()) {
          const san = punishMove.san.endsWith('#') ? punishMove.san : `${punishMove.san}#`;
          refutationExplanation = `Stockfish immediately plays ${san}, ending the game with checkmate.`;
        } else if (punishMove.captured) {
          const capName = pieceName(punishMove.captured);
          refutationExplanation = `Stockfish plays ${punishMove.san}, capturing your ${capName} on ${punishTo}.`;
          if (!whySummary) {
            motifs.push('Material Loss');
            whySummary = `${playedMoveSan} blunders material: Stockfish wins your ${capName} with ${punishMove.san}.`;
          }
        } else if (chessPunish.inCheck()) {
          refutationExplanation = `Stockfish punishes this with ${punishMove.san}+, opening an aggressive check on your king.`;
          if (!whySummary) {
            motifs.push('Compromised King Safety');
            whySummary = `${playedMoveSan} compromises king safety, inviting Stockfish's attack with ${punishMove.san}+.`;
          }
        }

        const forkTargets = detectFork(chessPunish);
        if (forkTargets && forkTargets.length >= 2 && !chessPunish.isCheckmate()) {
          motifs.push('Allowed Tactical Fork');
          const names = forkTargets.map(t => `${pieceName(t.piece)} on ${t.square}`).join(' and ');
          refutationExplanation = `Stockfish plays ${punishMove.san}, executing a devastating fork against your ${names}.`;
          if (!whySummary) {
            whySummary = `${playedMoveSan} allows Stockfish to fork your ${names} with ${punishMove.san}.`;
          }
        }
      }
    } catch (e) {}
  }

  // 3. Hanging piece placed directly into line of fire
  if (!whySummary && movedPiece) {
    const isAttackedAfter = chessAfter.isAttacked(toSq, opponentColor);
    const isDefendedAfter = chessAfter.isAttacked(toSq, playerColor);

    if (isAttackedAfter && !isDefendedAfter && movedPiece.type !== 'k') {
      motifs.push('Hanging Piece');
      whySummary = `${playedMoveSan} moves your ${pieceName(movedPiece)} into ${toSq} where it hangs with zero defenders.`;
    }
  }

  // 4. Abandoned defender (removing the guard)
  if (!whySummary && movedPiece) {
    const hangingBefore = findHangingPieces(chessBefore, playerColor);
    const hangingAfter = findHangingPieces(chessAfter, playerColor);

    const newlyHanging = hangingAfter.filter(
      ha => !hangingBefore.some(hb => hb.square === ha.square) && ha.square !== toSq
    );

    if (newlyHanging.length > 0) {
      const victim = newlyHanging[0];
      motifs.push('Removed Defender');
      whySummary = `Moving your ${pieceName(movedPiece)} away from ${fromSq} leaves your ${pieceName(victim.piece)} on ${victim.square} completely undefended.`;
    }
  }

  // 5. Positional / Strategic Concessions
  if (!whySummary) {
    if (movedPiece?.type === 'k' && !chessBefore.inCheck()) {
      motifs.push('Premature King Walk');
      whySummary = `${playedMoveSan} wanders your king out unnecessarily, forfeiting castling rights and leaving it vulnerable to open lines.`;
    } else if (movedPiece?.type === 'p' && (toSq === 'f3' || toSq === 'f6')) {
      motifs.push('Weakened King Diagonal');
      whySummary = `${playedMoveSan} weakens the critical f-pawn diagonal, exposing your king to diagonal checks.`;
    } else {
      motifs.push('Positional Concession');
      whySummary = `${playedMoveSan} surrenders active piece play, allowing ${opponentSide} to seize the initiative and restrict your counterplay.`;
    }
  }

  // 6. Detailed Explanation of WHY the recommended move is superior
  if (!whyBetter) {
    if (bestMoveSan && bestMovedPiece) {
      if (bestMoveSan.startsWith('O-O')) {
        whyBetter = `${bestMoveSan} shelters your king into safety and activates your rook on the central files, preventing enemy tactical strikes.`;
      } else if (bestMovedPiece.type === 'p') {
        whyBetter = `${bestMoveSan} controls key central squares, avoids tactical weaknesses, and denies opponent pieces forward outposts.`;
      } else if (bestMovedPiece.type === 'n' || bestMovedPiece.type === 'b') {
        whyBetter = `${bestMoveSan} develops your ${pieceName(bestMovedPiece)} actively to a defended square, maintaining piece coordination without hanging material.`;
      } else if (bestMovedPiece.type === 'r' || bestMovedPiece.type === 'q') {
        whyBetter = `${bestMoveSan} repositions your ${pieceName(bestMovedPiece)} to an open file or active diagonal while keeping your defenses solid.`;
      } else {
        whyBetter = `${bestMoveSan} preserves your positional balance and avoids walking into Stockfish's counter-tactics.`;
      }
    } else if (bestMoveSan) {
      whyBetter = `${bestMoveSan} solves the tactical tension on the board and keeps your position solid.`;
    }
  }

  return {
    tacticalMotifs: motifs.length > 0 ? motifs : ['Tactical Slip'],
    tacticalMotif: motifs[0] || 'Tactical Slip',
    why: whySummary,
    whySummary,
    whyBetter,
    refutationExplanation: refutationExplanation || 'Stockfish immediately seizes the initiative and mounts an attack on your position.',
    classification
  };
}
