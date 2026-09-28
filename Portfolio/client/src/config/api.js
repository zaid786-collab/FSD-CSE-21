/**
 * Frontend API Configuration & Universal Fetch Adapter
 * Connects React frontend components to the backend API specified by VITE_API_URL.
 * Supports dual-authentication: Bearer tokens via sessionStorage and HTTP-only cookies.
 */

// Normalized base URL without trailing slashes
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

// SessionStorage token key for admin authentication
export const AUTH_TOKEN_KEY = 'mzk_auth_token';

/**
 * Retrieves the current JWT admin token from sessionStorage if present.
 * @returns {string|null}
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  try {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    return (token && token.trim()) ? token.trim() : null;
  } catch (e) {
    return null;
  }
}

/**
 * Stores the JWT admin token in sessionStorage.
 * @param {string} token
 */
export function setAuthToken(token) {
  if (typeof window === 'undefined') return;
  try {
    if (token && typeof token === 'string' && token.trim()) {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token.trim());
    } else {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (e) {}
}

/**
 * Removes the JWT admin token from sessionStorage.
 */
export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (e) {}
}

/**
 * Returns a fully-qualified URL for an API endpoint if VITE_API_URL is configured,
 * otherwise returns the relative path.
 * 
 * @param {string} endpoint e.g. '/api/portfolio'
 * @returns {string} e.g. 'https://fsd-cse-21.onrender.com/api/portfolio'
 */
export function apiUrl(endpoint) {
  if (!API_BASE_URL) return endpoint;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
}

/**
 * Helper to safely attach Authorization Bearer header for protected /api/admin calls
 * without clobbering existing headers.
 */
function applyAuthHeader(url, init = {}) {
  const token = getAuthToken();
  const isAdminEndpoint = typeof url === 'string' && url.includes('/api/admin');

  // Only attach if it's an admin endpoint and a valid token exists
  if (!isAdminEndpoint || !token) {
    return init ? init.headers : undefined;
  }

  const existingHeaders = init ? init.headers : undefined;
  if (!existingHeaders) {
    return { Authorization: `Bearer ${token}` };
  }

  if (existingHeaders instanceof Headers) {
    if (!existingHeaders.has('Authorization')) {
      existingHeaders.set('Authorization', `Bearer ${token}`);
    }
    return existingHeaders;
  }

  if (Array.isArray(existingHeaders)) {
    const hasAuth = existingHeaders.some(([k]) => k.toLowerCase() === 'authorization');
    if (!hasAuth) {
      return [...existingHeaders, ['Authorization', `Bearer ${token}`]];
    }
    return existingHeaders;
  }

  if (typeof existingHeaders === 'object') {
    const hasAuth = Object.keys(existingHeaders).some(k => k.toLowerCase() === 'authorization');
    if (!hasAuth) {
      return {
        ...existingHeaders,
        Authorization: `Bearer ${token}`
      };
    }
    return existingHeaders;
  }

  return existingHeaders;
}

/**
 * Custom fetch helper with credentials, auth header, and base URL pre-configured
 */
export async function apiFetch(endpoint, options = {}) {
  const url = apiUrl(endpoint);
  const headers = applyAuthHeader(url, options);
  const config = {
    credentials: 'include',
    ...options,
    ...(headers !== undefined ? { headers } : {})
  };
  return fetch(url, config);
}

// Global fetch auto-interceptor:
// 1. Prepend API_BASE_URL when targeting relative '/api' endpoints.
// 2. Automatically attach credentials: 'include' for cross-domain cookie support.
// 3. Automatically attach Authorization: Bearer <token> for protected /api/admin/* endpoints.
if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string') {
      let targetUrl = input;
      let isApiCall = false;

      if (input.startsWith('/api')) {
        targetUrl = API_BASE_URL ? `${API_BASE_URL}${input}` : input;
        isApiCall = true;
      } else if (API_BASE_URL && input.startsWith(API_BASE_URL)) {
        isApiCall = true;
      }

      if (isApiCall) {
        const headers = applyAuthHeader(targetUrl, init);
        const modifiedInit = {
          ...init,
          credentials: (init && init.credentials) ? init.credentials : 'include',
          ...(headers !== undefined ? { headers } : {})
        };
        return originalFetch.call(this, targetUrl, modifiedInit);
      }
    }
    return originalFetch.call(this, input, init);
  };
}
