import React, { useState } from 'react';
import { 
  Check, Sparkles, HelpCircle, ShieldCheck, Zap, 
  ArrowRight, Key, Flame, DollarSign, Calculator, Lock
} from 'lucide-react';

export function PricingPage({ onNavigate, onLaunchApp }) {
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' | 'yearly'
  const [gamesPerWeek, setGamesPerWeek] = useState(15);
  const [selectedModel, setSelectedModel] = useState('gemini-flash'); // 'gemini-flash' | 'sonnet' | 'gpt4o-mini' | 'ollama'

  // Model costs per 40-move game review
  const modelCosts = {
    'gemini-flash': 0.00035,
    'gpt4o-mini': 0.002,
    'sonnet': 0.012,
    'ollama': 0.00000
  };

  const monthlyGames = gamesPerWeek * 4.33;
  const rawApiCostPerMonth = monthlyGames * modelCosts[selectedModel];
  const threeYearChessComCost = 480.00;
  const threeYearApexFounderCost = 59.00 + (rawApiCostPerMonth * 36);
  const totalThreeYearSavings = Math.max(0, threeYearChessComCost - threeYearApexFounderCost);

  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The BYOK-Led Trojan Horse Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Pay Once. Own Your Coach Forever.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          No recurring subscriptions required. Run Stockfish 19 locally on your machine for $0, bring your own free Google Gemini API key, or choose turnkey cloud convenience.
        </p>

        {/* Monthly vs Yearly Toggle for Pro */}
        <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Pro ($4.99/mo)
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly' ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Pro ($39/yr)</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-950/20 text-[10px] font-extrabold uppercase">Save 35%</span>
          </button>
        </div>
      </div>

      {/* PRICING 4-TIER MATRIX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* TIER 1: FREE FOREVER (BYOK) */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">1. Free Forever (BYOK)</div>
              <div className="text-3xl font-black text-white mt-2">$0</div>
              <div className="text-xs text-slate-400 mt-1">Bring Your Own Key • 100% Free</div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                For tech-savvy players, students, and open-source advocates who want zero fees forever.
              </p>

              <div className="my-6 border-t border-slate-800/80 pt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited</strong> game reviews with free Gemini key (1,500/day)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Full tactical & positional pedagogical breakdowns</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>1-Click Chess.com & Lichess import</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Stockfish 19 NNUE (Level 20)</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLaunchApp}
              className="w-full py-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              Start Free with BYOK
            </button>
          </div>

          {/* TIER 2: FREE TRIAL (HOSTED) */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-teal-500/40 transition-colors">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-400">2. Free Trial (Hosted)</div>
              <div className="text-3xl font-black text-white mt-2">$0</div>
              <div className="text-xs text-slate-400 mt-1">3 Full Reviews / Day • Zero Setup</div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                First-time visitors testing the waters without signing up or creating an API key.
              </p>

              <div className="my-6 border-t border-slate-800/80 pt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>3 free complete game reviews</strong> every 24 hours</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Zero setup</strong>: No credit card, no sign-up, no API key</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Interactive Socratic blunder sparring</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Instant 1-click PGN / username import</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLaunchApp}
              className="w-full py-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              Try 3 Free Reviews Today
            </button>
          </div>

          {/* TIER 3: APEX PRO (SUBSCRIPTION) */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">3. Apex Pro (Turnkey)</div>
              <div className="text-3xl font-black text-white mt-2">
                {billingCycle === 'monthly' ? '$4.99' : '$39'}
                <span className="text-xs font-normal text-slate-400">
                  {billingCycle === 'monthly' ? ' / mo' : ' / yr ($3.25/mo)'}
                </span>
              </div>
              <div className="text-xs text-indigo-400 font-semibold mt-1">Undercuts Chess.com by 75%</div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                For casual players who want 1-click magic with zero API setup or key management.
              </p>

              <div className="my-6 border-t border-slate-800/80 pt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited cloud analysis</strong> (Zero API key needed)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Conversational Socratic "Ask Coach" chat</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Multi-game subconscious leak detector (50 games)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Custom blunder puzzle generator & Anki export</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLaunchApp}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-500/20"
            >
              Start Apex Pro
            </button>
          </div>

          {/* TIER 4: LIFETIME FOUNDER (ONE-TIME DEAL) */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500 rounded-3xl p-6 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/15">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
              Best Long-Term Value
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">4. Lifetime Founder</div>
              <div className="text-3xl font-black text-white mt-2">$59 <span className="text-xs font-normal text-emerald-300">one-time</span></div>
              <div className="text-xs text-emerald-400 font-semibold mt-1">Pay once, own for life</div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                The anti-subscription wedge. Power users who want to own their software forever with zero recurring bills.
              </p>

              <div className="my-6 border-t border-slate-800/80 pt-4 space-y-2.5 text-xs text-slate-200">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>All Pro features unlocked forever</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Perpetual updates to Stockfish & AI pipelines</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Use free Gemini key (1,500/day) or hosted fallback</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Early access to upcoming grandmaster fine-tunes</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLaunchApp}
              className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/30"
            >
              Get Lifetime Founder Pass
            </button>
          </div>

        </div>
      </div>

      {/* INTERACTIVE TOKEN BURN & ROI CALCULATOR */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-black text-white flex items-center justify-center gap-2">
              <Calculator className="w-6 h-6 text-emerald-400" />
              <span>Interactive Token Cost & Savings Calculator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              See exactly what your real API costs will be and calculate your net 3-year savings versus Chess.com Diamond.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Left: Sliders & Controls */}
            <div className="space-y-6 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                  <span>Games Analyzed Per Week:</span>
                  <span className="text-emerald-400 font-mono text-sm">{gamesPerWeek} games</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={gamesPerWeek}
                  onChange={(e) => setGamesPerWeek(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>2 (Casual)</span>
                  <span>15 (Active)</span>
                  <span>50 (Intensive)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Your AI Coaching Model:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedModel('gemini-flash')}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      selectedModel === 'gemini-flash' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div>Google Gemini Flash</div>
                    <div className="text-[10px] opacity-75">$0.00035 / game</div>
                  </button>
                  <button
                    onClick={() => setSelectedModel('gpt4o-mini')}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      selectedModel === 'gpt4o-mini' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div>GPT-4o Mini</div>
                    <div className="text-[10px] opacity-75">$0.002 / game</div>
                  </button>
                  <button
                    onClick={() => setSelectedModel('sonnet')}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      selectedModel === 'sonnet' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div>Claude 3.5 Sonnet</div>
                    <div className="text-[10px] opacity-75">$0.012 / game</div>
                  </button>
                  <button
                    onClick={() => setSelectedModel('ollama')}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      selectedModel === 'ollama' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div>Local Ollama (Offline)</div>
                    <div className="text-[10px] text-emerald-400 font-bold">$0.0000 / game</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Real Economics Breakdown */}
            <div className="bg-slate-900/90 border border-emerald-500/30 p-6 rounded-2xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <div className="text-xs text-slate-400">Your Real Monthly AI Inference Bill:</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  ${rawApiCostPerMonth.toFixed(4)} <span className="text-xs font-normal text-slate-400">/ month</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  ({Math.round(monthlyGames)} games reviewed per month)
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>3-Year Chess.com Diamond:</span>
                  <span className="font-mono text-rose-400 font-bold">$480.00</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>3-Year Apex Lifetime + Tokens:</span>
                  <span className="font-mono text-emerald-400 font-bold">${threeYearApexFounderCost.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>Your Net 3-Year Savings:</span>
                  <span className="text-emerald-400 font-black text-lg font-mono">
                    ${totalThreeYearSavings.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onLaunchApp}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  Claim These Savings Today
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
