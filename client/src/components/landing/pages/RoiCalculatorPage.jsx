import React, { useState } from 'react';
import { 
  Calculator, DollarSign, TrendingUp, Sparkles, Check, ArrowRight, ShieldCheck 
} from 'lucide-react';

export function RoiCalculatorPage({ onNavigate, onLaunchApp }) {
  const [gamesPerWeek, setGamesPerWeek] = useState(15);
  const [years, setYears] = useState(3);
  const [selectedModel, setSelectedModel] = useState('gemini-flash');

  const modelCosts = {
    'gemini-flash': 0.00035,
    'gpt4o-mini': 0.002,
    'sonnet': 0.012,
    'ollama': 0.00000
  };

  const totalGamesInPeriod = gamesPerWeek * 52 * years;
  const totalTokenCost = totalGamesInPeriod * modelCosts[selectedModel];
  const chessComCost = 160.00 * years;
  const aimchessCost = 119.00 * years;
  const apexLifetimeCost = 59.00 + totalTokenCost;
  const netSavings = Math.max(0, chessComCost - apexLifetimeCost);
  const percentSaved = Math.round((netSavings / chessComCost) * 100);

  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Calculator className="w-3.5 h-3.5" />
          <span>Transparent Financial Reality</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Calculate Your Real Chess Savings
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          See the mathematical contrast between endless corporate subscriptions and owning your software with raw wholesale token pricing.
        </p>
      </div>

      {/* INTERACTIVE CALCULATOR */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Controls */}
            <div className="space-y-6">
              
              {/* Slider: Games per week */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
                  <span>Weekly Games Reviewed:</span>
                  <span className="text-emerald-400 font-mono text-base">{gamesPerWeek} games / week</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  value={gamesPerWeek}
                  onChange={(e) => setGamesPerWeek(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-2.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>2 (Weekend Player)</span>
                  <span>15 (Standard)</span>
                  <span>60 (Tournament Grinder)</span>
                </div>
              </div>

              {/* Time Horizon */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Time Horizon:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 5].map((y) => (
                    <button
                      key={y}
                      onClick={() => setYears(y)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        years === y 
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {y} {y === 1 ? 'Year' : 'Years'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  AI Inference Engine:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedModel('gemini-flash')}
                    className={`p-3 rounded-xl text-left border text-xs transition-all ${
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
                    className={`p-3 rounded-xl text-left border text-xs transition-all ${
                      selectedModel === 'gpt4o-mini' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div>GPT-4o Mini</div>
                    <div className="text-[10px] opacity-75">$0.00200 / game</div>
                  </button>
                  <button
                    onClick={() => setSelectedModel('sonnet')}
                    className={`p-3 rounded-xl text-left border text-xs transition-all ${
                      selectedModel === 'sonnet' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div>Claude 3.5 Sonnet</div>
                    <div className="text-[10px] opacity-75">$0.01200 / game</div>
                  </button>
                  <button
                    onClick={() => setSelectedModel('ollama')}
                    className={`p-3 rounded-xl text-left border text-xs transition-all ${
                      selectedModel === 'ollama' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold' 
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div>Local Ollama</div>
                    <div className="text-[10px] text-emerald-400 font-bold">$0.00000 / game</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Visual Outputs */}
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 space-y-6">
              <div>
                <div className="text-xs text-slate-400">Total Games Analyzed:</div>
                <div className="text-2xl font-black text-white font-mono">
                  {totalGamesInPeriod.toLocaleString()} games
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Chess.com Diamond ({years} yrs):</span>
                  <span className="font-mono text-rose-400 font-bold text-sm">${chessComCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Aimchess ({years} yrs):</span>
                  <span className="font-mono text-rose-400 font-bold text-sm">${aimchessCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Apex Lifetime Pass ($59 once):</span>
                  <span className="font-mono text-slate-300 font-bold text-sm">$59.00</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Total Raw Token Cost ({years} yrs):</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">${totalTokenCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Your Net Cash Savings</div>
                <div className="text-3xl font-black text-white font-mono mt-1 flex items-baseline gap-2">
                  <span>${netSavings.toFixed(2)}</span>
                  <span className="text-xs font-bold text-emerald-400">({percentSaved}% saved)</span>
                </div>
              </div>

              <button
                onClick={onLaunchApp}
                className="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/25"
              >
                Keep This Cash & Launch Apex Free
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
