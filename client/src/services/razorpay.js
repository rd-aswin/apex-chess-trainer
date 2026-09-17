import { API_BASE } from '../config.js';
import { getAuthToken, fetchCurrentUser, getStoredUser, setStoredUser } from './auth';

/**
 * Ensures Razorpay Checkout script is loaded on the page.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay Standard Web Checkout:
 * 1. Calls backend /api/create-order
 * 2. Launches Razorpay modal with order_id
 * 3. On success, calls backend /api/verify-payment to verify signature
 */
export async function initiateRazorpayCheckout({
  planId = 'monthly',
  amount, // in paise (e.g., 39900 = ₹399.00)
  currency = 'INR',
  planName = 'Apex Pro',
  description = 'Apex Chess Trainer Pro Upgrade',
  prefill = null,
  onSuccess = null,
  onFailure = null,
  onDismiss = null
}) {
  try {
    if (!amount || amount < 100) {
      throw new Error('Minimum order amount is 100 paise (₹1.00)');
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      throw new Error('Razorpay Checkout SDK failed to load. Check your network connection.');
    }

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TchwtnFfnGv7OO';

    // Step 1: Create Order on Backend with authoritative planId
    const orderRes = await fetch(`${API_BASE}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        amount: Math.round(amount),
        currency,
        receipt: `rcpt_${Date.now()}`
      })
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.success || !orderData.order_id) {
      throw new Error(orderData.error || 'Failed to create payment order with server');
    }

    // Step 2: Open Razorpay Checkout Modal
    const options = {
      key: keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Apex Chess Trainer',
      description: description || planName,
      image: '/logo192.png',
      order_id: orderData.order_id,
      handler: async function (response) {
        try {
          // Step 3: Verify Payment Signature on Backend
          const authToken = getAuthToken();
          const currentUser = getStoredUser();
          const verifyRes = await fetch(`${API_BASE}/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: orderData.planId || planId,
              email: currentUser?.email || prefill?.email || null
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            // Update authenticated user in state/store immediately
            if (verifyData.user) {
              setStoredUser(verifyData.user);
            } else {
              try {
                await fetchCurrentUser();
              } catch (e) {}
            }

            const activeUser = verifyData.user || getStoredUser();
            const isMonthlyOrAnnual = (verifyData.planDuration === 'monthly' || verifyData.planDuration === 'annual' || planId === 'monthly' || planId === 'annual');
            const calculatedIsLifetime = isMonthlyOrAnnual ? false : (verifyData.isLifetime ?? (planId === 'lifetime' || planId === 'demo'));

            // Save paid status locally strictly scoped to the active user
            if (activeUser) {
              try {
                localStorage.setItem('apex_pro_license', JSON.stringify({
                  userId: activeUser.id,
                  userEmail: activeUser.email,
                  isPro: true,
                  plan: planName,
                  planId: verifyData.planId || orderData.planId || planId,
                  planDuration: verifyData.planDuration || (planId === 'monthly' ? 'monthly' : 'lifetime'),
                  isLifetime: calculatedIsLifetime,
                  expiresAt: verifyData.proExpiresAt || null,
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  activatedAt: new Date().toISOString()
                }));
              } catch (e) {}
            }

            if (onSuccess) {
              onSuccess({
                ...verifyData,
                planName,
                planId: verifyData.planId || orderData.planId || planId,
                planDuration: verifyData.planDuration || (planId === 'monthly' ? 'monthly' : 'lifetime'),
                isLifetime: calculatedIsLifetime,
                expiresAt: verifyData.proExpiresAt || null,
                amount: orderData.amount,
                currency: orderData.currency
              });
            }
          } else {
            throw new Error(verifyData.error || 'Payment signature verification failed');
          }
        } catch (verifyErr) {
          console.error('[Razorpay Verify Error]:', verifyErr);
          if (onFailure) onFailure(verifyErr);
        }
      },
      prefill: prefill || {
        name: 'Apex Chess Player',
        email: 'player@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#10b981',
        backdrop_color: 'rgba(15, 23, 42, 0.85)'
      },
      modal: {
        ondismiss: function () {
          console.log('[Razorpay Modal]: Dismissed by user');
          if (onDismiss) onDismiss();
        }
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (failResponse) {
      console.error('[Razorpay Payment Failed]:', failResponse.error);
      const errMsg = failResponse.error?.description || failResponse.error?.reason || 'Payment failed';
      if (onFailure) onFailure(new Error(errMsg));
    });

    rzp.open();
  } catch (err) {
    console.error('[Razorpay Checkout Error]:', err);
    if (onFailure) onFailure(err);
  }
}
