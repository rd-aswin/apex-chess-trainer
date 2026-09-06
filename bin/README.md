# Stockfish 19 NNUE Engine Binary

This directory contains the official **Stockfish 19** binary with embedded dual neural networks (`nn-1a298aa575a0.nnue`), optimized for x86-64 modern CPUs with AVX-512 / AVX2 instructions.

## File Tracking
* `stockfish.exe` (~98.3 MiB) is tracked via **Git LFS** (Git Large File Storage).
* Ensure you have Git LFS installed (`git lfs install`) and run `git lfs pull` after cloning.

## Engine Configuration
* **Skill Level**: 20 (Locked Superhuman difficulty, ~3650+ Elo)
* **Hash**: 256 MB (configurable in `server/engine.js`)
* **Threads**: Auto-detected up to 8 threads
* **UCI Protocol**: Managed via standard input/output pipes in `server/engine.js`

For more details or alternative OS builds (Linux/macOS), visit the official Stockfish project:
https://stockfishchess.org/download/