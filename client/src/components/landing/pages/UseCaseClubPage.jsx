import React from 'react';
import { 
  Swords, ShieldCheck, Check, ArrowRight, Compass, Target, Sparkles 
} from 'lucide-react';

export function UseCaseClubPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-4">
          <Swords className="w-3.5 h-3.5" />
          <span>1600–1900 Club Player Mastery</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Tactics Won’t Get You Past 1800. Strategic Discipline Will.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          At 1700 Elo, games aren't lost to random 1-move blunders. You lose because you created a backward pawn on c6 on move 14, traded your active bishop, and suffocated in an endgame 25 moves later.
        </p>
      </div>

      {/* 3 CORE PILLARS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Outpost & Hole Recognition</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand the permanent consequences of pawn pushes. Discover how moving a pawn creates irreversible outposts for opponent knights.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Prophylactic Thinking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Grandmasters prevent opponent ideas before executing their own. Apex highlights opponent positional intentions before you commit to attacking plans.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Endgame Conversion Technique</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stop throwing away won +3.0 advantages in rook endgames. Master opposition, key squares, and the Lucena/Philidor positions with Stockfish 19.
            </p>
          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="bg-gradient-to-r from-cyan-500/10 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Reach 2000+ Elo with Strategic Clarity</h3>
            <p className="text-xs text-slate-400 mt-1">Confront locked Level 20 Stockfish and learn positional refutations.</p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20 shrink-0"
          >
            Audit Your Strategic Play
          </button>
        </div>

      </div>

    </div>
  );
}
