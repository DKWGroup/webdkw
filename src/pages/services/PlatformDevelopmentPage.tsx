import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Database, Code, Zap, Users, Shield, Cog } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const PlatformDevelopmentPage = () => {
  const packages = [
    {
      name: "Platforma Startowa",
      price: "15 000 - 25 000 PLN",
      description: "Podstawowa platforma z kluczowymi funkcjami",
      features: [
        "System logowania użytkowników",
        "Panel administracyjny",
        "Podstawowe CRUD operacje",
        "Responsywny design",
        "API REST",
        "Baza danych",
        "Podstawowe zabezpieczenia",
        "3 miesiące wsparcia"
      ],
      timeframe: "6-8 tygodni"
    },
    {
      name: "Platforma Biznesowa",
      price: "25 000 - 50 000 PLN",
      description: "Zaawansowana platforma z rozszerzonymi funkcjami",
      features: [
        "Wszystko z pakietu Startowego",
        "Zaawansowany system ról",
        "Integracje z API zewnętrznymi",
        "System powiadomień",
        "Raportowanie i analityka",
        "Workflow automation",
        "Backup i monitoring",
        "6 miesięcy wsparcia"
      ],
      timeframe: "8-12 tygodni",
      popular: true
    },
    {
      name: "Platforma Enterprise",
      price: "50 000+ PLN",
      description: "Kompleksowe rozwiązanie dla dużych organizacji",
      features: [
        "Wszystko z pakietu Biznesowego",
        "Mikrousługi architecture",
        "Zaawansowane zabezpieczenia",
        "Multi-tenant support",
        "Skalowalność enterprise",
        "Dedykowane integracje",
        "SLA i monitoring 24/7",
        "12 miesięcy wsparcia"
      ],
      timeframe: "12+ tygodni"
    }
  ]

  const technologies = [
    {
      icon: <Code className="h-8 w-8 text-orange-500" />,
      title: "Nowoczesne technologie",
      description: "React, Node.js, Python, PostgreSQL, MongoDB"
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Wysoka wydajność",
      description: "Optymalizacja pod kątem szybkości i skalowalności"
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      title: "Bezpieczeństwo",
      description: "Szyfrowanie, autoryzacja, audyt bezpieczeństwa"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "UX/UI Design",
      description: "Intuicyjny interfejs dostosowany do użytkowników"
    }
  ]

  const useCases = [
    {
      title: "Systemy CRM",
      description: "Zarządzanie relacjami z klientami, lead tracking, automatyzacja sprzedaży"
    },
    {
      title: "Platformy edukacyjne",
      description: "LMS, kursy online, systemy egzaminacyjne, zarządzanie studentami"
    },
    {
      title: "Systemy rezerwacji",
      description: "Booking online, kalendarz dostępności, płatności, powiadomienia"
    },
    {
      title: "Portale B2B",
      description: "Platformy współpracy, marketplace, systemy zamówień"
    },
    {
      title: "Aplikacje SaaS",
      description: "Software as a Service, subskrypcje, multi-tenant architecture"
    },
    {
      title: "Systemy zarządzania",
      description: "ERP, workflow management, raportowanie, analityka"
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
                <Database className="h-16 w-16 text-orange-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Platformy internetowe
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Zaawansowane systemy i aplikacje webowe dostosowane do specyficznych 
                potrzeb Twojego biznesu. Od prostych narzędzi po kompleksowe platformy enterprise.
              </p>
            </div>
          </div>
        </section>

        {/* Technologies section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Dlaczego nasze platformy są wyjątkowe?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {technologies.map((tech, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className="flex justify-center mb-4">
                    {tech.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {tech.title}
                  </h3>
                  <p className="text-gray-600">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Przykłady platform, które tworzymy
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl hover:bg-orange-50 transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pakiety i cennik
              </h2>
              <p className="text-xl text-gray-600">
                Wybierz pakiet dostosowany do skali Twojego projektu
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

        {/* Additional info */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl">
              <div className="flex items-start space-x-4">
                <Cog className="h-12 w-12 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Proces tworzenia platformy
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Faza planowania:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Analiza wymagań biznesowych</li>
                        <li>• Projektowanie architektury</li>
                        <li>• Wybór technologii</li>
                        <li>• Planowanie harmonogramu</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Faza realizacji:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Iteracyjny development</li>
                        <li>• Regularne testy</li>
                        <li>• Code review</li>
                        <li>• Wdrożenie i monitoring</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Masz pomysł na platformę internetową?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Porozmawiajmy o Twoich potrzebach i wspólnie zaprojektujmy idealne rozwiązanie.
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

export default PlatformDevelopmentPage