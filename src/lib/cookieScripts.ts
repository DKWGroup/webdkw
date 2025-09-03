// Script loading utilities for conditional analytics

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

// Track loaded scripts to avoid duplicates
const loadedScripts = new Set<string>();

/**
 * Load Google Analytics 4 (GA4) script
 */
export const loadGoogleAnalytics = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (loadedScripts.has("ga4")) {
      resolve();
      return;
    }

    try {
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", "G-4JP3FX6V5Z");

      // Load GA4 script
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-4JP3FX6V5Z";
      script.onload = () => {
        loadedScripts.add("ga4");
        console.log("Google Analytics loaded successfully");
        resolve();
      };
      script.onerror = () => {
        console.error("Failed to load Google Analytics");
        reject(new Error("Failed to load Google Analytics"));
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error("Error loading Google Analytics:", error);
      reject(error);
    }
  });
};

/**
 * Load Google Tag Manager (GTM) script
 */
export const loadGoogleTagManager = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (loadedScripts.has("gtm")) {
      resolve();
      return;
    }

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
        loadedScripts.add("gtm");
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

    try {
      // Facebook Pixel code
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        t.onload = () => {
          loadedScripts.add("fbpixel");
          console.log("Facebook Pixel loaded successfully");
          resolve();
        };
        t.onerror = () => {
          console.error("Failed to load Facebook Pixel");
          reject(new Error("Failed to load Facebook Pixel"));
        };
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );

      // Initialize Facebook Pixel (replace with your actual pixel ID)
      window.fbq("init", "2184652248627111");
      window.fbq("track", "PageView");
    } catch (error) {
      console.error("Error loading Facebook Pixel:", error);
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
      await Promise.all([loadGoogleAnalytics(), loadGoogleTagManager()]);
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
  return loadedScripts.has("ga4") || loadedScripts.has("gtm");
};

/**
 * Check if marketing scripts are loaded
 */
export const isMarketingLoaded = (): boolean => {
  return loadedScripts.has("fbpixel");
};
