import React from 'react';
import { X, Sparkles, Key, Crown, Clock, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export function DailyQuotaLimitModal({ isOpen, onClose, onOpenKeySettings, onOpenPricing }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Daily Limit Reached</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                3 of 3 Used
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Daily Free Reviews Used
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          You've used all <strong>3 free game reviews</strong> for today. Apex provides 3 full game reviews daily with zero setup, no credit card, and no account required. Your daily free reviews reset automatically at <strong>midnight local time</strong>.
        </p>

        {/* 2 Clear Options */}
        <div className="space-y-3 mb-6">

          {/* Option A: Free Google Gemini Key ($0.00) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/40 hover:border-teal-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">Option 1 • 100% Free Forever</span>
              </div>
              <div className="text-sm font-bold text-white">Add Your Free Google Gemini Key</div>
              <div className="text-xs text-slate-400">
                Google provides 1,500 free reviews/day. 60-second setup, no credit card.
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onOpenKeySettings) onOpenKeySettings();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all shadow-md shadow-teal-500/20 shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Add Free Key</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Option B: Apex Pro */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/40 hover:border-indigo-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Option 2 • Instant Convenience</span>
              </div>
              <div className="text-sm font-bold text-white">Upgrade to Apex Pro</div>
              <div className="text-xs text-slate-400">
                Unlimited hosted reviews with zero setup or API keys. ₹399/mo or ₹4,899 Lifetime.
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onOpenPricing) onOpenPricing();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/20 shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>View Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Footer info & Dismiss */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Stockfish 19 offline play is always 100% free and unlimited.</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors py-1 px-2 font-medium"
          >
            Continue Playing
          </button>
        </div>

      </div>
    </div>
  );
}
