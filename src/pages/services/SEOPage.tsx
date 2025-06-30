import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ArrowLeft, Check, Search, TrendingUp, Target, BarChart3, FileText, Link as LinkIcon, Plus, Minus, ExternalLink } from 'lucide-react'
import { supabase, Project } from '../../lib/supabase'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEOHead from '../../components/SEOHead'

const SEOPage = () => {
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
        .ilike('description', '%SEO%')
        .limit(3)

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const packages = [
    {
      name: "SEO Audit",
      price: "800 zł",
      description: "Kompleksowa analiza SEO Twojej strony",
      features: [
        "Audyt techniczny strony",
        "Analiza słów kluczowych",
        "Analiza konkurencji",
        "Raport z rekomendacjami",
        "Plan działań SEO",
        "Konsultacja 1h",
      ],
      timeframe: "3 dni",
      oneTime: true
    },
    {
      name: "SEO Miesięczne",
      price: "od 1 200 zł",
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
      timeframe: "od 3 miesięcy",
      popular: true
    },
    {
      name: "Premium SEO",
      price: "od 2 500 zł",
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
      timeframe: "od 3 miesięcy"
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

  const processSteps = [
    {
      title: "Audyt i analiza",
      details: [
        "Kompleksowy audyt techniczny strony",
        "Analiza obecnych pozycji w Google",
        "Badanie konkurencji i ich strategii SEO",
        "Analiza słów kluczowych i potencjału",
        "Identyfikacja problemów technicznych"
      ]
    },
    {
      title: "Strategia SEO",
      details: [
        "Opracowanie listy docelowych słów kluczowych",
        "Planowanie struktury treści",
        "Strategia link buildingu",
        "Harmonogram działań SEO",
        "Określenie KPI i celów"
      ]
    },
    {
      title: "Optymalizacja techniczna",
      details: [
        "Naprawa błędów technicznych",
        "Optymalizacja szybkości ładowania",
        "Poprawa struktury URL",
        "Implementacja schema markup",
        "Optymalizacja dla urządzeń mobilnych"
      ]
    },
    {
      title: "Content marketing",
      details: [
        "Optymalizacja istniejących treści",
        "Tworzenie nowych artykułów i stron",
        "Optymalizacja meta tagów",
        "Tworzenie treści pod długi ogon",
        "Optymalizacja obrazów i mediów"
      ]
    },
    {
      title: "Link building",
      details: [
        "Analiza profilu linków",
        "Budowanie linków wysokiej jakości",
        "Guest posting i współpraca",
        "Linki lokalne i branżowe",
        "Monitoring i raportowanie linków"
      ]
    },
    {
      title: "Monitoring i optymalizacja",
      details: [
        "Śledzenie pozycji w Google",
        "Analiza ruchu organicznego",
        "Monitoring konwersji",
        "Miesięczne raporty wyników",
        "Ciągła optymalizacja strategii"
      ]
    }
  ]

  const uniqueFeatures = [
    {
      title: "Holistyczne podejście do SEO",
      description: "Łączymy optymalizację techniczną, content marketing i link building w spójną strategię."
    },
    {
      title: "Focus na konwersję",
      description: "Nie tylko zwiększamy ruch, ale optymalizujemy go pod kątem generowania leadów i sprzedaży."
    },
    {
      title: "Transparentne raportowanie",
      description: "Otrzymujesz szczegółowe raporty z jasno określonym ROI i wpływem na biznes."
    },
    {
      title: "Długoterminowa strategia",
      description: "Budujemy trwałe fundamenty SEO, które będą działać przez lata."
    }
  ]

  const faqs = [
    {
      question: "Jak długo trzeba czekać na efekty SEO?",
      answer: "Pierwsze efekty SEO widać po 2-3 miesiącach, znaczące rezultaty po 6 miesiącach. SEO to inwestycja długoterminowa - raz osiągnięte pozycje generują ruch przez lata bez dodatkowych kosztów reklamowych."
    },
    {
      question: "Czy gwarantujecie konkretne pozycje w Google?",
      answer: "Nie gwarantujemy konkretnych pozycji, ponieważ algorytm Google się zmienia. Gwarantujemy profesjonalne działania zgodne z wytycznymi Google i transparentne raportowanie postępów."
    },
    {
      question: "Czy SEO jest lepsze od Google Ads?",
      answer: "SEO i Google Ads to uzupełniające się strategie. SEO daje długoterminowe efekty bez kosztów za kliknięcie, ale wymaga czasu. Google Ads daje natychmiastowe efekty, ale wymaga stałego budżetu."
    },
    {
      question: "Jak wybieracie słowa kluczowe?",
      answer: "Analizujemy Twój biznes, konkurencję i potencjał słów kluczowych. Wybieramy frazy o odpowiednim wolumenie wyszukiwań, konkurencyjności i potencjale konwersji."
    },
    {
      question: "Czy SEO działa dla każdej branży?",
      answer: "Tak, SEO działa dla każdej branży, ale strategie różnią się w zależności od specyfiki biznesu, konkurencji i grupy docelowej. Dostosowujemy podejście do Twojej branży."
    }
  ]

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="SEO i Pozycjonowanie Stron | WebDKW"
          description="Profesjonalne usługi SEO i pozycjonowania stron internetowych. Zwiększ widoczność w Google i generuj więcej klientów."
          keywords="SEO, pozycjonowanie, Google, optymalizacja, marketing internetowy"
          url="https://webdkw.net/uslugi/seo"
        />
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

          {/* What makes our SEO unique */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Co wyróżnia nasze usługi SEO?
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
                  Przykłady naszych realizacji SEO
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Proces optymalizacji SEO
              </h2>
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
    </HelmetProvider>
  )
}

export default SEOPage