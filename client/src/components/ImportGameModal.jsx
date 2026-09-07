import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  UploadCloud, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Clock, 
  Trophy, 
  ArrowRight,
  Search,
  User
} from 'lucide-react';
import { Chess } from 'chess.js';
import { API_BASE } from '../config';

export default function ImportGameModal({ isOpen, onClose, onImportGame }) {
  const [activeTab, setActiveTab] = useState('chesscom'); // 'chesscom' | 'lichess' | 'pgn'
  const [chesscomUser, setChesscomUser] = useState('');
  const [lichessUser, setLichessUser] = useState('');
  const [recentChesscom, setRecentChesscom] = useState([]);
  const [recentLichess, setRecentLichess] = useState([]);

  const [rawPgn, setRawPgn] = useState('');
  const [pgnValidation, setPgnValidation] = useState(null); // { valid: bool, moves: number, error: string }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [lastFetchedUser, setLastFetchedUser] = useState('');

  // Load recent usernames from localStorage on mount
  useEffect(() => {
    try {
      const savedChesscom = JSON.parse(localStorage.getItem('apex_recent_chesscom') || '[]');
      const savedLichess = JSON.parse(localStorage.getItem('apex_recent_lichess') || '[]');
      setRecentChesscom(savedChesscom);
      setRecentLichess(savedLichess);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Validate PGN as user types or pastes
  useEffect(() => {
    if (!rawPgn.trim()) {
      setPgnValidation(null);
      return;
    }
    try {
      const chess = new Chess();
      chess.loadPgn(rawPgn, { strict: false });
      const moveCount = chess.history().length;
      if (moveCount > 0) {
        setPgnValidation({ valid: true, moves: moveCount });
      } else {
        setPgnValidation({ valid: false, error: 'No legal moves found in PGN.' });
      }
    } catch (err) {
      setPgnValidation({ valid: false, error: err.message || 'Invalid PGN format.' });
    }
  }, [rawPgn]);

  if (!isOpen) return null;

  const saveRecentUser = (platform, username) => {
    const clean = username.trim();
    if (!clean) return;
    try {
      if (platform === 'chesscom') {
        const updated = [clean, ...recentChesscom.filter(u => u.toLowerCase() !== clean.toLowerCase())].slice(0, 4);
        setRecentChesscom(updated);
        localStorage.setItem('apex_recent_chesscom', JSON.stringify(updated));
      } else {
        const updated = [clean, ...recentLichess.filter(u => u.toLowerCase() !== clean.toLowerCase())].slice(0, 4);
        setRecentLichess(updated);
        localStorage.setItem('apex_recent_lichess', JSON.stringify(updated));
      }
    } catch {
      // Ignore
    }
  };

  const handleFetchChessCom = async (targetUser) => {
    const userToFetch = targetUser || chesscomUser;
    if (!userToFetch.trim()) return;

    setLoading(true);
    setError(null);
    setGames([]);

    try {
      const res = await fetch(`${API_BASE}/import/chesscom?username=${encodeURIComponent(userToFetch.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}: Failed to fetch games`);
      }

      setGames(data.games || []);
      setLastFetchedUser(userToFetch.trim());
      saveRecentUser('chesscom', userToFetch);
    } catch (err) {
      setError(err.message || 'Failed to fetch games from Chess.com');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchLichess = async (targetUser) => {
    const userToFetch = targetUser || lichessUser;
    if (!userToFetch.trim()) return;

    setLoading(true);
    setError(null);
    setGames([]);

    try {
      const res = await fetch(`${API_BASE}/import/lichess?username=${encodeURIComponent(userToFetch.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}: Failed to fetch games`);
      }

      setGames(data.games || []);
      setLastFetchedUser(userToFetch.trim());
      saveRecentUser('lichess', userToFetch);
    } catch (err) {
      setError(err.message || 'Failed to fetch games from Lichess');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setRawPgn(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSelectGame = (game) => {
    if (!game.pgn) return;
    onImportGame({
      pgn: game.pgn,
      white: game.white,
      black: game.black,
      platform: game.platform,
      timeControl: game.timeControl,
      timeClass: game.timeClass,
      date: game.date,
      url: game.url,
      userColor: game.userColor,
      userOutcome: game.userOutcome
    });
    onClose();
  };

  const handleDirectPgnSubmit = () => {
    if (!rawPgn.trim() || !pgnValidation?.valid) return;
    onImportGame({
      pgn: rawPgn.trim(),
      white: { username: 'White', rating: '?' },
      black: { username: 'Black', rating: '?' },
      platform: 'Custom PGN',
      timeControl: 'Manual Import',
      date: new Date().toLocaleDateString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-emerald-950/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Import Game for Analysis
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  1-Click
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Load matches directly from Chess.com, Lichess, or raw PGN for Stockfish 19 & AI Coach review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2 gap-2">
          <button
            onClick={() => { setActiveTab('chesscom'); setError(null); setGames([]); }}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'chesscom'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Chess.com
          </button>
          <button
            onClick={() => { setActiveTab('lichess'); setError(null); setGames([]); }}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'lichess'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Lichess
          </button>
          <button
            onClick={() => { setActiveTab('pgn'); setError(null); }}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'pgn'
                ? 'border-emerald-500 text-emerald-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Paste PGN / FEN
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* CHESS.COM TAB */}
          {activeTab === 'chesscom' && (
            <div className="space-y-4">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleFetchChessCom(); }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={chesscomUser}
                    onChange={(e) => setChesscomUser(e.target.value)}
                    placeholder="Enter Chess.com username (e.g. hikaru)..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !chesscomUser.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-950/50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Fetch Games
                </button>
              </form>

              {/* Recent searches */}
              {recentChesscom.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-500">Recent:</span>
                  {recentChesscom.map((u) => (
                    <button
                      key={u}
                      onClick={() => { setChesscomUser(u); handleFetchChessCom(u); }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/50"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LICHESS TAB */}
          {activeTab === 'lichess' && (
            <div className="space-y-4">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleFetchLichess(); }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={lichessUser}
                    onChange={(e) => setLichessUser(e.target.value)}
                    placeholder="Enter Lichess username (e.g. DrNykterstein)..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !lichessUser.trim()}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-cyan-950/50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Fetch Games
                </button>
              </form>

              {/* Recent searches */}
              {recentLichess.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-500">Recent:</span>
                  {recentLichess.map((u) => (
                    <button
                      key={u}
                      onClick={() => { setLichessUser(u); handleFetchLichess(u); }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/50"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PASTE PGN TAB */}
          {activeTab === 'pgn' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Paste PGN Notation or Drop File:
                </label>
                <label className="cursor-pointer text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload .pgn file
                  <input type="file" accept=".pgn,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <textarea
                value={rawPgn}
                onChange={(e) => setRawPgn(e.target.value)}
                placeholder="[Event &quot;Live Match&quot;]&#10;1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6..."
                rows={8}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
              />

              {/* PGN Validation Feedback */}
              {pgnValidation && (
                <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${
                  pgnValidation.valid 
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                }`}>
                  <div className="flex items-center gap-2">
                    {pgnValidation.valid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>
                      {pgnValidation.valid 
                        ? `Valid PGN notation verified (${pgnValidation.moves} moves loaded)` 
                        : pgnValidation.error}
                    </span>
                  </div>
                  {pgnValidation.valid && (
                    <button
                      onClick={handleDirectPgnSubmit}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
                    >
                      Analyze Game
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <p className="text-xs font-mono">Fetching latest games from {activeTab === 'chesscom' ? 'Chess.com' : 'Lichess'}...</p>
            </div>
          )}

          {/* Games List (For Chess.com / Lichess) */}
          {!loading && games.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Recent Standard Games for <strong className="text-slate-200">@{lastFetchedUser}</strong> ({games.length}):</span>
                <span className="text-[11px] text-slate-500">Click a match to analyze</span>
              </div>

              <div className="grid gap-2 max-h-[380px] overflow-y-auto pr-1">
                {games.map((g) => {
                  const outcomeBg = g.userOutcome === 'win' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : (g.userOutcome === 'loss' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                      : 'bg-slate-800 text-slate-400 border-slate-700');

                  return (
                    <div
                      key={g.id}
                      onClick={() => handleSelectGame(g)}
                      className="group p-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Outcome Pill */}
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border uppercase shrink-0 ${outcomeBg}`}>
                          {g.userOutcome}
                        </div>

                        {/* Match Info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                            <span className="truncate">
                              <span className="text-slate-400">vs </span>
                              {g.userColor === 'white' ? g.black.username : g.white.username}
                            </span>
                            <span className="text-xs text-slate-500 font-normal font-mono">
                              ({g.userColor === 'white' ? g.black.rating : g.white.rating})
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {g.timeControl} ({g.timeClass})
                            </span>
                            <span>•</span>
                            <span className="text-slate-500 text-[11px]">{g.date}</span>
                            <span>•</span>
                            <span className="text-[11px] text-slate-500 capitalize">Played as {g.userColor}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        {g.url && (
                          <a
                            href={g.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                            title="View on original site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 border border-emerald-500/30 group-hover:border-emerald-500"
                        >
                          Analyze
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state after search */}
          {!loading && lastFetchedUser && games.length === 0 && !error && (
            <div className="py-12 text-center text-slate-500 text-xs space-y-1">
              <p>No standard chess games found for @{lastFetchedUser} in the recent archive.</p>
              <p className="text-[11px] text-slate-600">Note: Non-standard variants (Chess960, Atomic, etc.) are excluded.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>Supported: Standard Blitz, Rapid, Classical & Bullet games</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
