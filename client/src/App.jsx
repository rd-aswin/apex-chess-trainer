import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { ChessBoard } from './components/ChessBoard';
import { EvalBar } from './components/EvalBar';
import { MoveHistory } from './components/MoveHistory';
import { EvalGraph } from './components/EvalGraph';
import { AnalysisPanel } from './components/AnalysisPanel';
import { AccuracyBadge } from './components/AccuracyBadge';
import { GameHistoryModal } from './components/GameHistoryModal';
import { DesktopAppModal } from './components/DesktopAppModal';
import { AiCoachChat } from './components/AiCoachChat';
import { UpdateModal } from './components/UpdateModal';
import ImportGameModal from './components/ImportGameModal';
import { LandingView } from './components/landing/LandingView';
import { useSoundEffects } from './hooks/useSoundEffects';
import { Swords, RotateCcw, Flag, Sparkles, Award, History, Volume2, VolumeX, Monitor, Bot, RefreshCw, UploadCloud, Loader2 } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export function App() {
  // Game & Board State
  const [game, setGame] = useState(() => new Chess());
  const [userColor, setUserColor] = useState('w');
  const [mode, setMode] = useState('play'); // 'play' | 'review' | 'sandbox'
  const [reviewTab, setReviewTab] = useState('coach'); // 'coach' | 'accuracy' | 'chat'
  const [moves, setMoves] = useState([]);
  const [currentPly, setCurrentPly] = useState(0);
  const [lastMove, setLastMove] = useState(null);
  const [currentScore, setCurrentScore] = useState({ type: 'cp', value: 0 });
  const [arrows, setArrows] = useState([]);

  // Engine & API State
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedKey, setAnalyzedKey] = useState('');

  // Match State
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });

  // Sandbox State
  const [sandboxData, setSandboxData] = useState(null);
  const [sandboxMoves, setSandboxMoves] = useState([]);
  const [sandboxEval, setSandboxEval] = useState(null);
  const [sandboxFeedback, setSandboxFeedback] = useState('');

  // UI Modals & Drawer
  const [isCoachDrawerOpen, setIsCoachDrawerOpen] = useState(false);
  const [isPlayCoachOpen, setIsPlayCoachOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [updateAvailableBadge, setUpdateAvailableBadge] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // View state: 'landing' (19-page marketing website) vs 'app' (chess trainer board)
  const [view, setView] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#app') return 'app';
    return 'landing';
  });

  // Sync hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#app') {
        setView('app');
      } else if (!hash || hash === '#landing' || hash === '#home' || hash.length > 1) {
        if (hash !== '#app') {
          setView('landing');
        }
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Background check for updates on app mount
  useEffect(() => {
    fetch('http://localhost:5000/api/updates/check')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.isUpdateAvailable) {
          setUpdateAvailableBadge(true);
        }
      })
      .catch(() => {});
  }, []);

  // Procedural Audio
  const sounds = useSoundEffects();

  const playSound = useCallback(
    (action) => {
      if (isMuted) return;
      if (action === 'capture') sounds.playCapture();
      else if (action === 'check') sounds.playCheck();
      else if (action === 'castle') sounds.playCastle();
      else sounds.playMove();
    },
    [isMuted, sounds]
  );

  // Close coach drawer on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsCoachDrawerOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Compute captured pieces
  const computeCapturedPieces = (chessInstance) => {
    const startCounts = { p: 8, n: 2, b: 2, r: 2, q: 1 };
    const currentCounts = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
    };

    const board = chessInstance.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type !== 'k') {
          currentCounts[piece.color][piece.type]++;
        }
      }
    }

    const whiteCaptures = [];
    const blackCaptures = [];

    for (const [type, count] of Object.entries(startCounts)) {
      const missingBlack = count - currentCounts.b[type];
      for (let i = 0; i < missingBlack; i++) whiteCaptures.push(type);

      const missingWhite = count - currentCounts.w[type];
      for (let i = 0; i < missingWhite; i++) blackCaptures.push(type);
    }

    return { white: whiteCaptures, black: blackCaptures };
  };

  // Stockfish move requester
  const requestEngineMove = useCallback(
    async (currentMoves, currentGame) => {
      setIsEngineThinking(true);
      try {
        const uciMoves = currentMoves.map((m) => m.uci);
        const res = await fetch(`${API_BASE}/move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moves: uciMoves, depth: 22, movetime: 1800 })
        });

        const data = await res.json();
        if (!data.success || !data.bestMove) return;

        const bestMove = data.bestMove;
        const from = bestMove.slice(0, 2);
        const to = bestMove.slice(2, 4);
        const promotion = bestMove.length > 4 ? bestMove[4] : undefined;

        const moveResult = currentGame.move({ from, to, promotion });
        if (!moveResult) return;

        if (currentGame.inCheck && currentGame.inCheck()) {
          playSound('check');
        } else if (moveResult.captured) {
          playSound('capture');
        } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
          playSound('castle');
        } else {
          playSound('move');
        }

        const newMoves = [
          ...currentMoves,
          {
            san: moveResult.san,
            uci: bestMove,
            from,
            to,
            fen: currentGame.fen()
          }
        ];

        setGame(new Chess(currentGame.fen()));
        setMoves(newMoves);
        setCurrentPly(newMoves.length);
        setLastMove({ from, to });
        setCapturedPieces(computeCapturedPieces(currentGame));

        if (data.score) setCurrentScore(data.score);

        checkGameOver(currentGame, newMoves);
      } catch (err) {
        console.error('Engine move error:', err);
      } finally {
        setIsEngineThinking(false);
      }
    },
    [playSound]
  );

  // Check Game Over
  const checkGameOver = (chessInstance, currentMoves) => {
    if (chessInstance.isGameOver && chessInstance.isGameOver()) {
      setIsGameOver(true);
      playSound('gameover');

      let reason = 'Game Over';
      if (chessInstance.isCheckmate()) {
        const winner = chessInstance.turn() === 'w' ? 'Black' : 'White';
        reason = `Checkmate! ${winner} wins.`;
      } else if (chessInstance.isDraw()) {
        if (chessInstance.isStalemate()) reason = 'Draw by Stalemate.';
        else if (chessInstance.isThreefoldRepetition()) reason = 'Draw by Repetition.';
        else if (chessInstance.isInsufficientMaterial()) reason = 'Draw by Insufficient Material.';
        else reason = 'Game drawn.';
      }

      setGameOverMessage(reason);
      triggerMatchAnalysis(currentMoves, reason);
    }
  };

  // Run Match Analysis (with client-side caching)
  const triggerMatchAnalysis = async (gameMoves, resultStr = '') => {
    const uciMoves = gameMoves.map((m) => m.uci);
    const currentKey = uciMoves.join(',');

    // If already analyzed in current session, switch immediately to review without API call
    if (analysis && analyzedKey === currentKey) {
      setMode('review');
      setReviewTab('coach');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moves: uciMoves,
          userColor,
          result: resultStr || (userColor === 'w' ? '0-1' : '1-0')
        })
      });

      const data = await res.json();
      if (data.success) {
        setAnalysis(data);
        setAnalyzedKey(currentKey);
        setMode('review');
        setReviewTab('coach');
        handleSelectPly(gameMoves.length, data);
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // User Move Handler
  const handleUserMove = ({ from, to, promotion }) => {
    if (isEngineThinking) return;

    if (mode === 'sandbox') {
      handleSandboxUserMove({ from, to, promotion });
      return;
    }

    if (isGameOver) return;

    if (game.turn() !== userColor) return;

    try {
      const moveResult = game.move({ from, to, promotion: promotion || 'q' });
      if (!moveResult) return;

      if (game.inCheck && game.inCheck()) {
        playSound('check');
      } else if (moveResult.captured) {
        playSound('capture');
      } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
        playSound('castle');
      } else {
        playSound('move');
      }

      const uci = `${from}${to}${moveResult.promotion || ''}`;
      const newMoves = [
        ...moves,
        {
          san: moveResult.san,
          uci,
          from,
          to,
          fen: game.fen()
        }
      ];

      setGame(new Chess(game.fen()));
      setMoves(newMoves);
      setCurrentPly(newMoves.length);
      setLastMove({ from, to });
      setCapturedPieces(computeCapturedPieces(game));

      if (game.isGameOver && game.isGameOver()) {
        checkGameOver(game, newMoves);
      } else {
        requestEngineMove(newMoves, game);
      }
    } catch (err) {
      console.warn('Illegal move attempt:', err);
    }
  };

  // Sandbox Handlers
  const handleSandboxUserMove = async ({ from, to, promotion }) => {
    if (!sandboxData) return;
    const sGame = sandboxData.sandboxGame;

    try {
      const moveResult = sGame.move({ from, to, promotion: promotion || 'q' });
      if (!moveResult) return;

      if (sGame.inCheck && sGame.inCheck()) {
        playSound('check');
      } else if (moveResult.captured) {
        playSound('capture');
      } else if (moveResult.flags && (moveResult.flags.includes('k') || moveResult.flags.includes('q'))) {
        playSound('castle');
      } else {
        playSound('move');
      }

      setGame(new Chess(sGame.fen()));
      setLastMove({ from, to });

      const userUci = `${from}${to}${moveResult.promotion || ''}`;
      const userMoveObj = {
        san: moveResult.san,
        uci: userUci,
        from,
        to,
        fen: sGame.fen()
      };

      setSandboxMoves((prev) => [...prev, userMoveObj]);
      setSandboxFeedback(`Testing ${moveResult.san}... Stockfish 19 is calculating reply.`);

      if (sGame.isGameOver()) {
        const resultText = sGame.isCheckmate() ? 'Checkmate in sandbox!' : 'Sandbox drawn.';
        setSandboxFeedback(resultText);
        return;
      }

      setIsEngineThinking(true);
      const res = await fetch(`${API_BASE}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: sGame.fen(), depth: 18, movetime: 1500 })
      });

      const data = await res.json();
      if (data.success && data.bestMove) {
        const sfFrom = data.bestMove.slice(0, 2);
        const sfTo = data.bestMove.slice(2, 4);
        const sfProm = data.bestMove.length > 4 ? data.bestMove[4] : undefined;

        const sfRes = sGame.move({ from: sfFrom, to: sfTo, promotion: sfProm });
        if (sfRes) {
          if (sGame.inCheck && sGame.inCheck()) {
            playSound('check');
          } else if (sfRes.captured) {
            playSound('capture');
          } else if (sfRes.flags && (sfRes.flags.includes('k') || sfRes.flags.includes('q'))) {
            playSound('castle');
          } else {
            playSound('move');
          }

          setGame(new Chess(sGame.fen()));
          setLastMove({ from: sfFrom, to: sfTo });

          const sfMoveObj = {
            san: sfRes.san,
            uci: data.bestMove,
            from: sfFrom,
            to: sfTo,
            fen: sGame.fen()
          };
          setSandboxMoves((prev) => [...prev, sfMoveObj]);
        }

        if (data.score) {
          setCurrentScore(data.score);
          setSandboxEval(data.score);
          const evalStr = data.score.type === 'mate'
            ? `Mate in ${data.score.value}`
            : `${(data.score.value / 100).toFixed(1)}`;
          setSandboxFeedback(
            `You tested ${moveResult.san}. Stockfish responded with ${sfRes?.san || data.bestMove} (Eval: ${evalStr}).`
          );
        }

        if (sGame.isGameOver()) {
          const resultText = sGame.isCheckmate() ? ' Checkmate by Stockfish!' : ' Sandbox drawn.';
          setSandboxFeedback((prev) => `${prev}${resultText}`);
        }
      }
    } catch (e) {
      console.warn('Sandbox move error:', e);
    } finally {
      setIsEngineThinking(false);
    }
  };

  const handleEnterSandbox = (step) => {
    if (!step || !step.fenBefore) return;
    const sGame = new Chess(step.fenBefore);
    const stepScore = (step.whiteEvalCp !== undefined && step.score?.type !== 'mate')
      ? { type: 'cp', value: step.whiteEvalCp }
      : step.score;

    setSandboxData({
      originalPly: step.ply,
      sandboxGame: sGame,
      step
    });
    setSandboxMoves([]);
    setSandboxEval(stepScore || null);
    if (stepScore) {
      setCurrentScore(stepScore);
    }
    setSandboxFeedback('Play the move you wanted to try on the board.');
    setGame(sGame);
    setLastMove(null);
    setMode('sandbox');
    setArrows([]);
    setIsCoachDrawerOpen(false);
  };

  const handleResetSandbox = () => {
    if (!sandboxData || !sandboxData.step) return;
    const sGame = new Chess(sandboxData.step.fenBefore);
    const stepScore = (sandboxData.step.whiteEvalCp !== undefined && sandboxData.step.score?.type !== 'mate')
      ? { type: 'cp', value: sandboxData.step.whiteEvalCp }
      : sandboxData.step.score;

    setSandboxData({
      ...sandboxData,
      sandboxGame: sGame
    });
    setSandboxMoves([]);
    setSandboxEval(stepScore || null);
    if (stepScore) {
      setCurrentScore(stepScore);
    }
    setSandboxFeedback('Position reset. Play the move you wanted to try on the board.');
    setGame(sGame);
    setLastMove(null);
    setArrows([]);
  };

  const handleExitSandbox = () => {
    setSandboxData(null);
    setSandboxMoves([]);
    setSandboxEval(null);
    setSandboxFeedback('');
    setMode('review');
    setIsCoachDrawerOpen(true);
    handleSelectPly(currentPly);
  };

  // Select Ply in Review
  const handleSelectPly = (ply, overrideAnalysis = null) => {
    setCurrentPly(ply);

    if (ply === 0) {
      setGame(new Chess());
      setLastMove(null);
      setArrows([]);
      setCurrentScore({ type: 'cp', value: 0 });
      return;
    }

    const targetMove = moves[ply - 1];
    if (targetMove) {
      setGame(new Chess(targetMove.fen));
      setLastMove({ from: targetMove.from, to: targetMove.to });

      const activeAnalysis = overrideAnalysis || analysis;
      if (activeAnalysis && activeAnalysis.steps) {
        const step = activeAnalysis.steps.find((s) => s.ply === ply);
        if (step) {
          const stepScore = (step.whiteEvalCp !== undefined && step.score?.type !== 'mate')
            ? { type: 'cp', value: step.whiteEvalCp }
            : step.score;
          setCurrentScore(stepScore);

          const stepArrows = [];
          if (
            ['Blunder', 'Mistake', 'Inaccuracy', 'Missed Win'].includes(
              step.classification?.classification
            )
          ) {
            if (step.playedMoveUci) {
              stepArrows.push({
                from: step.playedMoveUci.slice(0, 2),
                to: step.playedMoveUci.slice(2, 4),
                color: 'red'
              });
            }
            if (step.bestMoveUci) {
              stepArrows.push({
                from: step.bestMoveUci.slice(0, 2),
                to: step.bestMoveUci.slice(2, 4),
                color: 'green'
              });
            }
          } else if (step.playedMoveUci) {
            stepArrows.push({
              from: step.playedMoveUci.slice(0, 2),
              to: step.playedMoveUci.slice(2, 4),
              color: 'green'
            });
          }
          setArrows(stepArrows);
        }
      }
    }
  };

  // Start New Game
  const startNewGame = (color) => {
    const newG = new Chess();
    setGame(newG);
    setUserColor(color);
    setMode('play');
    setMoves([]);
    setCurrentPly(0);
    setLastMove(null);
    setCurrentScore({ type: 'cp', value: 0 });
    setArrows([]);
    setAnalysis(null);
    setAnalyzedKey('');
    setIsGameOver(false);
    setGameOverMessage('');
    setCapturedPieces({ white: [], black: [] });
    setSandboxData(null);
    setIsNewGameModalOpen(false);

    if (color === 'b') {
      requestEngineMove([], newG);
    }
  };

  const handleResign = () => {
    if (isGameOver) return;
    setIsGameOver(true);
    const reason = userColor === 'w' ? 'White resigns.' : 'Black resigns.';
    setGameOverMessage(reason);
    playSound('gameover');
    triggerMatchAnalysis(moves, reason);
  };

  const handleLoadGameFromHistory = (historicalGame) => {
    const replayChess = new Chess();
    const loadedMoves = [];

    for (const uci of historicalGame.moves) {
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;
      const res = replayChess.move({ from, to, promotion });
      if (res) {
        loadedMoves.push({
          san: res.san,
          uci,
          from,
          to,
          fen: replayChess.fen()
        });
      }
    }

    setMoves(loadedMoves);
    setUserColor(historicalGame.userColor || 'w');
    setAnalysis({
      accuracy: historicalGame.accuracy,
      counts: historicalGame.counts,
      steps: historicalGame.steps
    });
    setAnalyzedKey((historicalGame.moves || []).join(','));
    setMode('review');
    setReviewTab('coach');
    setIsGameOver(true);
    setGameOverMessage(`Archived match (${historicalGame.result})`);
    handleSelectPly(loadedMoves.length);
  };

  const handleImportGame = async (importedGame) => {
    try {
      const replayChess = new Chess();
      replayChess.loadPgn(importedGame.pgn, { strict: false });

      const loadedMoves = [];
      const verboseHistory = replayChess.history({ verbose: true });
      const stepChess = new Chess();

      for (const m of verboseHistory) {
        const res = stepChess.move({ from: m.from, to: m.to, promotion: m.promotion });
        if (res) {
          loadedMoves.push({
            san: res.san,
            uci: `${m.from}${m.to}${m.promotion || ''}`,
            from: m.from,
            to: m.to,
            fen: stepChess.fen()
          });
        }
      }

      if (loadedMoves.length === 0) {
        console.warn('Imported game contains no moves.');
        return;
      }

      const assignedColor = importedGame.userColor === 'black' ? 'b' : 'w';
      setUserColor(assignedColor);
      setMoves(loadedMoves);
      setGame(new Chess(stepChess.fen()));
      setCurrentPly(loadedMoves.length);
      setIsGameOver(true);
      const matchLabel = `${importedGame.platform || 'Imported'}: ${importedGame.white?.username || 'White'} vs ${importedGame.black?.username || 'Black'}`;
      setGameOverMessage(matchLabel);
      setCapturedPieces(computeCapturedPieces(stepChess));

      // Switch to review mode and trigger Stockfish 19 & AI Coach analysis
      const uciMoves = loadedMoves.map((m) => m.uci);
      const currentKey = uciMoves.join(',');

      setMode('review');
      setReviewTab('coach');
      setIsAnalyzing(true);

      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moves: uciMoves,
          userColor: assignedColor,
          result: importedGame.userOutcome === 'win' 
            ? (assignedColor === 'w' ? '1-0' : '0-1')
            : (assignedColor === 'w' ? '0-1' : '1-0')
        })
      });

      const data = await res.json();
      if (data.success) {
        setAnalysis(data);
        setAnalyzedKey(currentKey);
        handleSelectPly(loadedMoves.length, data);
      } else {
        console.warn('Backend analysis returned unsuccessful:', data.error);
      }
    } catch (err) {
      console.error('Failed to import and analyze game:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentStep = useMemo(() => {
    if (!analysis || !analysis.steps || currentPly === 0) return null;
    return analysis.steps.find((s) => s.ply === currentPly) || null;
  }, [analysis, currentPly]);

  // When in landing view, render the 19-page acquisition website
  if (view === 'landing') {
    return (
      <LandingView
        onLaunchApp={() => {
          setView('app');
          window.location.hash = '#app';
        }}
      />
    );
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Sleek Minimal Header (44px) */}
      <header className="h-11 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo192.png"
            alt="Apex Chess Logo"
            className="w-7 h-7 rounded-lg shadow-md border border-emerald-500/40 object-cover"
          />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-white tracking-tight">
              Apex Chess
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              SF 19 (Max 20)
            </span>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewGameModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded transition-colors border border-slate-700"
          >
            <RotateCcw size={13} /> New Game
          </button>

          {!isGameOver && mode === 'play' && (
            <button
              onClick={handleResign}
              disabled={isEngineThinking}
              className="flex items-center gap-1 px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/50 text-xs font-semibold text-rose-300 rounded transition-colors border border-rose-800/50 disabled:opacity-40"
            >
              <Flag size={13} /> Resign
            </button>
          )}

          {isGameOver && mode !== 'review' && (
            <button
              onClick={() => triggerMatchAnalysis(moves, gameOverMessage)}
              disabled={isAnalyzing}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded transition-colors shadow"
            >
              <Sparkles size={13} /> {isAnalyzing ? 'Analyzing...' : 'Review'}
            </button>
          )}

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Past Matches"
          >
            <History size={16} />
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold"
            title="Import Game from Chess.com, Lichess, or PGN"
          >
            <UploadCloud size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            onClick={() => {
              setView('landing');
              window.location.hash = '#home';
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold"
            title="Explore Pricing, Features & Anti-Subscription Manifesto"
          >
            <Sparkles size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">Pricing & Site</span>
          </button>

          {isAnalyzing && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-pulse">
              <Loader2 size={13} className="animate-spin text-emerald-400" />
              <span className="hidden sm:inline">Stockfish Analyzing...</span>
            </div>
          )}

          <button
            onClick={() => {
              if (mode === 'play') {
                setIsPlayCoachOpen(true);
              } else {
                setReviewTab('chat');
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 transition-colors border border-emerald-500/40 bg-emerald-500/15"
            title="Chat with Grandmaster AI Coach"
          >
            <Bot size={14} className="text-emerald-400" />
            <span className="text-[11px] font-bold">Ask Coach</span>
          </button>

          <button
            onClick={() => setIsDesktopModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/30 bg-emerald-500/10"
            title="Desktop App & Shortcut"
          >
            <Monitor size={14} />
            <span className="text-[11px] font-semibold hidden md:inline">Desktop App</span>
          </button>

          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="relative flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/80 bg-slate-800/60"
            title="Check for Updates & Tool Health"
          >
            <RefreshCw size={13} className="text-emerald-400" />
            <span className="text-[11px] font-semibold hidden md:inline">Updates</span>
            {updateAvailableBadge && (
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 ring-2 ring-slate-900 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setIsMuted((m) => !m)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </header>

      {/* Main Workspace: Board on Left (Pinned), Sidebar on Right (Never Scrolls Page) */}
      <main className="flex-1 min-h-0 overflow-hidden p-2 sm:p-3 flex flex-row items-center justify-center gap-4">
        {/* Left Section: Eval Bar + Chessboard (Always pinned, perfectly scaled) */}
        <div className="flex items-center justify-center gap-2.5 h-full shrink-0">
          <EvalBar score={currentScore} isFlipped={userColor === 'b'} />

          <ChessBoard
            game={game}
            isFlipped={userColor === 'b'}
            onMove={handleUserMove}
            lastMove={lastMove}
            arrows={arrows}
            isEngineThinking={isEngineThinking}
            disabled={isGameOver && mode !== 'sandbox'}
          />
        </div>

        {/* Right Section: Fixed-Height Sidebar (Matches Board Height Exactly) */}
        <div className="relative w-[360px] md:w-[400px] lg:w-[430px] h-[min(80vh,620px)] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl shrink-0">
          {/* Sandbox Active Banner & Controls */}
          {mode === 'sandbox' && (
            <div className="p-2.5 flex flex-col gap-2 shrink-0 border-b border-slate-800/80">
              <AnalysisPanel
                isSandboxMode={true}
                sandboxMoves={sandboxMoves}
                sandboxEval={sandboxEval}
                sandboxFeedback={sandboxFeedback}
                onResetSandbox={handleResetSandbox}
                onExitSandbox={handleExitSandbox}
              />
            </div>
          )}

          {/* Review Mode - Stockfish Analysis In-Progress HUD */}
          {mode === 'review' && isAnalyzing && (
            <div className="p-3.5 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border-b border-emerald-500/30 flex flex-col gap-2.5 shrink-0 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Loader2 size={15} className="animate-spin text-emerald-400 shrink-0" />
                  <span>Stockfish 19 Evaluating Match...</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Depth 16 NNUE
                </span>
              </div>
              
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Calculating move qualities, blunders, and refutations for all <span className="font-semibold text-white">{moves.length} moves</span>. Advantage graph will appear once complete (~15–25s).
              </p>

              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full animate-pulse w-3/4" />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span>⏱️ Sequential NNUE analysis</span>
                <span className="text-emerald-400 font-medium">
                  ♟️ Move navigation active below
                </span>
              </div>
            </div>
          )}

          {/* Review Mode Tabs */}
          {mode === 'review' && analysis && (
            <div className="flex border-b border-slate-800 bg-slate-950/70 shrink-0">
              <button
                onClick={() => setReviewTab('coach')}
                className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  reviewTab === 'coach'
                    ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles size={14} /> Coach Review
              </button>
              <button
                onClick={() => setReviewTab('chat')}
                className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  reviewTab === 'chat'
                    ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bot size={14} /> Ask Coach (AI)
              </button>
              <button
                onClick={() => setReviewTab('accuracy')}
                className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  reviewTab === 'accuracy'
                    ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-900/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award size={14} /> Accuracy
              </button>
            </div>
          )}

          {/* AI Coach Conversational View */}
          {mode === 'review' && reviewTab === 'chat' ? (
            <div className="flex-1 min-h-0">
              <AiCoachChat
                currentFen={game.fen()}
                moves={moves}
                currentPly={currentPly}
                userColor={userColor}
                currentStep={currentStep}
                currentScore={currentScore}
              />
            </div>
          ) : (
            <>
              {/* Review Mode - Advantage Graph Ribbon */}
              {mode === 'review' && analysis && reviewTab === 'coach' && (
                <div className="p-2 shrink-0 border-b border-slate-800/80">
                  <EvalGraph
                    steps={analysis.steps}
                    currentPly={currentPly}
                    onSelectPly={(ply) => {
                      handleSelectPly(ply);
                    }}
                  />
                </div>
              )}

              {/* Review Mode - Tab 2: Match Accuracy Matrix */}
              {mode === 'review' && analysis && reviewTab === 'accuracy' && (
                <div className="p-2.5 shrink-0 border-b border-slate-800/80 max-h-[300px] overflow-y-auto">
                  <AccuracyBadge
                    accuracy={analysis.accuracy}
                    counts={analysis.counts}
                    userColor={userColor}
                  />
                </div>
              )}

              {/* Move History: Has 100% full vertical space by default */}
              <div className="flex-1 min-h-0 flex flex-col">
                {mode === 'sandbox' && (
                  <div className="px-2.5 py-1 bg-indigo-950/60 border-b border-indigo-900/40 text-[10px] font-bold text-indigo-300 uppercase tracking-wider shrink-0">
                    Sandbox Moves ({sandboxMoves.length} played)
                  </div>
                )}
                <div className="flex-1 min-h-0">
                  <MoveHistory
                    moves={mode === 'sandbox' ? sandboxMoves : moves}
                    analysisSteps={mode === 'sandbox' ? [] : (analysis?.steps || [])}
                    currentPly={mode === 'sandbox' ? sandboxMoves.length : currentPly}
                    onSelectPly={mode === 'sandbox' ? null : handleSelectPly}
                    capturedPieces={capturedPieces}
                  />
                </div>
              </div>
            </>
          )}

          {/* Coach Explanation Drawer Trigger Bar (Sticky at bottom of sidebar) */}
          {mode === 'review' && analysis && currentStep && (
            <div className="p-2 bg-slate-950/90 border-t border-slate-800 shrink-0">
              <button
                onClick={() => setIsCoachDrawerOpen(!isCoachDrawerOpen)}
                className={`w-full py-1.5 px-3 rounded-lg border flex items-center justify-between text-xs font-semibold transition-all shadow-sm ${
                  currentStep.classification?.classification === 'Blunder' || currentStep.classification?.classification === 'Missed Win'
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 hover:bg-rose-900/90'
                    : currentStep.classification?.classification === 'Mistake'
                    ? 'bg-orange-950/80 border-orange-500/50 text-orange-300 hover:bg-orange-900/90'
                    : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles size={14} className={
                    currentStep.classification?.classification === 'Blunder' ? 'text-rose-400' : 'text-amber-400'
                  } />
                  <span>
                    {currentStep.classification?.label || 'Move'}: {currentStep.playedMoveSan}
                    {currentStep.bestMoveSan && ` → Best: ${currentStep.bestMoveSan}`}
                  </span>
                </span>
                <span className="text-[11px] font-bold text-white shrink-0 ml-2">
                  {isCoachDrawerOpen ? 'Hide ▾' : 'Why? Coach Breakdown ▴'}
                </span>
              </button>
            </div>
          )}

          {/* Slide-out Coach Drawer Overlay (Leaves Move History completely visible when closed!) */}
          {mode === 'review' && isCoachDrawerOpen && currentStep && (
            <div className="absolute inset-x-0 bottom-0 max-h-[82%] bg-slate-950/95 backdrop-blur-md border-t-2 border-emerald-500/60 shadow-2xl p-3 z-30 transition-all duration-300 flex flex-col rounded-b-xl overflow-hidden">
              <AnalysisPanel
                currentStep={currentStep}
                isSandboxMode={false}
                onEnterSandbox={(step) => {
                  setIsCoachDrawerOpen(false);
                  handleEnterSandbox(step);
                }}
                onExitSandbox={handleExitSandbox}
                onClose={() => setIsCoachDrawerOpen(false)}
              />
            </div>
          )}

          {/* Play Mode Game Over Footer Banner */}
          {isGameOver && mode === 'play' && (
            <div className="p-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-slate-200 truncate">
                {gameOverMessage}
              </span>
              <button
                onClick={() => triggerMatchAnalysis(moves, gameOverMessage)}
                disabled={isAnalyzing}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded transition-colors shadow shrink-0"
              >
                {isAnalyzing ? 'Analyzing...' : 'Review Match'}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* New Game Side Selector Modal */}
      {isNewGameModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xs p-4 shadow-2xl flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white text-center">
              New Match vs Stockfish 19
            </h3>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => startNewGame('w')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-base shadow">
                  ♔
                </div>
                <span className="text-xs font-bold text-slate-200">Play White</span>
              </button>

              <button
                onClick={() => startNewGame('b')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-100 font-bold text-base shadow">
                  ♚
                </div>
                <span className="text-xs font-bold text-slate-200">Play Black</span>
              </button>
            </div>

            <button
              onClick={() => setIsNewGameModalOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-200 text-center transition-colors pt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Match History Modal */}
      <GameHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadGame={handleLoadGameFromHistory}
      />

      {/* Desktop App & Shortcut Modal */}
      <DesktopAppModal
        isOpen={isDesktopModalOpen}
        onClose={() => setIsDesktopModalOpen(false)}
      />

      {/* Tool & Engine Health Center Modal */}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />

      {/* 1-Click Online Game Importer Modal */}
      <ImportGameModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportGame={handleImportGame}
      />

      {/* Play Mode - AI Coach Chat Modal */}
      {isPlayCoachOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg h-[min(85vh,650px)] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Bot size={16} className="text-emerald-400" />
                Apex Grandmaster Coach
              </div>
              <button
                onClick={() => setIsPlayCoachOpen(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 text-xs font-bold transition-colors"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <AiCoachChat
                currentFen={game.fen()}
                moves={moves}
                currentPly={moves.length}
                userColor={userColor}
                currentStep={null}
                currentScore={currentScore}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
