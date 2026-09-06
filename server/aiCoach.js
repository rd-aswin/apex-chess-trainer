import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { identifyOpening } from './openingBook.js';
import { explainMistake } from './explainer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_FILE = path.resolve(__dirname, '..', 'data', 'coach-config.json');

/**
 * Load Coach Configuration (API key, preferred provider, Ollama settings)
 */
export function getCoachConfig() {
  let config = {
    provider: 'gemini', // 'gemini' | 'ollama' | 'builtin'
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama3.2:3b'
  };

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      config = { ...config, ...data };
    }
  } catch (err) {
    console.error('[AI Coach] Failed to read coach-config.json:', err.message);
  }

  return config;
}

/**
 * Save Coach Configuration
 */
export function saveCoachConfig(newConfig) {
  try {
    const dataDir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const current = getCoachConfig();
    const updated = { ...current, ...newConfig };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf8');
    return updated;
  } catch (err) {
    console.error('[AI Coach] Failed to write coach-config.json:', err.message);
    throw err;
  }
}

/**
 * Build Grounded System Instructions
 */
function buildSystemPrompt({
  openingInfo,
  currentFen,
  moves,
  currentPly,
  userColor,
  score,
  bestMoveSan,
  tacticalFacts
}) {
  const currentMoveText = moves.length > 0 && currentPly > 0 && currentPly <= moves.length
    ? `${Math.ceil(currentPly / 2)}${currentPly % 2 === 1 ? '.' : '...'} ${moves[currentPly - 1]}`
    : 'Starting position';

  const movesSummary = moves.slice(0, currentPly).join(' ') || 'None';

  let prompt = `You are the Apex Chess Coach, a friendly, insightful, and pedagogical Grandmaster mentor (Elo 2700+).
Your goal is to help your student deeply understand chess concepts, opening strategy, and tactical motifs rather than merely memorizing moves.

=== CURRENT BOARD REALITY (FACTUAL GROUNDING - ZERO HALLUCINATIONS) ===
* Current FEN: "${currentFen}"
* Moves Played So Far: "${movesSummary}"
* Current Ply: ${currentPly} (Move displayed: ${currentMoveText})
* User Playing As: ${userColor === 'w' ? 'White' : 'Black'}
* Detected Opening: ${openingInfo.name} (${openingInfo.variation}) [ECO: ${openingInfo.eco}]
`;

  if (openingInfo.concepts) {
    prompt += `* Opening Strategic Ideas:
  - White's Plan: ${openingInfo.concepts.whitePlan || 'Control center and activate pieces.'}
  - Black's Plan: ${openingInfo.concepts.blackPlan || 'Counter in center and fight for balance.'}
`;
    if (openingInfo.concepts.keyMoves) {
      prompt += `* Known Key Move Explanations in this Opening:
${Object.entries(openingInfo.concepts.keyMoves)
  .map(([mv, exp]) => `  - ${mv}: ${exp}`)
  .join('\n')}
`;
    }
  }

  if (score !== undefined && score !== null) {
    prompt += `* Engine Evaluation: ${score > 0 ? '+' : ''}${(score / 100).toFixed(2)} pawns from White's perspective\n`;
  }

  if (bestMoveSan) {
    prompt += `* Stockfish Superhuman Recommendation: ${bestMoveSan}\n`;
  }

  if (tacticalFacts) {
    prompt += `* Tactical Breakdown:
  - Played move motif: ${tacticalFacts.playedExplanation || 'None'}
  - Engine move benefit: ${tacticalFacts.bestExplanation || 'None'}
`;
  }

  prompt += `
=== COACHING GUIDELINES ===
1. Be natural, articulate, encouraging, and human. Speak as a passionate Grandmaster sitting across the chessboard.
2. Explain the strategic "why": the battle for central control, pawn levers, piece activity, prophylactic defense, or tactical traps.
3. If the user asks about an opening move (e.g. "Why is a6 played in the Ruy Lopez?"), explain the structural dilemma it poses to the opponent and the long-term plan.
4. Format moves cleanly in backticks (e.g., \`3... a6\`, \`4. Ba4\`, \`e4\`, \`d4\`).
5. Keep answers focused, engaging, and clear (2 to 4 crisp paragraphs or clean bullet points). Never dump raw algebraic coordinate spam without human explanation.
`;

  return prompt;
}

