# 07. Open-Source License Audit & Zero-Capital Guarantee

---

## 1. Zero-Capital Mandate

This application is built with a **strict $0.00 capital expenditure requirement**. 

* **No Cloud API Subscriptions**: No OpenAI, Anthropic, or external inference fees.
* **No Software Licenses**: Every tool is licensed under permissive or copyleft open-source terms.
* **No Hidden Tiers**: No "premium" locks, accounts, or payment gateways.
* **100% Local Execution**: Runs entirely on the user's Lenovo ThinkPad E16 hardware.

---

## 2. Complete License & Dependency Audit

Every technical asset in this project has been audited for open-source compliance:

| Component / Layer | Name / Package | License | Author / Organization | Commercial / Paid Elements? |
| :--- | :--- | :--- | :--- | :--- |
| **Calculation Engine** | Stockfish 19 | **GNU General Public License v3 (GPLv3)** | Official Stockfish Developers | **None** (100% Free Open-Source) |
| **Neural Weights (NNUE)**| `nn-1a298aa575a0.nnue` | **GPLv3** | Stockfish Open-Source Team | **None** (Trained via Fishtest) |
| **Chess Logic Core** | `chess.js` | **BSD-2-Clause / MIT** | Jeff Hlywa & Contributors | **None** (Standard open-source library) |
| **AI Inference Runtime** | Microsoft DirectML / ONNX Runtime | **MIT License** | Microsoft & AMD | **None** (Open-source hardware runtime) |
| **Local Language Model** | Llama-3.2-3B / Qwen-2.5-3B | **Open Weights (Llama 3.2 Community / Apache 2.0)** | Meta AI / Alibaba Cloud | **None** (Free local offline download) |
| **Human Move Model (Opt)**| Maia 2 | **GNU GPL v3** | University of Toronto & Cornell | **None** (Open-source research weights) |
| **Frontend Framework** | React 19 & React-DOM | **MIT License** | Meta Open Source | **None** (Standard open-source) |
| **Build Tooling** | Vite 6 | **MIT License** | Evan You & Vite Contributors | **None** (Standard open-source) |
| **CSS & Design System** | Tailwind CSS | **MIT License** | Tailwind Labs | **None** (Open-source CSS framework) |
| **Vector Piece Art** | cburnett SVG Vector Set | **CC BY-SA 3.0 / GPL** | Colin M.L. Burnett | **None** (Standard tournament vector set) |
| **Sound Synthesis** | Web Audio API | **W3C Open Web Standard** | W3C Standard | **None** (Built into browser engine) |
| **Local Database** | Structured JSON / SQLite | **Public Domain** | SQLite Consortium | **None** (Flat local file storage) |

---

## 3. Legal & Distribution Safety

1. **GPLv3 Compliance**:
   - Stockfish 19 is distributed as an independent, stand-alone executable binary in `bin/stockfish.exe`.
   - Communication occurs strictly through standard operating system `stdin`/`stdout` text streams (UCI protocol) as an external process.
   - This cleanly maintains modularity and respects GNU GPLv3 terms.
2. **Offline Privacy**:
   - The application does not collect analytics, logs, or telemetry.
   - All games and personal mistake analyses remain exclusively on the user's hard drive.
