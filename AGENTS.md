# Workspace Rules: Strict Planning & Exploration Guardrails

## 1. Zero Premature Code During Planning
- When the user indicates they are planning, discussing, brainstorming, exploring architecture, or deciding what to add/remove, the assistant must **NEVER** write or generate project source code files, scaffolding, or build scripts in the workspace.
- The workspace must remain completely clean until the user explicitly, unambiguously gives instructions to begin coding (e.g., "start coding now", "proceed with implementation").

## 2. Deep Documentation & Collaborative Exploration
- While in planning mode, all output must take the form of comprehensive documentation, architecture specifications, research findings, and collaborative discussion.
- Acknowledge that in early planning phases, nothing is fixed; all options, trade-offs, and design ideas must be explored collaboratively.

## 3. Strict Pragmatism & Technical Honesty (No Overdoing, No Impossible Tasks)
- **Do only what is realistically possible and practical.** Do not over-engineer or attempt the impossible.
- Never attempt fragile, excessive, or unfeasible features just because they were mentioned or requested.
- If a request is technically unfeasible, unreliable, unrealistic at the current point in time, or simply not worth the time and complexity, **explicitly and plainly state that it is not possible or not recommended** upfront before wasting effort.
- Prioritize stable, simple, high-value implementations over complex, fragile gimmicks.

## 4. Local-Only Version Control (No Unconfirmed Remote Push)
- When instructed to save or commit locally without uploading, keep all changes strictly on local Git branches. Never execute `git push` until the user explicitly requests a remote upload.

## 5. Visibility of System Status for Asynchronous Compute
- Whenever a backend engine computation or network import takes longer than 1.5 seconds, the UI must render an immediate, high-visibility loading HUD (spinner, badge, estimated duration, and board interactivity tips).
- Handlers triggered upon async completion must receive the fresh payload directly as an argument rather than relying on React closure states.

## 6. Cloud Portability & Non-Root Container Standards
- Never hardcode OS-specific binary paths (e.g. `stockfish.exe`) or hardcoded `localhost:5000` endpoints in source files.
- Always support environment overrides (`STOCKFISH_PATH`, `PORT`, `VITE_API_BASE`).
- For Dockerized engine hosting (Hugging Face Spaces), enforce non-root user UID 1000 (`USER user`), bind to `0.0.0.0`, and default to port `7860`.

