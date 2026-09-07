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
    const archivesUrl = `https://api.chess.com/pub/player/${encodeURIComponent(cleanUsername)}/games/archives`;
    const archivesRes = await fetch(archivesUrl, {
      headers: { 'User-Agent': USER_AGENT }
    });

    if (archivesRes.status === 404) {
      return res.status(404).json({ error: `Chess.com user "${username}" was not found.` });
    }
    if (!archivesRes.ok) {
      return res.status(archivesRes.status).json({ error: `Chess.com API responded with ${archivesRes.status}` });
    }

    const archivesData = await archivesRes.json();
    const archives = archivesData.archives || [];

    if (archives.length === 0) {
      return res.status(200).json({ username: cleanUsername, platform: 'Chess.com', games: [] });
    }

    const latestMonthUrl = archives[archives.length - 1];
    const gamesRes = await fetch(latestMonthUrl, {
      headers: { 'User-Agent': USER_AGENT }
    });

    if (!gamesRes.ok) {
      return res.status(502).json({ error: `Failed to retrieve games from ${latestMonthUrl}` });
    }

    const gamesData = await gamesRes.json();
    let rawGames = gamesData.games || [];

    if (rawGames.length < 10 && archives.length > 1) {
      try {
        const prevMonthUrl = archives[archives.length - 2];
        const prevRes = await fetch(prevMonthUrl, { headers: { 'User-Agent': USER_AGENT } });
        if (prevRes.ok) {
          const prevData = await prevRes.json();
          rawGames = [...(prevData.games || []), ...rawGames];
        }
      } catch (e) {}
    }

    const validGames = rawGames
      .filter(g => g.rules === 'chess' && g.pgn && g.pgn.length > 50)
      .map(g => {
        const isWhite = g.white?.username?.toLowerCase() === cleanUsername;
        const playerResult = isWhite ? g.white?.result : g.black?.result;
        const userWon = playerResult === 'win';
        const userLost = ['resigned', 'checkmated', 'timeout', 'abandoned'].includes(playerResult);

        return {
          id: g.url ? g.url.split('/').pop() : Math.random().toString(36).slice(2),
          platform: 'Chess.com',
          url: g.url,
          white: {
            username: g.white?.username || 'Unknown',
            rating: g.white?.rating ?? '?',
            result: g.white?.result
          },
          black: {
            username: g.black?.username || 'Unknown',
            rating: g.black?.rating ?? '?',
            result: g.black?.result
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
      .reverse()
      .slice(0, 15);

    return res.status(200).json({
      username: cleanUsername,
      platform: 'Chess.com',
      games: validGames
    });
  } catch (err) {
    console.error('[Chess.com Import] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
