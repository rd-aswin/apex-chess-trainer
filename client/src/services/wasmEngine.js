/**
 * wasmEngine.js — High-Performance Client-Side Stockfish WASM Engine
 *
 * Runs Stockfish inside a dedicated browser Web Worker via WebAssembly.
 * Provides 0ms network latency for engine moves, evaluations, and game reviews.
 */

class WasmEngineService {
  constructor() {
    this.worker = null;
    this.isReady = false;
    this.initPromise = null;
    this.currentTask = null;
    this.taskQueue = [];
    this.initListeners = [];
    this.isSupported = typeof window !== 'undefined' && typeof window.Worker === 'function';
    this.useWasm = typeof WebAssembly === 'object' && typeof WebAssembly.validate === 'function';
  }

  /**
   * Initialize the Web Worker and configure UCI Skill Level 20.
   */
  async init() {
    if (this.isReady) return true;
    if (this.initPromise) return this.initPromise;

    if (!this.isSupported) {
      console.warn('[WasmEngine] Web Workers not supported in this browser environment.');
      return false;
    }

    this.initPromise = new Promise((resolve) => {
      try {
        const workerScript = this.useWasm ? '/stockfish.wasm.js' : '/stockfish.js';
        console.log(`[WasmEngine] Initializing engine with ${workerScript} (WASM supported: ${this.useWasm})...`);

        this.worker = new Worker(workerScript);

        this.worker.onmessage = (event) => {
          const line = typeof event.data === 'string' ? event.data.trim() : '';
          if (!line) return;

          // Dispatch to init listeners
          for (const listener of [...this.initListeners]) {
            listener(line);
          }

          // Dispatch to active computation task
          if (this.currentTask && this.currentTask.onLine) {
            this.currentTask.onLine(line);
          }
        };

        this.worker.onerror = (err) => {
          console.error('[WasmEngine] Worker error:', err);
          if (this.useWasm) {
            console.warn('[WasmEngine] WASM loader failed. Attempting pure JS fallback /stockfish.js...');
            this.useWasm = false;
            try {
              if (this.worker) this.worker.terminate();
              this.worker = new Worker('/stockfish.js');
              this.worker.onmessage = (e) => {
                const line = typeof e.data === 'string' ? e.data.trim() : '';
                if (!line) return;
                for (const l of [...this.initListeners]) l(line);
                if (this.currentTask && this.currentTask.onLine) this.currentTask.onLine(line);
              };
              this.worker.postMessage('uci');
            } catch (fallbackErr) {
              console.error('[WasmEngine] Fallback worker failed:', fallbackErr);
            }
          }
        };

        const onInitLine = (line) => {
          if (line === 'uciok') {
            this.worker.postMessage('setoption name Skill Level value 20');
            this.worker.postMessage('isready');
          } else if (line === 'readyok') {
            this.isReady = true;
            this._removeInitListener(onInitLine);
            console.log('[WasmEngine] Stockfish WASM is ready and running client-side (Level 20).');
            resolve(true);
          }
        };
        this._addInitListener(onInitLine);

        // Send UCI handshake
        this.worker.postMessage('uci');

        // 6-second timeout fallback
        setTimeout(() => {
          if (!this.isReady) {
            console.warn('[WasmEngine] Initialization timed out after 6s.');
            this._removeInitListener(onInitLine);
            resolve(false);
          }
        }, 6000);
      } catch (err) {
        console.error('[WasmEngine] Failed to spawn worker:', err);
        resolve(false);
      }
    });

    return this.initPromise;
  }

  _addInitListener(fn) {
    this.initListeners.push(fn);
  }

  _removeInitListener(fn) {
    this.initListeners = this.initListeners.filter((l) => l !== fn);
  }

