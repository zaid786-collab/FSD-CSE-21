/**
 * Frontend API Configuration & Universal Fetch Adapter
 * Connects React frontend components to the backend API specified by VITE_API_URL.
 */

// Normalized base URL without trailing slashes
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

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
 * Custom fetch helper with credentials and base URL pre-configured
 */
export async function apiFetch(endpoint, options = {}) {
  const url = apiUrl(endpoint);
  const config = {
    credentials: 'include',
    ...options,
    headers: {
      ...options.headers,
    }
  };
  return fetch(url, config);
}

// Global fetch auto-interceptor:
// Automatically intercepts any relative '/api' calls in the browser and attaches the API_BASE_URL
// and credentials: 'include' (critical for cross-domain admin JWT authentication).
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
        const modifiedInit = {
          ...init,
          credentials: (init && init.credentials) ? init.credentials : 'include'
        };
        return originalFetch.call(this, targetUrl, modifiedInit);
      }
    }
    return originalFetch.call(this, input, init);
  };
}
