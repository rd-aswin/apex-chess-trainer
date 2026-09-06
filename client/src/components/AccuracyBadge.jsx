import React from 'react';
import { Award, Zap, ShieldAlert, Check } from 'lucide-react';

/**
 * Post-Game Accuracy Summary Card.
 * Displays CAPS accuracy comparison (User vs Stockfish 19)
 * and classification breakdown pills (Best, Good, Inaccuracy, Mistake, Blunder).
 */
export function AccuracyBadge({
  accuracy = { white: 100, black: 100 },
  counts = {
    white: { best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, missedWin: 0 },
    black: { best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0, missedWin: 0 }
  },
  userColor = 'w'
}) {
  const userAcc = userColor === 'w' ? accuracy.white : accuracy.black;
  const engineAcc = userColor === 'w' ? accuracy.black : accuracy.white;

  const userCounts = userColor === 'w' ? counts.white : counts.black;
  const engineCounts = userColor === 'w' ? counts.black : counts.white;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Award className="text-amber-400" size={20} />
          <h3 className="text-sm font-bold text-slate-200">Match Accuracy Performance</h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          CAPS Model
        </span>
      </div>

      {/* Accuracy Comparison Bars */}
      <div className="grid grid-cols-2 gap-4">
        {/* User Card */}
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              You ({userColor === 'w' ? 'White' : 'Black'})
            </span>
            <span className="font-mono font-bold text-base text-emerald-400">
              {userAcc}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, userAcc)}%` }}
            />
          </div>
        </div>

        {/* Stockfish Card */}
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Stockfish 19 ({userColor === 'w' ? 'Black' : 'White'})
            </span>
            <span className="font-mono font-bold text-base text-blue-400">
              {engineAcc}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, engineAcc)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Move Breakdown Matrix */}
      <div className="flex flex-col gap-1.5 text-xs">
        <div className="grid grid-cols-[1fr_60px_60px] text-[11px] font-semibold text-slate-400 px-2 pb-1 border-b border-slate-800">
          <span>Classification</span>
          <span className="text-center">You</span>
          <span className="text-center">Stockfish</span>
        </div>

        {/* Best Moves */}
        <div className="grid grid-cols-[1fr_60px_60px] items-center px-2 py-1 rounded bg-slate-950/40">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Best Moves
          </span>
          <span className="text-center font-mono text-slate-200">{userCounts.best}</span>
          <span className="text-center font-mono text-slate-400">{engineCounts.best}</span>
        </div>

        {/* Good Moves */}
        <div className="grid grid-cols-[1fr_60px_60px] items-center px-2 py-1 rounded">
          <span className="flex items-center gap-1.5 text-blue-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400" /> Good Moves
          </span>
          <span className="text-center font-mono text-slate-200">{userCounts.good}</span>
          <span className="text-center font-mono text-slate-400">{engineCounts.good}</span>
        </div>

        {/* Inaccuracies */}
        <div className="grid grid-cols-[1fr_60px_60px] items-center px-2 py-1 rounded bg-slate-950/40">
          <span className="flex items-center gap-1.5 text-amber-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-300" /> Inaccuracies
          </span>
          <span className="text-center font-mono text-slate-200">{userCounts.inaccuracy}</span>
          <span className="text-center font-mono text-slate-400">{engineCounts.inaccuracy}</span>
        </div>

        {/* Mistakes */}
        <div className="grid grid-cols-[1fr_60px_60px] items-center px-2 py-1 rounded">
          <span className="flex items-center gap-1.5 text-orange-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-orange-400" /> Mistakes
          </span>
          <span className="text-center font-mono text-slate-200">{userCounts.mistake}</span>
          <span className="text-center font-mono text-slate-400">{engineCounts.mistake}</span>
        </div>

        {/* Blunders */}
        <div className="grid grid-cols-[1fr_60px_60px] items-center px-2 py-1 rounded bg-rose-950/30 border border-rose-900/40">
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Blunders
          </span>
          <span className="text-center font-mono font-bold text-rose-400">{userCounts.blunder}</span>
          <span className="text-center font-mono text-slate-400">{engineCounts.blunder}</span>
        </div>
      </div>
    </div>
  );
}

export default AccuracyBadge;
