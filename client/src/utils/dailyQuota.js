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
 * Checks if the current authenticated user has an active, unexpired Pro license.
 */
export function isUserUnlimited() {
  try {
    // 1. Authenticated User Pro Plan check
    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user && (user.plan === 'pro' || user.isPro)) {
        if (user.proExpiresAt && Date.now() > new Date(user.proExpiresAt).getTime()) {
          return false; // Subscription expired
        }
        return true;
      }
    }

    // 2. Verified Pro License storage check
    const proRaw = localStorage.getItem('apex_pro_license');
    if (proRaw) {
      const parsed = JSON.parse(proRaw);
      if (parsed && parsed.isPro) {
        if (parsed.expiresAt && Date.now() > new Date(parsed.expiresAt).getTime()) {
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
 */
export function isUserLifetime() {
  try {
    // Check authenticated user profile
    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user && (user.plan === 'pro' || user.isPro)) {
        if (user.isLifetime) return true;
        if (user.planDuration === 'lifetime') return true;
        if (!user.proExpiresAt) return true; // Lifetime by default if no expiry
      }
    }

    // Check stored license
    const proRaw = localStorage.getItem('apex_pro_license');
    if (proRaw) {
      const parsed = JSON.parse(proRaw);
      if (parsed && parsed.isPro) {
        if (parsed.isLifetime || parsed.planDuration === 'lifetime') return true;
        if (parsed.plan && parsed.plan.toLowerCase().includes('lifetime')) return true;
        if (!parsed.expiresAt && !parsed.proExpiresAt) return true;
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

  // Pro users have unlimited reviews
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

  // Check if user is logged in
  let currentUser = null;
  try {
    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    if (rawUser) {
      currentUser = JSON.parse(rawUser);
    }
  } catch (e) {}

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
