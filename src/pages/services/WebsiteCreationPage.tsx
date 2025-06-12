import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Globe, Smartphone, Search, Shield, BarChart, Headphones, Plus, Minus, ExternalLink } from 'lucide-react'
import { supabase, Project } from '../../lib/supabase'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const WebsiteCreationPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [openProcess, setOpenProcess] = useState<number | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .in('category', ['Strona firmowa', 'Landing page', 'Strona wizytówka'])
        .limit(3)

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

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

  const processSteps = [
    {
      title: "Konsultacja i analiza potrzeb",
      details: [
        "Szczegółowa rozmowa o celach biznesowych",
        "Analiza grupy docelowej i konkurencji",
        "Określenie funkcjonalności i zakresu projektu",
        "Ustalenie harmonogramu i budżetu",
        "Przygotowanie briefu projektowego"
      ]
    },
    {
      title: "Przygotowanie koncepcji i wireframes",
      details: [
        "Projektowanie architektury informacji",
        "Tworzenie wireframes dla kluczowych stron",
        "Planowanie ścieżek użytkownika (user journey)",
        "Optymalizacja pod konwersję",
        "Prezentacja i iteracje na podstawie feedbacku"
      ]
    },
    {
      title: "Projektowanie graficzne",
      details: [
        "Tworzenie unikalnego designu zgodnego z brandingiem",
        "Projektowanie responsywnych layoutów",
        "Dobór kolorystyki, typografii i elementów graficznych",
        "Tworzenie komponentów UI i style guide",
        "Optymalizacja pod kątem UX i konwersji"
      ]
    },
    {
      title: "Kodowanie i implementacja",
      details: [
        "Kodowanie front-endu z użyciem najnowszych technologii",
        "Implementacja systemu zarządzania treścią (CMS)",
        "Integracja z narzędziami analitycznymi",
        "Optymalizacja wydajności i szybkości ładowania",
        "Implementacja podstawowych funkcji SEO"
      ]
    },
    {
      title: "Testy i optymalizacja",
      details: [
        "Testy funkcjonalności na różnych urządzeniach",
        "Testy wydajności i optymalizacja szybkości",
        "Sprawdzenie kompatybilności z przeglądarkami",
        "Testy formularzy i integracji",
        "Optymalizacja SEO on-page"
      ]
    },
    {
      title: "Wdrożenie i szkolenie",
      details: [
        "Konfiguracja hostingu i domeny",
        "Wdrożenie strony na środowisko produkcyjne",
        "Konfiguracja narzędzi analitycznych",
        "Szkolenie z obsługi panelu CMS",
        "Przekazanie dokumentacji i materiałów"
      ]
    }
  ]

  const uniqueFeatures = [
    {
      title: "Strategiczne podejście do konwersji",
      description: "Każdy element strony projektujemy z myślą o maksymalizacji konwersji i generowaniu leadów."
    },
    {
      title: "Optymalizacja pod Google Ads",
      description: "Strony przygotowane pod kampanie reklamowe z odpowiednimi landing page'ami i trackingiem."
    },
    {
      title: "Zaawansowana analityka",
      description: "Implementujemy narzędzia do śledzenia zachowań użytkowników i optymalizacji wyników."
    },
    {
      title: "Mobilne pierwszeństwo",
      description: "Projektujemy najpierw na urządzenia mobilne, zapewniając doskonałe doświadczenie na każdym ekranie."
    }
  ]

  const faqs = [
    {
      question: "Ile czasu zajmuje stworzenie strony internetowej?",
      answer: "Czas realizacji zależy od złożoności projektu. Prosta strona wizytówka to 2-3 tygodnie, landing page 2-4 tygodnie, a kompleksowa strona firmowa 4-6 tygodni. Dokładny harmonogram ustalamy na etapie konsultacji."
    },
    {
      question: "Czy mogę samodzielnie zarządzać treścią na stronie?",
      answer: "Tak! Każda strona wyposażona jest w intuicyjny panel CMS, który pozwala na łatwe zarządzanie treścią. Dodatkowo przeprowadzamy szkolenie z obsługi systemu."
    },
    {
      question: "Czy strona będzie zoptymalizowana pod SEO?",
      answer: "Absolutnie. Każda strona jest podstawowo zoptymalizowana pod SEO (meta tagi, struktura URL, szybkość ładowania). Dla lepszych rezultatów oferujemy również zaawansowane pakiety SEO."
    },
    {
      question: "Co się dzieje po zakończeniu projektu?",
      answer: "Otrzymujesz pełne wsparcie techniczne przez okres określony w pakiecie (1-3 miesiące). Obejmuje to poprawki błędów, aktualizacje bezpieczeństwa i pomoc techniczną."
    },
    {
      question: "Czy strona będzie działać na urządzeniach mobilnych?",
      answer: "Tak, wszystkie nasze strony są w pełni responsywne i zoptymalizowane pod urządzenia mobilne. Projektujemy z podejściem 'mobile-first'."
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
            <p className="text-xl text-gray-600 leading-relaxed mb-12 text-center">
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

        {/* What makes our websites unique */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Co wyróżnia nasze strony internetowe?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {uniqueFeatures.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio projects */}
        {projects.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Przykłady naszych realizacji
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative group">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
                          >
                            <span>Zobacz projekt</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-orange-500 font-semibold mb-3">{project.industry}</p>
                      <p className="text-gray-600 text-sm">{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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
            <p className="text-xl text-gray-600 leading-relaxed mb-12 text-center">
            Każdy projekt realizujemy kompleksowo – od analizy potrzeb, przez projekt graficzny, aż po wdrożenie i optymalizację SEO. Nasz proces obejmuje:
              </p>
            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg">
                  <button
                    onClick={() => setOpenProcess(openProcess === index ? null : index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <div className="flex-shrink-0">
                      {openProcess === index ? (
                        <Minus className="h-6 w-6 text-orange-500" />
                      ) : (
                        <Plus className="h-6 w-6 text-orange-500" />
                      )}
                    </div>
                  </button>
                  
                  {openProcess === index && (
                    <div className="px-8 pb-6">
                      <div className="border-t border-gray-100 pt-6">
                        <ul className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-600">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
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

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Często zadawane pytania
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
                  >
                    <h3 className="text-lg font-bold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFaq === index ? (
                        <Minus className="h-6 w-6 text-orange-500" />
                      ) : (
                        <Plus className="h-6 w-6 text-orange-500" />
                      )}
                    </div>
                  </button>
                  
                  {openFaq === index && (
                    <div className="px-8 pb-6">
                      <div className="border-t border-gray-100 pt-6">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
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