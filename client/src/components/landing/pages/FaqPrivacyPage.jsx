import React, { useState } from 'react';
import { 
  HelpCircle, ShieldCheck, Lock, ChevronDown, Check, ArrowRight, Swords 
} from 'lucide-react';

export function FaqPrivacyPage({ onNavigate, onLaunchApp }) {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "Isn't getting an API key technically difficult?",
      a: "Not at all. It takes less than 60 seconds. You visit Google AI Studio, click 'Get API Key', and copy the code. Google gives you 1,500 full game reviews per day at $0.00 cost with no credit card required. If you can make a free Google account, you can get an API key."
    },
    {
      q: "Will I ever be hit with an unexpected cloud bill?",
      a: "Never. If you use Google AI Studio's free tier, your billing limit is hard-capped at $0.00. Furthermore, Apex has a client-side hard stop mechanism built into the settings where you can lock your spend to zero."
    },
    {
      q: "Can I use Apex completely without an API key?",
      a: "Yes! Apex includes native Stockfish 19 NNUE (Skill Level 20, 3650+ Elo) and our symbolic pedagogical explainer running 100% locally on your machine. You can play games, analyze positions, and view accuracy scores completely offline with zero API keys."
    },
    {
      q: "What happens to my opening preparation and game PGNs?",
      a: "Your game history is stored strictly on your local machine (in data/history.json or your browser's private indexed storage). Apex has zero central cloud databases and zero user tracking. Your tournament novelties remain 100% private to you."
    },
    {
      q: "Does Apex work offline when traveling or on airplanes?",
      a: "Yes. Stockfish 19 is compiled natively into the platform. When disconnected from the internet, you can play full matches, review tactical mistakes, and spar candidate moves completely offline."
    },
    {
      q: "What is the GPL-3.0 Open-Source guarantee?",
      a: "Apex Chess Trainer is licensed under the GNU General Public License v3.0. You have the perpetual right to run the software, inspect the source code, modify it, and run it locally on as many computers as you own."
    }
  ];

  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Objection Crusher & Security</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Frequently Asked Questions & Privacy
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Clear, plain-English answers to every technical, financial, and privacy question about Apex Chess Trainer.
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
            <h3 className="text-lg font-bold text-white">Our 3 Non-Negotiable Privacy Tenets</h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">1. Zero Trackers</strong>
              No Google Analytics, Meta Pixels, or fingerprinting scripts. We do not track where you browse.
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">2. Local Storage</strong>
              API keys are saved in your local browser storage and never transmitted to Apex servers.
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">3. FOSS License</strong>
              Fully transparent source code protected under GNU General Public License v3.0.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={onLaunchApp}
              className="px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>Launch Live App ($0 Free)</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
