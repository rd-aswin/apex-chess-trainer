/**
 * Online Game Importer & PGN Normalizer
 * Fetches recent standard games from Chess.com and Lichess public APIs.
 */

const USER_AGENT = 'ApexChessTrainer/1.0 (https://github.com/rd-aswin/apex-chess-trainer; personal-training)';

// Simple in-memory cache with 2-minute TTL to respect upstream rate limits
const cache = new Map();
const CACHE_TTL_MS = 2 * 60 * 1000;

function getCached(key) {
  const item = cache.get(key);
  if (item && (Date.now() - item.timestamp < CACHE_TTL_MS)) {
    return item.data;
  }
  return null;
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
  // Clean up old entries if cache grows too large
  if (cache.size > 50) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

/**
 * Fetch recent standard games for a Chess.com player
 */
export async function fetchChessComGames(username) {
  const cleanUsername = username.trim().toLowerCase();
  const cacheKey = `chesscom:${cleanUsername}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // 1. Fetch archives list
  const archivesUrl = `https://api.chess.com/pub/player/${encodeURIComponent(cleanUsername)}/games/archives`;
  const archivesRes = await fetch(archivesUrl, {
    headers: { 'User-Agent': USER_AGENT }
  });

  if (archivesRes.status === 404) {
    throw new Error(`Chess.com user "${username}" was not found.`);
  }
  if (!archivesRes.ok) {
    if (archivesRes.status === 429) {
      throw new Error('Chess.com rate limit reached. Please wait a minute and try again.');
    }
    throw new Error(`Chess.com API responded with status ${archivesRes.status}`);
  }

  const archivesData = await archivesRes.json();
  const archives = archivesData.archives || [];

  if (archives.length === 0) {
    const emptyResult = { username: cleanUsername, platform: 'chess.com', games: [] };
    setCached(cacheKey, emptyResult);
    return emptyResult;
  }

  // 2. Fetch the latest month archive
  const latestMonthUrl = archives[archives.length - 1];
  const gamesRes = await fetch(latestMonthUrl, {
    headers: { 'User-Agent': USER_AGENT }
  });

  if (!gamesRes.ok) {
    throw new Error(`Failed to retrieve games from ${latestMonthUrl}`);
  }

  const gamesData = await gamesRes.json();
  let rawGames = gamesData.games || [];

  // If latest month has fewer than 10 games and there's a previous month, fetch it too
  if (rawGames.length < 10 && archives.length > 1) {
    try {
      const prevMonthUrl = archives[archives.length - 2];
      const prevRes = await fetch(prevMonthUrl, { headers: { 'User-Agent': USER_AGENT } });
      if (prevRes.ok) {
        const prevData = await prevRes.json();
        rawGames = [...(prevData.games || []), ...rawGames];
      }
    } catch {
      // Ignore fallback error, use what we have
    }
  }

  // 3. Filter for standard chess (rules === 'chess') and minimum 4 plies
  const validGames = rawGames
    .filter(g => g.rules === 'chess' && g.pgn && g.pgn.length > 50)
    .map(g => {
      const isWhite = g.white.username.toLowerCase() === cleanUsername;
      const playerResult = isWhite ? g.white.result : g.black.result;
      const userWon = playerResult === 'win';
      const userLost = ['resigned', 'checkmated', 'timeout', 'abandoned'].includes(playerResult);

      return {
        id: g.url ? g.url.split('/').pop() : Math.random().toString(36).slice(2),
        platform: 'Chess.com',
        url: g.url,
        white: {
          username: g.white.username,
          rating: g.white.rating ?? '?',
          result: g.white.result
        },
        black: {
          username: g.black.username,
          rating: g.black.rating ?? '?',
          result: g.black.result
        },
        userColor: isWhite ? 'white' : 'black',
        userOutcome: userWon ? 'win' : (userLost ? 'loss' : 'draw'),
        timeClass: g.time_class || 'blitz',
        timeControl: formatTimeControl(g.time_control),
        endTime: g.end_time,
        date: new Date(g.end_time * 1000).toLocaleDateString(),
        fen: g.fen,
        pgn: g.pgn
      };
    })
    .reverse() // Most recent first
    .slice(0, 15);

  const result = {
    username: cleanUsername,
    platform: 'Chess.com',
    games: validGames
  };

  setCached(cacheKey, result);
  return result;
}

/**
 * Fetch recent standard games for a Lichess player
 */
export async function fetchLichessGames(username) {
  const cleanUsername = username.trim().toLowerCase();
  const cacheKey = `lichess:${cleanUsername}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Fetch up to 25 games so filtering for standard variant yields recent matches
  const url = `https://lichess.org/api/games/user/${encodeURIComponent(cleanUsername)}?max=25&pgnInJson=true&clocks=true`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/x-ndjson'
    }
  });

  if (res.status === 404) {
    throw new Error(`Lichess user "${username}" was not found.`);
  }
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('Lichess rate limit reached. Please wait a minute and try again.');
    }
    throw new Error(`Lichess API responded with status ${res.status}`);
  }

  const text = await res.text();
  const lines = text.trim().split('\n').filter(Boolean);

  const validGames = [];

  for (const line of lines) {
    try {
      const g = JSON.parse(line);
      // Filter strictly for standard chess variant
      if (g.variant !== 'standard' || !g.pgn) continue;

      const whiteUser = g.players?.white?.user?.name || 'Anonymous';
      const blackUser = g.players?.black?.user?.name || 'Anonymous';
      const isWhite = whiteUser.toLowerCase() === cleanUsername;
      
      let userOutcome = 'draw';
      if (g.winner === 'white') {
        userOutcome = isWhite ? 'win' : 'loss';
      } else if (g.winner === 'black') {
        userOutcome = !isWhite ? 'win' : 'loss';
      }

      validGames.push({
        id: g.id,
        platform: 'Lichess',
        url: `https://lichess.org/${g.id}`,
        white: {
          username: whiteUser,
          rating: g.players?.white?.rating ?? '?',
          result: g.winner === 'white' ? 'win' : (g.status === 'draw' ? 'draw' : 'loss')
        },
        black: {
          username: blackUser,
          rating: g.players?.black?.rating ?? '?',
          result: g.winner === 'black' ? 'win' : (g.status === 'draw' ? 'draw' : 'loss')
        },
        userColor: isWhite ? 'white' : 'black',
        userOutcome,
        timeClass: g.speed || 'blitz',
        timeControl: g.clock ? `${Math.round(g.clock.initial / 60)}+${g.clock.increment}` : (g.speed || 'rapid'),
        endTime: Math.floor(g.lastMoveAt / 1000),
        date: new Date(g.createdAt).toLocaleDateString(),
        fen: g.lastFen,
        pgn: g.pgn
      });
    } catch {
      // Ignore malformed line
    }
  }

  const result = {
    username: cleanUsername,
    platform: 'Lichess',
    games: validGames
  };

  setCached(cacheKey, result);
  return result;
}

/**
 * Format Chess.com time control into human-readable string
 */
function formatTimeControl(tc) {
  if (!tc) return 'Standard';
  if (tc.includes('/')) {
    const days = Math.round(parseInt(tc.split('/')[1]) / 86400);
    return `${days}d / move`;
  }
  if (tc.includes('+')) {
    const [base, inc] = tc.split('+');
    return `${Math.round(parseInt(base) / 60)}+${inc}`;
  }
  const secs = parseInt(tc);
  if (!isNaN(secs)) {
    return `${Math.round(secs / 60)} min`;
  }
  return tc;
}

/**
 * Sanitize PGN for safe consumption by chess.js
 */
export function sanitizePgn(rawPgn) {
  if (!rawPgn || typeof rawPgn !== 'string') return '';
  return rawPgn
    .replace(/\r\n/g, '\n')
    // Remove recursive sub-variations that could break Peggy parser on unclosed parens
    .replace(/\([^\(\)]*\)/g, '')
    // Collapse excess whitespace
    .replace(/[ \t]+/g, ' ')
    .trim();
}
