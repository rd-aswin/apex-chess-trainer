import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Swords, ChevronDown, Menu, X, ArrowRight, 
  ShieldCheck, Calculator, Flame, BookOpen, Layers, Users, Zap,
  Key, HelpCircle, Heart, Play
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
        ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-2.5' 
        : 'bg-transparent py-4 border-b border-slate-800/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 p-0.5 shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-lg select-none transform group-hover:scale-110 transition-transform">♟️</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-base text-white">Apex Chess</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                AI Coach
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 font-medium tracking-wide">Plain-English Review</p>
          </div>
        </button>

        {/* Streamlined Desktop Navigation Links (Spacious & Clean) */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          
          {/* 1. Features Dropdown */}
          <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'features' ? null : 'features')}
              onMouseEnter={() => setActiveDropdown('features')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                currentPage.startsWith('features') 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>Features</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'features' && (
              <div className="absolute top-full left-0 w-72 bg-slate-900/98 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2 mt-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => handleNav('features/ai-review')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Plain-English Review</div>
                    <div className="text-[11px] text-slate-400">Clear coaching explanations, not cryptic numbers</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('features/socratic-sparring')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <Zap className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Interactive Move Sparring</div>
                    <div className="text-[11px] text-slate-400">Try your candidate ideas after mistakes</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('features/leak-detection')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <Flame className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Find Your Bad Habits</div>
                    <div className="text-[11px] text-slate-400">Audit recurring blunders across 50 games</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('features/engine')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <Swords className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">World Champion Engine</div>
                    <div className="text-[11px] text-slate-400">Instant offline analysis right on your laptop</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('features/drills')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <BookOpen className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Custom Blunder Drills</div>
                    <div className="text-[11px] text-slate-400">Practice puzzles made from your actual games</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('features/openings')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-3"
                >
                  <span className="text-sm mt-0.5 shrink-0">📖</span>
                  <div>
                    <div className="text-xs font-bold text-white">Opening Strategy Guide</div>
                    <div className="text-[11px] text-slate-400">Master the ideas behind your repertoire</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 2. Compare Dropdown */}
          <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'comparisons' ? null : 'comparisons')}
              onMouseEnter={() => setActiveDropdown('comparisons')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                currentPage.startsWith('vs') 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>Compare</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${activeDropdown === 'comparisons' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'comparisons' && (
              <div className="absolute top-full left-0 w-64 bg-slate-900/98 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2 mt-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => handleNav('vs-chesscom')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Vs Chess.com Diamond</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">$160/yr</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Real coaching vs pre-written templates</div>
                </button>
                <button 
                  onClick={() => handleNav('vs-lichess')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Vs Lichess Engine</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">100% Free</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">A human coach vs a raw calculator</div>
                </button>
              </div>
            )}
          </div>

          {/* 3. For Your Level Dropdown */}
          <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'usecases' ? null : 'usecases')}
              onMouseEnter={() => setActiveDropdown('usecases')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                currentPage.startsWith('use-cases') 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>For Your Level</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${activeDropdown === 'usecases' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'usecases' && (
              <div className="absolute top-full left-0 w-64 bg-slate-900/98 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2 mt-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => handleNav('use-cases/1200-1500')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-xs font-bold text-white">1200–1500 Improvers</div>
                  <div className="text-[11px] text-slate-400">Stop hanging undefended pieces</div>
                </button>
                <button 
                  onClick={() => handleNav('use-cases/1600-1900')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-xs font-bold text-white">1600–1900 Club Players</div>
                  <div className="text-[11px] text-slate-400">Master pawn structures & outposts</div>
                </button>
                <button 
                  onClick={() => handleNav('use-cases/adult-improver')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-xs font-bold text-white">Busy Adult Improvers</div>
                  <div className="text-[11px] text-slate-400">High-yield 15-minute daily routine</div>
                </button>
                <button 
                  onClick={() => handleNav('use-cases/coaches')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="text-xs font-bold text-white">Coaches & Academies</div>
                  <div className="text-[11px] text-slate-400">Review student games automatically</div>
                </button>
              </div>
            )}
          </div>

          {/* 4. Pricing (Direct Link) */}
          <button
            onClick={() => handleNav('pricing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
              currentPage === 'pricing' 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Pricing
          </button>

          {/* 5. Resources Dropdown (Consolidates Guides, Calc, Story, FAQ & Demo) */}
          <div className="relative" onMouseLeave={() => setActiveDropdown(null)}>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
              onMouseEnter={() => setActiveDropdown('resources')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                ['how-byok-works', 'calculator', 'manifesto', 'demo', 'faq-privacy'].includes(currentPage)
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>Resources</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'resources' && (
              <div className="absolute top-full right-0 w-64 bg-slate-900/98 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-2 mt-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button 
                  onClick={() => handleNav('how-byok-works')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-2.5"
                >
                  <Key className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">How Free Key Works</div>
                    <div className="text-[11px] text-slate-400">60-second tutorial for Google AI Studio</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('calculator')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-2.5"
                >
                  <Calculator className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Savings Calculator</div>
                    <div className="text-[11px] text-slate-400">Compare 3-year costs against Chess.com</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('demo')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-2.5"
                >
                  <Play className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Interactive Demo</div>
                    <div className="text-[11px] text-slate-400">Try sample blunders without signing up</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('manifesto')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-2.5"
                >
                  <Heart className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Why No Subscriptions?</div>
                    <div className="text-[11px] text-slate-400">Our mission and software promise</div>
                  </div>
                </button>
                <button 
                  onClick={() => handleNav('faq-privacy')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-2.5"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Common Questions & Privacy</div>
                    <div className="text-[11px] text-slate-400">FAQ on offline play and key security</div>
                  </div>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Action CTA (Clean & Uncluttered) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNav('demo')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60"
          >
            Try Demo
          </button>

          <button
            onClick={onLaunchApp}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none"
          >
            <Swords className="w-3.5 h-3.5 text-slate-950" />
            <span>Start Training Free</span>
            <ArrowRight className="w-3 h-3 text-slate-950 transition-transform group-hover:translate-x-0.5" />
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
              Why No Subscriptions?
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
            <p className="text-xs font-semibold text-slate-500 uppercase px-3 mb-1">Compare</p>
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
