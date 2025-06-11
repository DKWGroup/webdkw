import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Globe, Smartphone, Search, Shield, BarChart, Headphones } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const WebsiteCreationPage = () => {
  const packages = [
    {
      name: "Strona Wizytówka",
      price: "3 000 - 5 000 PLN",
      description: "Idealna dla małych firm i freelancerów",
      features: [
        "Do 5 podstron",
        "Responsywny design",
        "Podstawowe SEO",
        "Formularz kontaktowy",
        "Galeria zdjęć",
        "Mapa Google",
        "Certyfikat SSL",
        "1 miesiąc wsparcia"
      ],
      timeframe: "2-3 tygodnie"
    },
    {
      name: "Landing Page",
      price: "4 000 - 7 000 PLN", 
      description: "Zoptymalizowana pod konwersję strona sprzedażowa",
      features: [
        "Jedna strona zoptymalizowana pod konwersję",
        "A/B testing setup",
        "Zaawansowane CTA",
        "Integracja z narzędziami analitycznymi",
        "Optymalizacja szybkości",
        "Pixel tracking (Facebook, Google)",
        "Formularz lead generation",
        "2 miesiące wsparcia"
      ],
      timeframe: "2-4 tygodnie",
      popular: true
    },
    {
      name: "Strona Firmowa",
      price: "6 000 - 12 000 PLN",
      description: "Kompleksowa prezentacja firmy",
      features: [
        "Do 15 podstron",
        "Zaawansowany design",
        "Kompleksowe SEO",
        "Blog/aktualności",
        "Galeria projektów",
        "Formularz ofertowy",
        "Panel administracyjny",
        "3 miesiące wsparcia"
      ],
      timeframe: "4-6 tygodni"
    }
  ]

  const benefits = [
    {
      icon: <Globe className="h-8 w-8 text-orange-500" />,
      title: "Profesjonalny wizerunek",
      description: "Buduj zaufanie klientów dzięki profesjonalnej prezentacji online"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-orange-500" />,
      title: "Responsywność",
      description: "Twoja strona będzie wyglądać perfekcyjnie na wszystkich urządzeniach"
    },
    {
      icon: <Search className="h-8 w-8 text-orange-500" />,
      title: "Optymalizacja SEO",
      description: "Zwiększ widoczność w Google i przyciągnij więcej klientów"
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      title: "Bezpieczeństwo",
      description: "Certyfikat SSL i regularne aktualizacje bezpieczeństwa"
    }
  ]

  const process = [
    "Konsultacja i analiza potrzeb",
    "Przygotowanie koncepcji i wireframes",
    "Projektowanie graficzne",
    "Kodowanie i implementacja",
    "Testy i optymalizacja",
    "Wdrożenie i szkolenie"
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
                <Globe className="h-16 w-16 text-orange-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Tworzenie stron internetowych
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Profesjonalne strony wizytówkowe i landing page'y, które budują zaufanie 
                i przekonują klientów do skorzystania z Twoich usług.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Dlaczego warto zainwestować w profesjonalną stronę?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
            W dzisiejszych czasach strona internetowa to podstawa obecności w sieci. To właśnie ona jest wizytówką Twojej firmy, buduje zaufanie i pozwala dotrzeć do nowych odbiorców. Profesjonalnie zaprojektowana strona internetowa:
              </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
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
                Pakiety i cennik
              </h2>
              <p className="text-xl text-gray-600">
                Wybierz pakiet dostosowany do potrzeb Twojego biznesu
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
                      <div className="text-3xl font-bold text-orange-500 mb-4">{pkg.price}</div>
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
                      <p className="text-sm text-gray-500 mb-6">Czas realizacji: {pkg.timeframe}</p>
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Proces realizacji
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
            Każdy projekt realizujemy kompleksowo – od analizy potrzeb, przez projekt graficzny, aż po wdrożenie i optymalizację SEO. Nasz proces obejmuje:
              </p>
            <div className="space-y-4">
              {process.map((step, index) => (
                <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional info */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-xl">
                <BarChart className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Analityka i monitoring
                </h3>
                <p className="text-gray-600">
                  Każda strona jest wyposażona w Google Analytics i narzędzia 
                  do monitorowania ruchu i konwersji.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl">
                <Headphones className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Wsparcie techniczne
                </h3>
                <p className="text-gray-600">
                  Otrzymujesz wsparcie techniczne, szkolenie z obsługi 
                  oraz pomoc w przypadku problemów.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Gotowy na profesjonalną stronę internetową?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Umów się na bezpłatną konsultację i otrzymaj spersonalizowaną wycenę.
            </p>
            <Link
              to="/#kontakt"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Umów bezpłatną konsultację
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default WebsiteCreationPage