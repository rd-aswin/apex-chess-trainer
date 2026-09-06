import React from 'react';
import { 
  Sparkles, Swords, ShieldCheck, Heart, Terminal, 
  ExternalLink, ArrowUpRight, Cpu, Lock, Github
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
              The anti-subscription superhuman chess training platform. Powered by local Stockfish 19 NNUE (AVX-512) and neuro-symbolic explainable AI.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 border border-slate-800 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                GPL-3.0 FOSS
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 border border-slate-800 text-cyan-400">
                <Cpu className="w-3.5 h-3.5" />
                AVX-512 Ready
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={onLaunchApp}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20 text-center flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4" />
                <span>Launch Interactive Board</span>
              </button>
            </div>
          </div>

          {/* Col 2: Core Platform & Commercial */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-emerald-400 transition-colors">
                  Flagship Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pricing')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Pricing & BYOK</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">$0</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-byok-works')} className="hover:text-emerald-400 transition-colors">
                  How BYOK Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('calculator')} className="hover:text-emerald-400 transition-colors">
                  3-Year ROI Calculator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('demo')} className="hover:text-emerald-400 transition-colors">
                  Interactive Sandbox Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Engine & AI Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">AI & Engine</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('features/ai-review')} className="hover:text-emerald-400 transition-colors">
                  Explainable AI Review
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features/socratic-sparring')} className="hover:text-emerald-400 transition-colors">
                  Socratic Sparring
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features/leak-detection')} className="hover:text-emerald-400 transition-colors">
                  50-Game Leak Detector
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features/engine')} className="hover:text-emerald-400 transition-colors">
                  Stockfish 19 AVX-512
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features/drills')} className="hover:text-emerald-400 transition-colors">
                  Blunder Drills & Anki
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features/openings')} className="hover:text-emerald-400 transition-colors">
                  Opening Repertoire (ECO)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Competitors & Personas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Comparisons</h4>
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
                Who It's For
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
                  Coaches & Academies
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Philosophy & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Philosophy & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('manifesto')} className="hover:text-emerald-400 transition-colors">
                  Anti-Subscription Manifesto
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq-privacy')} className="hover:text-emerald-400 transition-colors">
                  FAQ & Objection Crusher
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq-privacy')} className="hover:text-emerald-400 transition-colors">
                  Privacy & Zero Telemetry
                </button>
              </li>
              <li>
                <a 
                  href="https://github.com/rd-aswin/apex-chess-trainer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-slate-300"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://aistudio.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-slate-300"
                >
                  <span>Google AI Studio Key</span>
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
              Stockfish 19 NNUE (Level 20) Active
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              Keys Stored Locally (AES-256)
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-slate-400">Gemini 1.5/2.5 Flash Grounded</span>
          </div>

          <div className="flex items-center gap-3">
            <span>© 2026 Apex Chess Trainer. Built with passion for true improvers.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
