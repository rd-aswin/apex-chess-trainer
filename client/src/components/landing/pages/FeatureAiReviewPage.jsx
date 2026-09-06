import React from 'react';
import { 
  Sparkles, Check, ArrowRight, ShieldCheck, Cpu, Swords, Brain 
} from 'lucide-react';

export function FeatureAiReviewPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Accurate AI Coaching</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Chess Explanations You Can Actually Understand
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Regular AI models like ChatGPT invent fake moves and make illegal chess suggestions. Apex combines a world-champion chess engine with smart coaching so you get <strong>100% accurate, plain-English explanations</strong> every time.
        </p>
      </div>

      {/* 3 SIMPLE STEPS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Step 1 */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-cyan-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-black text-xl flex items-center justify-center shrink-0">
            1
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 1: Finding The Objective Truth</div>
            <h3 className="text-xl font-bold text-white">Stockfish 19 Calculates the Best Move</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Before our AI writes a single word, the world's strongest chess engine analyzes the board right on your laptop. It calculates the exact score and the forced response so the coaching is always mathematically correct.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">Accurate Score</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">Best Alternative Move</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">Opponent Refutation</span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-xl flex items-center justify-center shrink-0">
            2
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Step 2: Spotting The Human Mistake</div>
            <h3 className="text-xl font-bold text-white">We Identify What Went Wrong on the Board</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our tactical detector examines piece relationships: Did your move leave a piece undefended? Did you walk into a pawn fork? Did you expose your king? We isolate the exact reason your move failed.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">Hanging Pieces</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">Forks & Pins</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">King Safety Vulnerabilities</span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-emerald-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xl flex items-center justify-center shrink-0">
            3
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step 3: Grandmaster Teaching</div>
            <h3 className="text-xl font-bold text-white">Your AI Coach Explains It Like a Friend</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              The AI receives only the verified facts. It doesn't guess or invent moves. It writes helpful, encouraging coaching advice that explains the mistake and gives you a practical rule of thumb for your future games.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">Zero Fake Moves</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">Clear Explanations</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">Memorable Rules of Thumb</span>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <button
          onClick={onLaunchApp}
          className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-xl shadow-emerald-500/25 inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>See Plain-English Review in Action</span>
        </button>
      </div>

    </div>
  );
}
