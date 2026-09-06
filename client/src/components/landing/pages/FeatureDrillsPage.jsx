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
          Personalized Blunder Drills & Anki Decks
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Generic puzzle books teach tactics that never appear in your games. Apex extracts puzzles directly from <strong>your own lost positions</strong> and converts them into spaced-repetition Anki decks.
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
              Every blunder you make in an imported match is automatically converted into an interactive puzzle challenge.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Spaced Repetition Timing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review your tactical blindspots at optimal scientific intervals (1 day, 3 days, 7 days, 30 days) to burn motifs into subconscious memory.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">1-Click Anki Deck Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export rich SVG board snapshots with complete Grandmaster tactical explanations into standard Anki-compatible `.apkg` files.
            </p>
          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Cure Your Tactical Blindspots</h3>
            <p className="text-xs text-slate-400 mt-1">Generate custom blunder drills from your past games today.</p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-indigo-400 hover:bg-indigo-300 transition-colors shadow-lg shadow-indigo-500/20 shrink-0"
          >
            Create Your First Drill
          </button>
        </div>

      </div>

    </div>
  );
}
