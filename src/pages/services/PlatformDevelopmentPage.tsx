import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Database, Code, Zap, Users, Shield, Cog, Plus, Minus, ExternalLink } from 'lucide-react'
import { supabase, Project } from '../../lib/supabase'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const PlatformDevelopmentPage = () => {
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
        .in('category', ['Platforma B2B', 'System rezerwacji', 'Platforma edukacyjna', 'Platforma internetowa'])
        .limit(3)

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

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

  const processSteps = [
    {
      title: "Analiza wymagań i planowanie",
      details: [
        "Szczegółowa analiza potrzeb biznesowych",
        "Mapowanie procesów i workflow",
        "Określenie funkcjonalności i zakresu",
        "Wybór technologii i architektury",
        "Przygotowanie specyfikacji technicznej"
      ]
    },
    {
      title: "Projektowanie architektury systemu",
      details: [
        "Projektowanie bazy danych",
        "Architektura aplikacji i API",
        "Planowanie integracji zewnętrznych",
        "Projektowanie systemu bezpieczeństwa",
        "Dokumentacja techniczna"
      ]
    },
    {
      title: "Projektowanie UX/UI",
      details: [
        "Analiza użytkowników i ich potrzeb",
        "Tworzenie wireframes i prototypów",
        "Projektowanie interfejsu użytkownika",
        "Testowanie użyteczności",
        "Responsive design dla wszystkich urządzeń"
      ]
    },
    {
      title: "Development i implementacja",
      details: [
        "Kodowanie back-endu i API",
        "Implementacja front-endu",
        "Integracje z systemami zewnętrznymi",
        "Implementacja systemu bezpieczeństwa",
        "Testy jednostkowe i integracyjne"
      ]
    },
    {
      title: "Testy i optymalizacja",
      details: [
        "Testy funkcjonalne i wydajnościowe",
        "Testy bezpieczeństwa",
        "Testy obciążeniowe",
        "Optymalizacja wydajności",
        "Testy akceptacyjne z klientem"
      ]
    },
    {
      title: "Wdrożenie i szkolenia",
      details: [
        "Konfiguracja środowiska produkcyjnego",
        "Migracja danych",
        "Szkolenia użytkowników",
        "Dokumentacja użytkownika",
        "Wsparcie po wdrożeniu"
      ]
    }
  ]

  const uniqueFeatures = [
    {
      title: "Skalowalna architektura",
      description: "Projektujemy systemy, które rosną razem z Twoim biznesem, obsługując rosnącą liczbę użytkowników."
    },
    {
      title: "Zaawansowane integracje",
      description: "Łączymy Twoją platformę z istniejącymi systemami i zewnętrznymi API."
    },
    {
      title: "Bezpieczeństwo enterprise",
      description: "Implementujemy najwyższe standardy bezpieczeństwa i zgodności z regulacjami."
    },
    {
      title: "Analityka i raportowanie",
      description: "Wbudowane narzędzia do analizy danych i generowania szczegółowych raportów."
    }
  ]

  const faqs = [
    {
      question: "Jakie technologie używacie do tworzenia platform?",
      answer: "Używamy nowoczesnych technologii takich jak React, Node.js, Python, PostgreSQL, MongoDB. Wybór technologii zależy od specyfiki projektu i wymagań biznesowych."
    },
    {
      question: "Czy platforma będzie skalowalna?",
      answer: "Tak, projektujemy wszystkie platformy z myślą o skalowalności. Używamy architektury mikrousług i rozwiązań chmurowych, które pozwalają na łatwe skalowanie wraz z rozwojem biznesu."
    },
    {
      question: "Jak długo trwa stworzenie platformy internetowej?",
      answer: "Czas realizacji zależy od złożoności projektu. Podstawowa platforma to 6-8 tygodni, zaawansowana 8-12 tygodni, a enterprise 12+ tygodni. Dokładny harmonogram ustalamy po analizie wymagań."
    },
    {
      question: "Czy mogę integrować platformę z istniejącymi systemami?",
      answer: "Absolutnie. Specjalizujemy się w integracjach z systemami ERP, CRM, płatnościami, API zewnętrznymi i innymi narzędziami biznesowymi."
    },
    {
      question: "Jakie wsparcie otrzymam po wdrożeniu?",
      answer: "Oferujemy wsparcie techniczne przez okres określony w pakiecie (3-12 miesięcy). Obejmuje to poprawki błędów, aktualizacje, monitoring i pomoc techniczną."
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

        {/* What makes our platforms unique */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Co wyróżnia nasze platformy internetowe?
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

        {/* Use cases section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Przykłady platform, które tworzymy
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-white p-6 rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-lg">
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

        {/* Portfolio projects */}
        {projects.length > 0 && (
          <section className="py-16 bg-white">
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

        {/* Process section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Proces tworzenia platformy
            </h2>
            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200">
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