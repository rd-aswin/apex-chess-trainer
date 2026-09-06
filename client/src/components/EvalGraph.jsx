import React from 'react';

/**
 * Compact Interactive SVG Advantage Chart.
 * Height: 60px - sleek momentum ribbon with blunder/mistake dots.
 */
export function EvalGraph({
  steps = [],
  currentPly = 0,
  onSelectPly
}) {
  if (!steps || steps.length === 0) {
    return null;
  }

  const width = 600;
  const height = 60;
  const centerY = height / 2;
  const totalPlies = steps.length;

  const getClampedY = (whiteEvalCp) => {
    const cp = Math.max(-800, Math.min(800, whiteEvalCp || 0));
    return centerY - (cp / 800) * (centerY - 6);
  };

  const points = steps.map((step, idx) => {
    const x = ((idx + 1) / totalPlies) * (width - 16) + 8;
    const y = getClampedY(step.whiteEvalCp);
    return {
      x,
      y,
      ply: step.ply,
      cp: step.whiteEvalCp,
      classification: step.classification?.classification
    };
  });

  const startPoint = { x: 8, y: centerY, ply: 0, cp: 0 };
  const allPoints = [startPoint, ...points];

  const linePath = allPoints.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
    ''
  );

  const fillPath = `${linePath} L ${allPoints[allPoints.length - 1].x.toFixed(1)} ${centerY} L 8 ${centerY} Z`;
  const currentPt = allPoints.find((p) => p.ply === currentPly) || allPoints[0];

  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-1.5 flex flex-col gap-1 select-none shrink-0">
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span className="font-semibold text-slate-300">Advantage Curve</span>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Blunder
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Mistake
          </span>
        </div>
      </div>

      <div className="relative w-full h-[52px] bg-slate-950 rounded overflow-hidden border border-slate-800/80 cursor-pointer">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-full select-none"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const ratio = clickX / rect.width;
            const targetPly = Math.round(ratio * totalPlies);
            if (onSelectPly) onSelectPly(Math.max(0, Math.min(totalPlies, targetPly)));
          }}
        >
          {/* Neutral Centerline */}
          <line
            x1="0"
            y1={centerY}
            x2={width}
            y2={centerY}
            stroke="#334155"
            strokeDasharray="2 2"
            strokeWidth="1"
          />

          {/* Shaded Area */}
          <path d={fillPath} fill="rgba(16, 185, 129, 0.18)" />

          {/* Advantage Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Blunder & Mistake Markers */}
          {points.map((pt) => {
            if (pt.classification === 'Blunder' || pt.classification === 'Missed Win') {
              return (
                <circle
                  key={pt.ply}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  className="fill-rose-500 stroke-slate-950 stroke-1 hover:scale-150 transition-transform cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectPly) onSelectPly(pt.ply);
                  }}
                />
              );
            }
            if (pt.classification === 'Mistake') {
              return (
                <circle
                  key={pt.ply}
                  cx={pt.x}
                  cy={pt.y}
                  r="3"
                  className="fill-amber-400 stroke-slate-950 stroke-1 hover:scale-150 transition-transform cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectPly) onSelectPly(pt.ply);
                  }}
                />
              );
            }
            return null;
          })}

          {/* Current Ply Vertical Scrubber */}
          {currentPt && (
            <g>
              <line
                x1={currentPt.x}
                y1="0"
                x2={currentPt.x}
                y2={height}
                stroke="#38bdf8"
                strokeWidth="1.6"
              />
              <circle
                cx={currentPt.x}
                cy={currentPt.y}
                r="3.5"
                fill="#38bdf8"
                stroke="#020617"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

export default EvalGraph;
