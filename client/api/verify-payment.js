import crypto from 'crypto';
import { upgradeUserToPro } from './auth/_store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are all required'
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return res.status(401).json({
        success: false,
        error: 'Razorpay key secret not configured on server'
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Upgrade user account to Pro if authenticated or email provided
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;
      let upgradedUser = null;
      try {
        if (token || email) {
          upgradedUser = await upgradeUserToPro({ email, token });
        }
      } catch (upgradeErr) {
        console.warn('[verify-payment] Failed to upgrade user in KV:', upgradeErr.message);
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        user: upgradedUser
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Signature verification failed: payment signature does not match'
      });
    }
  } catch (err) {
    console.error('[Vercel verify-payment Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Error verifying payment signature'
    });
  }
}
