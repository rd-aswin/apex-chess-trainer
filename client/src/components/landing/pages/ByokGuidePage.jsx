import React from 'react';
import { 
  Key, ShieldCheck, Lock, ExternalLink, ArrowRight, 
  Sparkles, Check, DollarSign, Cpu, AlertCircle 
} from 'lucide-react';

export function ByokGuidePage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Key className="w-3.5 h-3.5" />
          <span>The 60-Second Setup Guide</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          How Bring Your Own Key (BYOK) Works
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Google gives every single person a <strong>100% free Gemini API key</strong> that allows 1,500 full game reviews every single day. Here is how you unlock it in under 60 seconds with zero credit card required.
        </p>
      </div>

      {/* 3-STEP VISUAL TUTORIAL */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          {/* Step 1 */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xl flex items-center justify-center shrink-0">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Visit Google AI Studio (Free, No Credit Card)
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Google provides generous developer free tiers to encourage adoption of Gemini models. With a standard free Google account, you receive up to <strong>15 requests per minute and 1,500 requests per day</strong> at $0.00 cost.
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
              >
                <span>Open Google AI Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xl flex items-center justify-center shrink-0">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Click "Create API Key" & Copy It
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Click the blue <strong>"Get API key"</strong> button in Google AI Studio, select or create a default free project, and click <strong>Copy</strong>. Your key looks like a random string of letters and numbers (e.g., <code className="text-xs bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400">AIzaSy...</code>).
              </p>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero billing setup: Google does not ask for or require a credit card for the free tier.</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xl flex items-center justify-center shrink-0">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Paste Into Apex Chess Trainer Settings
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Open Apex Chess Trainer, click the <strong>Ask Coach</strong> or <strong>Settings</strong> icon, and paste your API key. It is instantly saved into your browser's private <code className="text-xs bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400">localStorage</code>.
              </p>
              <button
                onClick={onLaunchApp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
              >
                <span>Launch App to Paste Key</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* PRIVACY & SECURITY GUARANTEE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Your Key Never Leaves Your Machine</h3>
              <p className="text-xs text-slate-400">Direct Client-to-Provider Architecture</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Server Storage</span>
              </div>
              <p className="text-slate-400">Apex maintains no central user database. Your key is stored exclusively in your browser's local memory.</p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Direct TLS Encryption</span>
              </div>
              <p className="text-slate-400">Inference calls travel directly between your machine and Google's official endpoints over encrypted HTTPS.</p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Revocable in 1-Click</span>
              </div>
              <p className="text-slate-400">You maintain 100% control. You can delete the key from your browser or revoke it in Google AI Studio anytime.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
