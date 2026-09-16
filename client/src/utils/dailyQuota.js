/**
 * dailyQuota.js - Manages the 3-free-reviews-per-day zero-setup quota.
 * 
 * Free / zero-setup users get 3 full match reviews per day.
 * Users with a Pro license ('apex_pro_license') or a personal Gemini key ('apex_gemini_key')
 * have unlimited reviews.
 * 
 * Quota resets automatically at midnight local time.
 */

export const DAILY_LIMIT = 3;
export const QUOTA_STORAGE_KEY = 'apex_daily_free_reviews';

/**
 * Checks if the current user has unlimited reviews (Pro license or BYOK Gemini key).
 */
export function isUserUnlimited() {
  try {
    // 1. Pro License check
    const proRaw = localStorage.getItem('apex_pro_license');
    if (proRaw) {
      const parsed = JSON.parse(proRaw);
      if (parsed && parsed.isPro) return true;
    }

    // 2. Personal Gemini API Key check (BYOK)
    const geminiKey = localStorage.getItem('apex_gemini_key');
    if (geminiKey && geminiKey.trim().length > 0) return true;
  } catch (e) {
    console.warn('[dailyQuota] Error inspecting unlimited status:', e);
  }
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
 * Gets current daily quota status:
 * {
 *   isUnlimited: boolean,
 *   usedCount: number,
 *   remainingCount: number,
 *   maxAllowed: number,
 *   canReview: boolean,
 *   date: string
 * }
 */
export function getDailyQuota() {
  if (isUserUnlimited()) {
    return {
      isUnlimited: true,
      usedCount: 0,
      remainingCount: Infinity,
      maxAllowed: DAILY_LIMIT,
      canReview: true,
      date: getTodayDateString()
    };
  }

  const today = getTodayDateString();
  let usedCount = 0;

  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Automatic midnight reset: if date !== today, count is fresh 0
      if (parsed && parsed.date === today && typeof parsed.count === 'number') {
        usedCount = parsed.count;
      }
    }
  } catch (e) {
    console.warn('[dailyQuota] Error reading quota storage:', e);
  }

  const remainingCount = Math.max(0, DAILY_LIMIT - usedCount);
  const canReview = usedCount < DAILY_LIMIT;

  return {
    isUnlimited: false,
    usedCount,
    remainingCount,
    maxAllowed: DAILY_LIMIT,
    canReview,
    date: today
  };
}

/**
 * Consumes 1 review from today's quota.
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
  } catch (e) {
    console.warn('[dailyQuota] Error saving consumed quota:', e);
  }

  return getDailyQuota();
}
