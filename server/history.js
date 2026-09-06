import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function deduplicateHistory(history) {
  const seen = new Set();
  const unique = [];
  for (const game of history) {
    const key = Array.isArray(game.moves) ? game.moves.join(',') : '';
    if (key && !seen.has(key)) {
      seen.add(key);
      unique.push(game);
    }
  }
  return unique;
}

export function getGameHistory() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? deduplicateHistory(parsed) : [];
  } catch (err) {
    console.error('Error reading history file:', err);
    return [];
  }
}

export function findGameByMoves(moves) {
  if (!moves || moves.length === 0) return null;
  const history = getGameHistory();
  const targetKey = moves.join(',');
  return history.find(g => Array.isArray(g.moves) && g.moves.join(',') === targetKey) || null;
}

export function saveGameToHistory(gameData) {
  ensureDataDir();
  try {
    let history = getGameHistory();
    const movesKey = (gameData.moves || []).join(',');

    // Check if game with identical move sequence already exists
    const existingIndex = history.findIndex(
      g => Array.isArray(g.moves) && g.moves.join(',') === movesKey
    );

    if (existingIndex !== -1) {
      // Update existing record without creating a duplicate
      history[existingIndex] = {
        ...history[existingIndex],
        ...gameData,
        date: history[existingIndex].date // Preserve original match timestamp
      };
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
      return history[existingIndex];
    }

    const entry = {
      id: 'game_' + Date.now(),
      date: new Date().toISOString(),
      ...gameData
    };

    history.unshift(entry);
    if (history.length > 50) {
      history.length = 50;
    }

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
    return entry;
  } catch (err) {
    console.error('Error saving game history:', err);
    return null;
  }
}

export function getGameById(id) {
  const history = getGameHistory();
  return history.find(g => g.id === id) || null;
}
