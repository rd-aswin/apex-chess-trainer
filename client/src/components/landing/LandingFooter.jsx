import React from 'react';
import { 
  Sparkles, Swords, ShieldCheck, Heart, 
  ExternalLink, ArrowUpRight, Lock, CheckCircle2
} from 'lucide-react';

export function LandingFooter({ onNavigate, onLaunchApp }) {
  const handleNav = (pageId) => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Col 1: Mission & Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-lg">♟️</span>
                </div>
              </div>
              <span className="font-black text-white text-lg tracking-tight">APEX CHESS</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              The personal chess coach you actually own. Plain-English explanations, mistake detection, and zero recurring monthly fees.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 border border-slate-800 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                No Monthly Fees
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 border border-slate-800 text-cyan-400">
                <Lock className="w-3.5 h-3.5" />
                100% Private
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={onLaunchApp}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20 text-center flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4" />
                <span>Start Training Free</span>
              </button>
            </div>
          </div>

          {/* Col 2: Core Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Start Here</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-emerald-400 transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pricing')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Pricing & Plans</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">$0</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-byok-works')} className="hover:text-emerald-400 transition-colors">
                  How Free Key Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('calculator')} className="hover:text-emerald-400 transition-colors">
                  3-Year Savings Calculator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('demo')} className="hover:text-emerald-400 transition-colors">
                  Interactive Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Coaching Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Coaching Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('features/ai-review')} className="hover:text-emerald-400 transition-colors">
                  Plain-English Review
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features/socratic-sparring')} className="hover:text-emerald-400 transition-colors">
                  Interactive Move Sparring
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features/leak-detection')} className="hover:text-emerald-400 transition-colors">
                  Find Your Bad Habits
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features/engine')} className="hover:text-emerald-400 transition-colors">
                  World Champion Engine
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features/drills')} className="hover:text-emerald-400 transition-colors">
                  Custom Blunder Drills
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features/openings')} className="hover:text-emerald-400 transition-colors">
                  Opening Strategy Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Compare & Rating Levels */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Compare</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('vs-chesscom')} className="hover:text-emerald-400 transition-colors">
                  Vs. Chess.com Diamond
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('vs-lichess')} className="hover:text-emerald-400 transition-colors">
                  Vs. Lichess Calculator
                </button>
              </li>
              <li className="pt-2 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                For Your Level
              </li>
              <li>
                <button onClick={() => handleNav('use-cases/1200-1500')} className="hover:text-emerald-400 transition-colors">
                  1200–1500 Improvers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('use-cases/1600-1900')} className="hover:text-emerald-400 transition-colors">
                  1600–1900 Club Players
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('use-cases/adult-improver')} className="hover:text-emerald-400 transition-colors">
                  Busy Adult Improvers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('use-cases/coaches')} className="hover:text-emerald-400 transition-colors">
                  Coaches & Teachers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Philosophy & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Trust & Help</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('manifesto')} className="hover:text-emerald-400 transition-colors">
                  Our Story (Why No Subscriptions)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq-privacy')} className="hover:text-emerald-400 transition-colors">
                  Common Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq-privacy')} className="hover:text-emerald-400 transition-colors">
                  Your Privacy & Games
                </button>
              </li>
              <li>
                <a 
                  href="https://aistudio.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-slate-300"
                >
                  <span>Get Free Google Key</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Live System Status Bar & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              World Champion Stockfish 19 Ready
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              Your Games Stay Private On Your Device
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-slate-400">Works 100% Offline</span>
          </div>

          <div className="flex items-center gap-3">
            <span>© 2026 Apex Chess Trainer. Built for players who want to actually improve.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
