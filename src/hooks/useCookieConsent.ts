import { useState, useEffect } from 'react';
import { loadAnalyticsScripts } from '../lib/cookieScripts';

export type CookieConsentLevel = 'all' | 'analytics' | 'necessary' | 'rejected' | null;

export interface CookieConsent {
  level: CookieConsentLevel;
  hasNecessary: boolean;
  hasAnalytics: boolean;
  hasMarketing: boolean;
  isConsentGiven: boolean;
}

export const useCookieConsent = (): CookieConsent => {
  const [consentLevel, setConsentLevel] = useState<CookieConsentLevel>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent') as CookieConsentLevel;
    setConsentLevel(storedConsent);
    
    // Load analytics scripts if consent is given
    if (storedConsent && storedConsent !== 'rejected') {
      loadAnalyticsScripts(storedConsent).catch(error => {
        console.error('Failed to load analytics scripts:', error);
      });
    }
  }, []);

  const hasNecessary = true; // Always true
  const hasAnalytics = consentLevel === 'all' || consentLevel === 'analytics';
  const hasMarketing = consentLevel === 'all';
  const isConsentGiven = consentLevel !== null;

  return {
    level: consentLevel,
    hasNecessary,
    hasAnalytics,
    hasMarketing,
    isConsentGiven,
  };
};

// Utility functions for checking consent
export const canUseAnalytics = (): boolean => {
  const consent = localStorage.getItem('cookie-consent');
  return consent === 'all' || consent === 'analytics';
};

export const canUseMarketing = (): boolean => {
  const consent = localStorage.getItem('cookie-consent');
  return consent === 'all';
};

export const resetCookieConsent = (): void => {
  localStorage.removeItem('cookie-consent');
  window.location.reload();
};