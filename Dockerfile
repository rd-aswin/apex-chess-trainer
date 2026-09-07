# Base image: Node.js 20 LTS on Debian Bookworm Slim
FROM node:20-bookworm-slim

# Install system utilities and Stockfish chess engine
RUN apt-get update && apt-get install -y --no-install-recommends \
    stockfish \
    ca-certificates \
    && ln -s /usr/games/stockfish /usr/bin/stockfish \
    && rm -rf /var/lib/apt/lists/*

# Use non-root node user (UID 1000) built into node image
USER node
ENV HOME=/home/node \
    PATH=/home/node/.local/bin:$PATH \
    NODE_ENV=production \
    PORT=7860 \
    STOCKFISH_PATH=/usr/bin/stockfish

WORKDIR /home/node/app

# Copy dependency manifests first for Docker layer caching
COPY --chown=node:node package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy server code and data
COPY --chown=node:node server/ ./server/
COPY --chown=node:node data/ ./data/

# Default port
EXPOSE 7860

# Launch server
CMD ["node", "server/index.js"]
