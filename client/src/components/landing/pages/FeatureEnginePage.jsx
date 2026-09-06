import React from 'react';
import { 
  Cpu, Swords, ShieldCheck, Zap, ArrowRight, Check, WifiOff 
} from 'lucide-react';

export function FeatureEnginePage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-4">
          <Cpu className="w-3.5 h-3.5" />
          <span>Local Computing Power</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          World Champion Engine. Zero Lag. 100% Offline.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Why wait for overloaded cloud servers to finish your game review? Apex runs the official <strong>Stockfish 19 engine</strong> directly on your laptop for instantaneous analysis with zero monthly server bills.
        </p>
      </div>

      {/* BENEFITS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Instant Calculations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates millions of positions per second locally. No waiting in cloud server queues during peak streaming hours.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Works Completely Offline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              On a flight, in a coffee shop, or traveling without internet. Play games and review mistakes anywhere in the world.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Maximum Locked Strength</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike web platforms that dial down engine depth to cut their cloud costs, Apex gives you locked maximum grandmaster strength.
            </p>
          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="bg-gradient-to-r from-cyan-500/10 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Test Stockfish 19 On Your Laptop</h3>
            <p className="text-xs text-slate-400 mt-1">Experience instant offline analysis with zero handicap.</p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20 shrink-0"
          >
            Launch Engine Board
          </button>
        </div>

      </div>

    </div>
  );
}
