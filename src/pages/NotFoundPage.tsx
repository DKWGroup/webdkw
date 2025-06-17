import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search, Code } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEOHead 
          title="Strona nie znaleziona (404) | Tworzenie Stron Internetowych"
          description="Ups! Strona nie istnieje. Wróć na stronę główną i sprawdź naszą ofertę tworzenia stron internetowych, sklepów online i optymalizacji SEO."
          keywords="strony internetowe, tworzenie stron www, sklepy internetowe, pozycjonowanie SEO, Google Ads, marketing internetowy"
          url="https://webdkw.pl"
        />
    
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <Code className="h-24 w-24 text-orange-500" />
              <div className="text-8xl font-bold text-gray-300">404</div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Strona nie została znaleziona
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Ups! Wygląda na to, że strona, której szukasz, nie istnieje lub została przeniesiona. 
            Może wystąpił błąd w adresie URL?
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Home className="h-5 w-5" />
              <span>Wróć na stronę główną</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Wróć do poprzedniej strony</span>
            </button>
          </div>

          {/* Helpful Links */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Może szukasz jednej z tych stron?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/uslugi"
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <Search className="h-6 w-6 text-orange-500 group-hover:text-orange-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Nasze usługi</div>
                  <div className="text-sm text-gray-600">Poznaj pełną ofertę</div>
                </div>
              </Link>
              
              <Link
                to="/portfolio"
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <Search className="h-6 w-6 text-orange-500 group-hover:text-orange-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Portfolio</div>
                  <div className="text-sm text-gray-600">Zobacz nasze projekty</div>
                </div>
              </Link>
              
              <Link
                to="/blog"
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <Search className="h-6 w-6 text-orange-500 group-hover:text-orange-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Blog</div>
                  <div className="text-sm text-gray-600">Artykuły i porady</div>
                </div>
              </Link>
              
              <Link
                to="/proces-realizacji"
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <Search className="h-6 w-6 text-orange-500 group-hover:text-orange-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Proces realizacji</div>
                  <div className="text-sm text-gray-600">Jak pracujemy</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              Potrzebujesz pomocy?
            </h3>
            <p className="text-blue-800 mb-4">
              Jeśli nie możesz znaleźć tego, czego szukasz, skontaktuj się z nami bezpośrednio.
            </p>
            <Link
              to="/#kontakt"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Skontaktuj się z nami
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default NotFoundPage