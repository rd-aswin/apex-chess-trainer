import React, { useState } from 'react';
import { 
  Check, Sparkles, HelpCircle, ShieldCheck, Zap, 
  ArrowRight, Key, Flame, DollarSign, Lock, CreditCard, Shield, AlertCircle
} from 'lucide-react';
import { initiateRazorpayCheckout } from '../../../services/razorpay';
import { PaymentReceiptModal } from '../../PaymentReceiptModal';

export function PricingPage({ onNavigate, onLaunchApp }) {
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' | 'yearly'
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptModal, setReceiptModal] = useState({
    isOpen: false,
    status: 'loading',
    details: null
  });

  const handleCheckout = (planType) => {
    let amount = 39900; // in paise
    let planName = 'Apex Pro Monthly';
    let description = 'Apex Pro 1-Month Membership';

    if (planType === 'pro') {
      if (billingCycle === 'monthly') {
        amount = 39900; // ₹399.00
        planName = 'Apex Pro Monthly';
        description = 'Apex Pro 1-Month Membership';
      } else {
        amount = 319900; // ₹3,199.00
        planName = 'Apex Pro Annual';
        description = 'Apex Pro 1-Year Membership (Save 35%)';
      }
    } else if (planType === 'lifetime') {
      amount = 489900; // ₹4,899.00 ($59)
      planName = 'Apex Lifetime Founder';
      description = 'Lifetime Access to All Pro Features Forever';
    } else if (planType === 'test') {
      amount = 100; // 100 paise = ₹1.00
      planName = 'Razorpay Test Checkout';
      description = 'Test Verification Transaction (₹1.00)';
    }

    setIsProcessing(true);
    setReceiptModal({
      isOpen: true,
      status: 'loading',
      details: { planName, amount, currency: 'INR' }
    });

    initiateRazorpayCheckout({
      amount,
      currency: 'INR',
      planName,
      description,
      onSuccess: (verifyData) => {
        setIsProcessing(false);
        setReceiptModal({
          isOpen: true,
          status: 'success',
          details: {
            planName,
            amount,
            currency: 'INR',
            order_id: verifyData.order_id,
            payment_id: verifyData.payment_id
          }
        });
      },
      onFailure: (err) => {
        setIsProcessing(false);
        setReceiptModal({
          isOpen: true,
          status: 'failed',
          details: {
            planName,
            amount,
            currency: 'INR',
            error: err.message || 'Payment transaction could not be completed.'
          }
        });
      },
      onDismiss: () => {
        setIsProcessing(false);
        setReceiptModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Honest Pricing</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Pay Once. Own Your Coach Forever.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          No monthly subscription traps. Get unlimited coaching for free using Google's free AI key, try 3 free reviews a day with zero setup, or grab a lifetime license.
        </p>

        {/* Monthly vs Yearly Toggle for Pro */}
        <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Pro ($4.99/mo)
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly' ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Pro ($39/yr)</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-950/20 text-[10px] font-extrabold uppercase">Save 35%</span>
          </button>
        </div>
      </div>

      {/* PRICING 4-TIER MATRIX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* TIER 1: FREE FOREVER */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">1. Free Forever (Your Key)</div>
              <div className="text-3xl font-black text-white mt-2">$0</div>
              <div className="text-xs text-slate-400 mt-1">Unlimited Free Reviews Forever</div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                For players who want unlimited reviews for $0 using Google's free AI key (1,500 games/day).
              </p>

              <div className="my-6 border-t border-slate-800/80 pt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited</strong> game reviews with free Google key</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Plain-English mistake explanations</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>1-Click Chess.com & Lichess import</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>World champion Stockfish engine</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLaunchApp}
              className="w-full py-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              Start Free (1-Min Setup)
            </button>
          </div>

          {/* TIER 2: FREE TRIAL (HOSTED) */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-teal-500/40 transition-colors">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-400">2. Free Trial (Zero Setup)</div>
              <div className="text-3xl font-black text-white mt-2">$0</div>
              <div className="text-xs text-slate-400 mt-1">3 Free Full Reviews / Day</div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Try it out immediately without signing up, entering a card, or pasting any keys.
              </p>

              <div className="my-6 border-t border-slate-800/80 pt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>3 free complete game reviews</strong> every day</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span><strong>Zero setup</strong>: No card, no password, no key</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Interactive move testing sandbox</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Instant 1-click import from Chess.com</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLaunchApp}
              className="w-full py-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              Try 3 Free Games Today
            </button>
          </div>

          {/* TIER 3: APEX PRO */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">3. Apex Pro</div>
              <div className="text-3xl font-black text-white mt-2">
                {billingCycle === 'monthly' ? '$4.99' : '$39'}
                <span className="text-xs font-normal text-slate-400">
                  {billingCycle === 'monthly' ? ' / mo' : ' / yr ($3.25/mo)'}
                </span>
              </div>
              <div className="text-xs text-indigo-400 font-semibold mt-1">75% Cheaper Than Chess.com</div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                For players who want 1-click convenience with zero key management or setup.
              </p>

              <div className="my-6 border-t border-slate-800/80 pt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Unlimited reviews</strong> (No keys needed)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Chat with Grandmaster AI coach anytime</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>World Champion Stockfish 19 NNUE engine</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Interactive sandbox move refutations</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCheckout('pro')}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CreditCard size={14} />
              <span>Start Apex Pro ({billingCycle === 'monthly' ? '₹399/mo' : '₹3,199/yr'})</span>
            </button>
          </div>

          {/* TIER 4: LIFETIME FOUNDER */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500 rounded-3xl p-6 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/15">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
              Best Long-Term Value
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">4. Lifetime Founder</div>
              <div className="text-3xl font-black text-white mt-2">₹4,899 <span className="text-xs font-normal text-emerald-300">($59 one-time)</span></div>
              <div className="text-xs text-emerald-400 font-semibold mt-1">Pay once, own forever</div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                For players who hate recurring bills. Own all features forever with zero monthly charges.
              </p>

              <div className="my-6 border-t border-slate-800/80 pt-4 space-y-2.5 text-xs text-slate-200">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>All Pro features unlocked forever</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Free updates to all future versions</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Use free Google key or hosted analysis</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Early access to new coaching models</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCheckout('lifetime')}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles size={14} />
              <span>Get Lifetime Pass (₹4,899)</span>
            </button>
          </div>

        </div>

        {/* Razorpay Integration Trust Banner & Test Checkout */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>Razorpay Standard Web Checkout Active</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">Test Gateway</span>
              </div>
              <div className="text-slate-400 text-[11px]">HMAC-SHA256 server verification • Instant Pro activation</div>
            </div>
          </div>
          <button
            onClick={() => handleCheckout('test')}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <CreditCard size={13} />
            <span>⚡ Test ₹1.00 Checkout</span>
          </button>
        </div>
      </div>

      {/* RISK-FREE GUARANTEES & PEACE OF MIND */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-black text-white">
              Why Chess Players Choose Apex
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Built for chess enthusiasts who want clear, patient explanations without paying \$160 every year.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">30-Day Money-Back Guarantee</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If you purchase the Lifetime Pass or Pro and don't feel your tactical vision improved, just email us within 30 days for a full, prompt refund.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                <Key className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Free Forever with Google Key</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google provides a free personal key that easily handles unlimited chess game reviews at \$0.00/month. We never charge you to use it.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Instant 1-Click Import</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste your Chess.com or Lichess username to review your latest games immediately. No passwords required, and your data stays on your machine.
              </p>
            </div>
          </div>

          {/* Interactive Savings Calculator Link */}
          <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white">Wondering how much you spend on chess subscriptions?</div>
              <div className="text-xs text-slate-400">See your exact 1, 3, and 5-year savings compared to Chess.com Diamond or Aimchess.</div>
            </div>
            <button
              onClick={() => onNavigate('#calculator')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-2 shrink-0"
            >
              <span>Open Subscription Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Receipt & Confirmation Modal */}
      <PaymentReceiptModal
        isOpen={receiptModal.isOpen}
        status={receiptModal.status}
        details={receiptModal.details}
        onClose={() => setReceiptModal({ isOpen: false, status: 'loading', details: null })}
        onLaunchApp={onLaunchApp}
      />

    </div>
  );
}
