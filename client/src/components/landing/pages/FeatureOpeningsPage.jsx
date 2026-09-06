import React from 'react';
import { 
  BookOpen, Sparkles, Check, ArrowRight, Compass, ShieldCheck 
} from 'lucide-react';

export function FeatureOpeningsPage({ onNavigate, onLaunchApp }) {
  const openings = [
    { name: 'Sicilian Defense (B20–B99)', desc: 'Asymmetrical counter-attacking pawn structures fighting for the d4 and c-file squares.' },
    { name: 'Ruy Lopez / Spanish (C60–C99)', desc: 'Classical piece pressure on e5 and long-term bishop pair maneuvering.' },
    { name: 'French Defense (C00–C19)', desc: 'Counter-punching closed pawn chains with central breaks ...c5 and ...f6.' },
    { name: 'Queen’s Gambit (D06–D69)', desc: 'Total central domination and strategic piece pressure along the semi-open c-file.' },
    { name: 'King’s Indian Defense (E60–E99)', desc: 'Hypermodern kingside pawn storms and dramatic tactical king attacks.' },
    { name: 'Caro-Kann Defense (B10–B19)', desc: 'Rock-solid endgame pawn structures with rapid, unhampered piece development.' }
  ];

  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>Opening Theory Re-Engineered</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Opening Repertoire & ECO Concepts
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Stop memorizing endless engine trees. Apex explains the <strong>strategic purpose and middlegame plans</strong> behind every major opening variation.
        </p>
      </div>

      {/* OPENING CARDS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          {openings.map((op, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-colors space-y-2">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>{op.name}</span>
                <span className="text-xs text-emerald-400 font-mono">ECO Grounded</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {op.desc}
              </p>
            </div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Master Your Opening Repertoire</h3>
            <p className="text-xs text-slate-400 mt-1">Receive live opening feedback during every game review.</p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 shrink-0"
          >
            Review Your Openings Free
          </button>
        </div>

      </div>

    </div>
  );
}
