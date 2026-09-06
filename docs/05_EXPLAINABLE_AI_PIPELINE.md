# 05. The Explainable AI (XAI) & Tactical Explainer Pipeline

---

## 1. Problem Statement: Why Standard Chess Analysis Fails

Standard chess platforms fail at human pedagogy because:
1. **Engines think in numbers, not concepts**: Showing `"-3.8 Blunder"` tells a player *that* they made a mistake, but not *why* it was a mistake.
2. **Move notation is not explanation**: Outputting `14... e5 15. Qh5 g6 16. Qxe5+` forces the player to calculate multi-move sequences in their head without understanding the underlying strategic blunder.
3. **Raw LLMs hallucinate**: If an LLM (like ChatGPT) is asked to analyze a chess game directly, it invents phantom pieces, permits illegal moves, and invents fake tactics.

---

## 2. The 3-Stage Neuro-Symbolic Pipeline (100% Truth, Zero Hallucinations)

To guarantee 100% factual accuracy and human clarity, Apex Chess Trainer enforces a **strict three-stage separation of concerns**:

```
[User Played Move on Board]
            │
            ▼
 ┌────────────────────────────────────────────────────────┐
 │ STAGE 1: Ground Truth Engine (Stockfish 19 on CPU)     │
 │ • Calculates objective best move & evaluation delta   │
 │ • Computes win-probability swing (CAPS2 formula)       │
 │ • Generates the multi-ply punishment line (refutation) │
 └────────────────────────────┬───────────────────────────┘
                              │
                              ▼
 ┌────────────────────────────────────────────────────────┐
 │ STAGE 2: Symbolic Tactical & Geometric Analyzer        │
 │ • Bitboard ray-tracing extracts concrete chess motifs: │
 │   - Hanging Piece / Under-defended targets             │
 │   - Tactical Forks, Pins, Skewers, Discovered Attacks  │
 │   - King Shelter Weaknesses (f2/f7 diagonal opened)    │
 │   - Removed Guard / Deflected Defender                 │
 │ • Assembles verified JSON factual summary              │
 └────────────────────────────┬───────────────────────────┘
                              │
                              ▼
 ┌────────────────────────────────────────────────────────┐
 │ STAGE 3: The Mentor (Offline AI Model on NPU/GPU)      │
 │ • Receives ONLY the structured factual JSON facts      │
 │ • Translates facts into natural, human, encouraging    │
 │   Grandmaster coaching prose                           │
 │ • Result: 0% hallucinations, 100% pedagogical value    │
 └────────────────────────────────────────────────────────┘
```

---

## 3. The Threat / Defense / Concession Model (DecodeChess Reverse-Engineered)

Our symbolic analyzer deconstructs every move into three fundamental questions:

1. **Threats Created**:
   * Which enemy pieces did this move attack?
   * Did it deliver a check or create an unstoppable checkmate net?
2. **Defenses Created**:
   * Which friendly pieces or key squares are newly guarded?
3. **Concessions Made**:
   * Did moving this piece leave another piece undefended (**Removal of Guard**)?
   * Did it vacate a critical square or outpost for enemy infiltration?
   * Did it open a diagonal or file leading directly to the King?

### Null-Move Threat Decomposition
To determine what the opponent is threatening before or after a move:
1. The engine generates a virtual "null move" (letting the opponent move twice in a row).
2. Stockfish calculates the opponent's best response to the null move.
3. The resulting move sequence reveals the opponent's **immediate underlying threat**. If the player's move failed to prevent that threat, the mistake is categorized and explained.

---

## 4. Move Classification & CAPS Accuracy Math

Centipawn scores are converted into winning probabilities using the **Lichess Sigmoid Formula**:

$$Win\% = 50 + 50 \times \left( \frac{2}{1 + \exp(-0.00368208 \cdot cp)} - 1 \right)$$

### Move Classification Thresholds:

| Classification | Glyph | Color | Evaluation / Win% Criteria | Description |
| :--- | :---: | :--- | :--- | :--- |
| **Brilliant** | `!!` | Cyan | Evaluated as best move + genuine piece sacrifice with winning follow-up | Rare, game-defining sacrifice. |
| **Best Move** | `★` | Emerald | Top engine move or $\Delta cp < 15$ | Optimal calculation. |
| **Good** | `✔` | Blue | $\Delta cp < 50$, $\Delta Win\% < 5\%$ | Solid practical move. |
| **Inaccuracy** | `?!` | Yellow | $\Delta cp = 50\text{--}120$, $\Delta Win\% = 5\text{--}10\%$ | Minor positional or developmental slip. |
| **Mistake** | `?` | Amber | $\Delta cp = 120\text{--}250$, $\Delta Win\% = 10\text{--}25\%$ | Clear loss of advantage or tactical concession. |
| **Blunder** | `??` | Red | $\Delta cp > 250$, $\Delta Win\% > 25\%$ | Fatal error, hung piece, or game-losing oversight. |
| **Missed Win**| `✖` | Rose | Eval was $> +3.0$ and dropped to $\le +1.0$ | Overlooking a forced win or tactical knockout. |

---

## 5. Structured JSON Schema Passed to the Local AI Coach

To eliminate hallucinations, the local language model on your NPU receives only verified facts:

```json
{
  "moveNumber": 14,
  "turn": "Black",
  "playedMove": "e7e5",
  "classification": "Blunder",
  "evalDrop": "-4.20 cp (Win% dropped from 48% to 8%)",
  "bestEngineMove": "Be7",
  "tacticalMotif": "Removed Defender / Allowed Knight Fork",
  "explanationFacts": {
    "pieceMoved": "pawn from e7 to e5",
    "vacatedDefense": "pawn no longer defends d6 and d5 squares",
    "opponentThreat": "White knight jumps to d5, forking queen on d8 and bishop on c7",
    "refutationLine": ["Nxd5", "Qd8", "Nxc7+", "Qxc7", "Bxd5"],
    "alternativeBenefit": "14... Be7 completes kingside development, neutralizes pin on f6, and prepares castling."
  }
}
```
