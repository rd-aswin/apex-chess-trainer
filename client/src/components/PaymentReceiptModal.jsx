import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, X, ShieldCheck, Copy, ArrowRight } from 'lucide-react';

export function PaymentReceiptModal({
  isOpen,
  status, // 'loading' | 'success' | 'failed'
  details, // { order_id, payment_id, amount, currency, planName, error }
  onClose,
  onLaunchApp
}) {
  if (!isOpen) return null;

  const copyToClipboard = (text) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (e) {}
  };

  const formattedAmount = details?.amount 
    ? (details.currency === 'INR' ? `?${(details.amount / 100).toFixed(2)}` : `$${(details.amount / 100).toFixed(2)}`)
    : '';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {status === 'loading' && (
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            <h3 className="text-base font-bold text-white">Opening Razorpay Checkout...</h3>
            <p className="text-xs text-slate-400">Connecting securely to payment gateway</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center w-full">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20 animate-in zoom-in-75 duration-300">
              <CheckCircle2 size={32} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
              <Sparkles size={12} />
              <span>Payment Verified Successfully</span>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight mb-1">
              Welcome to {details?.planName || 'Apex Pro'}!
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Your license is activated on this device with full lifetime benefits.
            </p>

            {/* Receipt Summary Box */}
            <div className="w-full bg-slate-950 border border-slate-800/90 rounded-2xl p-4 text-left space-y-2.5 mb-6 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Plan</span>
                <span className="font-bold text-white">{details?.planName || 'Apex Pro'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Amount Paid</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">{formattedAmount}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Payment ID</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[11px] text-slate-300">{details?.payment_id}</span>
                  <button onClick={() => copyToClipboard(details?.payment_id)} title="Copy" className="text-slate-500 hover:text-slate-300 p-0.5">
                    <Copy size={11} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Order ID</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[11px] text-slate-300">{details?.order_id}</span>
                  <button onClick={() => copyToClipboard(details?.order_id)} title="Copy" className="text-slate-500 hover:text-slate-300 p-0.5">
                    <Copy size={11} />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onLaunchApp) onLaunchApp();
              }}
              className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <span>Launch Apex Trainer Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center w-full">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/20">
              <AlertCircle size={32} />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Payment Incomplete</h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed max-w-xs">
              {details?.error || 'The payment transaction could not be completed or was cancelled.'}
            </p>

            <div className="w-full flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
