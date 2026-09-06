import React, { useState } from 'react';
import { 
  Calculator, DollarSign, TrendingUp, Sparkles, Check, ArrowRight, ShieldCheck, 
  Wallet, Trophy, BookOpen, Clock, HelpCircle, Zap
} from 'lucide-react';

export function RoiCalculatorPage({ onNavigate, onLaunchApp }) {
  // Current subscription selection
  const [currentSub, setCurrentSub] = useState('diamond'); // 'diamond' | 'platinum' | 'aimchess' | 'gold'
  const [years, setYears] = useState(3); // 1 | 3 | 5
  const [apexPlan, setApexPlan] = useState('lifetime'); // 'byok' | 'lifetime' | 'pro'
  const [gamesPerWeek, setGamesPerWeek] = useState(15);

  // Annual costs of competitor subscriptions
  const competitorPlans = {
    diamond: {
      name: 'Chess.com Diamond',
      annualCost: 160.00,
      monthlyEquivalent: '13.33',
      description: 'Unlimited game reviews, puzzles & video lessons'
    },
    platinum: {
      name: 'Chess.com Platinum',
      annualCost: 100.00,
      monthlyEquivalent: '8.33',
      description: 'Unlimited puzzles & basic analysis'
    },
    aimchess: {
      name: 'Aimchess Premium',
      annualCost: 119.00,
      monthlyEquivalent: '9.92',
      description: 'Post-game statistics & custom drills'
    },
    gold: {
      name: 'Chess.com Gold',
      annualCost: 60.00,
      monthlyEquivalent: '5.00',
      description: 'Limited game reviews (25/day)'
    }
  };

  // Apex cost calculations over the chosen time horizon
  const getApexCost = () => {
    if (apexPlan === 'byok') return 0; // Free forever with Google key
    if (apexPlan === 'lifetime') return 59.00; // Flat one-time fee
    if (apexPlan === 'pro') return 39.00 * years; // Annual hosted
    return 0;
  };

  const currentPlanData = competitorPlans[currentSub];
  const totalCompetitorCost = currentPlanData.annualCost * years;
  const totalApexCost = getApexCost();
  const totalSavings = Math.max(0, totalCompetitorCost - totalApexCost);
  const percentSaved = Math.round((totalSavings / totalCompetitorCost) * 100);
  const totalGamesAnalyzed = gamesPerWeek * 52 * years;

  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Calculator className="w-3.5 h-3.5" />
          <span>Chess Subscription Comparison</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          See How Much Money You Save
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Recurring subscriptions quietly take hundreds of dollars out of your pocket every year. 
          See how much stays in your wallet when you switch to Apex.
        </p>
      </div>

      {/* INTERACTIVE CALCULATOR */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10">
          
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Select Current Subscription */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  1. What chess subscription do you currently pay for?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(competitorPlans).map(([key, plan]) => (
                    <button
                      key={key}
                      onClick={() => setCurrentSub(key)}
                      className={`p-3.5 rounded-2xl text-left border transition-all ${
                        currentSub === key 
                          ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500/50' 
                          : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-xs text-white">{plan.name}</span>
                        <span className="font-mono text-xs font-bold text-rose-400">${plan.annualCost}/yr</span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{plan.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Select Time Horizon */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  2. How many years do you plan on playing chess?
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[1, 3, 5].map((y) => (
                    <button
                      key={y}
                      onClick={() => setYears(y)}
                      className={`py-3 rounded-2xl text-xs font-bold transition-all ${
                        years === y 
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400' 
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <div>{y} {y === 1 ? 'Year' : 'Years'}</div>
                      <div className={`text-[10px] ${years === y ? 'text-slate-900/80 font-bold' : 'text-slate-500'}`}>
                        {y === 3 ? 'Most Common' : y === 1 ? 'Short Term' : 'Long Term'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Select Apex Option */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  3. Compare against which Apex option?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setApexPlan('byok')}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      apexPlan === 'byok' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500/50' 
                        : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Free Key ($0)</div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">$0 forever</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-snug">Google's free key tier covers all games</div>
                  </button>

                  <button
                    onClick={() => setApexPlan('lifetime')}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      apexPlan === 'lifetime' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500/50' 
                        : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Lifetime Pass</div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">$59 pay once</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-snug">Own all Pro features forever</div>
                  </button>

                  <button
                    onClick={() => setApexPlan('pro')}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      apexPlan === 'pro' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-white ring-1 ring-emerald-500/50' 
                        : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Apex Pro Annual</div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">$39 / year</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-snug">Zero setup, fully hosted coaching</div>
                  </button>
                </div>
              </div>

              {/* 4. Games Reviewed Slider */}
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                  <span>How many games do you review weekly?</span>
                  <span className="text-emerald-400 font-mono text-sm">{gamesPerWeek} games/wk</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={gamesPerWeek}
                  onChange={(e) => setGamesPerWeek(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                  <span>2 (Casual)</span>
                  <span>15 (Club Active)</span>
                  <span>50 (Tournament Grinder)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Over {years} {years === 1 ? 'year' : 'years'}, you will review <strong className="text-white font-mono">{totalGamesAnalyzed.toLocaleString()}</strong> games.
                </div>
              </div>

            </div>

            {/* Right Column: Financial Results (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
              
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {years}-Year Comparison Summary
                </span>
                <h3 className="text-xl font-black text-white mt-3">
                  Your Net Financial Savings
                </h3>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 text-xs bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center text-slate-400">
                  <span>{currentPlanData.name} ({years} yrs):</span>
                  <span className="font-mono text-rose-400 font-bold text-sm">
                    ${totalCompetitorCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>
                    Apex {apexPlan === 'byok' ? 'Free Forever' : apexPlan === 'lifetime' ? 'Lifetime Pass' : 'Pro Annual'}:
                  </span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    {totalApexCost === 0 ? '$0.00' : `$${totalApexCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex justify-between items-baseline">
                  <span className="font-bold text-slate-200">Cash Kept in Your Pocket:</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ${totalSavings.toFixed(2)}
                  </span>
                </div>
                <div className="text-right text-[11px] font-bold text-emerald-400">
                  {percentSaved}% total savings
                </div>
              </div>

              {/* Tangible Value Translation */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>What You Can Buy With ${totalSavings.toFixed(0)} Saved:</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5 pt-1">
                  <li className="flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>3–5 Official Tournament Entry Fees</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>A premium weighted wooden chess set</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span><strong>8–10 classic physical chess books</strong></span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={onLaunchApp}
                  className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  <span>Start Training Free Today</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('#pricing')}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800 text-center"
                >
                  View All Lifetime & Pro Plans
                </button>
              </div>

              <div className="text-center text-[10px] text-slate-400">
                No credit card required to start • Free Google key works forever
              </div>

            </div>

          </div>

          {/* SIDE-BY-SIDE FEATURE COMPARISON */}
          <div className="pt-8 border-t border-slate-800">
            <h4 className="text-base font-bold text-white mb-4 text-center">
              Why Paying Less Gives You Better Chess Training
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
              
              {/* Competitor Subscription Box */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">
                  {currentPlanData.name} (${totalCompetitorCost.toFixed(0)} over {years} yrs)
                </div>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>Vague one-sentence feedback ("This was an inaccuracy")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>No interactive candidate move testing or coaching conversation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>Recurring annual charges that never stop or renew at higher rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>Separate upsells needed for advanced drill analytics</span>
                  </li>
                </ul>
              </div>

              {/* Apex Box */}
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                  Apex Chess Trainer ({totalApexCost === 0 ? '$0 with Free Key' : `$${totalApexCost} one-time`})
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Clear explanations in plain English explaining WHY moves fail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Interactive "What If?" move testing with live coaching responses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Zero subscription hostage: own your software or use free keys forever</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Personalized blunder pattern detection and custom drills included</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

