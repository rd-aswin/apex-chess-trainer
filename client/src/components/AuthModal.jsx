import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, AlertCircle, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { registerAccount, verifyAccountCode, loginAccount } from '../services/auth';

export function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'login', promptMessage = '' }) {
  const [tab, setTab] = useState(initialTab); // 'login' | 'register' | 'verify'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError(null);
      setSuccessMsg(null);
      setDemoCode(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginAccount({ email, password });
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      } else if (res.verificationRequired) {
        setTab('verify');
        setDemoCode(res.verificationCode);
        setError(res.error || 'Please enter the 6-digit verification code to activate your account.');
      } else {
        setError(res.error || 'Login failed. Please verify your credentials.');
      }
    } catch (err) {
      setError('Unable to connect to service. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await registerAccount({ email, name, password });
      if (res.success) {
        setTab('verify');
        setDemoCode(res.verificationCode);
        setSuccessMsg(res.message || 'Account created! Enter the 6-digit verification code to activate.');
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } catch (err) {
      setError('Unable to connect to service. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await verifyAccountCode({ email, code });
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid or expired code.');
      }
    } catch (err) {
      setError('Unable to connect to service. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 selection:bg-emerald-500/30">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {tab === 'login' && 'Sign in to Apex Chess'}
                {tab === 'register' && 'Create Your Free Account'}
                {tab === 'verify' && 'Verify Your Account'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {tab === 'verify' ? 'Enter your 6-digit verification code' : '3 Free Grandmaster Reviews Every Day'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Prompt Notice (if triggered by game review gate) */}
        {promptMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-start gap-2 text-xs text-emerald-300">
            <Sparkles size={16} className="shrink-0 mt-0.5 text-emerald-400" />
            <p className="leading-relaxed">{promptMessage}</p>
          </div>
        )}

        {/* Tab Switcher (Sign In vs Create Account) */}
        {tab !== 'verify' && (
          <div className="flex border-b border-slate-800/80 bg-slate-950/40 px-6 pt-2">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
                tab === 'login'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(null); }}
              className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
                tab === 'register'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Free Account
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {/* Alerts */}
          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl flex items-start gap-2 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl flex items-start gap-2 text-xs text-emerald-300 animate-in fade-in">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Verification Code Demo Banner */}
          {tab === 'verify' && demoCode && (
            <div 
              onClick={() => setCode(demoCode)}
              className="p-3 bg-indigo-950/50 hover:bg-indigo-900/40 border border-indigo-500/40 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs text-indigo-300 group"
              title="Click to auto-fill code"
            >
              <div className="flex items-center gap-2">
                <KeyRound size={15} className="text-indigo-400" />
                <span>Verification Code: <strong className="font-mono text-white tracking-widest text-sm ml-1">{demoCode}</strong></span>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 group-hover:bg-indigo-500/40 px-2 py-0.5 rounded font-semibold transition-colors">
                Auto-fill
              </span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="grandmaster@example.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight size={14} />}
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-400">Don't have an account yet? </span>
                <button
                  type="button"
                  onClick={() => { setTab('register'); setError(null); }}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  Create one for free
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Magnus Carlsen"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@example.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Sparkles size={13} />
                  Included in your Free Account:
                </div>
                <div className="text-slate-300">✓ 3 Free Grandmaster Game Reviews Every Day</div>
                <div className="text-slate-300">✓ 1-Click Chess.com & Lichess Importer</div>
                <div className="text-slate-300">✓ Turn-by-Turn Plain-English AI Coaching</div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Continue to Verification'}
                {!loading && <ArrowRight size={14} />}
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-400">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => { setTab('login'); setError(null); }}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: VERIFY ACCOUNT */}
          {tab === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Enter 6-Digit Code sent to <span className="text-emerald-400">{email}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-center font-mono text-xl tracking-[0.5em] text-emerald-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Unlock 3 Free Reviews'}
                {!loading && <CheckCircle2 size={14} />}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => { setTab('register'); setError(null); }}
                  className="text-slate-400 hover:text-slate-200"
                >
                  ← Back to sign up
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default AuthModal;
