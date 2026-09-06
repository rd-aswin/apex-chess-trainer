import React, { useState } from 'react';
import { 
  Sparkles, Swords, ArrowRight, ShieldCheck, Zap, 
  DollarSign, Check, X, AlertTriangle, Users, TrendingUp,
  Flame, Award, Lock, ExternalLink, RefreshCw
} from 'lucide-react';

export function HomePage({ onNavigate, onLaunchApp }) {
  const [activeTab, setActiveTab] = useState('apex'); // 'apex' | 'stockfish' | 'chesscom'

  return (
    <div className="min-h-screen text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Problem Agitation Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-lg shadow-emerald-500/10 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tired of Paying $16/Month for Confusing Numbers?</span>
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
            You make a blunder. Traditional engines show a cryptic score and a 10-move variation you'll never remember. Apex explains <strong>why your move was bad</strong> in clear, friendly English—and helps you practice the right move.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-200 transform hover:-translate-y-1 flex items-center justify-center gap-2.5"
            >
              <Swords className="w-5 h-5 text-slate-950" />
              <span>Start Training Free (3 Games/Day)</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={() => onNavigate('pricing')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl text-base font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>See Honest Pricing</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">$0 with Free Key</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              3 Free Reviews Every Day (No Signup)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              100% Free Forever with Your Google Key
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Works with Chess.com & Lichess
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              100% Private (No Tracking)
            </span>
          </div>

        </div>
      </section>

      {/* INTERACTIVE CONTRAST DEMO */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800/80 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">See The Difference Yourself</h2>
            <p className="text-2xl sm:text-3xl font-black text-white">Compare How Different Sites Explain a Mistake</p>
            <p className="text-sm text-slate-400 mt-2">Example: French Defense — Black plays 14... Be6?</p>
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
                <span>Apex AI Coach</span>
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
                <span>Standard Engine</span>
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
                    Grandmaster Coach Tone
                  </span>
                </div>
                <div className="bg-slate-900/60 rounded-2xl p-5 border border-emerald-500/20">
                  <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Why 14... Be6 is a Serious Flaw:
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    "Your bishop looks natural on e6, but it abandons the defense of your <strong>knight on c6</strong>. White immediately strikes with <strong>15. d5!</strong>, which forks your bishop and knight while opening the center toward your uncastled king."
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400 font-semibold">What Happened:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Pawn Fork (d5)</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Left Knight Undefended (c6)</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">King Trapped in Center</span>
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
                    ❌ <em>Notice: Doesn't tell you about the d5 pawn fork. Doesn't tell you that your c6 knight is hung. You have to figure out why by yourself.</em>
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'stockfish' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="font-mono text-xs text-slate-400">depth 24 score cp 185 nodes 14209184</span>
                  <span className="text-xs text-cyan-400 font-mono font-bold">+1.85 (White advantage)</span>
                </div>
                <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 font-mono text-xs text-slate-400 space-y-2">
                  <p>d4d5 c6e7 d5e6 f7e6 f1c4 d7d5 e4d5 e6d5 c4b3</p>
                  <p className="text-slate-400 font-sans text-xs pt-2">
                    ❌ <em>Notice: A wall of computer notation that doesn't teach you how to avoid making the same blunder again.</em>
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
              <span>Try analyzing positions in the interactive demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* THE 3-YEAR SUBSCRIPTION COMPARISON */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20 mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Why Keep Paying Subscriptions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How Much Are You Spending on Chess Software?
          </h2>
          <p className="text-base text-slate-400 mt-4 leading-relaxed">
            Major platforms charge you every single month—even when you're busy with work and don't play. Apex gives you freedom: train for free with your own key, or pay once and own it for life.
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
                  <span>Generic one-sentence templates ("You missed a tactic")</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Bills you every month even when you didn't play</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Cloud analysis slows down during busy peak hours</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-800/80 mt-6 text-xs text-slate-400">
              Ongoing monthly bill that never stops
            </div>
          </div>

          {/* Card 2: Aimchess */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 relative flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Aimchess</div>
              <div className="text-3xl font-black text-white mt-2">$119 <span className="text-sm font-normal text-slate-400">/ year</span></div>
              <div className="text-xs text-rose-400 font-semibold mt-1">$357 over 3 years</div>
              
              <ul className="mt-6 space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Static charts that tell you what went wrong, but don't teach you</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>No conversational coach to ask questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>Requires another recurring monthly charge</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-800/80 mt-6 text-xs text-slate-400">
              Separate subscription on top of playing sites
            </div>
          </div>

          {/* Card 3: Apex Chess Trainer */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/60 rounded-3xl p-8 relative flex flex-col justify-between shadow-2xl shadow-emerald-500/10">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
              No Recurring Bills
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Apex Chess Trainer</div>
              <div className="text-3xl font-black text-white mt-2">$0 <span className="text-sm font-normal text-emerald-300">/ forever</span></div>
              <div className="text-xs text-emerald-400 font-semibold mt-1">Free with your key • or $59 Lifetime</div>
              
              <ul className="mt-6 space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>1,500 Free Reviews/Day</strong> using your free Google key</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Plain-English Coaching</strong> that explains why moves fail</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>World Champion Stockfish</strong> runs right on your computer</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Guilt:</strong> If you don't play for 3 weeks, you pay $0.00</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => onNavigate('pricing')}
                className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/25"
              >
                View Plans & Pricing
              </button>
            </div>
          </div>

        </div>

        {/* Real Math Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-2xl mx-auto text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Why It's So Affordable:</div>
          <div className="text-lg font-black text-white mt-1">
            Reviewing 30 full games a month with Google's AI costs less than <span className="text-emerald-400 font-mono">2 cents</span>.
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Major sites charge you $16 every month for fractions of a cent in compute. With Apex, you keep that money in your pocket.
          </p>
        </div>

      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Designed For Real Improvement</h2>
            <p className="text-3xl sm:text-5xl font-black text-white">Everything You Need to Break Your Rating Plateau</p>
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
                <span>Plain-English Game Review</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Understand the tactical and strategic reasons behind your mistakes. Never guess what a random engine number means again.
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
                <span>Interactive Move Sparring</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Try your candidate ideas on the board! When you blunder, test what you were thinking and let the coach show you why it fails.
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
                <span>Find Your Bad Habits</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identifies recurring habits across your last 50 games: pieces left unguarded, king safety oversights, or giving away active bishops.
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
                <span>World Champion Engine (Offline)</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stockfish 19 runs directly on your computer with locked maximum strength. Instant responses with zero server lag or queues.
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
                <span>Custom Blunder Practice Drills</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Converts your actual game mistakes into interactive puzzles and Anki flashcards so you never make the same error twice.
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
                <span>1-Minute Free Setup</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste your free Google key once in settings. It stays in your browser memory. We never store your keys or track your games.
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
            Own Your Personal Chess Coach Today.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto mb-8">
            No recurring $16/mo bills. No locked reviews. Try 3 games free right now, or bring your free Google key for unlimited reviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-xl shadow-emerald-500/25 transition-all text-base flex items-center justify-center gap-2"
            >
              <Swords className="w-5 h-5" />
              <span>Start Training Free (3 Reviews Today)</span>
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
