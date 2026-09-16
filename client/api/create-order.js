import Razorpay from 'razorpay';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { amount, currency = 'INR', receipt } = req.body || {};

    if (amount === undefined || typeof amount !== 'number' || amount < 100) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required and must be at least 100 paise (?1.00)'
      });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return res.status(401).json({
        success: false,
        error: 'Razorpay authentication failed: missing credentials on server'
      });
    }

    const razorpay = new Razorpay({ key_id, key_secret });
    const orderReceipt = receipt ? String(receipt) : `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency: (currency || 'INR').toUpperCase(),
      receipt: orderReceipt
    });

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error('[Vercel create-order Error]:', err);
    const statusCode = err.statusCode || (err.error?.code === 'BAD_REQUEST_ERROR' ? 400 : 500);
    return res.status(statusCode).json({
      success: false,
      error: err.error?.description || err.message || 'Failed to create Razorpay order'
    });
  }
}
