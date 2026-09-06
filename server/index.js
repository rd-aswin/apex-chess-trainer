import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { stockfishEngine } from './engine.js';
import { analyzeGame } from './analyzer.js';
import { getGameHistory, saveGameToHistory, getGameById, findGameByMoves } from './history.js';
import { identifyOpening } from './openingBook.js';
import { chatWithCoach, getCoachConfig, saveCoachConfig } from './aiCoach.js';
import { getUpdateReport } from './updater.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. System & Engine Status
app.get('/api/status', (req, res) => {
  res.json({
    engine: 'Stockfish 19',
    version: '19 NNUE',
    status: stockfishEngine.ready ? 'ready' : 'initializing',
    level: 'Maximum (Skill Level 20 - Locked)',
    skillLevel: stockfishEngine.skillLevel,
    threads: stockfishEngine.threads,
    hash: stockfishEngine.hash,
    elo: '3650+ (Superhuman)',
    handicap: false
  });
});

// 2. Play Turn - Request Stockfish 19 Move
app.post('/api/move', async (req, res) => {
  try {
    const { fen, moves = [], depth = 22, movetime = 2000 } = req.body;
    console.log(`[API /move] Move request. Depth: ${depth}, movetime: ${movetime}ms`);

    const result = await stockfishEngine.getMove({
      fen: fen || 'startpos',
      moves,
      depth,
      movetime
    });

    // Stockfish UCI returns score from the perspective of the side to move.
    // We normalize to White's perspective (+ = White advantage, - = Black advantage)
    let normalizedScore = result.score;
    const turn = (fen && fen !== 'startpos') ? (fen.split(' ')[1] || 'w') : ((moves.length % 2 === 1) ? 'b' : 'w');
    if (turn === 'b' && result.score) {
      normalizedScore = {
        type: result.score.type,
        value: -result.score.value
      };
    }

    res.json({
      success: true,
      bestMove: result.bestMove,
      ponder: result.ponder,
      score: normalizedScore,
      rawScore: result.score,
      depth: result.depth,
      pv: result.pv
    });
  } catch (err) {
    console.error('[API /move Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Post-Game Deep Match Analysis (Cached & Deduplicated)
app.post('/api/analyze', async (req, res) => {
  try {
    const { moves = [], initialFen, userColor = 'w', result = '1-0' } = req.body;
    console.log(`[API /analyze] Request for ${moves.length} moves...`);

    // Check if this exact match was already analyzed
    const cachedGame = findGameByMoves(moves);
    if (cachedGame && cachedGame.steps && cachedGame.steps.length > 0) {
      console.log(`[API /analyze] Serving cached analysis for game ${cachedGame.id}`);
      return res.json({
        success: true,
        gameId: cachedGame.id,
        accuracy: cachedGame.accuracy,
        counts: cachedGame.counts,
        steps: cachedGame.steps,
        fromCache: true
      });
    }

    console.log(`[API /analyze] Starting fresh match analysis for ${moves.length} moves...`);
    const analysis = await analyzeGame({ moves, initialFen });

    const saved = saveGameToHistory({
      moves,
      initialFen,
      userColor,
      result,
      accuracy: analysis.accuracy,
      counts: analysis.counts,
      steps: analysis.steps
    });

    res.json({
      success: true,
      gameId: saved ? saved.id : null,
      ...analysis
    });
  } catch (err) {
    console.error('[API /analyze Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Position Evaluation (for Sandbox / Live Eval Bar)
app.post('/api/eval', async (req, res) => {
  try {
    const { fen, depth = 16 } = req.body;
    if (!fen) {
      return res.status(400).json({ error: 'FEN string is required' });
    }

    const evalResult = await stockfishEngine.evaluate({ fen, depth, multiPv: 1 });
    const turn = (fen && fen !== 'startpos') ? (fen.split(' ')[1] || 'w') : 'w';
    let normalizedScore = evalResult.primaryScore;
    if (turn === 'b' && normalizedScore) {
      normalizedScore = {
        type: normalizedScore.type,
        value: -normalizedScore.value
      };
    }

    res.json({
      success: true,
      ...evalResult,
      score: normalizedScore,
      primaryScore: normalizedScore
    });
  } catch (err) {
    console.error('[API /eval Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Game History
app.get('/api/history', (req, res) => {
  const history = getGameHistory();
  const summaries = history.map(g => ({
    id: g.id,
    date: g.date,
    userColor: g.userColor,
    result: g.result,
    moveCount: g.moves.length,
    accuracy: g.accuracy,
    counts: g.counts
  }));
  res.json({ success: true, history: summaries });
});

app.get('/api/history/:id', (req, res) => {
  const game = getGameById(req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json({ success: true, game });
});

// 6. AI Coach - Conversational Grandmaster Mentor
app.post('/api/coach/chat', async (req, res) => {
  try {
    const {
      messages = [],
      currentFen,
      moves = [],
      currentPly = 0,
      userColor = 'w',
      score = 0,
      bestMoveSan = '',
      tacticalFacts = null,
      apiKey = ''
    } = req.body;

    const result = await chatWithCoach({
      messages,
      currentFen,
      moves,
      currentPly,
      userColor,
      score,
      bestMoveSan,
      tacticalFacts,
      overrideKey: apiKey
    });

    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error('[API /coach/chat Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/coach/opening', (req, res) => {
  try {
    const { moves = [] } = req.body;
    const opening = identifyOpening(moves);
    res.json({ success: true, opening });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/coach/config', (req, res) => {
  try {
    const config = getCoachConfig();
    const maskedKey = config.geminiApiKey
      ? config.geminiApiKey.slice(0, 4) + '...' + config.geminiApiKey.slice(-4)
      : '';

    res.json({
      success: true,
      provider: config.provider,
      hasGeminiKey: !!config.geminiApiKey,
      maskedKey,
      ollamaUrl: config.ollamaUrl,
      ollamaModel: config.ollamaModel
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/coach/config', (req, res) => {
  try {
    const { geminiApiKey, provider, ollamaUrl, ollamaModel } = req.body;
    const updated = saveCoachConfig({
      ...(geminiApiKey !== undefined ? { geminiApiKey } : {}),
      ...(provider !== undefined ? { provider } : {}),
      ...(ollamaUrl !== undefined ? { ollamaUrl } : {}),
      ...(ollamaModel !== undefined ? { ollamaModel } : {})
    });
    res.json({ success: true, provider: updated.provider, hasGeminiKey: !!updated.geminiApiKey });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Update & Tool Health Check Endpoint
app.get('/api/updates/check', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const report = await getUpdateReport(force);
    res.json({ success: true, ...report });
  } catch (err) {
    console.error('[API /updates/check Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Create Desktop Shortcut Endpoint
app.post('/api/create-shortcut', (req, res) => {
  try {
    const desktop = path.join(process.env.USERPROFILE || process.env.HOME || '', 'Desktop');
    const shortcutPath = path.join(desktop, 'Apex Chess Trainer.lnk');
    const rootDir = path.resolve(__dirname, '..');
    const batPath = path.join(rootDir, 'run.bat');
    const icoPath = path.join(rootDir, 'app.ico');

    const lines = [
      '$WshShell = New-Object -ComObject WScript.Shell',
      `$s = $WshShell.CreateShortcut('${shortcutPath.replace(/'/g, "''")}')`,
      `$s.TargetPath = '${batPath.replace(/'/g, "''")}'`,
      `$s.WorkingDirectory = '${rootDir.replace(/'/g, "''")}'`,
      `$s.IconLocation = '${icoPath.replace(/'/g, "''")}, 0'`,
      `$s.Description = 'Apex Chess Trainer - Stockfish 19'`,
      `$s.WindowStyle = 1`,
      `$s.Save()`
    ];
    const script = lines.join('\n');
    const encoded = Buffer.from(script, 'utf16le').toString('base64');

    exec(`powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encoded}`, (err) => {
      if (err) {
        console.error('[Create Shortcut Error]:', err);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, path: shortcutPath });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/download-launcher', (req, res) => {
  const batPath = path.resolve(__dirname, '..', 'run.bat');
  res.download(batPath, 'Apex-Chess-Trainer.bat');
});

// Start engine and server
async function startServer() {
  try {
    await stockfishEngine.init();
    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(` CHESS TRAINER BACKEND RUNNING ON PORT ${PORT}`);
      console.log(` ENGINE: STOCKFISH 19 (LEVEL: MAXIMUM LOCKED)`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