  _enqueueTask(taskFn) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ taskFn, resolve, reject });
      this._processQueue();
    });
  }

  _processQueue() {
    if (this.currentTask || this.taskQueue.length === 0) return;

    const { taskFn, resolve, reject } = this.taskQueue.shift();
    this.currentTask = taskFn(
      (result) => {
        this.currentTask = null;
        resolve(result);
        this._processQueue();
      },
      (error) => {
        this.currentTask = null;
        reject(error);
        this._processQueue();
      }
    );
  }

  /**
   * Calculate best move for a given position.
   * @param {Object} options
   * @param {string} options.fen FEN string
   * @param {number} options.depth Search depth (default 12 for instant 50-150ms response)
   * @param {number} options.movetime Maximum calculation time in ms (default 1500ms)
   * @returns {Promise<Object>} { success, bestMove, ponder, score, depth, pv, engine }
   */
  async getBestMove({ fen = 'startpos', depth = 12, movetime = 1500 }) {
    const ready = await this.init();
    if (!ready || !this.worker) {
      throw new Error('Stockfish WASM engine is not available in this browser');
    }

    return this._enqueueTask((done, fail) => {
      let positionCmd = 'position ';
      if (fen && fen !== 'startpos') {
        positionCmd += `fen ${fen}`;
      } else {
        positionCmd += 'startpos';
      }

      let bestMove = null;
      let currentScore = { type: 'cp', value: 0 };
      let currentDepth = 0;
      let pv = [];

      const timeout = setTimeout(() => {
        if (this.worker) {
          try {
            this.worker.postMessage('stop');
          } catch (e) {}
        }
      }, movetime + 2000);

      const onLine = (line) => {
        if (line.startsWith('info ') && line.includes(' score ')) {
          const depthMatch = line.match(/\bdepth\s+(\d+)\b/);
          if (depthMatch) currentDepth = parseInt(depthMatch[1], 10);

          const cpMatch = line.match(/\bscore cp (-?\d+)\b/);
          const mateMatch = line.match(/\bscore mate (-?\d+)\b/);
          if (cpMatch) {
            currentScore = { type: 'cp', value: parseInt(cpMatch[1], 10) };
          } else if (mateMatch) {
            currentScore = { type: 'mate', value: parseInt(mateMatch[1], 10) };
          }

          const pvIndex = line.indexOf(' pv ');
          if (pvIndex !== -1) {
            pv = line.substring(pvIndex + 4).trim().split(/\s+/);
          }
        }

        if (line.startsWith('bestmove ')) {
          clearTimeout(timeout);
          const parts = line.split(/\s+/);
          bestMove = parts[1];
          const ponder = parts[3] || null;

          // Normalize score to White's perspective (+ = White, - = Black)
          const turn = fen && fen !== 'startpos' ? (fen.split(' ')[1] || 'w') : 'w';
          let normalizedScore = currentScore;
          if (turn === 'b' && currentScore) {
            normalizedScore = {
              type: currentScore.type,
              value: -currentScore.value
            };
          }

          done({
            success: true,
            bestMove,
            ponder,
            score: normalizedScore,
            rawScore: currentScore,
            depth: currentDepth,
            pv,
            engine: 'Stockfish WASM (Local Client)'
          });
        }
      };

      try {
        this.worker.postMessage(positionCmd);
        this.worker.postMessage(`go depth ${depth} movetime ${movetime}`);
      } catch (err) {
        clearTimeout(timeout);
        fail(err);
      }

      return { onLine };
    });
  }

  /**
   * Evaluate a position without making a move.
   */
  async evaluatePosition({ fen, depth = 12 }) {
    return this.getBestMove({ fen, depth, movetime: 1200 });
  }

  /**
   * Stop current calculation.
   */
  stop() {
    if (this.worker) {
      try {
        this.worker.postMessage('stop');
      } catch (e) {}
    }
  }

  /**
   * Terminate the worker instance.
   */
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
      this.initPromise = null;
    }
  }
}

export const wasmEngine = new WasmEngineService();
