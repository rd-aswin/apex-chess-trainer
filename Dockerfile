# Base image: Node.js 20 LTS on Debian Bookworm Slim
FROM node:20-bookworm-slim

# Install system utilities and Stockfish chess engine
RUN apt-get update && apt-get install -y --no-install-recommends \
    stockfish \
    ca-certificates \
    && ln -s /usr/games/stockfish /usr/bin/stockfish \
    && rm -rf /var/lib/apt/lists/*

# Hugging Face Spaces requires running as non-root user with UID 1000
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    NODE_ENV=production \
    PORT=7860 \
    STOCKFISH_PATH=/usr/bin/stockfish

WORKDIR $HOME/app

# Copy dependency manifests first for Docker layer caching
COPY --chown=user:user package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy server code and data
COPY --chown=user:user server/ ./server/
COPY --chown=user:user data/ ./data/

# Hugging Face Spaces default port
EXPOSE 7860

# Launch server
CMD ["node", "server/index.js"]
