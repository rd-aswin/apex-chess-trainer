import React from 'react';
import { 
  Heart, Sparkles, Swords, ArrowRight, Check, ExternalLink 
} from 'lucide-react';

export function VsLichessPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20 mb-4">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Respectful Open-Source Companion</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          We Love Lichess. But Stockfish is a Calculator, Not a Coach.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Lichess is the greatest free chess server on Earth. But when you review your games, staring at <code className="text-xs bg-slate-900 px-2 py-0.5 rounded text-rose-400">-3.4</code> won't teach you how to stop losing your rooks.
        </p>
      </div>

      {/* CORE ARGUMENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Lichess Role */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Where Lichess Shines</div>
            <h3 className="text-xl font-bold text-white">The Ultimate Free Playing Ground</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lichess was built by Thibault Duplessis as an ad-free, subscription-free gift to humanity. It offers blitz matchmaking, tournaments, and raw Stockfish server analysis at $0 cost.
            </p>
            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Zero advertisements & zero subscriptions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Instant global multiplayer matchmaking</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Open-source community ethos</span>
              </div>
            </div>
          </div>

          {/* Apex Role */}
          <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl p-8 space-y-4 shadow-xl shadow-emerald-500/5">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Where Apex Steps In</div>
            <h3 className="text-xl font-bold text-white">The Socratic Pedagogy Layer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Humans do not calculate 25-ply brute-force trees. We need concepts: <em>"You removed the defender of your f7 square"</em>, <em>"You created a dark-square outpost"</em>. Apex translates raw engine math into human wisdom.
            </p>
            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Articulate English explanations of tactical flaws</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Conversational Socratic coach sparring</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-game subconscious blunder profiling</span>
              </div>
            </div>
          </div>

        </div>

        {/* 1-CLICK INTEGRATION HOOK */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Seamless Integration</span>
            <h3 className="text-2xl font-black text-white mt-2">Import Any Lichess Game in 2 Seconds</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Type your Lichess username into Apex. We fetch your recent matches and feed them directly into our explainable AI pipeline.
            </p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/25 shrink-0"
          >
            Import a Lichess Game Now
          </button>
        </div>

      </div>

    </div>
  );
}
