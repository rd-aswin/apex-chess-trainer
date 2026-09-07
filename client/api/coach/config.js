export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      provider: 'gemini',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      geminiApiKey: process.env.GEMINI_API_KEY ? '••••••••' : '',
      ollamaUrl: 'http://localhost:11434',
      ollamaModel: 'llama3.2:3b'
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      ...(req.body || {})
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
