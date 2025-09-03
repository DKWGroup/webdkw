import Cookies from "js-cookie";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadAnalyticsScripts } from "../lib/cookieScripts";

const COOKIE_CONSENT_KEY = "cookie_consent_level";

type ConsentLevel = "all" | "analytics" | "necessary";

interface CookieConsentContextType {
  consentLevel: ConsentLevel | null;
  isBannerVisible: boolean;
  isPreferencesVisible: boolean;
  acceptConsent: (level: ConsentLevel) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  savePreferences: (analytics: boolean, marketing: boolean) => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

export const CookieConsentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [consentLevel, setConsentLevel] = useState<ConsentLevel | null>(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);

  // Efekt do sprawdzania i ładowania skryptów przy inicjalizacji
  useEffect(() => {
    const savedConsent = Cookies.get(COOKIE_CONSENT_KEY) as
      | ConsentLevel
      | undefined;
    if (savedConsent) {
      setConsentLevel(savedConsent);
      setIsBannerVisible(false);
      // **NOWOŚĆ: Ładuj skrypty na podstawie zapisanej zgody**
      loadAnalyticsScripts(savedConsent).catch(console.error);
    } else {
      setIsBannerVisible(true);
    }
  }, []);

  // Funkcja centralna do stosowania zgody
  const applyConsent = (level: ConsentLevel) => {
    Cookies.set(COOKIE_CONSENT_KEY, level, { expires: 365 });
    setConsentLevel(level);
    setIsBannerVisible(false);
    setIsPreferencesVisible(false);

    // **NOWOŚĆ: Ładuj skrypty po udzieleniu nowej zgody**
    loadAnalyticsScripts(level).catch(console.error);
  };

  const acceptConsent = (level: ConsentLevel) => {
    applyConsent(level);
  };

  const openPreferences = () => {
    setIsPreferencesVisible(true);
    setIsBannerVisible(false);
  };

  const closePreferences = () => {
    setIsPreferencesVisible(false);
    if (!consentLevel) {
      setIsBannerVisible(true);
    }
  };

  const savePreferences = (analytics: boolean, marketing: boolean) => {
    let level: ConsentLevel = "necessary";
    if (analytics && marketing) {
      level = "all";
    } else if (analytics) {
      level = "analytics";
    }
    applyConsent(level);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consentLevel,
        isBannerVisible,
        isPreferencesVisible,
        acceptConsent,
        openPreferences,
        closePreferences,
        savePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
};
