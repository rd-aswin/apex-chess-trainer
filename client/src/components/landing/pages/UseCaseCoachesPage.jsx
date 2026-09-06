import React from 'react';
import { 
  Users, Award, Check, ArrowRight, BookOpen, Layers, Sparkles, Swords, ShieldCheck 
} from 'lucide-react';

export function UseCaseCoachesPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 mb-4">
          <Users className="w-3.5 h-3.5" />
          <span>For Chess Coaches & Teachers</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Prepare Student Lessons in Half the Time
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Review student games with articulate plain-English tactical breakdowns. Save hours of lesson preparation and spare your students from expensive recurring subscriptions.
        </p>
      </div>

      {/* 3 CORE PILLARS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Instant 1-Click Game Import</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Import student matches directly by entering their Chess.com or Lichess username, or paste any PGN file. Review turning points with Stockfish 19 immediately.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Pedagogical Explanations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instead of cryptic computer numbers, Apex explains the tactical and strategic cause behind student mistakes so you have clear talking points ready for your lesson.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Subscription Burden</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Students do not need to pay \$160/year for Diamond memberships just to review homework. They can review games for free with their own Google key.
            </p>
          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Try Apex for Student Game Reviews</h3>
            <p className="text-xs text-slate-400 mt-1">Import any recent match and test our plain-English breakdown right now.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchApp}
              className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-indigo-400 hover:bg-indigo-300 transition-colors shadow-lg shadow-indigo-500/20 shrink-0 flex items-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>Review a Game Now</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

