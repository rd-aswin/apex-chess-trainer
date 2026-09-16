import React, { useEffect, useState } from 'react';
import { X, Calendar, Award, ChevronRight, History } from 'lucide-react';
import { API_BASE } from '../config';

/**
 * Modal dialog for browsing and loading past matches saved in data/history.json.
 */
export function GameHistoryModal({ isOpen, onClose, onLoadGame }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const localHistory = JSON.parse(localStorage.getItem('apex_chess_history') || '[]');
      let serverHistory = [];
      if (API_BASE.startsWith('http')) {
        try {
          const res = await fetch(`${API_BASE}/history`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.history)) {
              serverHistory = data.history;
            }
          }
        } catch (e) {
          // Backend optional / offline safe
        }
      }

      // Merge history entries intelligently: server history + local history
      const map = new Map();
      for (const g of serverHistory) {
        const key = g.id || (Array.isArray(g.moves) ? g.moves.join(',') : '');
        if (key) map.set(key, g);
      }
      for (const g of localHistory) {
        const key = g.id || (Array.isArray(g.moves) ? g.moves.join(',') : '');
        if (key) {
          if (map.has(key)) {
            map.set(key, { ...map.get(key), ...g });
          } else {
            map.set(key, g);
          }
        }
      }

      const combined = Array.from(map.values()).sort((a, b) => {
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      });

      setGames(combined);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      const fallback = JSON.parse(localStorage.getItem('apex_chess_history') || '[]');
      setGames(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGame = async (gameId) => {
    try {
      const localHistory = JSON.parse(localStorage.getItem('apex_chess_history') || '[]');
      let selectedGame = localHistory.find((g) => g.id === gameId);

      const hasStoredFullAnalysis =
        selectedGame &&
        Array.isArray(selectedGame.steps) &&
        selectedGame.steps.length > 0 &&
        selectedGame.counts;

      // If full analysis is not already in local storage, attempt to fetch from backend
      if (!hasStoredFullAnalysis && API_BASE.startsWith('http')) {
        try {
          const movesParam = selectedGame && Array.isArray(selectedGame.moves) ? `?moves=${selectedGame.moves.join(',')}` : '';
          const res = await fetch(`${API_BASE}/history/${gameId}${movesParam}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.game && Array.isArray(data.game.steps) && data.game.steps.length > 0) {
              selectedGame = { ...(selectedGame || {}), ...data.game };
              // Cache full game back into local history
              const idx = localHistory.findIndex(
                (g) => g.id === gameId || (Array.isArray(g.moves) && g.moves.join(',') === data.game.moves?.join(','))
              );
              let updatedLocal;
              if (idx !== -1) {
                updatedLocal = [...localHistory];
                updatedLocal[idx] = { ...updatedLocal[idx], ...selectedGame };
              } else {
                updatedLocal = [selectedGame, ...localHistory.slice(0, 49)];
              }
              localStorage.setItem('apex_chess_history', JSON.stringify(updatedLocal));
            }
          }
        } catch (apiErr) {
          console.warn('[GameHistoryModal] Backend history detail fetch failed, continuing with available data:', apiErr);
        }
      }

      if (!selectedGame) {
        selectedGame = games.find((g) => g.id === gameId);
      }

      if (selectedGame) {
        onLoadGame(selectedGame);
        onClose();
      }
    } catch (err) {
      console.error('Failed to load game details:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <History className="text-emerald-400" size={20} />
            <h3 className="text-base font-bold text-white">Past Matches</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-800/60">
          {loading && (
            <div className="text-center py-10 text-slate-400 text-sm animate-pulse">
              Loading match history...
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-rose-400 text-sm">
              Error: {error}
            </div>
          )}

          {!loading && !error && games.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm italic">
              No saved games found yet. Complete a match to archive it here!
            </div>
          )}

          {!loading &&
            games.map((g) => {
              const parsedDate = new Date(g.date);
              const dateStr = !isNaN(parsedDate.getTime())
                ? parsedDate.toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : (g.date || 'Recent Match');
              const totalMoves = g.moveCount || (Array.isArray(g.moves) ? g.moves.length : 0);
              const userAcc = g.userColor === 'w' ? g.accuracy?.white : g.accuracy?.black;
              const sfAcc = g.userColor === 'w' ? g.accuracy?.black : g.accuracy?.white;
              const userCounts = g.counts ? (g.userColor === 'w' ? g.counts.white : g.counts.black) : null;

              return (
                <div
                  key={g.id}
                  onClick={() => handleSelectGame(g.id)}
                  className="py-3 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">
                        Played as {g.userColor === 'w' ? 'White' : 'Black'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {g.result}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {totalMoves} moves
                      </span>
                      {userCounts && userCounts.blunder > 0 && (
                        <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-900/60 px-1.5 py-0.5 rounded">
                          {userCounts.blunder} {userCounts.blunder === 1 ? 'blunder' : 'blunders'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar size={12} /> {dateStr}
                      </span>
                      {userAcc !== undefined && (
                        <span className="text-emerald-400 font-mono text-[11px]">
                          Accuracy: {userAcc}% vs Engine {sfAcc}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-emerald-400 transition-colors">
                    <span className="text-xs font-semibold hidden sm:inline">Review</span>
                    <ChevronRight size={18} />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameHistoryModal;
