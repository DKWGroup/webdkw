import {
  ArrowLeft,
  Check,
  DollarSign,
  ExternalLink,
  Minus,
  Plus,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Project, supabase } from "../../lib/supabase";

const MarketingPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openProcess, setOpenProcess] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .ilike("description", "%marketing%")
        .limit(3);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const packages = [
    {
      name: "Setup Kampanii",
      price: "od 1 000 zł",
      description: "Jednorazowe przygotowanie kampanii reklamowych",
      features: [
        "Analiza grupy docelowej",
        "Konfiguracja Google Ads",
        "Konfiguracja Facebook/Instagram Ads",
        "Pixel tracking setup",
        "Landing page optymalizacja",
        "Pierwsze kampanie testowe",
        "Szkolenie z obsługi",
      ],
      timeframe: "1 tydzień",
      oneTime: true,
    },
    {
      name: "Zarządzanie Miesięczne",
      price: "od 600 zł",
      description: "Profesjonalne zarządzanie kampaniami reklamowymi",
      features: [
        "Zarządzanie Google Ads",
        "Zarządzanie Facebook/Instagram Ads",
        "Optymalizacja kampanii",
        "A/B testing reklam",
        "Miesięczne raporty ROI",
        "Optymalizacja budżetu",
        "Wsparcie techniczne",
      ],
      timeframe: "Pierwsze rezultaty w 2-4 tygodnie",
      popular: true,
    },
    {
      name: "Marketing PRO",
      price: "od 3000 zł",
      description: "Kompleksowa strategia marketingu cyfrowego",
      features: [
        "Wszystko z pakietu Miesięcznego",
        "Email marketing automation",
        "Content marketing",
        "Social media management",
        "Remarketing campaigns",
        "Conversion rate optimization",
        "Dedykowany account manager",
      ],
      timeframe: "Pełne rezultaty w 2-3 miesiące",
    },
  ];

  const platforms = [
    {
      icon: <Target className="h-8 w-8 text-orange-500" />,
      title: "Google Ads",
      description:
        "Reklamy w wyszukiwarce, YouTube, Gmail i sieci partnerskiej Google",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "Facebook & Instagram Ads",
      description:
        "Precyzyjne targetowanie w największych sieciach społecznościowych",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      title: "LinkedIn Ads",
      description: "Skuteczne dotarcie do decydentów B2B i profesjonalistów",
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Remarketing",
      description:
        "Ponowne dotarcie do osób, które już odwiedziły Twoją stronę",
    },
  ];

  const benefits = [
    "Szybkie rezultaty - pierwsze leady w ciągu 24-48h",
    "Precyzyjne targetowanie idealnych klientów",
    "Pełna kontrola nad budżetem reklamowym",
    "Szczegółowe raportowanie ROI",
    "Optymalizacja kosztów pozyskania klienta",
    "Skalowalność kampanii wraz z rozwojem biznesu",
  ];

  const metrics = [
    {
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      metric: "ROI 300-800%",
      description: "Średni zwrot z inwestycji w kampanie",
    },
    {
      icon: <Target className="h-8 w-8 text-blue-500" />,
      metric: "CTR 3-8%",
      description: "Współczynnik klikalności naszych reklam",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      metric: "CPC -40%",
      description: "Redukcja kosztów kliknięcia vs. konkurencja",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      metric: "Konwersja +250%",
      description: "Średni wzrost konwersji po optymalizacji",
    },
  ];

  const processSteps = [
    {
      title: "Analiza biznesu i grupy docelowej",
      details: [
        "Szczegółowa analiza modelu biznesowego",
        "Identyfikacja idealnego klienta (buyer persona)",
        "Analiza konkurencji i ich strategii reklamowych",
        "Określenie celów kampanii i KPI",
        "Ustalenie budżetu i strategii bidowania",
      ],
    },
    {
      title: "Badanie konkurencji i rynku",
      details: [
        "Analiza reklam konkurencji",
        "Badanie słów kluczowych w branży",
        "Analiza landing pages konkurentów",
        "Identyfikacja luk w rynku",
        "Benchmarking kosztów i wyników",
      ],
    },
    {
      title: "Opracowanie strategii kampanii",
      details: [
        "Wybór odpowiednich platform reklamowych",
        "Strategia targetowania i segmentacji",
        "Planowanie budżetu i harmonogramu",
        "Określenie struktury kampanii",
        "Strategia testowania i optymalizacji",
      ],
    },
    {
      title: "Przygotowanie kreacji reklamowych",
      details: [
        "Tworzenie tekstów reklamowych",
        "Projektowanie grafik i bannerów",
        "Przygotowanie materiałów wideo",
        "A/B testing różnych wersji",
        "Optymalizacja pod konwersję",
      ],
    },
    {
      title: "Konfiguracja i uruchomienie kampanii",
      details: [
        "Konfiguracja kont reklamowych",
        "Implementacja pixel tracking",
        "Ustawienie konwersji i celów",
        "Konfiguracja remarketing",
        "Uruchomienie kampanii testowych",
      ],
    },
    {
      title: "Monitoring i optymalizacja wyników",
      details: [
        "Codzienne monitorowanie wyników",
        "Optymalizacja bidów i budżetów",
        "Testowanie nowych kreacji",
        "Analiza i raportowanie ROI",
        "Skalowanie skutecznych kampanii",
      ],
    },
  ];

  const uniqueFeatures = [
    {
      title: "Data-driven approach",
      description:
        "Wszystkie decyzje podejmujemy na podstawie danych i testów, nie intuicji.",
    },
    {
      title: "Transparentne raportowanie",
      description:
        "Otrzymujesz szczegółowe raporty z jasno określonym ROI i wpływem na sprzedaż.",
    },
    {
      title: "Ciągła optymalizacja",
      description:
        "Nieustannie testujemy i optymalizujemy kampanie dla maksymalnych wyników.",
    },
    {
      title: "Holistyczne podejście",
      description:
        "Łączymy różne kanały reklamowe w spójną strategię marketingową.",
    },
  ];

  const faqs = [
    {
      question: "Jaki budżet reklamowy powinienem przeznaczyć?",
      answer:
        "Budżet zależy od branży, konkurencji i celów. Zalecamy start od 3000-5000 PLN miesięcznie dla testów, a następnie skalowanie skutecznych kampanii. Pomożemy określić optymalny budżet dla Twojego biznesu.",
    },
    {
      question: "Jak szybko zobaczę pierwsze rezultaty?",
      answer:
        "Pierwsze rezultaty widać już w ciągu 24-48 godzin od uruchomienia kampanii. Optymalne wyniki osiągamy po 2-4 tygodniach testowania i optymalizacji.",
    },
    {
      question: "Czy Google Ads jest lepsze od Facebook Ads?",
      answer:
        "To zależy od Twojego biznesu. Google Ads świetnie sprawdza się dla usług B2B i wysokiej intencji zakupu. Facebook Ads lepiej działa dla produktów B2C i budowania świadomości marki. Często łączymy oba kanały.",
    },
    {
      question: "Jak mierzicie skuteczność kampanii?",
      answer:
        "Mierzymy ROI, koszt pozyskania klienta (CAC), współczynnik konwersji, CTR i inne KPI. Otrzymujesz miesięczne raporty z jasno określonym wpływem na sprzedaż.",
    },
    {
      question: "Czy mogę samodzielnie zarządzać kampaniami?",
      answer:
        "Tak, oferujemy szkolenia i przekazanie kampanii. Jednak profesjonalne zarządzanie wymaga doświadczenia i czasu - często lepiej skupić się na biznesie, a kampanie zostawić ekspertom.",
    },
  ];

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
                <TrendingUp className="h-16 w-16 text-orange-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Marketing i kampanie reklamowe
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Profesjonalne kampanie Google Ads i Facebook Ads, które generują
                wysokiej jakości leady i maksymalizują zwrot z inwestycji
                reklamowej.
              </p>
            </div>
          </div>
        </section>

        {/* Platforms section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Platformy reklamowe, z których korzystamy
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {platforms.map((platform, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg text-center"
                >
                  <div className="flex justify-center mb-4">
                    {platform.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {platform.title}
                  </h3>
                  <p className="text-gray-600">{platform.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What makes our marketing unique */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Co wyróżnia nasze kampanie reklamowe?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {uniqueFeatures.map((feature, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Nasze wyniki mówią same za siebie
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="text-center bg-white p-6 rounded-xl shadow-lg"
                >
                  <div className="flex justify-center mb-4">{metric.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {metric.metric}
                  </div>
                  <p className="text-gray-600">{metric.description}</p>
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
                Przykłady naszych kampanii marketingowych
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
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
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-orange-500 font-semibold mb-3">
                        {project.industry}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {project.description}
                      </p>
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
                Pakiety marketingowe
              </h2>
              <p className="text-xl text-gray-600">
                Wybierz model współpracy dostosowany do Twoich potrzeb
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                    pkg.popular
                      ? "border-orange-500 transform lg:scale-105"
                      : "border-gray-200"
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
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {pkg.name}
                      </h3>
                      <div className="text-3xl font-bold text-orange-500 mb-4">
                        {pkg.price}
                        {!pkg.oneTime && (
                          <span className="text-lg text-gray-500">/mies</span>
                        )}
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
                        {pkg.timeframe}
                      </p>
                      <Link
                        to="/kontakt"
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 inline-block ${
                          pkg.popular
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
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
              Proces tworzenia kampanii
            </h2>
            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200"
                >
                  <button
                    onClick={() =>
                      setOpenProcess(openProcess === index ? null : index)
                    }
                    className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {step.title}
                      </h3>
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
                            <li
                              key={idx}
                              className="flex items-start space-x-3"
                            >
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

        {/* Benefits section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Dlaczego warto zainwestować w reklamy online?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-900 mb-3">
                💡 Pamiętaj: Budżet reklamowy to inwestycja, nie koszt
              </h3>
              <p className="text-yellow-800">
                Każda złotówka wydana na dobrze zoptymalizowane kampanie
                reklamowe powinna przynosić 3-8 złotych przychodu. Nasze
                kampanie są projektowane z myślą o maksymalizacji ROI, nie o
                wydawaniu budżetu.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Często zadawane pytania
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200"
                >
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
              Gotowy na pierwsze leady już jutro?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Umów się na bezpłatną konsultację i otrzymaj strategię kampanii
              dla Twojego biznesu.
            </p>
            <Link
              to="/kontakt"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Umów bezpłatną konsultację
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MarketingPage;
