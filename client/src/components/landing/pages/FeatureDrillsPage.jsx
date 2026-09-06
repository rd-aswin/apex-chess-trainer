import React from 'react';
import { 
  BookOpen, Award, Check, ArrowRight, Sparkles, RefreshCw, Layers 
} from 'lucide-react';

export function FeatureDrillsPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Active Learning Engine</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Custom Blunder Practice & Study Exports
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Generic puzzle books teach tactics that never appear in your games. Apex isolates the critical turning points from <strong>your own lost positions</strong> so you can re-test refutations and export them for study in Anki or your favorite tools.
        </p>
      </div>

      {/* CORE HIGHLIGHTS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Extracted From Real Losses</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review turning points from your actual games where mistakes occurred, instead of generic textbook puzzles that never appear in your games.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Interactive Board Retesting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Play alternative moves against Stockfish 19 right on the board to see and feel why the computer refutation succeeds.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Study Export & Anki Format</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export blunder moments, FEN positions, and plain-English notes into standard formats to study in Anki or your favorite chess tools.
            </p>
          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Included in Apex Pro & Lifetime Pass</div>
            <h3 className="text-xl font-bold text-white mt-1">Cure Your Tactical Blindspots</h3>
            <p className="text-xs text-slate-400 mt-1">Practice refutations on the board during any free review, or unlock saved drills in Pro.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onLaunchApp}
              className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-indigo-400 hover:bg-indigo-300 transition-colors shadow-lg shadow-indigo-500/20 text-center"
            >
              Try Free Board Review
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-5 py-3.5 rounded-xl font-bold text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors text-center"
            >
              View Pro Plans
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
