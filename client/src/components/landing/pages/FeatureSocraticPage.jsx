import React from 'react';
import { 
  Zap, Brain, Target, ArrowRight, Check, Sparkles, Swords 
} from 'lucide-react';

export function FeatureSocraticPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20 mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>Pedagogical Innovation</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Socratic Move-by-Move Sparring
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Passive reading builds zero rating points. Apex stops the board at critical turning points and challenges you to formulate your ideas before showing the engine answer.
        </p>
      </div>

      {/* 3 CORE PILLARS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Active Recall Conditioning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cognitive science demonstrates that looking up the solution yields 70% lower retention than attempting to solve the puzzle yourself first.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">"Try Your Idea" Sandbox</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Don't just ask why the computer move worked. Play your alternative idea on the board! Stockfish instantly evaluates your variation while Gemini explains the tactical refutation.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Conversational Coach Chat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask natural questions: <em>"Why can't I play e5 here?"</em>, <em>"What is White's strategic plan?"</em>. The coach responds with Grandmaster insight grounded in board facts.
            </p>
          </div>

        </div>

        {/* INTERACTIVE CALLOUT */}
        <div className="mt-12 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Test Your Ideas with a Grandmaster AI</h3>
            <p className="text-xs text-slate-400 mt-1">Experience live Socratic sparring in your next game review session.</p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20 shrink-0"
          >
            Launch Socratic Trainer
          </button>
        </div>

      </div>

    </div>
  );
}
