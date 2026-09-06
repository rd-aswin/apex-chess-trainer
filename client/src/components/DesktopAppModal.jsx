import React, { useState } from 'react';
import { X, Download, CheckCircle2, Monitor, Sparkles, ExternalLink } from 'lucide-react';

export function DesktopAppModal({ isOpen, onClose }) {
  const [isCreating, setIsCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

  const handleCreateShortcut = async () => {
    setIsCreating(true);
    setStatusMessage(null);
    try {
      const res = await fetch('http://localhost:5000/api/create-shortcut', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: 'Desktop shortcut created! Look for "Apex Chess Trainer" on your PC Desktop with the custom icon.'
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to create shortcut automatically.'
        });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Could not connect to backend server on port 5000.'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownloadLauncher = () => {
    window.location.href = 'http://localhost:5000/api/download-launcher';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Monitor className="text-emerald-400" size={20} />
            <h3 className="text-sm font-bold text-white tracking-tight">Desktop App & Launcher</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <img
              src="/logo192.png"
              alt="Apex Chess Logo"
              className="w-20 h-20 rounded-2xl shadow-xl border-2 border-emerald-500/50 object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full shadow">
              <Sparkles size={14} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-lg font-bold text-white tracking-tight">
              Apex Chess Trainer
            </h4>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Play completely offline against official Stockfish 19 NNUE (~3650+ Elo) in a standalone PC window.
            </p>
          </div>

          {/* Status banner */}
          {statusMessage && (
            <div
              className={`w-full p-2.5 rounded-lg text-xs flex items-center gap-2 text-left ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/70 border border-rose-500/50 text-rose-300'
              }`}
            >
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Actions */}
          <div className="w-full flex flex-col gap-2 pt-1">
            <button
              onClick={handleCreateShortcut}
              disabled={isCreating}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles size={15} />
              {isCreating ? 'Creating Shortcut...' : 'Create Windows Desktop Shortcut'}
            </button>

            <button
              onClick={handleDownloadLauncher}
              className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2"
            >
              <Download size={14} />
              Download Launcher (.bat)
            </button>
          </div>

          <div className="w-full bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 text-left flex flex-col gap-1.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              How it works:
            </div>
            <p className="leading-relaxed">
              Double-clicking the shortcut automatically boots the backend Stockfish 19 engine and opens the standalone app with no terminal required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesktopAppModal;
