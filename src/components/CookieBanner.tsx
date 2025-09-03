import React from "react";
import { Link } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";

const CookieBanner = () => {
  const { isBannerVisible, acceptConsent, openPreferences } =
    useCookieConsent();

  if (!isBannerVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50 animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          Używamy plików cookie, aby poprawić Twoje doświadczenie. Wybierając
          „Akceptuj wszystko”, zgadzasz się na ich użycie.
          <Link
            to="/polityka-prywatnosci"
            className="underline hover:text-primary-400 ml-2"
          >
            Dowiedz się więcej
          </Link>
        </p>
        <div className="flex-shrink-0 flex items-center gap-3">
          <button
            onClick={openPreferences}
            className="text-sm px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Dostosuj
          </button>
          <button
            onClick={() => acceptConsent("all")}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-2 rounded-md transition-colors shadow-md"
          >
            Akceptuj wszystko
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
