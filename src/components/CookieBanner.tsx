import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart3 } from 'lucide-react';
import { loadAnalyticsScripts } from '../lib/cookieScripts';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setShowBanner(false);
    loadAnalyticsScripts('all').catch(console.error);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      {/* Main Banner */}
      <div className="container-responsive py-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Używamy plików cookies
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nasza strona wykorzystuje pliki cookies, aby zapewnić najlepsze doświadczenia użytkownika. 
                Obejmują one niezbędne cookies funkcjonalne oraz opcjonalne cookies analityczne i marketingowe.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn-responsive bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 text-sm"
            >
              {showDetails ? 'Ukryj szczegóły' : 'Pokaż szczegóły'}
            </button>
            <button
              onClick={handleAcceptNecessary}
              className="btn-responsive bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 text-sm"
            >
              Tylko niezbędne
            </button>
            <button
              onClick={handleAcceptAll}
              className="btn-responsive bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium"
            >
              Akceptuj wszystkie
            </button>
          </div>
        </div>

        {/* Details Panel */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Necessary Cookies */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <h4 className="font-medium text-gray-900">Niezbędne</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Zawsze aktywne
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Te pliki cookies są niezbędne do funkcjonowania strony i nie można ich wyłączyć. 
                  Zazwyczaj są ustawiane w odpowiedzi na Twoje działania.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Preferencje cookies</li>
                  <li>• Sesja użytkownika</li>
                  <li>• Bezpieczeństwo</li>
                </ul>
              </div>

              {/* Analytics Cookies */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium text-gray-900">Analityczne</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Te pliki cookies pozwalają nam na analizowanie ruchu na stronie i zrozumienie, 
                  jak użytkownicy korzystają z naszej witryny.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Google Analytics</li>
                  <li>• Statystyki odwiedzin</li>
                  <li>• Analiza zachowań</li>
                </ul>
              </div>

              {/* Marketing Cookies */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-purple-500" />
                  <h4 className="font-medium text-gray-900">Marketingowe</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Te pliki cookies są używane do śledzenia użytkowników między stronami internetowymi 
                  w celu wyświetlania reklam.
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Facebook Pixel</li>
                  <li>• Google Ads</li>
                  <li>• Remarketing</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Więcej informacji znajdziesz w naszej{' '}
                <a href="/polityka-prywatnosci" className="text-primary-500 hover:text-primary-600 underline">
                  Polityce Prywatności
                </a>
                . Możesz w każdej chwili zmienić swoje preferencje cookies.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleReject}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Odrzuć cookies"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export default CookieBanner;