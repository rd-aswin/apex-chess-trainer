import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STOCKFISH_PATH = process.env.STOCKFISH_PATH || (
  process.platform === 'win32'
    ? path.resolve(__dirname, '..', 'bin', 'stockfish.exe')
    : '/usr/bin/stockfish'
);

export class StockfishEngine {
  constructor() {
    this.process = null;
    this.ready = false;
    this.queue = [];
    this.currentTask = null;
    this.outputBuffer = '';
    this.threads = Math.min(8, Math.max(1, os.cpus().length || 2));
    this.hash = 256;
    this.skillLevel = 20; // MAXIMUM LEVEL LOCKED
  }

  async init() {
    return new Promise((resolve, reject) => {
      try {
        console.log(`[Stockfish] Spawning binary at ${STOCKFISH_PATH}`);
        this.process = spawn(STOCKFISH_PATH, [], {
          windowsHide: true,
          stdio: ['pipe', 'pipe', 'pipe']
        });

        this.process.stdout.on('data', (data) => {
          this.handleOutput(data.toString());
        });

        this.process.stderr.on('data', (data) => {
          console.error(`[Stockfish stderr] ${data.toString()}`);
        });

        this.process.on('close', (code) => {
          console.warn(`[Stockfish] Process exited with code ${code}`);
          this.ready = false;
        });

        // Initialize UCI
        this.sendCommand('uci');
        this.sendCommand(`setoption name Threads value ${this.threads}`);
        this.sendCommand(`setoption name Hash value ${this.hash}`);
        this.sendCommand(`setoption name Skill Level value ${this.skillLevel}`);
        this.sendCommand('isready');

        const readyListener = (data) => {
          const text = data.toString();
          if (text.includes('readyok')) {
            this.ready = true;
            console.log(`[Stockfish 19] Initialized at MAXIMUM LEVEL (Skill 20, ${this.threads} Threads, ${this.hash}MB Hash)`);
            this.process.stdout.removeListener('data', readyListener);
            resolve(true);
          }
        };

        this.process.stdout.on('data', readyListener);

        setTimeout(() => {
          if (!this.ready) {
            reject(new Error('Stockfish initialization timed out'));
          }
        }, 10000);

      } catch (err) {
        console.error('[Stockfish] Initialization error:', err);
        reject(err);
      }
    });
  }

  sendCommand(cmd) {
    if (this.process && this.process.stdin.writable) {
      this.process.stdin.write(cmd + '\n');
    }
  }

  handleOutput(chunk) {
    this.outputBuffer += chunk;
    const lines = this.outputBuffer.split(/\r?\n/);
    this.outputBuffer = lines.pop(); // Keep partial line in buffer

    for (const line of lines) {
      if (!line.trim()) continue;
      if (this.currentTask) {
        this.currentTask.onLine(line);
      }
    }
  }

  enqueue(taskFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ taskFn, resolve, reject });
      this.processQueue();
    });
  }

  processQueue() {
    if (this.currentTask || this.queue.length === 0) return;

    const { taskFn, resolve, reject } = this.queue.shift();
    this.currentTask = taskFn((result) => {
      this.currentTask = null;
      resolve(result);
      this.processQueue();
    }, (error) => {
      this.currentTask = null;
      reject(error);
      this.processQueue();
    });
  }

  getMove({ fen, moves = [], depth = 22, movetime = 2000 }) {
    return this.enqueue((done, fail) => {
      let positionCmd = 'position ';
      if (fen && fen !== 'startpos') {
        positionCmd += `fen ${fen}`;
      } else {
        positionCmd += 'startpos';
      }

      if (moves && moves.length > 0) {
        positionCmd += ` moves ${moves.join(' ')}`;
      }

      let bestMove = null;
      let currentScore = null;
      let currentDepth = 0;
      let pv = [];

      const timeout = setTimeout(() => {
        this.sendCommand('stop');
      }, movetime + 5000);

      this.sendCommand(positionCmd);
      this.sendCommand(`go depth ${depth} movetime ${movetime}`);

      return {
        onLine: (line) => {
          if (line.startsWith('info ') && line.includes(' score ')) {
            const depthMatch = line.match(/depth\s+(\d+)/);
            if (depthMatch) currentDepth = parseInt(depthMatch[1], 10);

            const cpMatch = line.match(/score cp (-?\d+)/);
            const mateMatch = line.match(/score mate (-?\d+)/);
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
            const parts = line.split(' ');
            bestMove = parts[1];
            done({
              bestMove,
              ponder: parts[3] || null,
              score: currentScore,
              depth: currentDepth,
              pv
            });
          }
        }
      };
    });
  }

  evaluate({ fen, depth = 16, multiPv = 1 }) {
    return this.enqueue((done, fail) => {
      this.sendCommand(`setoption name MultiPV value ${multiPv}`);
      this.sendCommand(`position fen ${fen}`);
      this.sendCommand(`go depth ${depth}`);

      const variations = [];
      let finalBestMove = null;

      return {
        onLine: (line) => {
          if (line.startsWith('info ') && line.includes(' score ')) {
            const pvNumMatch = line.match(/multipv\s+(\d+)/);
            const pvNum = pvNumMatch ? parseInt(pvNumMatch[1], 10) : 1;

            const depthMatch = line.match(/depth\s+(\d+)/);
            const cpMatch = line.match(/score cp (-?\d+)/);
            const mateMatch = line.match(/score mate (-?\d+)/);

            let score = null;
            if (cpMatch) {
              score = { type: 'cp', value: parseInt(cpMatch[1], 10) };
            } else if (mateMatch) {
              score = { type: 'mate', value: parseInt(mateMatch[1], 10) };
            }

            const pvIndex = line.indexOf(' pv ');
            const pv = pvIndex !== -1 ? line.substring(pvIndex + 4).trim().split(/\s+/) : [];

            variations[pvNum - 1] = {
              depth: depthMatch ? parseInt(depthMatch[1], 10) : depth,
              score,
              pv
            };
          }

          if (line.startsWith('bestmove ')) {
            finalBestMove = line.split(' ')[1];
            this.sendCommand('setoption name MultiPV value 1');

            done({
              fen,
              bestMove: finalBestMove,
              variations: variations.filter(Boolean),
              primaryScore: variations[0]?.score || { type: 'cp', value: 0 },
              primaryPv: variations[0]?.pv || []
            });
          }
        }
      };
    });
  }
}

export const stockfishEngine = new StockfishEngine();
