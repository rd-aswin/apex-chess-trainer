import React from 'react';
import {
  Lock,
  RotateCcw,
  Flag,
  Sparkles,
  History,
  Volume2,
  VolumeX,
  Cpu,
  Swords,
  Zap
} from 'lucide-react';

/**
 * Game Controls bar and status header.
 * Enforces:
 * - Locked maximum difficulty badge (Skill Level 20, 8T, AVX-512)
 * - Side selection (Play as White / Play as Black)
 * - Action buttons: New Game, Resign, Game Review, Match History
 */
export function GameControls({
  isGameOver = false,
  isReviewMode = false,
  isEngineThinking = false,
  userColor = 'w',
  onNewGame,
  onResign,
  onStartReview,
  onOpenHistory,
  isMuted = false,
  onToggleMute,
  engineStatus = null
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col gap-3 select-none">
      {/* Locked Engine Badge */}
      <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-400">
            <Cpu size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-200">
                Stockfish WASM
              </span>
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Zap size={10} /> Local 0ms
              </span>
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Lock size={10} /> Level 20
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Client WebAssembly • Hardware Accelerated • Instant
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Past Matches */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors border border-slate-700"
            title="View past matches"
          >
            <History size={14} /> History
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button
          onClick={onNewGame}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg transition-colors border border-slate-700 shadow-sm active:scale-95"
        >
          <RotateCcw size={14} /> New Game
        </button>

        {!isGameOver && !isReviewMode && (
          <button
            onClick={onResign}
            disabled={isEngineThinking}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-950/40 hover:bg-rose-900/50 text-xs font-bold text-rose-300 rounded-lg transition-colors border border-rose-800/50 shadow-sm active:scale-95 disabled:opacity-40"
          >
            <Flag size={14} /> Resign
          </button>
        )}

        {(isGameOver || isReviewMode) && (
          <button
            onClick={onStartReview}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg transition-colors shadow-md active:scale-95 col-span-2 sm:col-span-1"
          >
            <Sparkles size={14} /> Review Match
          </button>
        )}
      </div>
    </div>
  );
}

export default GameControls;
