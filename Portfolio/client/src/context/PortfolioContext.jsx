import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import verifiedPortfolioData from '../data/portfolio.js';

const CACHE_KEY = 'mzk_verified_portfolio_cache_v2';
const API_TIMEOUT_MS = 8000;

/**
 * Retrieves the initial portfolio state synchronously.
 * Priority:
 * 1. Cached live CMS data from localStorage (if valid and populated)
 * 2. Authoritative verified portfolio dataset (0ms latency, guaranteed populated)
 */
function getInitialPortfolioData() {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (
          parsed &&
          Array.isArray(parsed.projects) &&
          parsed.projects.length > 0 &&
          Array.isArray(parsed.education) &&
          parsed.education.length > 0
        ) {
          return parsed;
        }
      }
    } catch (e) {
      // Graceful fallback for restricted storage environments / incognito
    }
  }
  return verifiedPortfolioData;
}

const PortfolioContext = createContext({
  portfolioData: verifiedPortfolioData,
  loading: false,
  isLive: false,
  error: null,
  refreshPortfolio: () => {}
});

export function PortfolioProvider({ children }) {
  const [portfolioData, setPortfolioData] = useState(getInitialPortfolioData);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  /**
   * Helper to perform a single fetch with a strict AbortController timeout
   */
  const performFetchWithTimeout = async (timeoutMs = API_TIMEOUT_MS) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch('/api/portfolio', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  /**
   * Controlled fetch with automatic 1-step retry for cold-start / network hiccup tolerance
   */
  const fetchPortfolio = useCallback(async (isManualRefresh = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isManualRefresh) {
      setLoading(true);
    }

    let success = false;
    let lastError = null;

    // Attempt up to 2 times with a gentle backoff
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await performFetchWithTimeout(API_TIMEOUT_MS);
        if (res.ok) {
          const json = await res.json();
          if (json && json.success && json.data) {
            const incoming = json.data;

            // Deterministic merge: never let an empty database response clobber verified content
            const merged = {
              profile: incoming.profile?.name ? incoming.profile : verifiedPortfolioData.profile,
              projects: (incoming.projects && incoming.projects.length > 0)
                ? incoming.projects
                : verifiedPortfolioData.projects,
              education: (incoming.education && incoming.education.length > 0)
                ? incoming.education
                : verifiedPortfolioData.education,
              experience: (incoming.experience && incoming.experience.length > 0)
                ? incoming.experience
                : verifiedPortfolioData.experience,
              skills: (incoming.skills && incoming.skills.length > 0)
                ? incoming.skills
                : verifiedPortfolioData.skills,
              certifications: (incoming.certifications && incoming.certifications.length > 0)
                ? incoming.certifications
                : verifiedPortfolioData.certifications,
              hackathons: (incoming.hackathons && incoming.hackathons.length > 0)
                ? incoming.hackathons
                : verifiedPortfolioData.hackathons,
              achievements: (incoming.achievements && incoming.achievements.length > 0)
                ? incoming.achievements
                : verifiedPortfolioData.achievements
            };

            setPortfolioData(merged);
            setIsLive(true);
            setError(null);
            success = true;

            // Cache merged live dataset
            try {
              if (typeof window !== 'undefined') {
                localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
              }
            } catch (storageErr) {
              // Ignore storage quotas or restrictions
            }

            // Sync document title
            if (merged.profile?.siteTitle) {
              document.title = merged.profile.siteTitle;
            }

            break; // Succeeded, exit retry loop
          }
        } else {
          lastError = new Error(`API returned HTTP status ${res.status}`);
        }
      } catch (err) {
        lastError = err;
        // If first attempt failed, wait 1200ms before retry
        if (attempt === 1) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
      }
    }

    if (!success) {
      console.warn(
        'Portfolio live API unavailable, using verified local fallback dataset:',
        lastError?.message || 'Timeout/Failure'
      );
      setError(lastError);
      setIsLive(false);
    }

    setLoading(false);
    isFetchingRef.current = false;
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        loading,
        isLive,
        error,
        refreshPortfolio: () => fetchPortfolio(true)
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
