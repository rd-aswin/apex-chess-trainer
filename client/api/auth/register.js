import { registerUser, setCorsHeaders } from './_store.js';

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { email, name, password } = req.body || {};
    const result = registerUser({ email, name, password });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error('[Vercel Auth Register Error]:', err);
    return res.status(500).json({ success: false, error: 'Server error registering user.' });
  }
}
