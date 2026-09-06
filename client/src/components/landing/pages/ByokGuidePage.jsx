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
          <span>60-Second Free Setup</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          How to Use Your Free Google AI Key
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Google provides a <strong>100% free AI key</strong> that allows up to 1,500 game reviews every single day. You don't need a credit card, and you will never be charged. Here's how to get it in 3 easy steps.
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
                Open Google AI Studio (Free, No Credit Card)
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Sign in with your normal Google account. Google gives every user a free developer tier with <strong>1,500 game reviews every day</strong> for $0.00.
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
                Click the blue <strong>"Get API key"</strong> button, click <strong>Create key</strong>, and copy the text. It looks like a random string of letters (e.g., <code className="text-xs bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400">AIzaSy...</code>).
              </p>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero payment info needed: Google does not ask for or require any credit card.</span>
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
                Paste Into Apex Coach Settings
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Open Apex Chess, click the <strong>Ask Coach</strong> button, and paste your key. It saves in your browser on your computer so you never have to paste it again.
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

      {/* PRIVACY PROMISE */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Your Key Stays on Your Laptop</h3>
              <p className="text-xs text-slate-400">100% Private to You</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Server Storage</span>
              </div>
              <p className="text-slate-400">Apex has no central database. Your key is saved exclusively in your browser memory on your device.</p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Surprise Charges</span>
              </div>
              <p className="text-slate-400">Because you didn't give Google a credit card, you cannot be billed. Ever.</p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>You Stay in Control</span>
              </div>
              <p className="text-slate-400">You can clear your key from your browser or revoke it in your Google account with one click anytime.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
