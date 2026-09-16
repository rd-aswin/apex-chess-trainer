import { getUserByToken, setCorsHeaders } from './_store.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;

    if (!token) {
      return res.status(401).json({ success: false, error: 'No authorization token provided.' });
    }

    const user = getUserByToken(token);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Session expired or invalid token.' });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('[Vercel Auth Me Error]:', err);
    return res.status(500).json({ success: false, error: 'Server error retrieving user.' });
  }
}
