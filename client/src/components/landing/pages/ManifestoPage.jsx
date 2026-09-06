import React from 'react';
import { 
  Flame, Heart, ShieldCheck, ArrowRight, Sparkles, Swords, DollarSign 
} from 'lucide-react';

export function ManifestoPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20 mb-4">
          <Flame className="w-3.5 h-3.5" />
          <span>The Anti-Subscription Manifesto</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          The Rentier Economy Ruined Software. We Refuse to Participate.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Why we reject the $16.99/month subscription trap, why AI inference belongs at wholesale cost, and why chess software should be owned for life.
        </p>
      </div>

      {/* MANIFESTO BODY */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-sm sm:text-base text-slate-300 leading-relaxed">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6">
          <h3 className="text-xl font-bold text-white">1. The Golden Age of Ownership</h3>
          <p>
            Twenty years ago, you bought a piece of chess software on a CD or as a downloadable installer. You paid for it once. You owned it. It ran on your machine without requiring a constant internet lifeline. It never threatened to lock you out if your credit card expired, and it never billed you while you were on vacation.
          </p>
          <p>
            Then venture capital arrived. Tech monopolies realized that charging a player $15 every month for ten years is vastly more lucrative than selling an honest piece of craftsmanship once.
          </p>

          <h3 className="text-xl font-bold text-white pt-4">2. The 2,000% AI Markup Racket</h3>
          <p>
            With the dawn of large language models, the exploitation worsened. A 40-move full game review using state-of-the-art models like <strong>Google Gemini Flash costs ~$0.00035</strong>.
          </p>
          <p>
            If you analyze 30 games a month, your real computational bill is <strong className="text-emerald-400 font-mono">$0.01</strong>. Yet incumbent platforms charge <strong className="text-rose-400 font-mono">$16.99/month</strong>. That is not software pricing; that is rentier extortion disguised as digital innovation.
          </p>

          <h3 className="text-xl font-bold text-white pt-4">3. The Apex Promise</h3>
          <p>
            We believe in radical transparency, local execution, and user ownership:
          </p>
          <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-200">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Bring Your Own Key (BYOK):</strong> We pass AI inference through to you at raw wholesale cost—or $0.00 using Google's free 1,500/day tier.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Local Stockfish 19:</strong> Engine computations run natively on your machine at locked Level 20 difficulty with zero cloud throttling.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Lifetime Ownership:</strong> If you choose our Pro tools, buy them once and own them for life. No recurring bills. Ever.</span>
            </li>
          </ul>

          <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 italic">
            "Chess was created as a noble pursuit of the human mind. The tools used to study it should empower the student, not drain their wallet."
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="text-center pt-4">
          <button
            onClick={onLaunchApp}
            className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-xl shadow-emerald-500/25 inline-flex items-center gap-2"
          >
            <Swords className="w-4 h-4" />
            <span>Join the Anti-Subscription Movement</span>
          </button>
        </div>

      </div>

    </div>
  );
}
