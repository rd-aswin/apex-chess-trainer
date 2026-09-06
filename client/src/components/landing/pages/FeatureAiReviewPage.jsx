import React from 'react';
import { 
  Sparkles, Check, ArrowRight, ShieldCheck, Cpu, Code2, Database 
} from 'lucide-react';

export function FeatureAiReviewPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Feature Deep Dive</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          The 3-Stage Neuro-Symbolic Engine
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Why raw LLMs hallucinate illegal moves, and how our decoupled 3-stage architecture guarantees <strong>100% mathematical chess truth</strong> with zero hallucinations.
        </p>
      </div>

      {/* THE 3 STAGES ARCHITECTURE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Stage 1 */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-cyan-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-black text-xl flex items-center justify-center shrink-0">
            1
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Stage 1: Ground Truth Engine</div>
            <h3 className="text-xl font-bold text-white">Stockfish 19 NNUE (Native C++ / AVX-512)</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Before an AI model writes a single word, native Stockfish 19 computes the objective mathematical reality: exact centipawn evaluations, Lichess sigmoid winning chances, the best alternative move, and the multi-ply punishment sequence.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Delta Centipawns</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">CAPS2 Accuracy Score</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Forced Refutation Line</span>
            </div>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-xl flex items-center justify-center shrink-0">
            2
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Stage 2: Geometric Tactical Parser</div>
            <h3 className="text-xl font-bold text-white">Symbolic Raytracers & Threat Model</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our symbolic geometry engine scans the 64 squares to detect exact physical board relationships: pinned pieces, overloaded defenders, hung undefended units, king exposure rays, and double-attack forks.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Removed Defender Detection</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Null-Move Threat Diagnostic</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Piece Coordination Matrix</span>
            </div>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-emerald-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xl flex items-center justify-center shrink-0">
            3
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Stage 3: Pedagogical Translation</div>
            <h3 className="text-xl font-bold text-white">Grounded Google Gemini Flash</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              The AI receives only pre-verified mathematical facts in a strict JSON schema. The model is forbidden from guessing moves. It acts purely as a master teacher, translating verified tactical truths into empathetic, articulate English prose.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">0% Hallucination Rate</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Socratic Tone</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Actionable Rule Formulation</span>
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
          <span>Experience Explainable AI Free</span>
        </button>
      </div>

    </div>
  );
}
