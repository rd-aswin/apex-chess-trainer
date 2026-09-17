import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export const DAILY_FREE_LIMIT = 3;
const USERS_FILE = path.join(os.tmpdir(), 'apex_users.json');

// In-memory cache for warm serverless instances / offline fallback
let memoryUsers = null;

// Support .env if process.env values are not preloaded by runtime
if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  try {
    const envPaths = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), '../.env'),
      path.resolve(process.cwd(), 'client/.env')
    ];
    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split('\n')) {
          const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
          if (match) {
            const key = match[1];
            let val = (match[2] || '').trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  } catch (e) {}
}

function getKvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return { url, token };
}

/**
 * Execute a command against Upstash Redis REST API using native fetch.
 * Returns the command result, or null on failure / unconfigured KV.
 */
export async function kvCommand(command) {
  const { url, token } = getKvConfig();
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('[Upstash KV Error]', res.status, errText);
      return null;
    }

    const data = await res.json();
    return data.result !== undefined ? data.result : null;
  } catch (err) {
    console.warn('[Upstash KV Network Error]:', err.message);
    return null;
  }
}

function parseKVResult(result) {
  if (!result) return null;
  if (typeof result === 'object') return result;
  try {
    return JSON.parse(result);
  } catch (e) {
    return result;
  }
}

function ensureLocalStore() {
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
    memoryUsers = [];
  }
  return memoryUsers;
}

function saveLocalStore(users) {
  memoryUsers = users;
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Fetch full user record from Upstash KV, falling back to local store.
 * Supports email or user ID.
 */
async function getUserRecord(identifier) {
  if (!identifier) return null;
  const isEmail = identifier.includes('@');
  let email = isEmail ? identifier.trim().toLowerCase() : null;

  if (!email) {
    const kvEmail = await kvCommand(['GET', `uid:${identifier}`]);
    if (kvEmail) {
      email = String(kvEmail).trim().toLowerCase();
    }
  }

  if (email) {
    const raw = await kvCommand(['GET', `user:${email}`]);
    const parsed = parseKVResult(raw);
    if (parsed) return parsed;
  }

  // Fallback to local memory / /tmp store
  const users = ensureLocalStore();
  return users.find((u) => u.email === identifier || u.id === identifier) || null;
}

/**
 * Save user record to both Upstash KV and local memory store.
 */
async function saveUser(user) {
  if (!user || !user.email) return false;

  // Persist to Upstash KV
  const userJson = JSON.stringify(user);
  const p1 = kvCommand(['SET', `user:${user.email}`, userJson]);
  const p2 = user.id ? kvCommand(['SET', `uid:${user.id}`, user.email]) : Promise.resolve();
  await Promise.all([p1, p2]);

  // Sync to local store
  const users = ensureLocalStore();
  const idx = users.findIndex((u) => u.email === user.email);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  saveLocalStore(users);
  return true;
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

export async function registerUser({ email, name, password }) {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await getUserRecord(normalizedEmail);

  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const { salt, hash } = hashPassword(password);
  const token = crypto.randomBytes(32).toString('hex');
  const userId = 'usr_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');

  const newUser = {
    id: userId,
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

  // Persist user and session token (30-day TTL)
  await saveUser(newUser);
  await kvCommand(['SET', `token:${token}`, normalizedEmail, 'EX', 30 * 86400]);

  return {
    success: true,
    message: 'Account created successfully! Welcome to Apex Chess Trainer.',
    token,
    user: sanitizeUser(newUser)
  };
}

export async function verifyUserCode({ email, code }) {
  if (!email) {
    return { success: false, error: 'Email is required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await getUserRecord(normalizedEmail);

  if (!user) {
    return { success: false, error: 'Account not found.' };
  }

  user.isVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpires = null;

  const token = crypto.randomBytes(32).toString('hex');
  user.tokens = [...(user.tokens || []).slice(-4), token];

  await saveUser(user);
  await kvCommand(['SET', `token:${token}`, normalizedEmail, 'EX', 30 * 86400]);

  return {
    success: true,
    message: 'Account verified successfully!',
    token,
    user: sanitizeUser(user)
  };
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await getUserRecord(normalizedEmail);

  if (!user) {
    return { success: false, error: 'Invalid email or password.' };
  }

  const { hash } = hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    return { success: false, error: 'Invalid email or password.' };
  }

  user.isVerified = true;

  const token = crypto.randomBytes(32).toString('hex');
  user.tokens = [...(user.tokens || []).slice(-4), token];

  await saveUser(user);
  await kvCommand(['SET', `token:${token}`, normalizedEmail, 'EX', 30 * 86400]);

  return {
    success: true,
    message: 'Login successful.',
    token,
    user: sanitizeUser(user)
  };
}

export async function getUserByToken(token) {
  if (!token) return null;

  let email = null;
  try {
    const res = await kvCommand(['GET', `token:${token}`]);
    if (res) email = String(res).trim().toLowerCase();
  } catch (e) {}

  let user = null;
  if (email) {
    user = await getUserRecord(email);
  }

  // Fallback to local memory store tokens
  if (!user) {
    const users = ensureLocalStore();
    user = users.find((u) => Array.isArray(u.tokens) && u.tokens.includes(token));
  }

  if (!user) return null;

  const today = getTodayDateString();
  if (!user.dailyReviews || user.dailyReviews.date !== today) {
    user.dailyReviews = { date: today, count: 0 };
    await saveUser(user);
  }

  return sanitizeUser(user);
}

export async function logoutUser(token) {
  if (!token) return false;

  try {
    await kvCommand(['DEL', `token:${token}`]);
  } catch (e) {}

  const users = ensureLocalStore();
  const user = users.find((u) => Array.isArray(u.tokens) && u.tokens.includes(token));
  if (user) {
    user.tokens = (user.tokens || []).filter((t) => t !== token);
    saveLocalStore(users);
  }
  return true;
}

export async function consumeUserReview(identifier) {
  if (!identifier) {
    return { success: false, error: 'User identifier is required.' };
  }

  const user = await getUserRecord(identifier);
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
  await saveUser(user);

  return {
    success: true,
    isPro: false,
    count: user.dailyReviews.count,
    remaining: Math.max(0, DAILY_FREE_LIMIT - user.dailyReviews.count)
  };
}

export async function upgradeUserToPro({ email, token }) {
  let targetEmail = email ? email.trim().toLowerCase() : null;

  if (!targetEmail && token) {
    const res = await kvCommand(['GET', `token:${token}`]);
    if (res) targetEmail = String(res).trim().toLowerCase();
    if (!targetEmail) {
      const users = ensureLocalStore();
      const u = users.find((usr) => Array.isArray(usr.tokens) && usr.tokens.includes(token));
      if (u) targetEmail = u.email;
    }
  }

  if (!targetEmail) return null;

  const user = await getUserRecord(targetEmail);
  if (!user) return null;

  user.plan = 'pro';
  user.proActivatedAt = new Date().toISOString();
  await saveUser(user);

  return sanitizeUser(user);
}

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
