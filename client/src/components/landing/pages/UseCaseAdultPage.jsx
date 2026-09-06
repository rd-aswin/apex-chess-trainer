import React from 'react';
import { 
  Clock, DollarSign, Check, ArrowRight, Sparkles, Heart, ShieldCheck 
} from 'lucide-react';

export function UseCaseAdultPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Clock className="w-3.5 h-3.5" />
          <span>The Adult Improver Routine</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          High-Yield Chess Training for Full-Time Professionals
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          You don’t have 4 hours a day to memorize opening lines. You need 15 minutes of surgical, high-retention deliberate practice that fits between your career, family, and life.
        </p>
      </div>

      {/* THE 15-MINUTE DAILY LOOP */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>The 15-Minute Deliberate Practice Protocol</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-bold">Minutes 0–8</div>
              <h4 className="text-sm font-bold text-white">Play 1 Rapid Match (10+0)</h4>
              <p className="text-xs text-slate-400">Play a focused online game on Lichess or Chess.com with no distractions.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-amber-400 font-bold">Minutes 8–12</div>
              <h4 className="text-sm font-bold text-white">1-Click Apex Explainable Review</h4>
              <p className="text-xs text-slate-400">Review your 2 biggest turning points. Understand the pedagogical *why* behind your mistakes.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-bold">Minutes 12–15</div>
              <h4 className="text-sm font-bold text-white">Solve 3 Custom Error Drills</h4>
              <p className="text-xs text-slate-400">Spar the refutation lines against Stockfish 19 to condition correct tactical instincts.</p>
            </div>
          </div>
        </div>

        {/* ZERO SUBSCRIPTION GUILT CALLOUT */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Zero Idle Subscription Guilt</div>
            <h3 className="text-xl font-bold text-white mt-1">If You Don't Play for 3 Weeks, You Pay $0.00</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Life happens. Projects get busy. Kids need attention. Apex will never charge you $16.99 for a month where you didn't have time to touch a chessboard.
            </p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 shrink-0"
          >
            Start Your 15-Min Routine
          </button>
        </div>

      </div>

    </div>
  );
}
