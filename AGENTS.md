# Workspace Rules: Strict Planning & Exploration Guardrails

## 1. Zero Premature Code During Planning
- When the user indicates they are planning, discussing, brainstorming, exploring architecture, or deciding what to add/remove, the assistant must **NEVER** write or generate project source code files, scaffolding, or build scripts in the workspace.
- The workspace must remain completely clean until the user explicitly, unambiguously gives instructions to begin coding (e.g., "start coding now", "proceed with implementation").

## 2. Deep Documentation & Collaborative Exploration
- While in planning mode, all output must take the form of comprehensive documentation, architecture specifications, research findings, and collaborative discussion.
- Acknowledge that in early planning phases, nothing is fixed; all options, trade-offs, and design ideas must be explored collaboratively.
