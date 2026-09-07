/**
 * Centralized Application Configuration
 * Dynamically resolves API_BASE from VITE_API_BASE environment variable in production (e.g. Hugging Face Spaces),
 * falling back to local Express server on port 5000 during development.
 */
export const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? 'https://apex-chess-api.onrender.com/api' : 'http://localhost:5000/api');
