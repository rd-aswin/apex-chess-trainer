import React, { useState } from 'react';
import { 
  Play, Sparkles, Swords, ArrowRight, Check, AlertCircle, RefreshCw 
} from 'lucide-react';

export function InteractiveDemoPage({ onNavigate, onLaunchApp }) {
  const [selectedScenario, setSelectedScenario] = useState(0);

  const scenarios = [
    {
      title: "1. The Removed Guard Blunder (1400 Elo)",
      move: "18... Ne7?",
      bestMove: "18... Rae8!",
      evalDelta: "+4.2 (Blunder)",
      flaw: "By jumping the knight from c6 to e7 to attack the queen, Black leaves the d8-rook and e7-square completely unguarded.",
      punishment: "19. Qxd8+! Rxd8 20. Rxd8# (Back-rank checkmate).",
      motifs: ["Removed Defender", "Back-Rank Vulnerability", "Deflection"]
    },
    {
      title: "2. The Poisoned Bishop on b2 (1600 Elo)",
      move: "12... Qxb2?",
      bestMove: "12... Be7!",
      evalDelta: "+3.6 (Mistake)",
      flaw: "Greedily grabbing the b2 pawn abandons the kingside defense and traps the queen on the queenside rim.",
      punishment: "13. Nb5! threatening both 14. Nc7+ fork and 14. Rab1 trapping the black queen.",
      motifs: ["Trapped Queen", "Poisoned Pawn", "Development Neglect"]
    },
    {
      title: "3. The Overloaded Defender (1800 Elo)",
      move: "22... f5?",
      bestMove: "22... Kg7!",
      evalDelta: "+2.9 (Strategic Flaw)",
      flaw: "Pushing f5 opens the diagonal to the black king and overloads the e6-pawn, which is tasked with guarding both d5 and f5.",
      punishment: "23. exf6+ Nxf6 24. Qxe6! winning a key central pawn and infiltrating the 7th rank.",
      motifs: ["Overloaded Pawn", "King Diagonal Exposure", "Weak Outpost"]
    }
  ];

  const current = scenarios[selectedScenario];

  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Play className="w-3.5 h-3.5" />
          <span>Zero-Friction Sandbox</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Experience Explainable AI Instantly
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          No sign-up. No credit card. No API key. Select a critical blunder below and inspect how our neuro-symbolic engine breaks it down.
        </p>
      </div>

      {/* INTERACTIVE DEMO VIEWER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Scenario Selectors */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {scenarios.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedScenario(idx)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                selectedScenario === idx 
                  ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold text-white">{s.title}</div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1">{s.move} ({s.evalDelta})</div>
            </button>
          ))}
        </div>

        {/* Breakdown Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-rose-400 font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                Played: {current.move}
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold ml-3 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Stockfish Best: {current.bestMove}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Evaluation Swing: <strong className="text-rose-400">{current.evalDelta}</strong>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Pedagogical Breakdown: Why This Failed
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                "{current.flaw}"
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Concrete Stockfish Refutation
              </h4>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-cyan-300">
                {current.punishment}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Underlying Tactical Motifs Detected
              </h4>
              <div className="flex flex-wrap gap-2">
                {current.motifs.map((m, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Want to analyze your own custom PGNs or play live matches against Level 20 Stockfish?
            </div>
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/25 shrink-0 flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>Launch Full Interactive Board</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
