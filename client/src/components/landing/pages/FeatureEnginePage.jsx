import React from 'react';
import { 
  Cpu, Swords, ShieldCheck, Zap, ArrowRight, Check, HardDrive 
} from 'lucide-react';

export function FeatureEnginePage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-4">
          <Cpu className="w-3.5 h-3.5" />
          <span>Hardware Acceleration</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Stockfish 19 NNUE on AVX-512
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Experience superhuman computation running directly on your CPU silicon. Locked Skill Level 20 (~3650+ Elo), zero cloud queues, and 100% offline execution.
        </p>
      </div>

      {/* TECH SPECS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="text-cyan-400 font-mono text-2xl font-black">3650+</div>
            <h3 className="text-sm font-bold text-white">Superhuman Elo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Locked Skill Level 20 with dual-NNUE evaluation nets. Stronger than any living world champion in history.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="text-emerald-400 font-mono text-2xl font-black">AVX-512</div>
            <h3 className="text-sm font-bold text-white">512-bit Vectorization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Processes 16 nodes simultaneously per CPU cycle. Executes 8 to 14 million nodes per second on modern hardware.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="text-indigo-400 font-mono text-2xl font-black">0.0ms</div>
            <h3 className="text-sm font-bold text-white">Zero Cloud Latency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No server queues. No connection drops during tournament broadcasts. Your engine is installed directly on your machine.
            </p>
          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="bg-gradient-to-r from-cyan-500/10 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Spar Against Locked Stockfish 19</h3>
            <p className="text-xs text-slate-400 mt-1">Confront the world's strongest chess computation with zero handicap.</p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20 shrink-0"
          >
            Launch Stockfish 19
          </button>
        </div>

      </div>

    </div>
  );
}
