import {
  registerUser,
  verifyUserCode,
  loginUser,
  getUserByToken,
  logoutUser,
  consumeUserReview,
  setCorsHeaders
} from './_store.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action || req.url.split('?')[0].split('/').pop();

  try {
    switch (action) {
      case 'register': {
        if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
        const { email, name, password } = req.body || {};
        const result = registerUser({ email, name, password });
        return res.status(result.success ? 200 : 400).json(result);
      }

      case 'verify': {
        if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
        const { email, code } = req.body || {};
        const result = verifyUserCode({ email, code });
        return res.status(result.success ? 200 : 400).json(result);
      }

      case 'login': {
        if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
        const { email, password } = req.body || {};
        const result = loginUser({ email, password });
        return res.status(result.success ? 200 : 400).json(result);
      }

      case 'me': {
        if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;
        if (!token) return res.status(401).json({ success: false, error: 'No authorization token provided.' });
        const user = getUserByToken(token);
        if (!user) return res.status(401).json({ success: false, error: 'Session expired or invalid token.' });
        return res.status(200).json({ success: true, user });
      }

      case 'logout': {
        if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;
        if (token) logoutUser(token);
        return res.status(200).json({ success: true, message: 'Logged out successfully.' });
      }

      case 'consume-review': {
        if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
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
      }

      default:
        return res.status(404).json({ success: false, error: `Unknown auth action: ${action}` });
    }
  } catch (err) {
    console.error(`[Vercel Auth Error: ${action}]:`, err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
}