/**
 * Handle Conversational Chat Query
 */
export async function chatWithCoach({
  messages = [],
  currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  moves = [],
  currentPly = 0,
  userColor = 'w',
  score = 0,
  bestMoveSan = '',
  tacticalFacts = null,
  overrideKey = ''
}) {
  const config = getCoachConfig();
  const apiKey = overrideKey || config.geminiApiKey || process.env.GEMINI_API_KEY;
  const openingInfo = identifyOpening(moves.slice(0, currentPly));

  const systemPrompt = buildSystemPrompt({
    openingInfo,
    currentFen,
    moves,
    currentPly,
    userColor,
    score,
    bestMoveSan,
    tacticalFacts
  });

  // 1. If Gemini API key is available, call Google Gemini 2.5 Flash
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      // Transform messages into Gemini format
      const contents = [];
      for (const m of messages) {
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.6,
          maxOutputTokens: 1000
        }
      });

      const reply = response.text;
      return {
        reply,
        provider: 'gemini',
        opening: openingInfo
      };
    } catch (err) {
      console.error('[AI Coach] Gemini API call error:', err.message);
      // Fallback to local heuristic if API fails
    }
  }

  // 2. If Ollama is configured and requested
  if (config.provider === 'ollama' && config.ollamaUrl) {
    try {
      const ollamaMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }))
      ];

      const res = await fetch(`${config.ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.ollamaModel || 'llama3.2:3b',
          messages: ollamaMessages,
          stream: false
        })
      });

      if (res.ok) {
        const data = await res.json();
        return {
          reply: data.message?.content || 'No response from local model.',
          provider: 'ollama',
          opening: openingInfo
        };
      }
    } catch (err) {
      console.warn('[AI Coach] Ollama connection failed, falling back to heuristic:', err.message);
    }
  }

  // 3. Fallback: Heuristic Grandmaster Explainer (Zero-cost, 100% offline without key)
  const lastUserMsg = messages[messages.length - 1]?.content || '';
  const heuristicReply = generateHeuristicExplanation({
    query: lastUserMsg,
    openingInfo,
    moves,
    currentPly,
    userColor,
    score,
    bestMoveSan,
    tacticalFacts
  });

  return {
    reply: heuristicReply,
    provider: 'offline-heuristic',
    opening: openingInfo,
    needsKey: !apiKey
  };
}

/**
 * Built-in Rule-based Grandmaster Opening & Tactical Explainer
 */
function generateHeuristicExplanation({
  query,
  openingInfo,
  moves,
  currentPly,
  userColor,
  score,
  bestMoveSan,
  tacticalFacts
}) {
  const q = (query || '').toLowerCase();
  const currentMove = currentPly > 0 && currentPly <= moves.length ? moves[currentPly - 1] : '';

  // Check if query is asking why a move in Ruy Lopez is played
  if (openingInfo.family === 'Ruy Lopez' || q.includes('ruy lopez') || q.includes('spanish')) {
    if (q.includes('a6') || currentMove === 'a6' || q.includes('why is this') || q.includes('why this move')) {
      return `### ♟️ The Grandmaster Idea behind \`3... a6\` (Morphy Defense)

In the **Ruy Lopez** (\`1.e4 e5 2.Nf3 Nc6 3.Bb5\`), White's bishop attacks the knight on \`c6\`, which is the primary defender of Black's central \`e5\` pawn.

When Black plays **\`3... a6\`**, you are asking White's bishop: *"What are your intentions? Declare them now."*

1. **Relieving the Pin**: White must immediately decide whether to trade with \`4. Bxc6\` or retreat with \`4. Ba4\`.
2. **The Pawn Safety Nuance**: If White plays \`4. Bxc6 dxc6 5. Nxe5?\`, White does **not** win a pawn because Black has the deadly fork **\`5... Qd4!\`**, simultaneously hitting the knight on \`e5\` and the pawn on \`e4\`, recovering the pawn with the two bishops!
3. **Queenside Space**: If White retreats \`4. Ba4\`, Black retains the powerful future option of playing \`...b5\` whenever necessary to kick the bishop and break pins.

That is why \`3... a6\` is played by almost every World Champion—it puts the question directly to White and gains queenside flexibility!`;
    }

    if (q.includes('nf6') || currentMove === 'Nf6') {
      return `### 🛡️ The Berlin Defense (\`3... Nf6\`)

Instead of questioning White's bishop with \`3... a6\`, Black immediately counter-attacks White's undefended \`e4\` pawn with **\`3... Nf6\`**!

* **Core Concept**: Black plays actively in the center. After \`4. O-O Nxe4 5. d4 Nd6 6. Bxc6 dxc6 7. dxe5 Nf5 8. Qxd8+ Kxd8\`, White has exchanged queens and Black's king cannot castle, but Black has the formidable **two bishops** and an impenetrable defensive bastion nicknamed **The Berlin Wall**.
* Vladimir Kramnik famously used this exact concept to defeat Garry Kasparov in their 2000 World Championship match!`;
    }

    if (q.includes('bb5') || currentMove === 'Bb5') {
      return `### ⚔️ White's Grandmaster Concept behind \`3. Bb5\`

White develops the bishop actively outside the pawn chain to pressure the \`c6\` knight.

* **Indirect Pressure on the Center**: The \`c6\` knight defends the central \`e5\` pawn. By pinning and menacing that defender, White exerts long-term pressure on Black's central foundation.
* **Rapid Kingside Castling**: White prepares to castle on move 4, keeping the king safe while opening the \`e-file\` for rook pressure.`;
    }
  }

  // Sicilian Defense Explanations
  if (openingInfo.family === 'Sicilian Defense' || q.includes('sicilian')) {
    if (q.includes('c5') || currentMove === 'c5' || q.includes('why')) {
      return `### ⚔️ The Dynamic Philosophy of the Sicilian Defense (\`1... c5\`)

Unlike \`1... e5\` which mirrors White's move symmetrically, **\`1... c5\`** creates an immediate asymmetrical imbalance!

1. **Central Pawn Superiority**: White usually wants to play \`d4\` to open the position. When White plays \`d4\`, Black trades a wing pawn (\`...cxd4\`) for White's central \`d-pawn\`. This leaves Black with **two central pawns** (\`d\` and \`e\`) against White's one (\`e\`), giving Black long-term central control.
2. **Semi-Open c-file**: Black gains an active open highway for rook and queen counterplay on the queenside.
3. **Playing to Win**: Statistically, the Sicilian is Black's highest-scoring defense at Master level because it unbalances the position from move one.`;
    }
  }

  // General Concept Explanations based on Opening Book
  if (openingInfo.concepts) {
    const concepts = openingInfo.concepts;
    return `### 📖 Strategic Guide: ${openingInfo.name} (${openingInfo.variation})

**ECO Code**: \`${openingInfo.eco}\`

* **White's Strategic Objective**: ${concepts.whitePlan}
* **Black's Strategic Objective**: ${concepts.blackPlan}

${tacticalFacts?.playedExplanation ? `\n* **Tactical Observation on current move**: ${tacticalFacts.playedExplanation}` : ''}
${bestMoveSan ? `\n* **Stockfish 19 Recommendation**: \`${bestMoveSan}\`` : ''}

> 💡 *Tip: For full conversational open-ended dialogue, you can connect a free Google Gemini API key in Coach Settings.*`;
  }

  // Default tactical / pedagogical fallback
  return `### ♟️ Apex Coach Position Breakdown

* **Current Opening**: **${openingInfo.name}** (${openingInfo.variation}) [\`${openingInfo.eco}\`]
* **Evaluation**: ${score > 0 ? '+' : ''}${(score / 100).toFixed(2)} pawns from White's perspective.
${bestMoveSan ? `* **Recommended Move**: \`${bestMoveSan}\`` : ''}

**Key Principles for this position**:
1. **Control the Center**: Ensure your pawns or pieces dispute the key central squares (\`e4\`, \`d4\`, \`e5\`, \`d5\`).
2. **Piece Harmony**: Connect your rooks by castling and activating your minor pieces before launching premature wing attacks.
3. **King Safety**: Always assess whether moving a piece exposes a diagonal or leaves an undefended square.

Feel free to ask specific questions about any move or plan!`;
}