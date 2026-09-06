import React from 'react';

/**
 * Dynamic vertical evaluation bar.
 * Calculates visual percentage using Lichess/Stockfish sigmoid winning chance model:
 * P(win) = 50 + 50 * (2 / (1 + exp(-0.00368208 * cp)) - 1)
 */
export function EvalBar({ score, isFlipped = false }) {
  let whitePercent = 50;
  let label = '0.0';

  if (score) {
    if (score.type === 'mate') {
      const mateMoves = score.value;
      if (mateMoves > 0) {
        whitePercent = 100;
        label = `M${mateMoves}`;
      } else if (mateMoves < 0) {
        whitePercent = 0;
        label = `-M${Math.abs(mateMoves)}`;
      } else {
        whitePercent = 50;
        label = '0.0';
      }
    } else {
      const cp = typeof score === 'number' ? score : (score.value || 0);
      // Normalized from White perspective (+ = White ahead, - = Black ahead)
      const sigmoid = 2 / (1 + Math.exp(-0.00368208 * cp)) - 1;
      whitePercent = Math.min(100, Math.max(0, 50 + 50 * sigmoid));
      const absVal = (Math.abs(cp) / 100).toFixed(1);
      label = cp > 0 ? `+${absVal}` : cp < 0 ? `-${absVal}` : '0.0';
    }
  }

  const isWhiteWinning = whitePercent >= 50;

  // Board orientation visual mapping:
  // When !isFlipped (standard White at bottom): Top = Black (dark), Bottom = White (light)
  // When isFlipped (board flipped, Black at bottom): Top = White (light), Bottom = Black (dark)
  const topColorClass = isFlipped ? 'bg-slate-100' : 'bg-slate-900';
  const bottomColorClass = isFlipped ? 'bg-slate-900' : 'bg-slate-100';

  const topHeight = isFlipped ? whitePercent : (100 - whitePercent);
  const bottomHeight = isFlipped ? (100 - whitePercent) : whitePercent;

  // Text color on light (White) vs dark (Black) slices:
  const topTextClass = isFlipped ? 'text-slate-900 font-bold' : 'text-slate-200 font-bold';
  const bottomTextClass = isFlipped ? 'text-slate-200 font-bold' : 'text-slate-900 font-bold';

  // Label placement:
  // If White is winning (whitePercent >= 50), show label in White's slice (Top if isFlipped, Bottom if !isFlipped).
  // If Black is winning (whitePercent < 50), show label in Black's slice (Bottom if isFlipped, Top if !isFlipped).
  const showLabelInTop = isFlipped ? isWhiteWinning : !isWhiteWinning;
  const showLabelInBottom = isFlipped ? !isWhiteWinning : isWhiteWinning;

  return (
    <div className="relative w-7 h-full max-h-[min(80vh,620px)] bg-slate-900 rounded-lg overflow-hidden flex flex-col shadow-inner border border-slate-700/60 select-none shrink-0">
      {/* Top Slice */}
      <div 
        className={`w-full ${topColorClass} transition-all duration-500 ease-out flex items-start justify-center pt-2 overflow-hidden`}
        style={{ height: `${topHeight}%` }}
      >
        {showLabelInTop && (
          <span className={`text-[11px] font-mono tracking-tighter leading-none ${topTextClass}`}>
            {label}
          </span>
        )}
      </div>

      {/* Bottom Slice */}
      <div 
        className={`w-full ${bottomColorClass} transition-all duration-500 ease-out flex items-end justify-center pb-2 shadow-sm overflow-hidden`}
        style={{ height: `${bottomHeight}%` }}
      >
        {showLabelInBottom && (
          <span className={`text-[11px] font-mono tracking-tighter leading-none ${bottomTextClass}`}>
            {label}
          </span>
        )}
      </div>

      {/* Center zero-advantage marker */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-500/50 pointer-events-none z-10" />
    </div>
  );
}

export default EvalBar;
