import React, { useState } from 'react';
import { PieceIcon, PIECE_SVGS } from '../utils/chessPieces';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

/**
 * Interactive SVG/HTML Chessboard.
 * Supports:
 * - Click-to-move and drag-and-drop
 * - Legal move indicators (dots / capture rings)
 * - Last move highlights
 * - In-check king glow
 * - SVG Tactical arrows (Green = Best, Red = Blunder, Amber = Refutation)
 * - Pawn promotion selector
 */
export function ChessBoard({
  game,
  isFlipped = false,
  onMove,
  lastMove = null,
  arrows = [], // array of { from: 'e2', to: 'e4', color: 'green' | 'red' | 'amber' }
  isEngineThinking = false,
  disabled = false
}) {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [promotionPending, setPromotionPending] = useState(null); // { from, to }

  // Orientation
  const displayFiles = isFlipped ? [...FILES].reverse() : FILES;
  const displayRanks = isFlipped ? [...RANKS].reverse() : RANKS;

  // Board square indexing for 800x800 coordinate system
  const getSquareCenter = (square) => {
    if (!square || square.length < 2) return { x: 0, y: 0 };
    const file = square[0];
    const rank = square[1];

    const col = isFlipped
      ? 7 - (file.charCodeAt(0) - 97)
      : file.charCodeAt(0) - 97;
    const row = isFlipped
      ? parseInt(rank, 10) - 1
      : 8 - parseInt(rank, 10);

    return {
      x: col * 100 + 50,
      y: row * 100 + 50
    };
  };

  // Find in-check king square
  let checkSquare = null;
  if (game && game.inCheck && game.inCheck()) {
    const turn = game.turn();
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          checkSquare = `${FILES[c]}${8 - r}`;
        }
      }
    }
  }

  // Calculate legal moves for selected square
  const handleSelectSquare = (square) => {
    if (disabled || isEngineThinking) return;

    // If clicking on an already selected square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // Check if clicked square is a legal destination for existing selection
    const targetMove = legalMoves.find((m) => m.to === square);
    if (selectedSquare && targetMove) {
      executeMove(selectedSquare, square);
      return;
    }

    // Otherwise select the new piece if it belongs to current player turn
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const executeMove = (from, to) => {
    const piece = game.get(from);
    // Check for pawn promotion
    const isPawnPromotion =
      piece &&
      piece.type === 'p' &&
      ((piece.color === 'w' && to[1] === '8') ||
        (piece.color === 'b' && to[1] === '1'));

    if (isPawnPromotion) {
      setPromotionPending({ from, to, color: piece.color });
      return;
    }

    finalizeMove(from, to, null);
  };

  const finalizeMove = (from, to, promotion = null) => {
    setSelectedSquare(null);
    setLegalMoves([]);
    setPromotionPending(null);

    if (onMove) {
      onMove({ from, to, promotion });
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, square) => {
    if (disabled || isEngineThinking) {
      e.preventDefault();
      return;
    }
    const piece = game.get(square);
    if (!piece || piece.color !== game.turn()) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', square);
    setSelectedSquare(square);
    const moves = game.moves({ square, verbose: true });
    setLegalMoves(moves);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSquare) => {
    e.preventDefault();
    const fromSquare = e.dataTransfer.getData('text/plain');
    if (fromSquare && fromSquare !== targetSquare) {
      const isLegal = legalMoves.some((m) => m.to === targetSquare);
      if (isLegal) {
        executeMove(fromSquare, targetSquare);
      }
    }
  };

  return (
    <div className="relative aspect-square h-[min(80vh,620px)] w-[min(80vh,620px)] rounded-lg overflow-hidden shadow-2xl border-4 border-slate-800 select-none bg-slate-900 shrink-0">
      {/* 8x8 Grid */}
      <div className="w-full h-full grid grid-cols-8 grid-rows-8">
        {displayRanks.map((rank, rowIdx) =>
          displayFiles.map((file, colIdx) => {
            const square = `${file}${rank}`;
            const isLight = (rowIdx + colIdx) % 2 === 0;
            const piece = game ? game.get(square) : null;
            const isSelected = selectedSquare === square;
            const isLastMoveSquare =
              lastMove && (lastMove.from === square || lastMove.to === square);
            const isCheck = checkSquare === square;
            const legalTarget = legalMoves.find((m) => m.to === square);

            return (
              <div
                key={square}
                onClick={() => handleSelectSquare(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, square)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                  isLight ? 'bg-[#eeeed2]' : 'bg-[#769656]'
                } ${isLastMoveSquare ? 'ring-inset ring-4 ring-yellow-400/60 bg-yellow-200/40' : ''} ${
                  isSelected ? 'bg-amber-300/80 ring-inset ring-4 ring-amber-500' : ''
                } ${isCheck ? 'bg-red-500/70 animate-pulse' : ''}`}
              >
                {/* Board edge coordinate indicators */}
                {colIdx === 0 && (
                  <span
                    className={`absolute top-1 left-1 text-[10px] font-bold font-mono ${
                      isLight ? 'text-[#769656]' : 'text-[#eeeed2]'
                    }`}
                  >
                    {rank}
                  </span>
                )}
                {rowIdx === 7 && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[10px] font-bold font-mono ${
                      isLight ? 'text-[#769656]' : 'text-[#eeeed2]'
                    }`}
                  >
                    {file}
                  </span>
                )}

                {/* Legal move indicator */}
                {legalTarget && !piece && (
                  <div className="w-4 h-4 rounded-full bg-slate-900/30 pointer-events-none" />
                )}
                {legalTarget && piece && (
                  <div className="absolute inset-1 rounded-full border-4 border-slate-900/40 pointer-events-none" />
                )}

                {/* Piece Icon */}
                {piece && (
                  <div
                    draggable={!disabled && !isEngineThinking && piece.color === game.turn()}
                    onDragStart={(e) => handleDragStart(e, square)}
                    className="w-[86%] h-[86%] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing"
                  >
                    <PieceIcon piece={piece} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* SVG Overlay for Tactical Directional Arrows */}
      {arrows && arrows.length > 0 && (
        <svg
          viewBox="0 0 800 800"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          <defs>
            {/* Green Arrow Marker (Best Move) */}
            <marker
              id="arrow-green"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#22c55e" />
            </marker>

            {/* Red Arrow Marker (Blunder / Mistake) */}
            <marker
              id="arrow-red"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
            </marker>

            {/* Amber Arrow Marker (Refutation Line) */}
            <marker
              id="arrow-amber"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
            </marker>
          </defs>

          {arrows.map((arrow, idx) => {
            const start = getSquareCenter(arrow.from);
            const end = getSquareCenter(arrow.to);
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return null;

            // Shorten the end slightly so the arrowhead sits perfectly
            const trimEnd = 24;
            const trimStart = 16;
            const x1 = start.x + (dx / dist) * trimStart;
            const y1 = start.y + (dy / dist) * trimStart;
            const x2 = end.x - (dx / dist) * trimEnd;
            const y2 = end.y - (dy / dist) * trimEnd;

            const strokeColor =
              arrow.color === 'red'
                ? '#ef4444'
                : arrow.color === 'amber'
                ? '#f59e0b'
                : '#22c55e';

            const markerId =
              arrow.color === 'red'
                ? 'url(#arrow-red)'
                : arrow.color === 'amber'
                ? 'url(#arrow-amber)'
                : 'url(#arrow-green)';

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth="11"
                strokeLinecap="round"
                opacity="0.82"
                markerEnd={markerId}
              />
            );
          })}
        </svg>
      )}

      {/* Pawn Promotion Modal */}
      {promotionPending && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center">
          <div className="bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-700 flex flex-col items-center">
            <h4 className="text-white font-semibold text-sm mb-3">Promote Pawn</h4>
            <div className="flex gap-2">
              {['q', 'r', 'b', 'n'].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    finalizeMove(
                      promotionPending.from,
                      promotionPending.to,
                      type
                    )
                  }
                  className="w-14 h-14 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center p-1.5 transition-colors border border-slate-600 shadow-md"
                >
                  <PieceIcon piece={{ type, color: promotionPending.color }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Engine Thinking Pulse Indicator */}
      {isEngineThinking && (
        <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/40 flex items-center gap-2 shadow-lg z-20">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-medium text-emerald-300">
            Stockfish 19 calculating...
          </span>
        </div>
      )}
    </div>
  );
}

export default ChessBoard;
