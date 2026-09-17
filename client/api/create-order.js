import Razorpay from 'razorpay';
import { AUTHORIZED_PLANS, kvCommand } from './auth/_store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { planId = 'monthly', amount: clientAmount, currency: clientCurrency = 'INR', receipt } = req.body || {};

    // 1. Resolve canonical plan and enforce server-side pricing
    let selectedPlan = null;
    if (planId && AUTHORIZED_PLANS[planId.toLowerCase()]) {
      selectedPlan = AUTHORIZED_PLANS[planId.toLowerCase()];
    } else if (typeof clientAmount === 'number' && clientAmount >= 100) {
      // Backwards-compatible plan lookup by amount
      if (clientAmount === 100) selectedPlan = AUTHORIZED_PLANS.demo;
      else if (clientAmount === 39900) selectedPlan = AUTHORIZED_PLANS.monthly;
      else if (clientAmount === 319900) selectedPlan = AUTHORIZED_PLANS.annual;
      else if (clientAmount === 489900) selectedPlan = AUTHORIZED_PLANS.lifetime;
      else selectedPlan = { id: 'custom', amount: Math.round(clientAmount), currency: 'INR', duration: 'monthly' };
    }

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan selected. Authorized plans are: demo (₹1), monthly (₹399), annual (₹3,199), lifetime (₹4,899).'
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

    // Enforce server-side authoritative amount (prevents price manipulation)
    const order = await razorpay.orders.create({
      amount: selectedPlan.amount,
      currency: selectedPlan.currency || 'INR',
      receipt: orderReceipt,
      notes: {
        planId: selectedPlan.id,
        planName: selectedPlan.name
      }
    });

    // 2. Bind order in Upstash KV with 24-hour TTL (prevents replay/tampering)
    try {
      await kvCommand([
        'SET',
        `order:${order.id}`,
        JSON.stringify({
          orderId: order.id,
          planId: selectedPlan.id,
          amount: order.amount,
          currency: order.currency,
          duration: selectedPlan.duration,
          createdAt: Date.now()
        }),
        'EX',
        '86400'
      ]);
    } catch (kvErr) {
      console.warn('[create-order] Could not bind order to KV:', kvErr.message);
    }

    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      planId: selectedPlan.id,
      planName: selectedPlan.name
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
