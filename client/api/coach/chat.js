export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      messages = [],
      currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      moves = [],
      currentPly = 0,
      userColor = 'w',
      score = 0,
      bestMoveSan = '',
      tacticalFacts = null,
      opening = null,
      apiKey: userApiKey = ''
    } = req.body || {};

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'No Gemini API key configured. Provide your free key in Settings or add GEMINI_API_KEY in Vercel environment variables.'
      });
    }

    const currentMoveText = moves.length > 0 && currentPly > 0 && currentPly <= moves.length
      ? `${Math.ceil(currentPly / 2)}${currentPly % 2 === 1 ? '.' : '...'} ${moves[currentPly - 1]}`
      : 'Starting position';

    const movesSummary = moves.slice(0, currentPly).join(' ') || 'None';
    const openingName = opening?.name || 'Standard Chess';
    const openingVariation = opening?.variation || 'Main Line';
    const openingEco = opening?.eco || 'A00';

    let systemPrompt = `You are the Apex Chess Coach, a friendly, insightful, and pedagogical Grandmaster mentor (Elo 2700+).
Your goal is to help your student deeply understand chess concepts, opening strategy, and tactical motifs rather than merely memorizing moves.

=== CURRENT BOARD REALITY (FACTUAL GROUNDING - ZERO HALLUCINATIONS) ===
* Current FEN: "${currentFen}"
* Moves Played So Far: "${movesSummary}"
* Current Ply: ${currentPly} (Move displayed: ${currentMoveText})
* User Playing As: ${userColor === 'w' ? 'White' : 'Black'}
* Detected Opening: ${openingName} (${openingVariation}) [ECO: ${openingEco}]
`;

    if (opening?.concepts) {
      systemPrompt += `* Opening Strategic Ideas:
  - White's Plan: ${opening.concepts.whitePlan || 'Control center and activate pieces.'}
  - Black's Plan: ${opening.concepts.blackPlan || 'Counter in center and fight for balance.'}
`;
      if (opening.concepts.keyMoves) {
        systemPrompt += `* Known Key Move Explanations in this Opening:
${Object.entries(opening.concepts.keyMoves)
  .map(([mv, exp]) => `  - ${mv}: ${exp}`)
  .join('\n')}
`;
      }
    }

    if (score !== undefined && score !== null) {
      systemPrompt += `* Engine Evaluation: ${score > 0 ? '+' : ''}${(score / 100).toFixed(2)} pawns from White's perspective\n`;
    }

    if (bestMoveSan) {
      systemPrompt += `* Stockfish Superhuman Recommendation: ${bestMoveSan}\n`;
    }

    if (tacticalFacts) {
      systemPrompt += `* Tactical Breakdown:
  - Played move motif: ${tacticalFacts.playedExplanation || 'None'}
  - Engine move benefit: ${tacticalFacts.bestExplanation || 'None'}
`;
    }

    systemPrompt += `
=== COACHING GUIDELINES ===
1. Be natural, articulate, encouraging, and human. Speak as a passionate Grandmaster sitting across the chessboard.
2. Explain the strategic "why": the battle for central control, pawn levers, piece activity, prophylactic defense, or tactical traps.
3. If the user asks about an opening move (e.g. "Why is a6 played in the Ruy Lopez?"), explain the structural dilemma it poses to the opponent and the long-term plan.
4. Format moves cleanly in backticks (e.g., \`3... a6\`, \`4. Ba4\`, \`e4\`, \`d4\`).
5. Keep answers focused, engaging, and clear (2 to 4 crisp paragraphs or clean bullet points). Never dump raw algebraic coordinate spam without human explanation.
`;

    // Map conversation messages to Gemini format
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Please assess the current position and share your grandmaster thoughts.' }]
      });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1000
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[Vercel Coach] Gemini API error:', geminiRes.status, errText);
      return res.status(geminiRes.status).json({
        error: `Gemini API returned ${geminiRes.status}`,
        details: errText
      });
    }

    const geminiData = await geminiRes.json();
    const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    return res.status(200).json({
      reply,
      provider: 'gemini',
      opening
    });
  } catch (err) {
    console.error('[Vercel Coach] Internal error:', err);
    return res.status(500).json({ error: err.message });
  }
}
