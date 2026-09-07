const USER_AGENT = 'ApexChessTrainer/1.0 (https://github.com/rd-aswin/apex-chess-trainer; personal-training)';

function formatTimeControl(tc) {
  if (!tc) return 'Standard';
  if (tc.includes('+')) return `${tc}s`;
  const secs = parseInt(tc, 10);
  if (isNaN(secs)) return tc;
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  return remSecs > 0 ? `${mins}m ${remSecs}s` : `${mins} min`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const username = req.query?.username || req.body?.username;
  if (!username) {
    return res.status(400).json({ error: 'Username parameter is required' });
  }

  const cleanUsername = username.trim().toLowerCase();

  try {
    const url = `https://lichess.org/api/games/user/${encodeURIComponent(cleanUsername)}?max=25&pgnInJson=true&clocks=true`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/x-ndjson'
      }
    });

    if (response.status === 404) {
      return res.status(404).json({ error: `Lichess user "${username}" was not found.` });
    }
    if (!response.ok) {
      return res.status(response.status).json({ error: `Lichess API responded with ${response.status}` });
    }

    const text = await response.text();
    const lines = text.trim().split('\n').filter(l => l.trim().length > 0);

    const validGames = [];
    for (const line of lines) {
      try {
        const g = JSON.parse(line);
        if (g.variant !== 'standard') continue;
        if (!g.pgn || g.pgn.length < 50) continue;

        const isWhite = g.players?.white?.user?.name?.toLowerCase() === cleanUsername;
        const winner = g.winner;
        let userOutcome = 'draw';
        if (winner) {
          userOutcome = (winner === 'white' && isWhite) || (winner === 'black' && !isWhite) ? 'win' : 'loss';
        }

        validGames.push({
          id: g.id,
          platform: 'Lichess',
          url: `https://lichess.org/${g.id}`,
          white: {
            username: g.players?.white?.user?.name || 'Anonymous',
            rating: g.players?.white?.rating ?? '?',
            result: winner === 'white' ? 'win' : (winner === 'black' ? 'loss' : 'draw')
          },
          black: {
            username: g.players?.black?.user?.name || 'Anonymous',
            rating: g.players?.black?.rating ?? '?',
            result: winner === 'black' ? 'win' : (winner === 'white' ? 'loss' : 'draw')
          },
          userColor: isWhite ? 'white' : 'black',
          userOutcome,
          timeClass: g.speed || 'blitz',
          timeControl: formatTimeControl(g.clock ? `${g.clock.initial}+${g.clock.increment}` : null),
          endTime: Math.floor(g.lastMoveAt / 1000),
          date: new Date(g.createdAt || Date.now()).toLocaleDateString(),
          fen: null,
          pgn: g.pgn
        });

        if (validGames.length >= 15) break;
      } catch (err) {}
    }

    return res.status(200).json({
      username: cleanUsername,
      platform: 'Lichess',
      games: validGames
    });
  } catch (err) {
    console.error('[Lichess Import] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
