# 06. UI / UX Design & Interface Specification

---

## 1. Interface Layout & Wireframe Hierarchy

The user interface follows a modern, dark-themed grandmaster cockpit design. It is divided into two primary zones: the **Interactive Board Arena** (left) and the **Analytical Review Cockpit** (right).

```
┌──────────────────────────────────────────────────────────────────────────┐
│  STOCKFISH 19 APEX TRAINER    [Level 20 Locked • 3650+ Elo]    [History] │
├──────────────────────────────────────────────────────────────────────────┤
│                                  │                                       │
│  [EVAL]   ┌────────────────────┐ │  [GAME CONTROLS / STATUS]             │
│   BAR     │                    │ │  Status: Playing as Black             │
│   +1.4    │                    │ │  [Resign Match]   [Play White/Black]  │
│   ████    │    INTERACTIVE     │ │                                       │
│   ████    │     CHESSBOARD     │ │───────────────────────────────────────│
│   ████    │                    │ │  [ACCURACY & ADVANTAGE GRAPH]         │
│   ░░░░    │  (Drag & Drop,     │ │  You: 71.4%  |  Stockfish: 99.2%      │
│   ░░░░    │   Legal dots,      │ │  /\_/\_                               │
│   ░░░░    │   Blunder / Best   │ │  \     \__ (Interactive Eval Curve)   │
│   -1.4    │   move arrows)     │ │───────────────────────────────────────│
│           │                    │ │  [COACH "WHY IT WAS A MISTAKE" PANEL] │
│           └────────────────────┘ │  [Blunder ??] Allowed Knight Fork     │
│                                  │  "Allows Stockfish 15. Ne6 forking    │
│                                  │   Queen and Rook."                    │
│                                  │  [Play Refutation]  [Try Your Idea]   │
│                                  │  Alternative: 14... Be7 (+0.1)        │
└──────────────────────────────────┴───────────────────────────────────────┘
```

---

## 2. Component Specifications

### 2.1 Interactive Chessboard
* **Rendering**: Pure SVG vector pieces (cburnett tournament set).
* **Interaction Modes**: Supports both **Click-to-Move** (accessible, click start square then destination) and **Drag-and-Drop** with touch-device support.
* **Visual States**:
  * **Legal Moves**: Centered dark dots on empty destination squares; circular border rings on legal capture squares.
  * **Last Move**: Soft yellow/lime background highlight on the `from` and `to` squares.
  * **Check Alert**: Radial red pulsing aura under the active King when in check.
  * **Promotion Modal**: Centered modal allowing selection of Queen, Rook, Bishop, or Knight upon pawn reach.

### 2.2 Directional Tactical Arrows
Rendered via dynamic SVG overlay on top of the chessboard:
* 🔴 **Red Arrow**: Visualizes the player's blunder move.
* 🟢 **Green Arrow**: Visualizes Stockfish's optimal recommended move.
* 🟠 **Amber Arrow**: Visualizes Stockfish's tactical threat or refutation sequence.

### 2.3 Dynamic Vertical Evaluation Bar
* **Dimensions**: 32px wide, matching the full height of the chessboard.
* **Proportions**: Smooth CSS transition based on current centipawn win-probability ($0\%\text{--}100\%$).
* **Score Indicator**: Displays numerical evaluation (e.g. `+2.4`, `-1.1`) or forced mate (`M3`, `-M1`). Inverts cleanly based on board orientation.

### 2.4 Interactive Advantage Graph (Evaluation Curve)
* **Visual**: Continuous SVG polyline curve tracking White vs. Black evaluation across all plies of the game.
* **Equality Line**: Dotted horizontal guideline at $0.00$ equality.
* **Clickable Markers**: Color-coded nodes (Red for Blunders, Amber for Mistakes, Yellow for Inaccuracies). Clicking any node instantly jumps the board and coach panel to that move.

### 2.5 Coach Analysis Card & "Try Your Idea" Sandbox
* **Badge**: Move classification tag with evaluation swing ($\Delta cp$).
* **The "Why" Narrative**: Instructive explanation of the tactical or positional error.
* **Refutation Player**: Step-by-step buttons to replay Stockfish's exact punishment line on the board.
* **"Try Your Idea" Sandbox**:
  * The user can freely make alternative moves on the board directly from the blunder position.
  * Stockfish instantly evaluates the alternative move, telling the user whether their idea holds up or if the engine has another refutation.

---

## 3. Web Audio API Acoustic Sound Design

To ensure zero latency and zero missing asset 404 errors, sounds are synthesized mathematically via the browser's native `AudioContext`:

| Sound Event | Oscillator Waveform | Frequency Progression | Duration | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Move** | Triangle | $320\text{ Hz} \to 140\text{ Hz}$ | 60ms | Clean, dry acoustic wooden click. |
| **Capture** | Square | $220\text{ Hz} \to 80\text{ Hz}$ | 90ms | Deeper, punchier snap. |
| **Check** | Sine (Dual Harmonics)| $600\text{ Hz} + 850\text{ Hz}$ | 180ms | Crisp, urgent bell alert. |
| **Castle** | Triangle (Dual Stagger)| $320\text{ Hz} \to 140\text{ Hz} \times 2$ | 120ms gap| Realistic double-piece relocation click. |
| **Game Over** | Triangle (Chord) | $220\text{ Hz} + 277\text{ Hz} + 330\text{ Hz}$ | 600ms | Dramatic resonant A-major chord. |
