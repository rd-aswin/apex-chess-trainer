import { getUserByToken, consumeUserReview, setCorsHeaders } from './_store.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        authRequired: true,
        error: 'Please sign in or create a free account to access match reviews.'
      });
    }

    const user = getUserByToken(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        authRequired: true,
        error: 'Session expired. Please sign in again.'
      });
    }

    const result = consumeUserReview(user.id);
    return res.status(result.success ? 200 : 403).json(result);
  } catch (err) {
    console.error('[Vercel Auth Consume Review Error]:', err);
    return res.status(500).json({ success: false, error: 'Server error consuming review.' });
  }
}
