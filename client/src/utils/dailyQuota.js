/**
 * dailyQuota.js - Manages the 3-free-reviews-per-day quota for verified user accounts.
 * 
 * In accordance with commercial requirements:
 * - Free users with verified accounts receive strictly 3 full match reviews per day.
 * - Only verified Pro accounts (activated via live Razorpay payment) have unlimited reviews.
 * - Unauthenticated visitors must sign in/verify to access match reviews.
 * - Quota resets automatically at midnight local time.
 */

export const DAILY_LIMIT = 3;
export const QUOTA_STORAGE_KEY = 'apex_daily_free_reviews';
const AUTH_USER_KEY = 'apex_auth_user';

/**
 * Helper to retrieve currently authenticated user from localStorage.
 */
function getActiveUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Checks if the current authenticated user has an active, unexpired Pro license.
 * Logged-out visitors are NEVER unlimited.
 */
export function isUserUnlimited() {
  try {
    const user = getActiveUser();
    if (!user) {
      // Visitor / Logged-out -> Never unlimited
      return false;
    }

    if (user.plan === 'pro' || user.isPro) {
      // Check expiration for monthly/annual plans
      if (user.proExpiresAt) {
        const expireTime = new Date(user.proExpiresAt).getTime();
        if (Date.now() > expireTime) {
          return false; // Subscription expired
        }
      }
      return true;
    }

    // Optional license fallback matching this specific user
    const proRaw = localStorage.getItem('apex_pro_license');
    if (proRaw) {
      const parsed = JSON.parse(proRaw);
      const matchesUser = (parsed.userId && parsed.userId === user.id) ||
                          (parsed.userEmail && parsed.userEmail.toLowerCase() === user.email.toLowerCase());
      if (matchesUser && parsed.isPro) {
        const exp = parsed.expiresAt || parsed.proExpiresAt;
        if (exp && Date.now() > new Date(exp).getTime()) {
          return false; // Expired
        }
        return true;
      }
    }
  } catch (e) {
    console.warn('[dailyQuota] Error inspecting unlimited status:', e);
  }
  return false;
}

/**
 * Checks if the current user has a permanent Lifetime membership (or ₹1 demo).
 * Monthly and Annual plans are NEVER lifetime.
 * Logged-out visitors are NEVER lifetime.
 */
export function isUserLifetime() {
  try {
    const user = getActiveUser();
    if (!user) {
      // Visitor / Logged-out -> Never lifetime
      return false;
    }

    // Must be Pro
    if (!user.isPro && user.plan !== 'pro') {
      return false;
    }

    // Monthly & Annual plans are explicitly NOT lifetime
    if (user.planDuration === 'monthly' || user.planDuration === 'annual') {
      return false;
    }
    if (user.planId === 'monthly' || user.planId === 'annual') {
      return false;
    }

    // If an active expiration timestamp exists, it is a timed subscription, NOT lifetime
    if (user.proExpiresAt) {
      return false;
    }

    // Explicit lifetime or demo grants
    if (user.isLifetime === true || user.planDuration === 'lifetime' || user.planId === 'lifetime' || user.planId === 'demo') {
      return true;
    }

    // Fallback license check strictly matching this user
    const proRaw = localStorage.getItem('apex_pro_license');
    if (proRaw) {
      const parsed = JSON.parse(proRaw);
      const matchesUser = (parsed.userId && parsed.userId === user.id) ||
                          (parsed.userEmail && parsed.userEmail.toLowerCase() === user.email.toLowerCase());
      if (matchesUser && parsed.isPro) {
        if (parsed.planDuration === 'monthly' || parsed.planDuration === 'annual') return false;
        if (parsed.planId === 'monthly' || parsed.planId === 'annual') return false;
        if (parsed.expiresAt || parsed.proExpiresAt) return false;
        if (parsed.isLifetime === true || parsed.planDuration === 'lifetime' || parsed.planId === 'lifetime' || parsed.planId === 'demo') {
          return true;
        }
      }
    }
  } catch (e) {}
  return false;
}

/**
 * Returns today's date in local YYYY-MM-DD format.
 */
export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets current daily quota status for the active user:
 * {
 *   isUnlimited: boolean,
 *   usedCount: number,
 *   remainingCount: number,
 *   maxAllowed: number,
 *   canReview: boolean,
 *   requiresLogin: boolean,
 *   date: string
 * }
 */
export function getDailyQuota() {
  const today = getTodayDateString();
  const currentUser = getActiveUser();

  // If no user is logged in, they must sign in / are on default free visitor tier
  if (!currentUser) {
    return {
      isUnlimited: false,
      usedCount: 0,
      remainingCount: DAILY_LIMIT,
      maxAllowed: DAILY_LIMIT,
      canReview: false,
      requiresLogin: true,
      date: today
    };
  }

  // Authenticated Pro users have unlimited reviews
  if (isUserUnlimited()) {
    return {
      isUnlimited: true,
      usedCount: 0,
      remainingCount: Infinity,
      maxAllowed: DAILY_LIMIT,
      canReview: true,
      requiresLogin: false,
      date: today
    };
  }

  // Read used count from user profile or local quota cache
  let usedCount = 0;
  if (currentUser.dailyReviews && currentUser.dailyReviews.date === today) {
    usedCount = currentUser.dailyReviews.count || 0;
  } else {
    try {
      const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.date === today && typeof parsed.count === 'number') {
          usedCount = parsed.count;
        }
      }
    } catch (e) {}
  }

  const remainingCount = Math.max(0, DAILY_LIMIT - usedCount);
  const canReview = usedCount < DAILY_LIMIT;

  return {
    isUnlimited: false,
    usedCount,
    remainingCount,
    maxAllowed: DAILY_LIMIT,
    canReview,
    requiresLogin: false,
    date: today
  };
}

/**
 * Consumes 1 review from today's quota locally.
 * Returns the fresh quota state after consumption.
 */
export function consumeDailyReview() {
  if (isUserUnlimited()) {
    return getDailyQuota();
  }

  const today = getTodayDateString();
  let currentCount = 0;

  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.date === today && typeof parsed.count === 'number') {
        currentCount = parsed.count;
      }
    }
  } catch (e) {}

  const newCount = currentCount + 1;

  try {
    localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify({
      date: today,
      count: newCount
    }));

    // Update currentUser in local storage as well
    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    if (rawUser) {
      const user = JSON.parse(rawUser);
      user.dailyReviews = {
        date: today,
        count: newCount,
        remaining: Math.max(0, DAILY_LIMIT - newCount),
        max: DAILY_LIMIT
      };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.warn('[dailyQuota] Error saving consumed quota:', e);
  }

  return getDailyQuota();
}
