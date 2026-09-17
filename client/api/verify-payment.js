import crypto from 'crypto';
import { upgradeUserToPro, kvCommand, AUTHORIZED_PLANS } from './auth/_store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, planId: clientPlanId } = req.body || {};

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

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Signature verification failed: payment signature does not match'
      });
    }

    // 1. Anti-Replay Defense: Verify this payment ID hasn't already been claimed
    try {
      const existingClaim = await kvCommand(['GET', `payment:${razorpay_payment_id}`]);
      if (existingClaim) {
        return res.status(409).json({
          success: false,
          error: 'This payment has already been verified and credited to an account.'
        });
      }
    } catch (replayErr) {
      console.warn('[verify-payment] Replay check warning:', replayErr.message);
    }

    // 2. Resolve verified planId from authoritative KV order record
    let targetPlanId = clientPlanId || 'lifetime';
    let orderMetadata = null;
    try {
      const rawOrder = await kvCommand(['GET', `order:${razorpay_order_id}`]);
      if (rawOrder) {
        orderMetadata = typeof rawOrder === 'string' ? JSON.parse(rawOrder) : rawOrder;
        if (orderMetadata?.planId) {
          targetPlanId = orderMetadata.planId;
        }
      }
    } catch (orderLookupErr) {
      console.warn('[verify-payment] Order lookup warning:', orderLookupErr.message);
    }

    // 3. Upgrade user account to Pro with exact plan duration
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;
    let upgradedUser = null;
    try {
      if (token || email) {
        upgradedUser = await upgradeUserToPro({ email, token, planId: targetPlanId });
      }
    } catch (upgradeErr) {
      console.warn('[verify-payment] Failed to upgrade user in KV:', upgradeErr.message);
    }

    // 4. Mark payment ID as permanently claimed in Upstash KV (prevents reuse)
    try {
      await kvCommand([
        'SET',
        `payment:${razorpay_payment_id}`,
        JSON.stringify({
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          planId: targetPlanId,
          userEmail: upgradedUser?.email || email || null,
          claimedAt: Date.now()
        })
      ]);
    } catch (claimErr) {
      console.warn('[verify-payment] Could not mark payment claimed in KV:', claimErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      planId: targetPlanId,
      planDuration: upgradedUser?.planDuration || (targetPlanId === 'monthly' ? 'monthly' : 'lifetime'),
      isLifetime: upgradedUser?.isLifetime ?? (targetPlanId === 'lifetime' || targetPlanId === 'demo'),
      proExpiresAt: upgradedUser?.proExpiresAt || null,
      user: upgradedUser
    });
  } catch (err) {
    console.error('[Vercel verify-payment Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Error verifying payment signature'
    });
  }
}
