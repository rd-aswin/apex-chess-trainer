import React from 'react';
import { 
  Flame, TrendingDown, Target, Check, ArrowRight, Sparkles, BarChart2 
} from 'lucide-react';

export function FeatureLeakDetectionPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20 mb-4">
          <Flame className="w-3.5 h-3.5" />
          <span>Pattern Recognition Engine</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          50-Game Subconscious Leak Detector
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Stop fixing isolated mistakes. Apex audits your last 50 games to uncover the recurring subconscious cognitive patterns costing you 150+ rating points.
        </p>
      </div>

      {/* SAMPLE LEAK AUDIT CARDS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs text-rose-400 font-bold uppercase tracking-wider">Recurring Blunder Cluster #1</div>
              <h3 className="text-lg font-bold text-white mt-0.5">Dark-Squared Bishop Liquidation (French Defense)</h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 font-mono font-bold">
              Avg Loss: -1.82 Eval
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Across 14 French Defense games, you traded off your light-square bishop for a knight on d7 <strong>71% of the time</strong>, leaving your dark-square complexes permanently crippled and allowing White a 82% win rate on the kingside.
          </p>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-400">Prescription:</strong> Preserve the dark-squared bishop with ...b6 and ...Ba6 maneuvers. Do not permit White to lock your pawn chain.
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Recurring Blunder Cluster #2</div>
              <h3 className="text-lg font-bold text-white mt-0.5">Knight Outpost Blindness in Closed Centers</h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold">
              Occurs in 64% of Games
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            When the center locks (pawns on d4/e4 vs d5/e5), you fail to occupy or dispute key outpost squares (d5, e5, f5) <strong>64% of the time</strong>, allowing your opponent's knights to dominate the board uncontested.
          </p>
        </div>

        {/* BOTTOM CALLOUT */}
        <div className="bg-gradient-to-r from-rose-500/10 via-slate-900 to-slate-950 border border-rose-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Audit Your Subconscious Chess Habits</h3>
            <p className="text-xs text-slate-400 mt-1">Connect your Chess.com or Lichess account and run a full 50-game audit.</p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 shrink-0"
          >
            Run 50-Game Audit Free
          </button>
        </div>

      </div>

    </div>
  );
}
