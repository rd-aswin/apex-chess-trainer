import React from 'react';
import { 
  Target, ShieldAlert, Check, ArrowRight, Sparkles, Brain, Award 
} from 'lucide-react';

export function UseCaseBeginnerPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Target className="w-3.5 h-3.5" />
          <span>1200–1500 Rating Breakthrough</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          You Know How Pieces Move. Here is Why You Keep Hanging Them.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          You score 1900 on puzzle trainers, but hang rooks in live 10-minute games. Why? Puzzles tell you a tactic exists. Real games do not ring a bell before your opponent strikes.
        </p>
      </div>

      {/* 3 CORE PILLARS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Undefended Piece Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              90% of games under 1500 are decided by hung pieces. Apex conditions your subconscious to verify piece guards before every single ply.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">The Null-Move Threat Check</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Before calculating your attack, what is your opponent threatening right now? Apex explains opponent threats so you never walk into basic forks.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Simple, Friendly Pedagogy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No cryptic master jargon or 15-move variations. Clear, actionable rules like: <em>"Never advance your f-pawn when your king is uncastled."</em>
            </p>
          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Break Past 1500 Elo for $0</h3>
            <p className="text-xs text-slate-400 mt-1">Free BYOK access with Stockfish 19 & Google Gemini Flash.</p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 shrink-0"
          >
            Start Curing Blunders
          </button>
        </div>

      </div>

    </div>
  );
}
