# Project Log: Apex Chess Trainer (Stockfish 19)

> **Living Project Document**  
> This file records all architectural decisions, hardware specifications, research findings, feature roadmaps, and progress updates. It is updated continuously throughout the project lifecycle.

---

## 1. Project Identity & Vision
* **Product Name**: Apex Chess Trainer
* **Target User**: Personal training tool for confronting the absolute strongest open-source chess model in the world.
* **Core Philosophy**:
  1. **Superhuman Opponent**: Unrestricted Stockfish 19 running at locked maximum difficulty (~3650+ Elo).
  2. **Fearless Defeat**: The player accepts losing every game in order to understand how superhuman computation punishes human mistakes.
  3. **Pedagogical "Why" Breakdown**: Moving beyond superficial scores (`-3.4 blunder`) to explain **why** a move failed (tactical motif, king safety, removed guard, or positional concession).
  4. **Zero Capital & 100% Open Source**: Built with $0.00 budget, no subscriptions, no cloud tokens, and 100% local execution.

---

## 2. Host Machine Profile & Hardware Allocation
* **System Model**: Lenovo ThinkPad E16 Gen 3
* **OS**: Windows 11 Home (Build 26100 / 24H2) with native DirectML support
* **CPU**: AMD Ryzen 7 250 (8 Cores / 16 Threads, Zen 4, up to 5.1 GHz, AVX-512 / AVX2 / BMI2)
  * *Allocated Role*: **Stockfish 19 Engine (Pure Alpha-Beta Calculation)** running at 8–12 million nodes/sec.
* **RAM**: 16.0 GB DDR5
* **GPU**: AMD Radeon 780M Graphics (RDNA 3, 12 CUs, DirectML / DirectX 12)
* **NPU**: AMD NPU Compute Accelerator Device (`PCI\VEN_1022&DEV_1502`, Driver `32.0.203.329`)
  * *Allocated Role*: **Offline AI Coach Model** running quantized inference via ONNX Runtime / DirectML with 0% CPU overhead.

---

## 3. Core Architectural Decision: Local Web Application
* **Decision**: Local Web Application (Node.js Backend + React 19 / Vite Frontend)
* **Rationale**:
  1. **Maximum Reliability**: Node.js and React are the most documented, battle-tested software stacks in computer science. Zero risk of obscure Rust/C++ compilation failures on Windows.
  2. **Hardware Direct Access**: Node.js manages the native Windows `stockfish.exe` binary over OS pipes with sub-millisecond response times.
  3. **Graphics & Sound**: Modern web browsers provide hardware-accelerated SVG rendering and zero-latency Web Audio API synthesis.
  4. **Zero Overhead**: No heavy 150MB+ desktop wrappers (Electron) or complex desktop compilers (Tauri). Starts instantly with a single double-click.

---

## 4. Documentation Suite Created (`docs/`)

The technical documentation suite has been established in the project directory:

