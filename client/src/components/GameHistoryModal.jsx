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
      if (localHistory.length > 0) {
        setGames(localHistory);
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE}/history`);
      const data = await res.json();
      if (data.success) {
        setGames(data.history || []);
      }
    } catch (err) {
      const localHistory = JSON.parse(localStorage.getItem('apex_chess_history') || '[]');
      setGames(localHistory);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGame = async (gameId) => {
    try {
      const localHistory = JSON.parse(localStorage.getItem('apex_chess_history') || '[]');
      const found = localHistory.find((g) => g.id === gameId);
      if (found) {
        onLoadGame(found);
        onClose();
        return;
      }
      const res = await fetch(`${API_BASE}/history/${gameId}`);
      const data = await res.json();
      if (data.success && data.game) {
        onLoadGame(data.game);
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
              const dateStr = new Date(g.date).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              const userAcc = g.userColor === 'w' ? g.accuracy?.white : g.accuracy?.black;
              const sfAcc = g.userColor === 'w' ? g.accuracy?.black : g.accuracy?.white;

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
                        {g.moveCount} moves
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar size={12} /> {dateStr}
                      </span>
                      {userAcc !== undefined && (
                        <span className="text-emerald-400 font-mono text-[11px]">
                          Accuracy: {userAcc}% vs SF {sfAcc}%
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
