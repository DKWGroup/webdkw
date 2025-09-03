// Script loading utilities for conditional analytics

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: any;
    _fbq: any;
  }
}

// Track loaded scripts to avoid duplicates
const loadedScripts = new Set<string>();

/**
 * Load Google Tag Manager (GTM) script
 * GTM will be responsible for loading other tags like GA4.
 */
export const loadGoogleTagManager = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (loadedScripts.has("gtm")) {
      resolve();
      return;
    }
    // **POPRAWKA: Natychmiast oznacz skrypt jako ładowany, aby zapobiec race condition.**
    loadedScripts.add("gtm");

    try {
      // Initialize dataLayer for GTM
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });

      // Load GTM script
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-MFXMH6N9";
      script.onload = () => {
        // loadedScripts.add("gtm"); // Usunięto stąd
        console.log("Google Tag Manager loaded successfully");
        resolve();
      };
      script.onerror = () => {
        console.error("Failed to load Google Tag Manager");
        reject(new Error("Failed to load Google Tag Manager"));
      };

      document.head.appendChild(script);

      // Add GTM noscript fallback
      const noscript = document.createElement("noscript");
      noscript.innerHTML =
        '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MFXMH6N9" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
      document.body.insertBefore(noscript, document.body.firstChild);
    } catch (error) {
      console.error("Error loading Google Tag Manager:", error);
      reject(error);
    }
  });
};

/**
 * Load Facebook Pixel script
 */
export const loadFacebookPixel = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (loadedScripts.has("fbpixel")) {
      resolve();
      return;
    }
    // **POPRAWKA: Natychmiast oznacz skrypt jako ładowany.**
    loadedScripts.add("fbpixel");

    // Sprawdź, czy obiekt fbq już istnieje (może być zablokowany przez adblocker)
    if (window.fbq && typeof window.fbq === "function" && window.fbq.loaded) {
      resolve();
      return;
    }

    try {
      // Definicja funkcji fbq
      const n: any = (window.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      });
      if (!window._fbq) window._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];

      // Tworzenie i ładowanie skryptu
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";

      // Inicjalizacja piksla PO załadowaniu skryptu
      script.onload = () => {
        try {
          window.fbq("init", "2184652248627111");
          window.fbq("track", "PageView");
          // loadedScripts.add("fbpixel"); // Usunięto stąd
          console.log("Facebook Pixel loaded and initialized successfully");
          resolve();
        } catch (initError) {
          console.error("Error initializing Facebook Pixel:", initError);
          reject(initError);
        }
      };

      script.onerror = () => {
        console.error("Failed to load Facebook Pixel script");
        reject(new Error("Failed to load Facebook Pixel script"));
      };

      // Wstawienie skryptu do DOM
      document.head.appendChild(script);

      // Add Facebook Pixel noscript fallback
      const noscript = document.createElement("noscript");
      noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2184652248627111&ev=PageView&noscript=1" />`;
      document.body.insertBefore(noscript, document.body.firstChild);
    } catch (error) {
      console.error("Error setting up Facebook Pixel:", error);
      reject(error);
    }
  });
};

/**
 * Load analytics scripts based on consent level
 */
export const loadAnalyticsScripts = async (
  consentLevel: string
): Promise<void> => {
  try {
    if (consentLevel === "all" || consentLevel === "analytics") {
      // Load only GTM. GTM will handle loading GA4.
      await loadGoogleTagManager();
    }

    if (consentLevel === "all") {
      await loadFacebookPixel();
    }

    console.log(`Analytics scripts loaded for consent level: ${consentLevel}`);
  } catch (error) {
    console.error("Error loading analytics scripts:", error);
  }
};

/**
 * Check if analytics scripts are loaded
 */
export const isAnalyticsLoaded = (): boolean => {
  return loadedScripts.has("gtm");
};

/**
 * Check if marketing scripts are loaded
 */
export const isMarketingLoaded = (): boolean => {
  return loadedScripts.has("fbpixel");
};
