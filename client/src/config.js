/**
 * Centralized Application Configuration
 * Dynamically resolves API_BASE.
 * In production on Vercel, defaults to '/api' (using native Vercel serverless functions),
 * unless a valid external backend override (e.g. Hugging Face Spaces) is explicitly provided.
 * Discards decommissioned Render URLs.
 */
const configuredBase = import.meta.env.VITE_API_BASE;
const isObsoleteRender = configuredBase && configuredBase.includes('onrender.com');

export const API_BASE = (configuredBase && !isObsoleteRender)
  ? configuredBase
  : (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
