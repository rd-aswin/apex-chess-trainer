import React, { useState, useEffect } from 'react';
import { 
  Loader2, Sparkles, ChevronLeft, ChevronRight, Lightbulb, 
  Clock, CheckCircle2, ShieldCheck, Swords, Bot, Target, Brain, Flame,
  Cpu, Zap
} from 'lucide-react';

const CHESS_TIPS = [
  {
    category: 'Calculation',
    title: 'The C-C-T Calculation Priority',
    tip: 'In any complex position, calculate in this strict order: 1. Checks, 2. Captures, 3. Threats. Forcing moves narrow down candidate branches.'
  },
  {
    category: 'Tactics',
    title: 'The "Removed Guard" Danger',
    tip: 'Over 38% of club blunders occur when a piece moves away, unintentionally abandoning the defense of another friendly piece or key square.'
  },
  {
    category: 'Prophylaxis',
    title: 'Ask the Grandmaster Question',
    tip: 'Before deciding on your attack, always ask: "If my opponent had two moves in a row, what would they play?" Prevent their threats first.'
  },
  {
    category: 'King Safety',
    title: 'Respect the f-Pawn Shield',
    tip: 'Never push your f-pawn (f4 or f5) if your king is still in the center or if the e1-h4 / e8-h5 diagonal is vulnerable to enemy queen checks.'
  },
  {
    category: 'Middlegame',
    title: 'Knight Outpost Domination',
    tip: 'A knight anchored on the 5th or 6th rank that cannot be driven away by enemy pawns is often worth as much as a rook.'
  },
  {
    category: 'Pawn Structure',
    title: 'Pawn Moves Are Irreversible',
    tip: 'Every pawn push permanently surrenders control of adjacent squares. Be certain you want the open space before lunging forward.'
  },
  {
    category: 'Endgame',
    title: 'The King Is an Attacking Piece',
    tip: 'Once queens leave the board, your king transforms from a liability into a fighting weapon. March your king actively toward the center!'
  },
  {
    category: 'Rook Strategy',
    title: 'Rooks Belong on the 7th Rank',
    tip: 'A rook on the 7th (or 2nd) rank paralyzes the enemy king, gobbles unadvanced pawns, and sets up decisive mating nets.'
  },
  {
    category: 'Psychology',
    title: 'Sit on Your Hands for 3 Seconds',
    tip: 'When you spot a winning move, stop! Take 3 seconds to look for an even better move, or verify that you are not walking into an in-between check.'
  },
  {
    category: 'Endgame',
    title: 'Active Defense in Rook Endings',
    tip: 'Passive defense loses rook endgames. Place your rook behind passed pawns (yours or your opponent’s) to maximize your scope.'
  },
  {
    category: 'Engine Fact',
    title: 'World Champion Engine Brain',
    tip: 'Stockfish calculates deep tactical evaluations trained on billions of positions, calculating millions of candidate variations to find the absolute best move.'
  },
  {
    category: 'Opening',
    title: 'Develop With Threats',
    tip: 'The fastest way to build an opening initiative is to develop minor pieces while simultaneously attacking unprotected enemy targets.'
  },
  {
    category: 'Tactics',
    title: 'The Overloaded Defender',
    tip: 'When an enemy piece is tasked with guarding two different squares at once, look for a strike that forces it to abandon one of them.'
  },
  {
    category: 'Mindset',
    title: 'Accepting Defeat as Data',
    tip: 'Superhuman engines punish every inaccuracy with ruthless math. Every loss analyzed in Apex is a permanent upgrade to your subconscious radar.'
  }
];

export function AnalysisLoadingHUD({ progress, moveCount = 0, quota = null }) {
  const [tipIndex, setTipIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Auto-rotate tips every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % CHESS_TIPS.length);
        setIsFading(false);
      }, 200);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleNextTip = () => {
    setIsFading(true);
    setTimeout(() => {
      setTipIndex((prev) => (prev + 1) % CHESS_TIPS.length);
      setIsFading(false);
    }, 150);
  };

  const handlePrevTip = () => {
    setIsFading(true);
    setTimeout(() => {
      setTipIndex((prev) => (prev - 1 + CHESS_TIPS.length) % CHESS_TIPS.length);
      setIsFading(false);
    }, 150);
  };

  const currentTip = CHESS_TIPS[tipIndex];
  const percent = Math.min(100, Math.max(0, progress?.percent || 5));
  const isComplete = percent >= 100;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-100 space-y-4 animate-in fade-in duration-200">
      
      {/* Top Status Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Cpu size={16} className="animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Stockfish 19 Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Zap size={10} className="text-amber-400" />
              <span>Full-Match Tactical Analysis</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {quota && !quota.isUnlimited && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              Free Review {quota.usedCount}/{quota.maxAllowed}
            </span>
          )}
          <span className="text-xs font-mono font-black text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            {percent}%
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline">
            ~3650 Elo Locked
          </span>
        </div>
      </div>

      {/* Progress Bar with Glow */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50"
            style={{ width: `${Math.max(5, percent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-mono">
            {progress?.current && progress?.total
              ? `Position ${progress.current} of ${progress.total}`
              : `Evaluating match moves (${Math.max(1, Math.ceil(moveCount / 2))} moves)...`}
            {progress?.moveSan ? ` • ${progress.moveSan}` : ''}
          </span>
          <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
            <Clock size={11} className="text-emerald-400" />
            {progress?.estimatedSecondsRemaining !== undefined
              ? `~${progress.estimatedSecondsRemaining}s remaining`
              : 'Grandmaster scan'}
          </span>
        </div>
      </div>

      {/* Anti-Boredom Chess Wisdom Carousel */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 relative overflow-hidden shadow-md">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
            <Lightbulb size={13} className="text-amber-400" />
            <span>Grandmaster Tip • {currentTip.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevTip}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Previous Tip"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-[9px] font-mono text-slate-400">
              {tipIndex + 1}/{CHESS_TIPS.length}
            </span>
            <button
              onClick={handleNextTip}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Next Tip"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        <div className={`transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-xs font-bold text-slate-200 mb-1">
            {currentTip.title}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {currentTip.tip}
          </p>
        </div>
      </div>

      {/* Interactivity Notice (Rule 5 Compliance) */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 px-0.5">
        <span className="flex items-center gap-1 text-emerald-400 font-medium">
          <Sparkles size={11} />
          <span>You can click moves below to inspect the board</span>
        </span>
        <span className="text-slate-400">0ms Network Lag</span>
      </div>

    </div>
  );
}
