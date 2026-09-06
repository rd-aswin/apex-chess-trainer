import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Bot,
  Package,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  X
} from 'lucide-react';

/**
 * Animated Update & Tool Health Center Modal
 * Provides real-time upstream status checks for Stockfish, Gemini AI models, and core packages.
 */
export function UpdateModal({ isOpen, onClose }) {
  const [report, setReport] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'stockfish' | 'ai' | 'packages'

  const fetchUpdates = async (force = false) => {
    setIsScanning(true);
    try {
      const res = await fetch(`http://localhost:5000/api/updates/check${force ? '?force=true' : ''}`);
      const data = await res.json();
      if (data.success) {
        setReport(data);
        setLastCheckedTime(new Date());
      }
    } catch (err) {
      console.error('Update check failed:', err);
    } finally {
      // Keep scanning animation smooth for at least 800ms
      setTimeout(() => {
        setIsScanning(false);
      }, 800);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUpdates(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles size={17} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Apex Tool & Engine Health Center
              </h2>
              <p className="text-[11px] text-slate-400">
                Live monitoring for Stockfish, Gemini AI models, and core chess libraries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchUpdates(true)}
              disabled={isScanning}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
              title="Re-scan upstream repositories"
            >
              <RefreshCw size={13} className={isScanning ? 'animate-spin' : ''} />
              <span>{isScanning ? 'Checking...' : 'Check Now'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          {/* Radar Scanning Visual Overlay */}
          {isScanning && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-center justify-center gap-4 text-xs font-medium text-emerald-300 animate-in fade-in">
              <div className="relative flex items-center justify-center w-8 h-8">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white">Scanning Upstream Sources...</span>
                <span className="text-[11px] text-slate-400">
                  Querying official Stockfish GitHub releases & npm registry
                </span>
              </div>
            </div>
          )}

          {/* Overall Health Status Banner */}
          {report && !isScanning && (
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                report.isUpdateAvailable
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    report.isUpdateAvailable ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {report.isUpdateAvailable ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">
                    {report.isUpdateAvailable
                      ? 'Upgrades Available for Online Tools'
                      : 'All Engines & AI Models Up to Date'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    {report.isUpdateAvailable
                      ? 'Newer versions of chess packages are available online.'
                      : 'You are running the latest official Stockfish 19 NNUE and Google Gemini 2.5 Flash.'}
                  </p>
                </div>
              </div>

              {lastCheckedTime && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock size={11} />
                  {lastCheckedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          )}

          {/* Subsystem Cards Grid */}
          <div className="space-y-3">
            {/* Card 1: Stockfish 19 NNUE */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-800 rounded-lg text-emerald-400">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      Stockfish Chess Engine
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950 border border-emerald-700/50 text-emerald-300">
                        AVX-512 NNUE
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-400">World's strongest open-source engine (~3650+ Elo)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {report?.stockfish?.isUpdateAvailable ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Update Available: {report.stockfish.latestTag}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Up to Date (sf_19)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Installed Version</span>
                  <span className="font-semibold text-slate-200">Stockfish 19 (sf_19)</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Latest Upstream GitHub Release</span>
                  <span className="font-semibold text-emerald-300">
                    {report?.stockfish?.latestVersion || 'Stockfish 19'}
                  </span>
                </div>
              </div>

              {report?.stockfish?.isUpdateAvailable && report?.stockfish?.downloadUrl && (
                <div className="mt-2 p-2.5 rounded-lg bg-amber-950/40 border border-amber-700/50 flex items-center justify-between">
                  <div className="text-[11px] text-amber-200">
                    <span>A newer Stockfish version ({report.stockfish.latestTag}) has been detected!</span>
                  </div>
                  <a
                    href={report.stockfish.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold transition-colors shadow"
                  >
                    <Download size={13} /> Download Zip
                  </a>
                </div>
              )}
            </div>

            {/* Card 2: AI Coach Model */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-800 rounded-lg text-emerald-400">
                    <Bot size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      Grandmaster AI Coach Model
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-indigo-950 border border-indigo-700/50 text-indigo-300">
                        Gemini 2.5 Flash
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-400">Google Gen AI SDK v2.21.0 • 1,500 RPD Free Quota</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Latest Generation
                </span>
              </div>

              <div className="text-xs space-y-1 pt-1 border-t border-slate-800/80">
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-semibold">
                    <div>Gemini 2.5 Flash</div>
                    <span className="text-[9px] text-slate-400">Active (Recommended)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    <div>Gemini 2.0 Flash</div>
                    <span className="text-[9px] text-slate-400">Ultra-fast Fallback</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    <div>Gemini 1.5 Pro</div>
                    <span className="text-[9px] text-slate-400">Deep Reasoning</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Core Libraries & Tools */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-800 rounded-lg text-emerald-400">
                    <Package size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Core Libraries & NPM Tools</h4>
                    <p className="text-[10px] text-slate-400">Official package versions on npm registry</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-400">
                  {report?.packages ? `${report.packages.length} packages tracked` : ''}
                </span>
              </div>

              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] border-b border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="p-2">Tool / Library</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Installed</th>
                      <th className="p-2">Latest Online</th>
                      <th className="p-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(report?.packages || []).map((pkg, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-2 font-mono font-semibold text-slate-200">{pkg.name}</td>
                        <td className="p-2 text-slate-400 text-[10px]">{pkg.role}</td>
                        <td className="p-2 font-mono text-slate-300">{pkg.current}</td>
                        <td className="p-2 font-mono text-emerald-400 font-semibold">{pkg.latest}</td>
                        <td className="p-2 text-right">
                          {pkg.isUpdateAvailable ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              Update
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Current
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="text-[11px]">
            Apex Chess Trainer • 100% Free & Open Source (GPL-3.0)
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}