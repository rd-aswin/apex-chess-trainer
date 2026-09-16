import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { registerAccount, loginAccount } from '../services/auth';

export function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'login', promptMessage = '' }) {
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError(null);
      setSuccessMsg(null);
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
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Unable to connect to authentication service. Please check your connection.');
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
        setSuccessMsg('Account created successfully! Welcome to Apex Chess.');
        if (onAuthSuccess) onAuthSuccess(res.user);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } catch (err) {
      setError('Unable to connect to authentication service. Please check your connection.');
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
                {tab === 'login' ? 'Sign in to Apex Chess' : 'Create Your Free Account'}
              </h3>
              <p className="text-[11px] text-slate-400">
                3 Free Grandmaster Reviews Every Day • Resets Midnight
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
        <div className="flex border-b border-slate-800/80 bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => { setTab('login'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
              tab === 'login'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); setSuccessMsg(null); }}
            className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
              tab === 'register'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Free Account
          </button>
        </div>

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
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight size={14} />}
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-400">Don't have an account yet? </span>
                <button
                  type="button"
                  onClick={() => { setTab('register'); setError(null); setSuccessMsg(null); }}
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
                <div className="text-slate-300">✓ 1-Click Chess.com & Lichess Game Importer</div>
                <div className="text-slate-300">✓ Turn-by-Turn Plain-English AI Coaching</div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Creating Free Account...' : 'Create Account & Start Playing'}
                {!loading && <ArrowRight size={14} />}
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-400">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => { setTab('login'); setError(null); setSuccessMsg(null); }}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  Sign in
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
