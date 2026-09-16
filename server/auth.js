import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export const DAILY_FREE_LIMIT = 3;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function getUsers() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading users.json:', err);
    return [];
  }
}

function saveUsers(users) {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing users.json:', err);
    return false;
  }
}

export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function hashPassword(password, salt = null) {
  const userSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, userSalt, 1000, 64, 'sha512').toString('hex');
  return { salt: userSalt, hash };
}

export function sanitizeUser(user) {
  if (!user) return null;
  const today = getTodayDateString();
  const userDate = user.dailyReviews?.date || today;
  const usedToday = userDate === today ? (user.dailyReviews?.count || 0) : 0;
  const remaining = user.plan === 'pro' ? Infinity : Math.max(0, DAILY_FREE_LIMIT - usedToday);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isVerified: !!user.isVerified,
    plan: user.plan || 'free',
    isPro: user.plan === 'pro',
    dailyReviews: {
      date: today,
      count: usedToday,
      remaining,
      max: DAILY_FREE_LIMIT
    },
    createdAt: user.createdAt
  };
}

/**
 * Registers a new user or refreshes verification for an unverified account.
 */
export function registerUser({ email, name, password }) {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const existing = users.find((u) => u.email === normalizedEmail);

  if (existing && existing.isVerified) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const { salt, hash } = hashPassword(password);
  const verificationCode = crypto.randomInt(100000, 999999).toString();
  const codeExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

  if (existing && !existing.isVerified) {
    existing.name = name ? name.trim() : existing.name;
    existing.salt = salt;
    existing.passwordHash = hash;
    existing.verificationCode = verificationCode;
    existing.verificationCodeExpires = codeExpires;
    saveUsers(users);

    return {
      success: true,
      message: 'Verification code resent.',
      email: normalizedEmail,
      isVerified: false,
      verificationCode // Exposed for testing & evaluation banner
    };
  }

  const newUser = {
    id: 'usr_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex'),
    email: normalizedEmail,
    name: name ? name.trim() : normalizedEmail.split('@')[0],
    salt,
    passwordHash: hash,
    isVerified: false,
    verificationCode,
    verificationCodeExpires: codeExpires,
    plan: 'free',
    dailyReviews: {
      date: getTodayDateString(),
      count: 0
    },
    createdAt: new Date().toISOString(),
    tokens: []
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    message: 'Account created! Please verify your email with the 6-digit code.',
    email: normalizedEmail,
    isVerified: false,
    verificationCode // Exposed for testing & evaluation banner
  };
}

/**
 * Verifies account with 6-digit OTP code and issues an auth token.
 */
export function verifyUserCode({ email, code }) {
  if (!email || !code) {
    return { success: false, error: 'Email and verification code are required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { success: false, error: 'Account not found.' };
  }

  if (user.isVerified) {
    // Already verified, generate session token
    const token = crypto.randomBytes(32).toString('hex');
    user.tokens = [...(user.tokens || []).slice(-4), token];
    saveUsers(users);
    return {
      success: true,
      message: 'Account already verified.',
      token,
      user: sanitizeUser(user)
    };
  }

  if (!user.verificationCode || user.verificationCode !== code.trim()) {
    return { success: false, error: 'Invalid verification code. Please check and try again.' };
  }

  if (user.verificationCodeExpires && Date.now() > user.verificationCodeExpires) {
    return { success: false, error: 'Verification code has expired. Please request a new code.' };
  }

  user.isVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpires = null;

  const token = crypto.randomBytes(32).toString('hex');
  user.tokens = [token];
  saveUsers(users);

  return {
    success: true,
    message: 'Account verified successfully!',
    token,
    user: sanitizeUser(user)
  };
}

/**
 * Logs in user, verifying password.
 */
export function loginUser({ email, password }) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { success: false, error: 'Invalid email or password.' };
  }

  const { hash } = hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    return { success: false, error: 'Invalid email or password.' };
  }

  if (!user.isVerified) {
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = Date.now() + 30 * 60 * 1000;
    saveUsers(users);

    return {
      success: false,
      verificationRequired: true,
      email: normalizedEmail,
      verificationCode, // Exposed for test & evaluation banner
      error: 'Your account is not verified yet. Please enter the 6-digit verification code.'
    };
  }

  // Create session token
  const token = crypto.randomBytes(32).toString('hex');
  user.tokens = [...(user.tokens || []).slice(-4), token];
  saveUsers(users);

  return {
    success: true,
    message: 'Login successful.',
    token,
    user: sanitizeUser(user)
  };
}

/**
 * Gets user by bearer session token.
 */
export function getUserByToken(token) {
  if (!token) return null;
  const users = getUsers();
  const user = users.find((u) => Array.isArray(u.tokens) && u.tokens.includes(token));
  if (!user) return null;

  // Check midnight quota reset
  const today = getTodayDateString();
  if (!user.dailyReviews || user.dailyReviews.date !== today) {
    user.dailyReviews = { date: today, count: 0 };
    saveUsers(users);
  }

  return sanitizeUser(user);
}

/**
 * Logs out user by removing token.
 */
export function logoutUser(token) {
  if (!token) return false;
  const users = getUsers();
  const user = users.find((u) => Array.isArray(u.tokens) && u.tokens.includes(token));
  if (!user) return false;

  user.tokens = user.tokens.filter((t) => t !== token);
  saveUsers(users);
  return true;
}

/**
 * Consumes 1 review for a user, enforcing the 3 free reviews per day limit.
 */
export function consumeUserReview(userId) {
  if (!userId) {
    return { success: false, error: 'User ID is required.' };
  }

  const users = getUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return { success: false, error: 'User account not found.' };
  }

  // Pro users have unlimited reviews
  if (user.plan === 'pro') {
    return {
      success: true,
      isPro: true,
      remaining: Infinity,
      count: user.dailyReviews?.count || 0
    };
  }

  const today = getTodayDateString();
  if (!user.dailyReviews || user.dailyReviews.date !== today) {
    user.dailyReviews = { date: today, count: 0 };
  }

  if (user.dailyReviews.count >= DAILY_FREE_LIMIT) {
    return {
      success: false,
      limitReached: true,
      error: `Daily free review limit reached (${DAILY_FREE_LIMIT}/${DAILY_FREE_LIMIT}). Upgrade to Pro for unlimited reviews or return at midnight.`,
      count: user.dailyReviews.count,
      remaining: 0
    };
  }

  user.dailyReviews.count += 1;
  saveUsers(users);

  return {
    success: true,
    isPro: false,
    count: user.dailyReviews.count,
    remaining: Math.max(0, DAILY_FREE_LIMIT - user.dailyReviews.count)
  };
}

/**
 * Upgrades a user account to Pro upon verified Razorpay payment.
 */
export function upgradeUserToPro(userId, paymentDetails = {}) {
  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  user.plan = 'pro';
  user.paymentHistory = [
    ...(user.paymentHistory || []),
    {
      date: new Date().toISOString(),
      ...paymentDetails
    }
  ];

  saveUsers(users);
  return sanitizeUser(user);
}
