import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  Compass,
  ShieldCheck,
  X
} from 'lucide-react';

/**
 * Pedagogical Analysis Card / Slide-out Drawer.
 * Explains:
 * 1. Why your move was a mistake
 * 2. Why Stockfish's move is better
 * 3. Plain English threat description
 * 4. Dismissible close button (X)
 */
export function AnalysisPanel({
  currentStep = null,
  isSandboxMode = false,
  sandboxMoves = [],
  sandboxEval = null,
  sandboxFeedback = '',
  onEnterSandbox,
  onResetSandbox,
  onExitSandbox,
  onClose = null
}) {
  // Sandbox Active View
  if (isSandboxMode) {
    return (
      <div className="bg-slate-900 border border-indigo-500/50 rounded-xl p-3 shadow-lg flex flex-col gap-2 shrink-0 select-none">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5">
            <Compass className="text-indigo-400" size={17} />
            <span className="text-xs font-bold text-indigo-300">
              "Try Your Idea" Sandbox
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onResetSandbox}
              className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded transition-colors border border-slate-700"
              title="Reset to original position"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={onExitSandbox}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-rose-900/60 text-xs font-bold text-slate-200 hover:text-rose-200 rounded transition-colors border border-slate-700 hover:border-rose-800"
            >
              Exit Sandbox
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 leading-normal">
          Make any move you want on the board. Stockfish 19 will immediately respond at Level 20. All moves are recorded below.
        </p>

        {sandboxFeedback && (
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
            {sandboxFeedback}
          </div>
        )}

        {sandboxEval && (
          <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Position Evaluation:</span>
            <span className={`font-bold ${sandboxEval.value > 100 ? 'text-emerald-400' : sandboxEval.value < -100 ? 'text-rose-400' : 'text-slate-300'}`}>
              {sandboxEval.type === 'mate' ? `Mate in ${sandboxEval.value}` : `${(sandboxEval.value / 100).toFixed(1)}`}
            </span>
          </div>
        )}
      </div>
    );
  }

  // No Move Selected View
  if (!currentStep) {
    return null;
  }

  const {
    turn,
    moveNumber,
    playedMoveSan,
    bestMoveSan,
    classification,
    explanation,
    accuracy
  } = currentStep;

  const classType = classification?.classification || 'Good';
  const isBlunder = classType === 'Blunder' || classType === 'Missed Win';
  const isMistake = classType === 'Mistake';
  const isInaccuracy = classType === 'Inaccuracy';
  const isSuboptimal = isBlunder || isMistake || isInaccuracy;

  const whyText = explanation?.why || explanation?.whySummary;
  const whyBetterText = explanation?.whyBetter;
  const motifs = explanation?.tacticalMotifs || (explanation?.tacticalMotif ? [explanation.tacticalMotif] : []);

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl flex flex-col gap-2.5 select-none max-h-[380px] overflow-y-auto">
      {/* 1. Header: Quality Classification & Move Comparison + Close Button */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          {isBlunder && <AlertTriangle className="text-rose-400 shrink-0" size={18} />}
          {isMistake && <AlertCircle className="text-orange-400 shrink-0" size={18} />}
          {isInaccuracy && <HelpCircle className="text-amber-300 shrink-0" size={18} />}
          {!isSuboptimal && <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />}

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold ${
                  isBlunder
                    ? 'text-rose-400'
                    : isMistake
                    ? 'text-orange-400'
                    : isInaccuracy
                    ? 'text-amber-300'
                    : 'text-emerald-400'
                }`}
              >
                {classification?.label || 'Move Analyzed'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {moveNumber}. {turn === 'w' ? 'White' : 'Black'}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono mt-0.5">
              You played: <span className="font-bold text-white">{playedMoveSan}</span>
              {isSuboptimal && bestMoveSan && (
                <>
                  {' '}→ Best was: <span className="font-bold text-emerald-400">{bestMoveSan}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            {accuracy}%
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close explanation (Esc)"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Tactical Motif Tags */}
      {motifs.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {motifs.map((motif, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 border border-rose-500/30 text-rose-300"
            >
              {motif}
            </span>
          ))}
        </div>
      )}

      {/* 3. WHY Your Move Failed */}
      {whyText && (
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/90 text-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
            Why your move was a mistake:
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {whyText}
          </p>
        </div>
      )}

      {/* 4. WHY The Recommended Move Is Better */}
      {isSuboptimal && whyBetterText && (
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/90 text-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <ShieldCheck size={12} /> Why {bestMoveSan} is better:
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {whyBetterText}
          </p>
        </div>
      )}

      {/* 5. How Stockfish Punishes This (Plain English) */}
      {isSuboptimal && explanation?.refutationExplanation && (
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/90 text-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <AlertTriangle size={12} className="text-amber-400 shrink-0" /> How Stockfish punishes this:
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {explanation.refutationExplanation}
          </p>
        </div>
      )}

      {/* 6. "Try Your Idea" Sandbox Trigger */}
      {isSuboptimal && (
        <div className="pt-1 flex items-center justify-between border-t border-slate-800/70">
          <span className="text-[11px] text-slate-400">
            Want to test an alternative move?
          </span>
          <button
            onClick={() => onEnterSandbox && onEnterSandbox(currentStep)}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-lg transition-colors shadow"
          >
            <Compass size={13} /> Try Your Idea
          </button>
        </div>
      )}
    </div>
  );
}

export default AnalysisPanel;
