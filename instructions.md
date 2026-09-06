# Instructions & Operating Guardrails for Apex Chess Trainer

> **Agent Directive & Quality Manual**  
> These instructions must be strictly followed by the AI assistant during all phases of design, implementation, and maintenance of the Apex Chess Trainer project.

---

## 1. Non-Negotiable Core Invariants

1. **Zero Capital & Zero Paid Services**:
   * NEVER introduce any library, tool, model, or API that requires a paid license, subscription, token, or credit card.
   * Every component must be 100% Free and Open-Source Software (FOSS).
2. **Locked Maximum Difficulty**:
   * Stockfish 19 must ALWAYS be locked to Skill Level 20 with full multi-threading and deep search depth (22–35+ plies).
   * NEVER introduce difficulty sliders, handicap modes, or "easy bot" options. The user’s explicit goal is facing the absolute strongest machine.
3. **Strict Separation of Planning vs. Implementation**:
   * While the user is planning or exploring, keep the workspace completely free of source code files.
   * Only create code files after the user gives explicit, unambiguous instructions to begin building.

---

## 2. Hardware Allocation Rules (Host: Lenovo ThinkPad E16 Gen 3)

1. **The Engine (Stockfish 19) -> CPU Cores**:
   * Stockfish must run natively on the AMD Ryzen 7 250 CPU using **AVX-512 / AVX2** vector instructions.
   * NEVER attempt to run alpha-beta search over a GPU/NPU PCIe bus; bus latency ruins search efficiency.
2. **The AI Coach / Explainer -> NPU / GPU**:
   * Use **ONNX Runtime with DirectML or Vitis AI Execution Provider** to target the **AMD XDNA NPU (`PCI\VEN_1022&DEV_1502`)** and **Radeon 780M GPU**.
   * Keep the coach model quantized (INT4/INT8) so memory footprint stays under 2.5 GB.

---

## 3. The 3-Stage Neuro-Symbolic Pipeline (Zero Hallucinations)

1. **Stage 1 (Ground Truth)**:
   * Stockfish 19 calculates the true best move, evaluation score, and refutation line.
2. **Stage 2 (Symbolic Motif Extraction)**:
   * Geometric bitboard code detects specific chess motifs:
     - Hanging pieces / undefended targets
     - Tactical forks, pins, and skewers
     - King shelter compromises
     - Removed guards / deflected defenders
3. **Stage 3 (Natural Language Coach)**:
   * The AI model or template synthesizer receives **ONLY** the verified JSON facts from Stages 1 and 2.
   * The AI model must **NEVER** calculate moves on its own; it only translates verified facts into clear, encouraging coaching prose.

---

## 4. Windows 11 & Development Standards

1. **PowerShell Scripting on Windows**:
   * Always invoke `npm.cmd` and `npx.cmd` directly rather than `npm` / `npx` to prevent Windows execution policy blocks (`npm.ps1 cannot be loaded`).
2. **Audio & Graphics Reliability**:
   * Use the **Web Audio API** for sound generation to eliminate 404 missing audio asset errors.
   * Use **SVG vector pieces** to ensure crisp visuals on high-DPI and 4K displays.
3. **Project Log Maintenance**:
   * Every time a major decision, architecture update, or milestone is reached, update `PROJECT_LOG.md` immediately so no context is ever lost.
