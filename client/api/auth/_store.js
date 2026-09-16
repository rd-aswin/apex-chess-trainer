import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const USERS_FILE = path.join(os.tmpdir(), 'apex_users.json');
export const DAILY_FREE_LIMIT = 3;

// In-memory cache for warm serverless instances
let memoryUsers = null;

function ensureStore() {
  if (memoryUsers !== null) return memoryUsers;

  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      memoryUsers = JSON.parse(raw);
    } else {
      memoryUsers = [];
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[Vercel Auth Store] Fallback to in-memory store:', err.message);
    memoryUsers = [];
  }
  return memoryUsers;
}

function saveStore(users) {
  memoryUsers = users;
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('[Vercel Auth Store] Error persisting to /tmp:', err.message);
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

export function registerUser({ email, name, password }) {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = ensureStore();
  const existing = users.find((u) => u.email === normalizedEmail);

  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const { salt, hash } = hashPassword(password);
  const token = crypto.randomBytes(32).toString('hex');

  const newUser = {
    id: 'usr_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex'),
    email: normalizedEmail,
    name: name ? name.trim() : normalizedEmail.split('@')[0],
    salt,
    passwordHash: hash,
    isVerified: true,
    verificationCode: null,
    verificationCodeExpires: null,
    plan: 'free',
    dailyReviews: {
      date: getTodayDateString(),
      count: 0
    },
    createdAt: new Date().toISOString(),
    tokens: [token]
  };

  users.push(newUser);
  saveStore(users);

  return {
    success: true,
    message: 'Account created successfully! Welcome to Apex Chess Trainer.',
    token,
    user: sanitizeUser(newUser)
  };
}

export function verifyUserCode({ email, code }) {
  if (!email) {
    return { success: false, error: 'Email is required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = ensureStore();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { success: false, error: 'Account not found.' };
  }

  user.isVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpires = null;

  const token = crypto.randomBytes(32).toString('hex');
  user.tokens = [...(user.tokens || []).slice(-4), token];
  saveStore(users);

  return {
    success: true,
    message: 'Account verified successfully!',
    token,
    user: sanitizeUser(user)
  };
}

export function loginUser({ email, password }) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = ensureStore();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { success: false, error: 'Invalid email or password.' };
  }

  const { hash } = hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    return { success: false, error: 'Invalid email or password.' };
  }

  // Auto-activate any legacy unverified user
  user.isVerified = true;

  const token = crypto.randomBytes(32).toString('hex');
  user.tokens = [...(user.tokens || []).slice(-4), token];
  saveStore(users);

  return {
    success: true,
    message: 'Login successful.',
    token,
    user: sanitizeUser(user)
  };
}

export function getUserByToken(token) {
  if (!token) return null;
  const users = ensureStore();
  const user = users.find((u) => Array.isArray(u.tokens) && u.tokens.includes(token));
  if (!user) return null;

  const today = getTodayDateString();
  if (!user.dailyReviews || user.dailyReviews.date !== today) {
    user.dailyReviews = { date: today, count: 0 };
    saveStore(users);
  }

  return sanitizeUser(user);
}

export function logoutUser(token) {
  if (!token) return false;
  const users = ensureStore();
  const user = users.find((u) => Array.isArray(u.tokens) && u.tokens.includes(token));
  if (!user) return false;

  user.tokens = user.tokens.filter((t) => t !== token);
  saveStore(users);
  return true;
}

export function consumeUserReview(userId) {
  if (!userId) {
    return { success: false, error: 'User ID is required.' };
  }

  const users = ensureStore();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return { success: false, error: 'User account not found.' };
  }

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
  saveStore(users);

  return {
    success: true,
    isPro: false,
    count: user.dailyReviews.count,
    remaining: Math.max(0, DAILY_FREE_LIMIT - user.dailyReviews.count)
  };
}

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
