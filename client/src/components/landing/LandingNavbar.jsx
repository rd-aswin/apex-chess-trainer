import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Swords, ChevronDown, Menu, X, ArrowRight, 
  ShieldCheck, Calculator, Flame, BookOpen, Layers, Users, Zap
} from 'lucide-react';

export function LandingNavbar({ currentPage, onNavigate, onLaunchApp }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (pageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-3' 
        : 'bg-transparent py-5 border-b border-slate-800/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl select-none transform group-hover:scale-110 transition-transform">♟️</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-lg text-white font-sans">Apex Chess</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                AI Coach
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 font-medium tracking-wide">Plain-English Game Review</p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          
          {/* Features Dropdown */}
          <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'features' ? null : 'features')}
              onMouseEnter={() => setActiveDropdown('features')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage.startsWith('features') 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Features</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'features' && (
              <div className="absolute top-full left-0 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2 mt-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => handleNav('features/ai-review')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">Plain-English Review</div>
                    <div className="text-xs text-slate-400">Clear explanations, not cryptic numbers</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('features/socratic-sparring')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <Zap className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">Interactive Move Sparring</div>
                    <div className="text-xs text-slate-400">Try your ideas when you make a mistake</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('features/leak-detection')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <Flame className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">Find Your Bad Habits</div>
                    <div className="text-xs text-slate-400">Spot mistakes repeated across 50 games</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('features/engine')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <Swords className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">World Champion Engine</div>
                    <div className="text-xs text-slate-400">Instant analysis on your own laptop</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('features/drills')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <BookOpen className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">Custom Blunder Drills</div>
                    <div className="text-xs text-slate-400">Practice puzzles made from your games</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('features/openings')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <span className="text-base mt-0.5 shrink-0">📖</span>
                  <div>
                    <div className="text-sm font-semibold text-white">Opening Strategy Guide</div>
                    <div className="text-xs text-slate-400">Learn the plans, not just memorized moves</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Comparisons Dropdown */}
          <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'comparisons' ? null : 'comparisons')}
              onMouseEnter={() => setActiveDropdown('comparisons')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage.startsWith('vs') 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>Compare</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'comparisons' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'comparisons' && (
              <div className="absolute top-full left-0 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2 mt-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => handleNav('vs-chesscom')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-sm font-semibold text-white flex items-center justify-between">
                    <span>Vs Chess.com Diamond</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">$160/yr</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Real coaching vs pre-written templates</div>
                </button>
                <button 
                  onClick={() => handleNav('vs-lichess')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-sm font-semibold text-white flex items-center justify-between">
                    <span>Vs Lichess Engine</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">100% Free</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">A human coach vs a raw calculator</div>
                </button>
              </div>
            )}
          </div>

          {/* Use Cases Dropdown */}
          <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'usecases' ? null : 'usecases')}
              onMouseEnter={() => setActiveDropdown('usecases')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage.startsWith('use-cases') 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>For Your Level</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'usecases' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'usecases' && (
              <div className="absolute top-full left-0 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2 mt-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => handleNav('use-cases/1200-1500')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-sm font-semibold text-white">1200–1500 Improvers</div>
                  <div className="text-xs text-slate-400">Stop hanging undefended pieces</div>
                </button>
                <button 
                  onClick={() => handleNav('use-cases/1600-1900')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-sm font-semibold text-white">1600–1900 Club Players</div>
                  <div className="text-xs text-slate-400">Master pawn structures and knight outposts</div>
                </button>
                <button 
                  onClick={() => handleNav('use-cases/adult-improver')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-sm font-semibold text-white">Busy Adult Improvers</div>
                  <div className="text-xs text-slate-400">High-yield 15-minute daily routine</div>
                </button>
                <button 
                  onClick={() => handleNav('use-cases/coaches')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-sm font-semibold text-white">Coaches & Academies</div>
                  <div className="text-xs text-slate-400">Review student games automatically</div>
                </button>
              </div>
            )}
          </div>

          {/* Pricing */}
          <button
            onClick={() => handleNav('pricing')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'pricing' 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Pricing
          </button>

          {/* How Free Key Works */}
          <button
            onClick={() => handleNav('how-byok-works')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'how-byok-works' 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            How Free Key Works
          </button>

          {/* Savings Calculator */}
          <button
            onClick={() => handleNav('calculator')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'calculator' 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Savings Calc</span>
          </button>

          {/* Our Story */}
          <button
            onClick={() => handleNav('manifesto')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'manifesto' 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Our Story
          </button>
        </div>

        {/* Action CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => handleNav('demo')}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
          >
            Try Demo
          </button>
          
          <button
            onClick={onLaunchApp}
            className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none"
          >
            <Swords className="w-4 h-4 text-slate-950" />
            <span>Start Training Free</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onLaunchApp}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300"
          >
            Start Free
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 px-4 pt-3 pb-8 max-h-[85vh] overflow-y-auto space-y-4">
          <div className="space-y-1">
            <button 
              onClick={() => handleNav('home')} 
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-white hover:bg-slate-900"
            >
              Home
            </button>
            <button 
              onClick={() => handleNav('pricing')} 
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-emerald-400 hover:bg-slate-900"
            >
              Pricing & Free Key
            </button>
            <button 
              onClick={() => handleNav('how-byok-works')} 
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
            >
              How Free Key Works
            </button>
            <button 
              onClick={() => handleNav('calculator')} 
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
            >
              3-Year Savings Calculator
            </button>
            <button 
              onClick={() => handleNav('manifesto')} 
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
            >
              Our Story (Why No Subscriptions)
            </button>
            <button 
              onClick={() => handleNav('demo')} 
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
            >
              Interactive Demo
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-500 uppercase px-3 mb-1">Features</p>
            <div className="grid grid-cols-2 gap-1">
              <button onClick={() => handleNav('features/ai-review')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">Plain-English Review</button>
              <button onClick={() => handleNav('features/socratic-sparring')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">Move Sparring</button>
              <button onClick={() => handleNav('features/leak-detection')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">Find Bad Habits</button>
              <button onClick={() => handleNav('features/engine')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">World Champion Engine</button>
              <button onClick={() => handleNav('features/drills')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">Custom Drills</button>
              <button onClick={() => handleNav('features/openings')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">Opening Guides</button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-500 uppercase px-3 mb-1">Comparisons</p>
            <div className="grid grid-cols-2 gap-1">
              <button onClick={() => handleNav('vs-chesscom')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">Vs Chess.com Diamond</button>
              <button onClick={() => handleNav('vs-lichess')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">Vs Lichess Engine</button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-500 uppercase px-3 mb-1">For Your Rating</p>
            <div className="grid grid-cols-2 gap-1">
              <button onClick={() => handleNav('use-cases/1200-1500')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">1200–1500 Rating</button>
              <button onClick={() => handleNav('use-cases/1600-1900')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">1600–1900 Rating</button>
              <button onClick={() => handleNav('use-cases/adult-improver')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">Busy Adults</button>
              <button onClick={() => handleNav('use-cases/coaches')} className="text-left text-xs p-2 rounded text-slate-400 hover:text-white">Coaches</button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={onLaunchApp}
              className="w-full py-3 rounded-xl text-center font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20"
            >
              Start Training Free Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
