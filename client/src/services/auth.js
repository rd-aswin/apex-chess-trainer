import { API_BASE } from '../config';

const AUTH_TOKEN_KEY = 'apex_auth_token';
const AUTH_USER_KEY = 'apex_auth_user';

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || null;
  } catch (e) {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (e) {}
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
    // Notify app of auth change
    window.dispatchEvent(new CustomEvent('apex_auth_changed', { detail: user }));
  } catch (e) {}
}

/**
 * Validates session token with the backend and returns the fresh user object with live daily quota.
 */
export async function fetchCurrentUser() {
  const token = getAuthToken();
  if (!token) {
    setStoredUser(null);
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        setStoredUser(data.user);
        return data.user;
      }
    }

    // Token invalid or expired
    setAuthToken(null);
    setStoredUser(null);
    return null;
  } catch (err) {
    // Offline fallback: return cached user
    return getStoredUser();
  }
}

/**
 * Register a new user account.
 */
export async function registerAccount({ email, name, password }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, password })
  });
  return res.json();
}

/**
 * Verify 6-digit OTP code and complete login.
 */
export async function verifyAccountCode({ email, code }) {
  const res = await fetch(`${API_BASE}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code })
  });
  const data = await res.json();

  if (data.success && data.token) {
    setAuthToken(data.token);
    setStoredUser(data.user);
  }

  return data;
}

/**
 * Log in with email and password.
 */
export async function loginAccount({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if (data.success && data.token) {
    setAuthToken(data.token);
    setStoredUser(data.user);
  }

  return data;
}

/**
 * Log out user and clear stored tokens.
 */
export async function logoutAccount() {
  const token = getAuthToken();
  if (token) {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
  }
  setAuthToken(null);
  setStoredUser(null);
}

/**
 * Consumes 1 review on the server for the authenticated user.
 * Enforces the strict 3 free reviews per day limit.
 */
export async function consumeServerReview() {
  const token = getAuthToken();
  if (!token) {
    return {
      success: false,
      authRequired: true,
      error: 'Please sign in or create a free account to access match reviews.'
    };
  }

  const res = await fetch(`${API_BASE}/auth/consume-review`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  if (data.success) {
    // Refresh user state
    await fetchCurrentUser();
  }
  return data;
}
