import React, { useEffect, useRef } from 'react';
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast } from 'lucide-react';
import { PieceIcon } from '../utils/chessPieces';

const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/**
 * Move history list with:
 * - Grouped White/Black plies
 * - Quality glyph badges (Best, Good, Inaccuracy, Mistake, Blunder)
 * - Material count and captured piece display
 * - Arrow key navigation support
 */
export function MoveHistory({
  moves = [],
  analysisSteps = [],
  currentPly = 0,
  onSelectPly,
  capturedPieces = { white: [], black: [] }
}) {
  const scrollRef = useRef(null);

  // Auto scroll to active ply
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentPly]);

  // Keyboard navigation: Left/Right arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (onSelectPly) onSelectPly(Math.max(0, currentPly - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (onSelectPly) onSelectPly(Math.min(moves.length, currentPly + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPly, moves.length, onSelectPly]);

  const whiteMaterial = capturedPieces.white.reduce(
    (sum, p) => sum + (PIECE_VALUES[p.toLowerCase()] || 0),
    0
  );
  const blackMaterial = capturedPieces.black.reduce(
    (sum, p) => sum + (PIECE_VALUES[p.toLowerCase()] || 0),
    0
  );
  const materialDiff = whiteMaterial - blackMaterial;

  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i] ? { ...moves[i], ply: i + 1 } : null,
      black: moves[i + 1] ? { ...moves[i + 1], ply: i + 2 } : null
    });
  }

  const getGlyphBadge = (plyIndex) => {
    if (!analysisSteps || analysisSteps.length === 0) return null;
    const step = analysisSteps.find((s) => s.ply === plyIndex);
    if (!step || !step.classification) return null;

    const { classification, glyph } = step.classification;
    let badgeStyle = 'text-slate-400';
    if (classification === 'Best') badgeStyle = 'text-emerald-400 font-bold';
    else if (classification === 'Good') badgeStyle = 'text-blue-400';
    else if (classification === 'Inaccuracy') badgeStyle = 'text-amber-300 font-bold';
    else if (classification === 'Mistake') badgeStyle = 'text-orange-400 font-bold';
    else if (classification === 'Blunder') badgeStyle = 'text-rose-400 font-black';
    else if (classification === 'Missed Win') badgeStyle = 'text-purple-400 font-bold';

    return (
      <span className={`ml-1 text-[11px] font-mono leading-none ${badgeStyle}`}>
        {glyph}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden select-none">
      {/* Captured Material Header */}
      <div className="px-2.5 py-1.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          {/* White Captures */}
          <div className="flex items-center gap-0.5 flex-wrap">
            <span className="text-[10px] text-slate-500 mr-1">W:</span>
            {capturedPieces.white.map((type, idx) => (
              <div key={idx} className="w-3.5 h-3.5 opacity-80">
                <PieceIcon piece={{ type: type.toLowerCase(), color: 'b' }} />
              </div>
            ))}
            {materialDiff > 0 && (
              <span className="text-[10px] font-mono text-emerald-400 font-bold ml-1">
                +{materialDiff}
              </span>
            )}
          </div>
        </div>

        {/* Black Captures */}
        <div className="flex items-center gap-0.5 flex-wrap">
          <span className="text-[10px] text-slate-500 mr-1">B:</span>
          {capturedPieces.black.map((type, idx) => (
            <div key={idx} className="w-3.5 h-3.5 opacity-80">
              <PieceIcon piece={{ type: type.toLowerCase(), color: 'w' }} />
            </div>
          ))}
          {materialDiff < 0 && (
            <span className="text-[10px] font-mono text-slate-300 font-bold ml-1">
              +{Math.abs(materialDiff)}
            </span>
          )}
        </div>
      </div>

      {/* Move Notation List with Internal Scrollbar */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-800/40 text-xs font-mono"
      >
        {movePairs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 italic p-4 text-xs">
            Moves will appear here...
          </div>
        ) : (
          movePairs.map((pair) => (
            <div
              key={pair.moveNumber}
              className="grid grid-cols-[32px_1fr_1fr] items-center px-2 py-1 hover:bg-slate-800/30 transition-colors"
            >
              <span className="text-slate-500 text-[10px]">{pair.moveNumber}.</span>

              {/* White Move */}
              <button
                onClick={() => onSelectPly && onSelectPly(pair.white.ply)}
                data-active={currentPly === pair.white.ply}
                className={`flex items-center justify-between px-1.5 py-0.5 rounded text-left transition-colors ${
                  currentPly === pair.white.ply
                    ? 'bg-emerald-600/30 text-emerald-300 font-bold'
                    : 'text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{pair.white.san}</span>
                {getGlyphBadge(pair.white.ply)}
              </button>

              {/* Black Move */}
              {pair.black ? (
                <button
                  onClick={() => onSelectPly && onSelectPly(pair.black.ply)}
                  data-active={currentPly === pair.black.ply}
                  className={`flex items-center justify-between px-1.5 py-0.5 rounded text-left transition-colors ${
                    currentPly === pair.black.ply
                      ? 'bg-emerald-600/30 text-emerald-300 font-bold'
                      : 'text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{pair.black.san}</span>
                  {getGlyphBadge(pair.black.ply)}
                </button>
              ) : (
                <span />
              )}
            </div>
          ))
        )}
      </div>

      {/* Step Navigation Controls */}
      <div className="p-1.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-center gap-2 shrink-0">
        <button
          onClick={() => onSelectPly && onSelectPly(0)}
          disabled={currentPly <= 0}
          title="Start (Home)"
          className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 transition-colors"
        >
          <ChevronFirst size={15} />
        </button>
        <button
          onClick={() => onSelectPly && onSelectPly(Math.max(0, currentPly - 1))}
          disabled={currentPly <= 0}
          title="Previous (Left Arrow)"
          className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="font-mono text-[11px] text-slate-400 px-1">
          {currentPly}/{moves.length}
        </span>
        <button
          onClick={() => onSelectPly && onSelectPly(Math.min(moves.length, currentPly + 1))}
          disabled={currentPly >= moves.length}
          title="Next (Right Arrow)"
          className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 transition-colors"
        >
          <ChevronRight size={15} />
        </button>
        <button
          onClick={() => onSelectPly && onSelectPly(moves.length)}
          disabled={currentPly >= moves.length}
          title="End (End)"
          className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 transition-colors"
        >
          <ChevronLast size={15} />
        </button>
      </div>
    </div>
  );
}

export default MoveHistory;
