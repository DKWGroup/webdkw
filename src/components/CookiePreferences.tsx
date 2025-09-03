import { BarChart3, Cookie, Settings, Shield, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useCookieConsent } from "../context/CookieConsentContext";

const CookiePreferences: React.FC = () => {
  const {
    isPreferencesVisible,
    closePreferences,
    savePreferences,
    consentLevel,
  } = useCookieConsent();

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (consentLevel) {
      setAnalytics(consentLevel === "all" || consentLevel === "analytics");
      setMarketing(consentLevel === "all");
    }
  }, [consentLevel, isPreferencesVisible]);

  const handleSave = () => {
    savePreferences(analytics, marketing);
  };

  if (!isPreferencesVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Preferencje cookies
            </h2>
          </div>
          <button
            onClick={closePreferences}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-600">
            Zarządzaj swoimi preferencjami dotyczącymi plików cookies. Możesz
            włączyć lub wyłączyć różne kategorie zgodnie ze swoimi
            preferencjami.
          </p>

          {/* Cookie Categories */}
          <div className="space-y-4">
            {/* Necessary Cookies */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Shield className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Cookies niezbędne
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Te pliki cookies są niezbędne do funkcjonowania strony
                      internetowej i nie można ich wyłączyć w naszych systemach.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Preferencje cookies</li>
                      <li>• Sesja użytkownika</li>
                      <li>• Bezpieczeństwo witryny</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center ml-4">
                  <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Zawsze aktywne
                  </span>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <BarChart3 className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Cookies analityczne
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Te pliki cookies pozwalają nam analizować ruch na stronie
                      i zrozumieć, jak użytkownicy korzystają z naszej witryny.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Google Analytics</li>
                      <li>• Statystyki odwiedzin</li>
                      <li>• Mapa ciepła</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={() => setAnalytics((v) => !v)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Cookie className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Cookies marketingowe
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Te pliki cookies są używane do śledzenia użytkowników
                      między stronami w celu wyświetlania spersonalizowanych
                      reklam.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• Facebook Pixel</li>
                      <li>• Google Ads</li>
                      <li>• Remarketing</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={() => setMarketing((v) => !v)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-4">
              Więcej informacji znajdziesz w naszej{" "}
              <a
                href="/polityka-prywatnosci"
                className="text-primary-500 hover:text-primary-600 underline"
              >
                Polityce Prywatności
              </a>
              .
            </p>
            <div className="flex gap-3">
              <button
                onClick={closePreferences}
                className="btn-responsive bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              >
                Anuluj
              </button>
              <button
                onClick={handleSave}
                className="btn-responsive bg-primary-500 hover:bg-primary-600 text-white font-medium"
              >
                Zapisz preferencje
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferences;
