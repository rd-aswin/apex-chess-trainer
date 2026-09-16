import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import { stockfishEngine } from './engine.js';
import { analyzeGame } from './analyzer.js';
import { getGameHistory, saveGameToHistory, getGameById, findGameByMoves } from './history.js';
import { identifyOpening } from './openingBook.js';
import { chatWithCoach, getCoachConfig, saveCoachConfig } from './aiCoach.js';
import { getUpdateReport } from './updater.js';
import { fetchChessComGames, fetchLichessGames, sanitizePgn } from './importer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
};

app.use(cors());
app.use(express.json());

// 0. Platform Health-Check & Root Landing
app.get('/', (req, res) => {
  res.json({
    service: 'Apex Chess Trainer API',
    status: 'online',
    engine: stockfishEngine.ready ? 'ready' : 'initializing',
    level: 'Stockfish 19 NNUE (Level 20 Locked)'
  });
});

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
    const analysis = await analyzeGame({
      moves,
      initialFen,
      onProgress: (p) => {
        if (p.current % 5 === 0 || p.current === p.total) {
          console.log(`[Analyzer] Position ${p.current}/${p.total} (${p.percent}%) evaluated - ${p.moveSan || 'start'}`);
        }
      }
    });

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

// 3b. Real-Time Streaming Game Analysis (SSE)
app.post('/api/analyze-stream', async (req, res) => {
  try {
    const { moves = [], initialFen, userColor = 'w', result = '1-0' } = req.body;
    console.log(`[API /analyze-stream] Stream request for ${moves.length} moves...`);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Check cached game
    const cachedGame = findGameByMoves(moves);
    if (cachedGame && cachedGame.steps && cachedGame.steps.length > 0) {
      console.log(`[API /analyze-stream] Serving cached analysis for game ${cachedGame.id}`);
      res.write(`data: ${JSON.stringify({
        type: 'complete',
        data: {
          success: true,
          gameId: cachedGame.id,
          accuracy: cachedGame.accuracy,
          counts: cachedGame.counts,
          steps: cachedGame.steps,
          fromCache: true
        }
      })}\n\n`);
      return res.end();
    }

    const analysis = await analyzeGame({
      moves,
      initialFen,
      onProgress: (progress) => {
        if (progress.current % 5 === 0 || progress.current === progress.total) {
          console.log(`[Analyzer Stream] Position ${progress.current}/${progress.total} (${progress.percent}%) - ${progress.moveSan || 'start'}`);
        }
        res.write(`data: ${JSON.stringify({ type: 'progress', ...progress })}\n\n`);
      }
    });

    const saved = saveGameToHistory({
      moves,
      initialFen,
      userColor,
      result,
      accuracy: analysis.accuracy,
      counts: analysis.counts,
      steps: analysis.steps
    });

    res.write(`data: ${JSON.stringify({
      type: 'complete',
      data: {
        success: true,
        gameId: saved ? saved.id : null,
        ...analysis
      }
    })}\n\n`);
    res.end();
  } catch (err) {
    console.error('[API /analyze-stream Error]:', err);
    res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
    res.end();
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

// 10. Game Import APIs (Chess.com, Lichess, PGN Sanitizer)
app.get('/api/import/chesscom', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ error: 'Valid username query parameter is required' });
    }
    const data = await fetchChessComGames(username);
    res.json(data);
  } catch (err) {
    console.error('[API /import/chesscom Error]:', err.message);
    const status = err.message.includes('not found') ? 404 : (err.message.includes('rate limit') ? 429 : 500);
    res.status(status).json({ error: err.message });
  }
});

app.get('/api/import/lichess', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ error: 'Valid username query parameter is required' });
    }
    const data = await fetchLichessGames(username);
    res.json(data);
  } catch (err) {
    console.error('[API /import/lichess Error]:', err.message);
    const status = err.message.includes('not found') ? 404 : (err.message.includes('rate limit') ? 429 : 500);
    res.status(status).json({ error: err.message });
  }
});

app.post('/api/import/sanitize-pgn', (req, res) => {
  const { pgn } = req.body;
  if (!pgn) return res.status(400).json({ error: 'PGN string is required' });
  res.json({ pgn: sanitizePgn(pgn) });
});

app.get('/api/download-launcher', (req, res) => {
  const batPath = path.resolve(__dirname, '..', 'run.bat');
  res.download(batPath, 'Apex-Chess-Trainer.bat');
});

// ==========================================
// RAZORPAY STANDARD WEB CHECKOUT INTEGRATION
// ==========================================

// 1. Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    // Validate amount >= 100 paise (minimum ₹1.00)
    if (amount === undefined || typeof amount !== 'number' || amount < 100) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required and must be at least 100 paise (₹1.00)'
      });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return res.status(401).json({
        success: false,
        error: 'Razorpay authentication failed: missing credentials on server'
      });
    }

    const razorpay = getRazorpayInstance();
    const orderReceipt = receipt ? String(receipt) : `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: (currency || 'INR').toUpperCase(),
      receipt: orderReceipt
    });

    console.log(`[Razorpay Order Created]: ID=${order.id}, Amount=${order.amount} ${order.currency}`);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error('[Razorpay Create Order Error]:', err);
    const statusCode = err.statusCode || (err.error?.code === 'BAD_REQUEST_ERROR' ? 400 : 500);
    return res.status(statusCode).json({
      success: false,
      error: err.error?.description || err.message || 'Failed to create Razorpay order'
    });
  }
});

// 2. Verify Razorpay Payment Signature
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Missing fields validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are all required'
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return res.status(401).json({
        success: false,
        error: 'Razorpay key secret not configured on server'
      });
    }

    // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log(`[Razorpay Payment Verified]: Payment ${razorpay_payment_id} for Order ${razorpay_order_id}`);
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      });
    } else {
      console.warn(`[Razorpay Verification Mismatch]: Order ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        error: 'Signature verification failed: payment signature does not match'
      });
    }
  } catch (err) {
    console.error('[Razorpay Verify Payment Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Error verifying payment signature'
    });
  }
});

// Start engine and server
async function startServer() {
  try {
    await stockfishEngine.init();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=================================================`);
      console.log(` CHESS TRAINER BACKEND RUNNING ON 0.0.0.0:${PORT}`);
      console.log(` ENGINE: STOCKFISH 19 (LEVEL: MAXIMUM LOCKED)`);
      console.log(`=================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
