# 04. Stockfish 19 Engine Configuration & Architecture

---

## 1. Engine Profile: Stockfish 19 Universal x86-64

Stockfish 19 represents the undisputed peak of computational chess, rated at **~3650+ Elo** on the CCRL / CEGT rating lists.

### Architectural Milestones in Stockfish 19
1. **Total Elimination of Handcrafted Evaluation (HCE)**:
   * 100% of positional evaluation is performed by neural networks. No hardcoded piece-square tables or human heuristics exist in the engine.
2. **Dual-NNUE Network Architecture**:
   * **Large Network (`nn-1a298aa575a0.nnue`, 109 MiB)**: Deep, multi-layer evaluation network loaded for complex middlegames and subtle strategic maneuvers.
   * **Small Network**: Highly compressed network used at shallow search depths to rapidly prune obviously lost or won branches.
3. **HalfKAv2 Feature Transformer**:
   * Evaluates piece placements relative to both Kings (`(King_Square, Piece_Type, Piece_Square)`).
   * Features an **Efficiently Updatable Accumulator**: When a move occurs, only the moved piece's weights are added and subtracted from the running accumulator, avoiding re-calculation of the entire board.
4. **Complete Principal Variations (PVs)**:
   * Generates continuous, complete move sequences all the way to checkmate or definitive endgame tablebase draws.

---

## 2. Locked UCI Configuration (Maximum Strength)

To guarantee the user always faces the engine at its absolute peak, the engine is initialized with these **locked UCI parameters**:

```ini
[UCI Configuration - Level 20 Maximum]
# Utilize maximum physical/logical cores on AMD Ryzen 7 250
Threads = 8

# Transposition Table Hash Memory (MB)
Hash = 256

# Skill Level: 20 is the absolute hardcoded maximum (no handicaps)
Skill Level = 20

# Disable artificial move overhead delays
Move Overhead = 10

# Dual-NNUE evaluation path
EvalFile = nn-1a298aa575a0.nnue

# MultiPV (Set to 1 during gameplay, dynamic during post-game analysis)
MultiPV = 1
```

---

## 3. Search & Gameplay Parameters

| Parameter | Setting During Gameplay | Setting During Post-Game Review | Rationale |
| :--- | :--- | :--- | :--- |
| **Search Depth** | `depth 22 - 25` | `depth 16 - 20` | Depth 22 delivers ~3600 Elo superhuman moves in 1.5–2.0 seconds. Depth 16 allows rapid multi-ply batch review of an entire 60-move game in ~10 seconds. |
| **Move Time Cap** | `movetime 2000` (2.0s) | N/A (depth-bound) | Ensures snappy, fluid gameplay while maintaining crushing tactical accuracy. |
| **MultiPV** | 1 (Best line) | 1 to 3 (Top lines) | MultiPV 3 allows comparison between what was played vs. the best alternative lines. |
| **Contempt** | 0 (Neutral) | 0 (Neutral) | Neutral objective evaluation without artificial bias. |

---

## 4. Evaluation Metrics & Score Parsing

Stockfish outputs evaluations in two distinct formats:
1. **Centipawns (`score cp <int>`)**:
   * Units of $1/100$th of a pawn from the engine's perspective.
   * Example: `score cp 150` indicates White is ahead by $1.50$ pawns.
2. **Forced Checkmate (`score mate <int>`)**:
   * Units of moves until unavoidable checkmate.
   * Example: `score mate 3` indicates forced mate in 3 moves. `score mate -1` indicates the opponent can deliver mate on the next move.
