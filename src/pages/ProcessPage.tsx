import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Palette, Code, Rocket, CheckCircle, Clock, Users, FileText } from 'lucide-react'
import { HelmetProvider } from 'react-helmet-async'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'

const ProcessPage = () => {
  const phases = [
    {
      phase: "Faza 1",
      title: "Audyt strategiczny i analiza konkurencji",
      icon: <Search className="h-12 w-12 text-orange-500" />,
      duration: "1 tydzień",
      description: "Analizuję Twój biznes, konkurencję i cele. Definiujemy strategię konwersji i pozycjonowania.",
      steps: [
        "Konsultacja strategiczna i analiza potrzeb biznesowych",
        "Badanie konkurencji i analizy rynku",
        "Definicja grupy docelowej i buyer persona",
        "Analiza obecnej strony (jeśli istnieje)",
        "Określenie celów biznesowych i KPI",
        "Wybór technologii i architektury rozwiązania",
        "Przygotowanie szczegółowej specyfikacji projektu"
      ],
      deliverables: [
        "Raport z audytu i analizy konkurencji",
        "Strategia projektu i mapa funkcjonalności",
        "Harmonogram realizacji",
        "Wycena finalna"
      ]
    },
    {
      phase: "Faza 2", 
      title: "Projektowanie UX/UI zoptymalizowane pod konwersję",
      icon: <Palette className="h-12 w-12 text-orange-500" />,
      duration: "1-2 tygodnie",
      description: "Tworzę design skupiony na konwersji, optymalizowany pod Twoją grupę docelową.",
      steps: [
        "Tworzenie wireframes i prototypów",
        "Projektowanie architektury informacji",
        "Opracowanie systemu designu i brandingu",
        "Projektowanie interfejsu użytkownika (UI)",
        "Optymalizacja ścieżek konwersji",
        "Projektowanie wersji mobilnej (responsive)",
        "Prezentacja i iteracje na podstawie feedbacku"
      ],
      deliverables: [
        "Wireframes i prototypy interaktywne",
        "Kompletny design systemu",
        "Projekty wszystkich podstron",
        "Style guide i dokumentacja designu"
      ]
    },
    {
      phase: "Faza 3",
      title: "Programowanie i optymalizacja SEO", 
      icon: <Code className="h-12 w-12 text-orange-500" />,
      duration: "2-3 tygodnie",
      description: "Koduję stronę z naciskiem na wydajność, bezpieczeństwo i optymalizację pod wyszukiwarki.",
      steps: [
        "Konfiguracja środowiska deweloperskiego",
        "Kodowanie front-endu zgodnie z designem",
        "Implementacja back-endu i bazy danych",
        "Integracja z systemami zewnętrznymi",
        "Optymalizacja techniczna SEO",
        "Implementacja analityki i trackingu",
        "Optymalizacja wydajności i szybkości"
      ],
      deliverables: [
        "Funkcjonalna strona na środowisku testowym",
        "Dokumentacja techniczna",
        "Raport z optymalizacji SEO",
        "Konfiguracja analityki"
      ]
    },
    {
      phase: "Faza 4",
      title: "Testy i wdrożenie",
      icon: <Rocket className="h-12 w-12 text-orange-500" />,
      duration: "1 tydzień", 
      description: "Testujemy wszystkie funkcjonalności, uruchamiamy stronę i przekazujemy Ci pełną kontrolę.",
      steps: [
        "Testy funkcjonalności na różnych urządzeniach",
        "Testy wydajności i optymalizacji",
        "Testy bezpieczeństwa i zabezpieczeń",
        "Konfiguracja hostingu i domeny",
        "Migracja na środowisko produkcyjne",
        "Konfiguracja backupów i monitoringu",
        "Szkolenie klienta z obsługi systemu"
      ],
      deliverables: [
        "Działająca strona na produkcji",
        "Dokumentacja użytkownika",
        "Materiały szkoleniowe",
        "Certyfikaty SSL i zabezpieczenia"
      ]
    },
    {
      phase: "Faza 5",
      title: "Wsparcie i optymalizacja wyników",
      icon: <CheckCircle className="h-12 w-12 text-orange-500" />,
      duration: "3 miesiące",
      description: "3 miesiące bezpłatnego wsparcia technicznego i optymalizacji wyników.",
      steps: [
        "Monitoring wydajności i dostępności",
        "Regularne aktualizacje bezpieczeństwa",
        "Analiza wyników i optymalizacja konwersji",
        "Wsparcie techniczne i konsultacje",
        "Raportowanie miesięczne",
        "Implementacja ulepszeń i nowych funkcji",
        "Backup i odzyskiwanie danych"
      ],
      deliverables: [
        "Miesięczne raporty z wyników",
        "Regularne aktualizacje systemu",
        "Wsparcie techniczne 24/7",
        "Optymalizacje na podstawie danych"
      ]
    }
  ]

  const methodology = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Podejście Agile",
      description: "Iteracyjny proces rozwoju z regularnymi konsultacjami i możliwością wprowadzania zmian"
    },
    {
      icon: <FileText className="h-8 w-8 text-green-500" />,
      title: "Transparentność",
      description: "Regularne raporty z postępów, dostęp do środowiska testowego i pełna dokumentacja"
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      title: "Terminowość",
      description: "Jasno określone milestones i dotrzymywanie ustalonych terminów realizacji"
    }
  ]

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
      <SEOHead 
          title="Proces Tworzenia Stron | Projektowanie, SEO, Marketing"
          description="Poznaj nasz proces tworzenia stron internetowych i sklepów online. Od projektu, przez optymalizację SEO, po skuteczne kampanie marketingowe. Zobacz, jak pracujemy!"
          keywords="strony internetowe, tworzenie stron www, sklepy internetowe, pozycjonowanie SEO, Google Ads, marketing internetowy"
          url="https://webdkw.pl"
        />
      
      <Header />
      
      <main className="pt-20">
        {/* Header section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 mb-8">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Powrót na stronę główną</span>
              </Link>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Proces realizacji projektu
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Poznaj szczegółowy proces tworzenia Twojej strony internetowej. 
                Każdy etap jest starannie zaplanowany, aby zapewnić najwyższą jakość i terminowość.
              </p>
            </div>
          </div>
        </section>

        {/* Methodology section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Nasza metodologia pracy
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {methodology.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className="flex justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process phases */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">
              5 faz realizacji projektu
            </h2>
            
            <div className="space-y-16">
              {phases.map((phase, index) => (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row items-start gap-12 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="bg-gray-50 p-8 rounded-2xl">
                      <div className="flex items-center space-x-4 mb-6">
                        {phase.icon}
                        <div>
                          <div className="text-sm font-semibold text-orange-500 mb-1">
                            {phase.phase}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {phase.title}
                          </h3>
                          <div className="text-gray-500 font-medium">
                            Czas realizacji: {phase.duration}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-lg mb-6">
                        {phase.description}
                      </p>

                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-4">Szczegółowe kroki:</h4>
                        <ul className="space-y-2">
                          {phase.steps.map((step, idx) => (
                            <li key={idx} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 mb-4">Deliverables:</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {phase.deliverables.map((deliverable, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{deliverable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phase number */}
                  <div className="flex-shrink-0 lg:w-32 flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline summary */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Podsumowanie harmonogramu
            </h2>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">4-8</div>
                  <div className="text-gray-600">tygodni realizacji</div>
                  <div className="text-sm text-gray-500 mt-1">dla standardowych projektów</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">5</div>
                  <div className="text-gray-600">faz projektu</div>
                  <div className="text-sm text-gray-500 mt-1">z jasnymi milestone'ami</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
                  <div className="text-gray-600">wsparcie</div>
                  <div className="text-sm text-gray-500 mt-1">przez cały okres współpracy</div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">
                  💡 Dlaczego nasz proces jest skuteczny?
                </h3>
                <p className="text-blue-800">
                  Każda faza ma jasno określone cele i deliverables. Regularnie konsultujemy postępy, 
                  co pozwala na wprowadzanie korekt i zapewnia, że końcowy produkt w 100% spełnia 
                  Twoje oczekiwania biznesowe.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Gotowy rozpocząć swój projekt?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Umów się na bezpłatną konsultację i omówimy szczegóły realizacji Twojego projektu.
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
    </HelmetProvider>
  )
}

export default ProcessPage