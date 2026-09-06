import React from 'react';
import { 
  X, Check, Sparkles, Swords, AlertTriangle, ArrowRight, ShieldCheck 
} from 'lucide-react';

export function VsChesscomPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20 mb-4">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Competitor Teardown</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Apex vs. Chess.com Diamond
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Tired of paying $160/year for canned template sentences? Compare what you actually get between a corporate subscription monopoly and a personal open-source trainer.
        </p>
      </div>

      {/* COMPARISON TABLE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-300">
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider">Feature / Capability</th>
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-rose-400">Chess.com Diamond</th>
                  <th className="p-4 sm:p-5 font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/5">Apex Chess Trainer (BYOK)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Annual Cost</td>
                  <td className="p-4 sm:p-5 text-rose-400 font-mono font-bold">$120 – $160 / year (Every year)</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-mono font-bold bg-emerald-500/5">$0.00 Forever (BYOK) OR $59 Once</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">3-Year Total Investment</td>
                  <td className="p-4 sm:p-5 text-rose-400 font-mono font-bold">$480.00</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-mono font-bold bg-emerald-500/5">$0.00 to $60.00 (87%+ Savings)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Engine Strength & Speed</td>
                  <td className="p-4 sm:p-5 text-slate-300">Scaled-down cloud engine with server queues</td>
                  <td className="p-4 sm:p-5 text-slate-200 bg-emerald-500/5">Stockfish 19 (Runs fast on your device, max strength)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Explanation Quality</td>
                  <td className="p-4 sm:p-5 text-slate-300">Pre-written canned templates ("You missed a tactic")</td>
                  <td className="p-4 sm:p-5 text-slate-200 bg-emerald-500/5">Plain-English coaching (explains the tactical "Why")</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Interactive Move Testing</td>
                  <td className="p-4 sm:p-5 text-slate-300">Static "next move" arrows; no candidate testing</td>
                  <td className="p-4 sm:p-5 text-slate-200 bg-emerald-500/5">Test your alternative ideas on the board in real time</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Habit & Pattern Tracking</td>
                  <td className="p-4 sm:p-5 text-slate-300">Basic rating breakdown and general accuracy score</td>
                  <td className="p-4 sm:p-5 text-slate-200 bg-emerald-500/5">Audits repeating blunder patterns across your games (Apex Pro)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Data Privacy & Storage</td>
                  <td className="p-4 sm:p-5 text-slate-300">Cloud telemetry, tracking cookies, user profiling</td>
                  <td className="p-4 sm:p-5 text-slate-200 bg-emerald-500/5">100% local client-side storage, zero central database</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Offline Capability</td>
                  <td className="p-4 sm:p-5 text-slate-300">Requires constant internet connection</td>
                  <td className="p-4 sm:p-5 text-slate-200 bg-emerald-500/5">100% offline engine calculations & match history</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Card */}
        <div className="mt-12 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Break Free From the $160/Year Trap</h3>
            <p className="text-xs text-slate-400">Import your Chess.com games with 1 click and see the difference immediately.</p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/25 shrink-0"
          >
            Import a Chess.com Game Free
          </button>
        </div>

      </div>

    </div>
  );
}
