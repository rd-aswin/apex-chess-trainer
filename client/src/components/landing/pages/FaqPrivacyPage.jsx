import React, { useState } from 'react';
import { 
  HelpCircle, ShieldCheck, Lock, ChevronDown, Check, ArrowRight, Swords 
} from 'lucide-react';

export function FaqPrivacyPage({ onNavigate, onLaunchApp }) {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "Can I really use this 100% free forever?",
      a: "Yes. Google gives every user a free developer key that allows 1,500 game reviews every day. You don't need to enter a credit card, and Google will never bill you. As long as you use your free key, Apex costs you $0.00."
    },
    {
      q: "Do I need any technical or programming skills?",
      a: "None at all. Getting a free key takes 60 seconds: you sign in with your normal Google account, click 'Get API key', and copy-paste it into Apex settings once. Or, you can just use our 3 free daily reviews without any setup at all!"
    },
    {
      q: "Is my opening preparation and match history kept private?",
      a: "100% yes. All your games and PGN files stay on your own computer. We do not have a central database where we store your games, and we never track or sell your data. Your tournament novelties remain private to you."
    },
    {
      q: "Can I use Apex offline on an airplane or when traveling?",
      a: "Yes. The world-champion Stockfish engine is installed right on your device. You can play practice games, test variations, and review moves completely offline with zero Wi-Fi connection."
    },
    {
      q: "Can I import games from both Chess.com and Lichess?",
      a: "Yes! Simply click 'Import' in the header, type in your Chess.com or Lichess username, and pick any recent match. Apex analyzes the game immediately with plain-English coaching."
    },
    {
      q: "What if I don't want to deal with any API keys at all?",
      a: "You have two great options: you can use our 3 free daily reviews every day with zero setup, or upgrade to Apex Pro ($4.99/mo or $59 Lifetime) where all cloud reviews are completely turnkey with zero keys needed."
    }
  ];

  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Common Questions & Answers
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about getting started, staying private, and breaking your rating plateau.
        </p>
      </div>

      {/* FAQ ACCORDION */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div 
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-sm font-bold text-white">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PRIVACY TENETS */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Our 3 Core Privacy Guarantees</h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">1. Zero Ad Trackers</strong>
              We do not track your browsing, run advertising scripts, or sell personal profiles.
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">2. Private Game History</strong>
              Your match logs stay on your computer. Your opening prep is never uploaded to a central server.
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">3. Zero Surprise Bills</strong>
              Google's developer tier does not collect card details, making accidental charges impossible.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onLaunchApp}
              className="px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>Start Training Free Today</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
