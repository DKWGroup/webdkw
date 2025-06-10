import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Search, TrendingUp, Target, BarChart3, FileText, Link as LinkIcon } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const SEOPage = () => {
  const packages = [
    {
      name: "SEO Audit",
      price: "1 500 PLN",
      description: "Kompleksowa analiza SEO Twojej strony",
      features: [
        "Audyt techniczny strony",
        "Analiza słów kluczowych",
        "Analiza konkurencji",
        "Raport z rekomendacjami",
        "Plan działań SEO",
        "Konsultacja 1h",
        "30 dni wsparcia email"
      ],
      timeframe: "1-2 tygodnie",
      oneTime: true
    },
    {
      name: "SEO Miesięczne",
      price: "2 000 - 4 000 PLN/mies",
      description: "Bieżąca optymalizacja i pozycjonowanie",
      features: [
        "Optymalizacja techniczna",
        "Content marketing",
        "Link building",
        "Monitoring pozycji",
        "Miesięczne raporty",
        "Optymalizacja konwersji",
        "Wsparcie techniczne"
      ],
      timeframe: "3-6 miesięcy",
      popular: true
    },
    {
      name: "SEO Enterprise",
      price: "5 000+ PLN/mies",
      description: "Kompleksowe SEO dla dużych projektów",
      features: [
        "Wszystko z pakietu Miesięcznego",
        "Dedykowany SEO specialist",
        "Zaawansowana analityka",
        "Multi-domain SEO",
        "Konkurencyjna analiza",
        "Strategia content marketing",
        "Priorytetowe wsparcie"
      ],
      timeframe: "6-12 miesięcy"
    }
  ]

  const services = [
    {
      icon: <Search className="h-8 w-8 text-orange-500" />,
      title: "Audyt techniczny SEO",
      description: "Analiza szybkości, struktury URL, meta tagów, schema markup"
    },
    {
      icon: <Target className="h-8 w-8 text-orange-500" />,
      title: "Analiza słów kluczowych",
      description: "Identyfikacja najcenniejszych fraz dla Twojej branży"
    },
    {
      icon: <FileText className="h-8 w-8 text-orange-500" />,
      title: "Content marketing",
      description: "Tworzenie wartościowych treści przyciągających klientów"
    },
    {
      icon: <LinkIcon className="h-8 w-8 text-orange-500" />,
      title: "Link building",
      description: "Budowanie autorytetu domeny przez wysokiej jakości linki"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-500" />,
      title: "Monitoring i raporty",
      description: "Śledzenie pozycji, ruchu i konwersji z jasnym ROI"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      title: "Optymalizacja konwersji",
      description: "Zwiększanie współczynnika konwersji z ruchu organicznego"
    }
  ]

  const results = [
    "Wzrost ruchu organicznego o 200-500% w 6 miesięcy",
    "Pozycje TOP 3 dla kluczowych fraz branżowych",
    "Zwiększenie liczby zapytań ofertowych o 150-300%",
    "Poprawa współczynnika konwersji o 50-100%",
    "Długoterminowy ROI 300-800%",
    "Budowanie autorytetu marki w internecie"
  ]

  const process = [
    {
      step: "1",
      title: "Audyt i analiza",
      description: "Kompleksowa analiza obecnego stanu SEO i konkurencji"
    },
    {
      step: "2", 
      title: "Strategia SEO",
      description: "Opracowanie dedykowanej strategii słów kluczowych"
    },
    {
      step: "3",
      title: "Optymalizacja techniczna",
      description: "Naprawa błędów technicznych i optymalizacja wydajności"
    },
    {
      step: "4",
      title: "Content marketing",
      description: "Tworzenie i optymalizacja treści pod kluczowe frazy"
    },
    {
      step: "5",
      title: "Link building",
      description: "Budowanie autorytetu przez wysokiej jakości linki"
    },
    {
      step: "6",
      title: "Monitoring i optymalizacja",
      description: "Ciągłe monitorowanie wyników i optymalizacja strategii"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Header section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 mb-8">
              <Link
                to="/uslugi"
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Powrót do usług</span>
              </Link>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <Search className="h-16 w-16 text-orange-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Optymalizacja SEO
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Profesjonalne pozycjonowanie stron internetowych, które zwiększa widoczność 
                w Google i przyciąga wysokiej jakości ruch organiczny.
              </p>
            </div>
          </div>
        </section>

        {/* Services section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Zakres usług SEO
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pakiety SEO
              </h2>
              <p className="text-xl text-gray-600">
                Wybierz pakiet dostosowany do Twoich potrzeb i budżetu
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                    pkg.popular ? 'border-orange-500 transform lg:scale-105' : 'border-gray-200'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                        NAJPOPULARNIEJSZY
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <div className="text-3xl font-bold text-orange-500 mb-4">
                        {pkg.price}
                        {!pkg.oneTime && <span className="text-lg text-gray-500">/mies</span>}
                      </div>
                      <p className="text-gray-600">{pkg.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-6">
                        {pkg.oneTime ? `Czas realizacji: ${pkg.timeframe}` : `Pierwsze rezultaty: ${pkg.timeframe}`}
                      </p>
                      <Link
                        to="/#kontakt"
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 inline-block ${
                          pkg.popular
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        Umów konsultację
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Proces optymalizacji SEO
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {process.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Jakie rezultaty możesz oczekiwać?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {results.map((result, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-lg">{result}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                💡 Dlaczego SEO to najlepsza inwestycja długoterminowa?
              </h3>
              <p className="text-blue-800">
                W przeciwieństwie do reklam płatnych, SEO buduje trwały fundament Twojej obecności online. 
                Raz osiągnięte wysokie pozycje generują ruch przez lata, zapewniając stały przepływ 
                potencjalnych klientów bez dodatkowych kosztów reklamowych.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Gotowy zdominować wyniki wyszukiwania?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Zacznij od bezpłatnego audytu SEO i dowiedz się, jak zwiększyć widoczność swojej strony.
            </p>
            <Link
              to="/#kontakt"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Zamów bezpłatny audyt SEO
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default SEOPage