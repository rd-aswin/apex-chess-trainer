import React from 'react';
import { 
  Flame, Heart, ShieldCheck, ArrowRight, Sparkles, Swords, CheckCircle2 
} from 'lucide-react';

export function ManifestoPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Heart className="w-3.5 h-3.5" />
          <span>Our Story & Mission</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          We Believe You Should Own Your Chess Coach.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Why we got fed up with $16/month subscriptions, why chess AI should be affordable for everyone, and how Apex was built for real players.
        </p>
      </div>

      {/* MANIFESTO BODY */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-sm sm:text-base text-slate-300 leading-relaxed">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6">
          <h3 className="text-xl font-bold text-white">1. What Happened to Owning Your Tools?</h3>
          <p>
            Years ago, when you bought chess training software, you paid once and it was yours. It ran on your computer. It didn't lock your game history if you didn't pay this month, and it didn't bill you when you were on vacation with your family.
          </p>
          <p>
            Over time, the chess world shifted toward endless monthly subscriptions. Today, players are expected to pay $120 to $160 every single year just to see which moves were blunders in their 10-minute games.
          </p>

          <h3 className="text-xl font-bold text-white pt-4">2. The Truth About AI Costs</h3>
          <p>
            Modern AI technology is incredible. An AI model like Google Gemini can read an entire 40-move chess game and explain every mistake in warm, human English.
          </p>
          <p>
            The actual computational cost of that review is <strong>less than half of one-tenth of a cent</strong> ($0.00035). Reviewing a game every day for a month costs about 1 cent.
          </p>
          <p>
            So why are players charged $16.99 every month? Because corporate platforms know that chess improvers are passionate and will pay whatever it takes to break their rating plateaus.
          </p>

          <h3 className="text-xl font-bold text-white pt-4">3. Our Three Simple Promises</h3>
          <p>
            We built Apex to be the tool we always wanted as chess players:
          </p>
          <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-200">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Free Forever With Your Key:</strong> Use Google's free developer key (1,500 reviews/day) and pay $0.00 forever. No credit card required.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Explanations in Plain English:</strong> No more staring at "+1.4" and guessing what it means. We explain the tactical and strategic reason behind your mistake.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Zero Monthly Lock-in:</strong> If you want our turnkey Pro experience, pay once and own it for life. No recurring charges.</span>
            </li>
          </ul>

          <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 italic">
            "Chess is a game of personal growth and joy. The tools you use to study it should support you, not charge you endless rent."
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="text-center pt-4">
          <button
            onClick={onLaunchApp}
            className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-xl shadow-emerald-500/25 inline-flex items-center gap-2"
          >
            <Swords className="w-4 h-4" />
            <span>Try Apex Chess Free Today</span>
          </button>
        </div>

      </div>

    </div>
  );
}