| Document | File Path | Focus & Purpose |
| :--- | :--- | :--- |
| **01. Project Overview** | [`docs/01_PROJECT_OVERVIEW.md`](file:///c:/Users/aswin/Desktop/WebDev/chessTrainer/docs/01_PROJECT_OVERVIEW.md) | Vision, philosophy, feature scope matrix. |
| **02. System Architecture** | [`docs/02_SYSTEM_ARCHITECTURE.md`](file:///c:/Users/aswin/Desktop/WebDev/chessTrainer/docs/02_SYSTEM_ARCHITECTURE.md) | 5-layer decoupled architecture, REST API specs, UCI protocol. |
| **03. Hardware Integration** | [`docs/03_HARDWARE_INTEGRATION.md`](file:///c:/Users/aswin/Desktop/WebDev/chessTrainer/docs/03_HARDWARE_INTEGRATION.md) | CPU AVX-512 vectorization, NPU/GPU DirectML execution. |
| **04. Stockfish Engine** | [`docs/04_CHESS_ENGINE_STOCKFISH.md`](file:///c:/Users/aswin/Desktop/WebDev/chessTrainer/docs/04_CHESS_ENGINE_STOCKFISH.md) | Stockfish 19 dual-NNUE, HalfKAv2 transformers, locked Level 20 UCI config. |
| **05. Explainable AI Pipeline**| [`docs/05_EXPLAINABLE_AI_PIPELINE.md`](file:///c:/Users/aswin/Desktop/WebDev/chessTrainer/docs/05_EXPLAINABLE_AI_PIPELINE.md) | 3-stage Neuro-Symbolic pipeline, DecodeChess threat model, CAPS2 math. |
| **06. UI/UX Specification** | [`docs/06_UI_UX_SPECIFICATION.md`](file:///c:/Users/aswin/Desktop/WebDev/chessTrainer/docs/06_UI_UX_SPECIFICATION.md) | Wireframes, SVG board, arrows, eval bar, Web Audio sound design. |
| **07. Open-Source Audit** | [`docs/07_OPEN_SOURCE_LICENSE_AUDIT.md`](file:///c:/Users/aswin/Desktop/WebDev/chessTrainer/docs/07_OPEN_SOURCE_LICENSE_AUDIT.md) | Zero-capital guarantee, complete FOSS license audit. |
| **08. Commercialization & Acquisition** | [`docs/08_COMMERCIALIZATION_AND_ACQUISITION.md`](file:///c:/Users/aswin/Desktop/WebDev/chessTrainer/docs/08_COMMERCIALIZATION_AND_ACQUISITION.md) | BYOK-Led Trojan Horse pricing, 6 conversion psychology pillars, 19-page acquisition blueprint. |

---

## 5. Project Timeline & Change Log
* **2026-09-06**:
  - Initial project conceptualization and requirement gathering.
  - Verified host hardware: AMD Ryzen 7 250 (16 threads), Radeon 780M, AMD XDNA NPU.
  - Formulated Zero-Capital, 100% Open-Source Mandate ($0.00 budget, no paid cloud APIs).
  - Evaluated Web App vs. Desktop Software; selected **Local Web Application** for maximum reliability and documentation support.
  - Created `PROJECT_LOG.md` and `instructions.md`.
  - Established modular, full-depth documentation suite in `docs/` (7 core specification files).
  - **Engine Deployment**:
    - Downloaded and verified official Stockfish 19 binary (`bin/stockfish.exe`) with dual-NNUE (`nn-1a298aa575a0.nnue`).
    - Configured locked Skill Level 20, 8 threads, 256MB hash, AVX-512 optimization (~3650+ Elo).
  - **Backend Server (Express / Node.js)**:
    - Built `server/engine.js` (UCI process manager with promise-based command pipeline).
    - Built `server/explainer.js` (Symbolic tactical motif explainer detecting hanging pieces, forks, pins, king safety flaws).
    - Built `server/analyzer.js` (Multi-ply game batch evaluator with CAPS accuracy model & Lichess win% sigmoid).
    - Built `server/history.js` (Local JSON file match storage in `data/history.json`).
    - Built `server/index.js` (REST API on port 5000: `/api/status`, `/api/move`, `/api/analyze`, `/api/eval`, `/api/history`).
  - **Frontend Application (React 19 / Vite / TailwindCSS)**:
    - Built `src/utils/chessPieces.jsx` (Vector SVG piece sets).
    - Built `src/hooks/useSoundEffects.js` (Web Audio API procedural sound synthesizer).
    - Built `src/components/ChessBoard.jsx` (Interactive board, legal dots, last-move highlights, directional tactical arrows, promotion modal).
    - Built `src/components/EvalBar.jsx` (Dynamic vertical evaluation bar with sigmoid winning chance scaling).
    - Built `src/components/MoveHistory.jsx` (Grouped move notation, quality glyphs, captured piece counters, step navigation).
    - Built `src/components/EvalGraph.jsx` (Interactive SVG advantage chart with clickable blunder markers).
    - Built `src/components/AnalysisPanel.jsx` (Pedagogical mistake card, "Why" breakdown, punishment line, "Try Your Idea" sandbox).
    - Built `src/components/GameControls.jsx` (Locked Level 20 badge, New Game, Resign, Side selector, Mute audio).
    - Built `src/components/AccuracyBadge.jsx` (CAPS accuracy scores and move category matrix).
    - Built `src/components/GameHistoryModal.jsx` (Past match archive browser and review loader).
    - Built `src/App.jsx` (Master coordinator with play, review, and sandbox modes).
  - **UI/UX Viewport Refinement (Zero-Scroll & Pinned Board)**:
    - Fixed container to `h-screen max-h-screen overflow-hidden` to eliminate page-level downward scrolling.
    - Pinned `ChessBoard` and `EvalBar` to `min(80vh, 620px)` so the board remains 100% visible at all times.
    - Integrated clean header action bar (`New Game`, `Resign`, `Review`, `History`, `Mute`) and removed redundant hardware spec banners to eliminate cognitive overload.
    - Structured review sidebar into compact tabs (`Coach Breakdown` vs `Match Accuracy`), keeping the move list and advantage graph visible side-by-side with the board.
    - Added left/right arrow key navigation for instant ply browsing.
  - **Pedagogical Explainer & Sandbox Overhaul**:
    - Enriched `explainer.js` to provide dual explanations: exactly why the played move failed (tactical flaw, hanging piece, exposed king) and why Stockfish's alternative is superior.
    - Fixed property mapping between backend and frontend review panels.
    - Overhauled "Try Your Idea" Sandbox: added live move recording (`sandboxMoves`), real-time Stockfish position evaluations, and dedicated sandbox move history logging.
  - **Analysis Caching & History Deduplication**:
    - Implemented client-side match caching (`analyzedKey`) in `App.jsx` to immediately switch to review mode without repeating API calls.
    - Implemented server-side analysis cache (`findGameByMoves`) in `index.js` and `history.js` to return existing analyses in under 10ms.
    - Added deduplication to `saveGameToHistory` to prevent duplicate match entries from ever being saved into `data/history.json`.
  - **Slide-Out Coach Drawer (Full Move List Visibility)**:
    - Reorganized review sidebar so Move History has 100% full vertical height by default.
    - Added a compact, non-intrusive bottom trigger bar highlighting mistakes and alternatives.
    - Implemented a smooth slide-out coach drawer with backdrop blur and close (`X`/`Escape`) controls, completely eliminating move list squishing.
  - **Evaluation Bar Normalization & Board Inversion Fix**:
    - **UCI Protocol Perspective Alignment**: In standard UCI, Stockfish reports evaluations from the perspective of the side to move. When Black was to move, a Black advantage (+500) was returned as positive, causing the frontend to interpret it as a White advantage. Normalized all API endpoints (`/api/move`, `/api/eval`, `/api/analyze`) to always output scores from White's perspective (+ = White ahead, - = Black ahead).
    - **EvalBar Flipped Board Orientation**: Resolved styling bug in `EvalBar.jsx` where top and bottom slices had hardcoded colors (`bg-slate-900` vs `bg-slate-100`). Dynamically bound slice colors, heights, and text labels to board orientation (`isFlipped`) so that the visual bar matches the physical position of Black and White on the board under both White and Black play.
    - **History Normalization**: Batch-normalized all existing cached game steps in `data/history.json` to ensure past review sessions render consistent evaluations.
  - **PWA Web App Installation & Custom Logo**:
    - Designed custom high-fidelity app logo featuring an emerald glowing crown and cybernetic knight piece.
    - Generated multi-resolution PWA assets in `client/public/`: `logo512.png` (512x512 maskable), `logo192.png` (192x192), `favicon.png` (64x64), and `favicon.svg` (vector icon).
    - Added W3C Web App Manifest (`manifest.json`) configured for `display: standalone` with theme color `#10b981` (`#020617` background).
    - Registered offline service worker (`sw.js`) and PWA metadata in `index.html` to enable the native "Install App" button in Windows Chrome/Edge.
    - Updated navigation header with the official logo badge next to the "Apex Chess" title.
  - **Windows Desktop Shortcut & Native App Mode**:
    - Generated multi-size Windows icon file `app.ico` (256x256) embedded with the custom emerald Apex Chess logo.
    - Created Windows Desktop Shortcut `C:\Users\aswin\Desktop\Apex Chess Trainer.lnk` linked to `run.bat` with the custom logo icon.
    - Overhauled `run.bat` to detect running ports (5000 & 5173), boot servers automatically if offline, and launch Chrome or Edge in native standalone app mode (`--app=http://localhost:5173`) with zero browser bars or tabs.
    - Built interactive `DesktopAppModal.jsx` in the frontend header allowing players to create or refresh their desktop shortcut with 1-click via backend endpoint `POST /api/create-shortcut` and download the `.bat` launcher.
  - **GitHub Repository & Cloud Version Control**:
    - Initialized Git repository with `main` branch.
    - Configured comprehensive `.gitignore` excluding `node_modules`, `.vite`, build artifacts, and OS temp files.
    - Integrated **Git LFS** (Large File Storage) for `bin/stockfish.exe` (~98.3 MB) with `.gitattributes` to ensure repository performance and avoid GitHub's 100MB regular blob limit.
    - Created public GitHub repository [`rd-aswin/apex-chess-trainer`](https://github.com/rd-aswin/apex-chess-trainer).
    - Crafted comprehensive documentation in root `README.md` (badges, overview, quick start, architecture, documentation links).
    - Uploaded full base codebase and pushed directly to `origin/main`.
  - **Conversational Grandmaster AI Coach ("Apex Coach")**:
    - Built `server/openingBook.js` with comprehensive ECO opening classifier, opening concepts, and key move explanations for Ruy Lopez, Sicilian, French, Italian, Caro-Kann, Queen's Gambit, King's Indian, and London System.
    - Integrated `@google/genai` SDK for Google Gemini 2.5 Flash with free tier access.
    - Built `server/aiCoach.js` neuro-symbolic grounding engine injecting board state, FEN, moves, ECO opening name, Stockfish evaluation, and tactical motifs into a structured Grandmaster system prompt.
    - Added backend routes `POST /api/coach/chat`, `POST /api/coach/opening`, `GET/POST /api/coach/config` supporting Gemini, local Ollama, and built-in offline heuristic fallback.
    - Built `client/src/components/AiCoachChat.jsx` conversational interface with quick question chips ("Why is this move played in this opening?", "What is my plan here?", "What is opponent threatening?"), opening badges, expandable strategic guides, and API key settings modal.
    - Integrated "Ask Coach (AI)" tab in Game Review mode and quick "Ask Coach" button in the navigation header during live play.
  - **Check for Updates & Tool Health Center (Stockfish, AI Models, npm Packages)**:
    - Built `server/updater.js` with automated version querying across GitHub API (`official-stockfish/Stockfish/releases/latest`), Google Gemini AI model catalog (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-pro`), and NPM registry (`chess.js`, `@google/genai`, `lucide-react`, `vite`, `express`).
    - Implemented a 3-minute in-memory cache and `User-Agent: ApexChessTrainer-UpdateCheck` to prevent unauthenticated GitHub API rate limits (60 req/hr).
    - Exposed `GET /api/updates/check` (with `?force=true` manual refresh bypass) in `server/index.js`.
    - Built `client/src/components/UpdateModal.jsx` featuring a high-tech dark HUD aesthetic, animated radar scan sweep, pulsing sonar rings, live tool health status, and 1-click Windows x86-64 binary zip download direct from official GitHub releases.
    - Synchronized to GitHub: Pushed commits (`a84f397`, `fa1b84d`) to `origin/main` on GitHub upon user review and approval.
  - **19-Page Customer Acquisition Website & BYOK Marketing Platform**:
    - Formulated the "BYOK-Led Trojan Horse" (Freemium + Frictionless Pro) commercialization strategy based on research into high-growth BYOK pioneers (TypingMind, Cursor, Bolt).
    - Authored comprehensive architectural specification `docs/08_COMMERCIALIZATION_AND_ACQUISITION.md` documenting unit economics (~$0.00035/game on Gemini Flash), 4-tier pricing model (Free BYOK $0, 3-Game Hosted Free Trial $0, Pro $4.99/mo, Lifetime Founder $59), and 6 core conversion psychology pillars.
    - Designed and implemented a responsive, multi-page client-side acquisition platform with 19 dedicated high-intent routes:
      1. Flagship Homepage (`/` / `#home`) with interactive blunder comparison demo and 3-year subscription graveyard.
      2. Pricing & Plans (`#pricing`) with 4-tier matrix and interactive Token Burn calculator.
      3. How BYOK Works (`#how-byok-works`) with 60-second visual setup guide and TLS direct privacy guarantee.
      4. Apex vs. Chess.com Diamond (`#vs-chesscom`) teardown comparing canned scripts against articulate AI coaching.
      5. Apex vs. Lichess (`#vs-lichess`) positioning Apex as an open-source pedagogical companion with 1-click import.
      6. Explainable AI Post-Game Review (`#features/ai-review`) detailing the 3-stage Neuro-Symbolic truth engine.
      7. Socratic Move-by-Move Sparring (`#features/socratic-sparring`) for active recall and idea testing.
      8. 50-Game Subconscious Leak Detector (`#features/leak-detection`) auditing recurring subconscious habit flaws.
      9. Stockfish 19 NNUE & AVX-512 (`#features/engine`) showcasing locked 3650+ Elo local CPU vectorization.
      10. Personalized Blunder Drills & Anki (`#features/drills`) for spaced-repetition active recall.
      11. Opening Repertoire & ECO Explorer (`#features/openings`) explaining master strategic plans.
      12. 1200–1500 Plateaued Improver (`#use-cases/1200-1500`) addressing undefended piece blindness.
      13. 1600–1900 Club Competitor (`#use-cases/1600-1900`) mastering pawn structures, outposts, and prophylaxis.
      14. Busy Adult Improver (`#use-cases/adult-improver`) with 15-minute high-yield routine and zero idle subscription guilt.
      15. Coaches & Chess Academies (`#use-cases/coaches`) with batch PGN evaluation and class blunder profiles.
      16. Anti-Subscription Manifesto (`#manifesto`) covering "The Rentier Economy Ruined Software".
      17. Interactive 3-Year ROI Calculator (`#calculator`) with live sliders and dynamic savings computation ($400+ saved).
      18. Zero-Friction Interactive Sandbox (`#demo`) for instant playable blunder analysis without account setup.
      19. Master FAQ & Security (`#faq-privacy`) crushing objections on API key safety, local encryption, and GPL-3 rights.
    - Built `LandingNavbar.jsx` with responsive dropdowns, mobile drawer, and prominent "Launch Live App" CTA.
    - Built `LandingFooter.jsx` with complete 19-link sitemap and real-time engine status bar.
    - Built `LandingView.jsx` master coordinator with URL hash routing and scroll synchronization.
    - **Customer-Facing Copy Overhaul (Zero Internal Jargon)**:
      - Cleaned all landing pages and navigation components to eliminate internal team and developer jargon (e.g., "Trojan Horse", "Neuro-symbolic", "AVX-512", "Bitboards", "Rentier Economy", "CAPS2").
      - Re-anchored every headline, benefit bullet, and comparison table to plain, relatable chess improver language ("Plain-English Explanations", "Find Your Bad Habits Across 50 Games", "World Champion Engine", "How to Get a Free Google Key in 60 Seconds", "Zero Monthly Fees").
      - Verified production build (`npm run build`) and committed locally to branch `commercial` (`03c75d4`).
    - **Calculator Replacement & Simplification (Zero AI/Token Jargon)**:
      - Removed the technical AI model token calculator from `PricingPage.jsx` (which previously showed raw token rates like \$0.00035/game, Claude 3.5 Sonnet, GPT-4o Mini, and Ollama buttons).
      - Added customer peace-of-mind guarantees to `PricingPage.jsx` (30-Day Money-Back Guarantee, Free Google Key Guarantee, Instant 1-Click Chess.com/Lichess Import).
      - Replaced `RoiCalculatorPage.jsx` with an intuitive **Chess Subscription Comparison Calculator**:
        - Allows players to select what they currently pay: Chess.com Diamond (\$160/yr), Chess.com Platinum (\$100/yr), Aimchess (\$119/yr), or Chess.com Gold (\$60/yr).
        - Select 1, 3, or 5-year timeline.
        - Compare against Apex Free Key (\$0), Apex Lifetime (\$59 once), or Apex Pro (\$39/yr).
        - Clearly shows exact cash kept in the player's pocket (\$420+ saved) and real-world value equivalents (tournament entries, wooden sets, chess books).
        - Features a side-by-side comparison table showing why plain-English coaching without subscriptions beats recurring billing.
      - Tested clean production build with Vite (1,625 modules compiled with 0 errors).
      - Committed locally to branch `commercial` (`f67d42b`).













