import React, { useState } from 'react';
import { 
  Sparkles, Swords, ArrowRight, ShieldCheck, Zap, 
  DollarSign, Check, X, AlertTriangle, Users, TrendingUp,
  Flame, Award, Lock, ExternalLink, RefreshCw
} from 'lucide-react';

export function HomePage({ onNavigate, onLaunchApp }) {
  // Sample position interactive toggle for hero demo
  const [activeTab, setActiveTab] = useState('apex'); // 'apex' | 'stockfish' | 'chesscom'

  return (
    <div className="min-h-screen text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Anti-Subscription Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-lg shadow-emerald-500/10 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The BYOK Anti-Subscription Chess Revolution</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Stop Staring at <span className="text-rose-400 underline decoration-rose-500/50 decoration-wavy decoration-2">+1.4</span>.<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Understand the Mistake.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            You blunder. Stockfish screams numbers. You learn nothing. Apex explains <em>why</em> your move failed in clear, human English—grounded by local <strong className="text-slate-200">Stockfish 19 NNUE</strong> and Google Gemini Flash.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center gap-2.5"
            >
              <Swords className="w-5 h-5 text-slate-950" />
              <span>Launch Live App ($0 Free)</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={() => onNavigate('pricing')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl text-base font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Explore BYOK Pricing</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">$0 API Key</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              100% Free Forever with BYOK
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              3 Free Hosted Reviews / Day (No Key Needed)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Stockfish 19 AVX-512 (3650+ Elo)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Zero Cloud Telemetry
            </span>
          </div>

        </div>
      </section>

      {/* INTERACTIVE CONTRAST DEMO */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800/80 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">The Difference Is Night & Day</h2>
            <p className="text-2xl sm:text-3xl font-black text-white">Compare How Different Platforms Analyze a Blunder</p>
            <p className="text-sm text-slate-400 mt-2">Position: French Defense Winawer — Black plays 14... Be6?</p>
          </div>

          {/* Interactive Toggle Switch */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
              <button
                onClick={() => setActiveTab('apex')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'apex' 
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Apex Explainable AI</span>
              </button>
              <button
                onClick={() => setActiveTab('chesscom')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'chesscom' 
                    ? 'bg-slate-800 text-rose-400 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Chess.com ($16/mo)</span>
              </button>
              <button
                onClick={() => setActiveTab('stockfish')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'stockfish' 
                    ? 'bg-slate-800 text-cyan-400 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Raw Stockfish Output</span>
              </button>
            </div>
          </div>

          {/* Demo Content Cards */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {activeTab === 'apex' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                      ? Mistake
                    </span>
                    <span className="font-mono text-sm font-semibold text-slate-300">14... Be6 (played) vs 14... 0-0 (best)</span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    Grandmaster Grounded
                  </span>
                </div>
                <div className="bg-slate-900/60 rounded-2xl p-5 border border-emerald-500/20">
                  <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Why 14... Be6 is a Serious Flaw:
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    "Your bishop looks natural on e6, but it abandons the defense of your <strong>c6-knight</strong>. White immediately strikes with <strong>15. d5!</strong>, creating a devastating pawn fork between your bishop on e6 and knight on c6. Furthermore, moving this bishop leaves your king trapped in the center just as White opens the central files."
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400 font-semibold">Tactical Motifs Detected:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Pawn Fork (d5)</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Removed Defender (c6)</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Uncastled King Exposure</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chesscom' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">
                      Inaccuracy
                    </span>
                    <span className="font-mono text-sm font-semibold text-slate-300">14... Be6</span>
                  </div>
                  <span className="text-xs text-rose-400 font-semibold">$16.99/mo Diamond</span>
                </div>
                <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800">
                  <p className="text-sm text-slate-300 italic">
                    "This is an inaccuracy. You should have castled instead. Finding the best move would have kept your position equal."
                  </p>
                  <p className="text-xs text-slate-400 mt-3">
                    ❌ <em>Notice: Doesn't mention the d5 pawn fork. Doesn't explain why c6 is now undefended. Forces you to figure out the refutation on your own.</em>
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'stockfish' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="font-mono text-xs text-slate-400">info depth 24 score cp 185 nodes 14209184 nps 11200344</span>
                  <span className="text-xs text-cyan-400 font-mono font-bold">+1.85 (White ahead)</span>
                </div>
                <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 font-mono text-xs text-slate-400 space-y-2">
                  <p>pv: d4d5 c6e7 d5e6 f7e6 f1c4 d7d5 e4d5 e6d5 c4b3 e7g6 d1e2+</p>
                  <p className="text-slate-400 font-sans text-xs pt-2">
                    ❌ <em>Notice: A coordinate dump. Without a Grandmaster sitting beside you, you cannot decipher the underlying strategic logic.</em>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => onNavigate('demo')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Try analyzing your own positions in the interactive sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* THE 3-YEAR SUBSCRIPTION GRAVEYARD */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20 mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Subscription Trap</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How Much Are You Really Paying to Learn Chess?
          </h2>
          <p className="text-base text-slate-400 mt-4 leading-relaxed">
            Incumbent sites charge you every single month whether you play 50 games or zero. With Apex BYOK, you own the platform and pay wholesale pennies for the intelligence you consume.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1: Chess.com Diamond */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 relative flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Chess.com Diamond</div>
              <div className="text-3xl font-black text-white mt-2">$160 <span className="text-sm font-normal text-slate-400">/ year</span></div>
              <div className="text-xs text-rose-400 font-semibold mt-1">$480 over 3 years</div>
              
              <ul className="mt-6 space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Canned 1-sentence template text disguised as AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Bills you every month even when you're busy & don't play</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Cloud engine throttled during peak server hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Full user telemetry and aggressive marketing popups</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-800/80 mt-6 text-xs text-slate-400">
              Per-game cost markup: ~2,500%
            </div>
          </div>

          {/* Card 2: Aimchess */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 relative flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Aimchess Analytics</div>
              <div className="text-3xl font-black text-white mt-2">$119 <span className="text-sm font-normal text-slate-400">/ year</span></div>
              <div className="text-xs text-rose-400 font-semibold mt-1">$357 over 3 years</div>
              
              <ul className="mt-6 space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Static charts that describe symptoms, not cures</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>No interactive Socratic candidate move sparring</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Requires full cloud sync and separate subscription</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>No local engine execution or offline capability</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-800/80 mt-6 text-xs text-slate-400">
              Per-game cost markup: ~1,800%
            </div>
          </div>

          {/* Card 3: Apex BYOK (Winner) */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/60 rounded-3xl p-8 relative flex flex-col justify-between shadow-2xl shadow-emerald-500/10">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
              Anti-Subscription
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Apex Chess Trainer (BYOK)</div>
              <div className="text-3xl font-black text-white mt-2">$0 <span className="text-sm font-normal text-emerald-300">/ forever</span></div>
              <div className="text-xs text-emerald-400 font-semibold mt-1">$0.00 with free Gemini key OR $59 Lifetime</div>
              
              <ul className="mt-6 space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>1,500 Free Reviews/Day</strong> via Google AI Studio API key</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Articulate GM Explanations</strong> powered by Gemini Flash</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Stockfish 19 NNUE</strong> on your local CPU (3650+ Elo)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Idle Guilt</strong>: Never bills you while you sleep</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => onNavigate('pricing')}
                className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/25"
              >
                View Transparent Pricing
              </button>
            </div>
          </div>

        </div>

        {/* Real Math Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-2xl mx-auto text-center">
          <div className="text-xs font-bold text-slate-400">RADICAL UNIT ECONOMIC REALITY:</div>
          <div className="text-lg font-black text-white mt-1">
            Analyzing 30 full games a month with Gemini Flash costs exactly <span className="text-emerald-400 font-mono">$0.0105</span>.
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Legacy platforms charge you $16.99/mo for $0.01 of compute. We give you the keys to wholesale pricing.
          </p>
        </div>

      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Designed For Genuine Improvement</h2>
            <p className="text-3xl sm:text-5xl font-black text-white">Everything You Need to Break Your Elo Plateau</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div 
              onClick={() => onNavigate('features/ai-review')}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Neuro-Symbolic Explainable AI</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero hallucinations. Stockfish calculates the truth, our geometric raytracer extracts the tactical motifs, and Gemini Flash writes the coaching wisdom.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              onClick={() => onNavigate('features/socratic-sparring')}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Socratic Move-by-Move Sparring</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Active recall instead of passive reading. The coach halts critical turning points and forces you to formulate candidate ideas before seeing engine answers.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              onClick={() => onNavigate('features/leak-detection')}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-rose-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>50-Game Subconscious Leak Detector</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discovers hidden habits across your games: dark-squared bishop trades, knight outpost misses, and back-rank vulnerabilities costing you 150 rating points.
              </p>
            </div>

            {/* Feature 4 */}
            <div 
              onClick={() => onNavigate('features/engine')}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Swords className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Stockfish 19 NNUE (AVX-512)</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Locked Level 20 (~3650+ Elo) computation running directly on your CPU hardware. Zero server queue latency, zero cloud throttling.
              </p>
            </div>

            {/* Feature 5 */}
            <div 
              onClick={() => onNavigate('features/drills')}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>Personalized Error Drills & Anki</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Converts your actual match blunders into custom interactive puzzle drills and spaced-repetition Anki decks.
              </p>
            </div>

            {/* Feature 6 */}
            <div 
              onClick={() => onNavigate('how-byok-works')}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 flex items-center justify-between">
                <span>1-Click BYOK & Local Storage</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste your free Google AI Studio key once into local browser storage. Direct TLS communication. Zero cloud database storage of your API keys.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CONVERSION HERO */}
      <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-6 text-2xl">
            ♟️
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Own Your Personal Grandmaster Coach.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto mb-8">
            No recurring $16/mo bills. No locked reviews. Bring your free Gemini key and analyze unlimited games forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-xl shadow-emerald-500/25 transition-all text-base flex items-center justify-center gap-2"
            >
              <Swords className="w-5 h-5" />
              <span>Launch Live App ($0 Free)</span>
            </button>

            <button
              onClick={() => onNavigate('calculator')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 transition-all text-base flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Calculate Your Savings</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
