import {
  ArrowLeft,
  BarChart3,
  Check,
  CreditCard,
  ExternalLink,
  Minus,
  Package,
  Plus,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import SEOHead from "../../components/SEOHead";
import { Project, supabase } from "../../lib/supabase";

const EcommercePage = () => {
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
        .in("category", ["Sklep internetowy", "E-commerce", "Sklep B2B"])
        .limit(3);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const packages = [
    {
      name: "Mikro sklep",
      price: "od 4 000 zł",
      description: "Idealny dla małych sklepów z podstawowym asortymentem",
      features: [
        "Do 100 produktów",
        "WooCommerce lub Shopify",
        "Podstawowe płatności online",
        "Zarządzanie zamówieniami",
        "Responsywny design",
        "Podstawowe SEO",
        "Integracja z kurierami",
        "3 miesiące wsparcia",
      ],
      timeframe: "2 tygodnie",
    },
    {
      name: "Sklep Profesjonalny",
      price: "od 14 000 zł",
      description: "Zaawansowany sklep z rozszerzonymi funkcjami",
      features: [
        "Nieograniczona liczba produktów",
        "Zaawansowane płatności",
        "System magazynowy",
        "Program lojalnościowy",
        "Zaawansowana analityka",
        "Multi-waluta i multi-język",
        "Integracje z ERP/CRM",
        "6 miesięcy wsparcia",
      ],
      timeframe: "4 tygodnie",
      popular: true,
    },
    {
      name: "Sklep Enterprise",
      price: "Indywidualna cena",
      description: "Kompleksowe rozwiązanie dla dużych sklepów",
      features: [
        "Wszystko z pakietu Profesjonalnego",
        "Dedykowane rozwiązania custom",
        "B2B marketplace funkcje",
        "Zaawansowana automatyzacja",
        "Dedykowane integracje",
        "Multi-store management",
        "SLA i monitoring 24/7",
        "12 miesięcy wsparcia",
      ],
      timeframe: "6+ tygodni",
    },
  ];

  const features = [
    {
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,
      title: "Płatności online",
      description:
        "Integracja z PayU, Przelewy24, PayPal, BLIK i kartami płatniczymi",
    },
    {
      icon: <Package className="h-8 w-8 text-orange-500" />,
      title: "Zarządzanie produktami",
      description:
        "Intuicyjny panel do dodawania produktów, kategorii i wariantów",
    },
    {
      icon: <Truck className="h-8 w-8 text-orange-500" />,
      title: "Integracja z kurierami",
      description: "Automatyczne generowanie etykiet i śledzenie przesyłek",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-500" />,
      title: "Analityka sprzedaży",
      description:
        "Szczegółowe raporty sprzedaży, najpopularniejsze produkty, ROI",
    },
  ];

  const integrations = [
    "Systemy płatności: PayU, Przelewy24, PayPal, Stripe",
    "Kurierzy: DPD, InPost, UPS, DHL, Poczta Polska",
    "Księgowość: iFirma, Wfirma, Comarch",
    "Marketing: Google Analytics, Facebook Pixel, Mailchimp",
    "ERP/CRM: Salesforce, HubSpot, systemy dedykowane",
    "Magazyn: BaseLinker, Allegro, Amazon, eBay",
  ];

  const benefits = [
    "Zwiększenie sprzedaży o 200-400% w pierwszym roku",
    "Automatyzacja procesów sprzedażowych",
    "Lepsze zarządzanie magazynem i zamówieniami",
    "Dotarcie do nowych grup klientów",
    "Możliwość sprzedaży 24/7",
    "Szczegółowa analityka i raportowanie",
  ];

  const processSteps = [
    {
      title: "Analiza biznesu i strategia e-commerce",
      details: [
        "Analiza modelu biznesowego i grupy docelowej",
        "Badanie konkurencji w branży e-commerce",
        "Określenie strategii sprzedaży online",
        "Planowanie struktury produktów i kategorii",
        "Wybór platformy e-commerce (WooCommerce, Shopify, custom)",
      ],
    },
    {
      title: "Projektowanie sklepu i UX",
      details: [
        "Projektowanie ścieżki zakupowej (customer journey)",
        "Optymalizacja procesu checkout",
        "Projektowanie kart produktów",
        "Planowanie filtrów i wyszukiwarki",
        "Responsive design dla urządzeń mobilnych",
      ],
    },
    {
      title: "Konfiguracja platformy e-commerce",
      details: [
        "Instalacja i konfiguracja platformy",
        "Konfiguracja metod płatności",
        "Integracja z kurierami i dostawą",
        "Konfiguracja podatków i fakturowania",
        "Ustawienie powiadomień email",
      ],
    },
    {
      title: "Import produktów i treści",
      details: [
        "Import bazy produktów",
        "Optymalizacja opisów produktów pod SEO",
        "Dodanie zdjęć produktów",
        "Konfiguracja wariantów i opcji",
        "Ustawienie stanów magazynowych",
      ],
    },
    {
      title: "Integracje i automatyzacja",
      details: [
        "Integracja z systemami magazynowymi",
        "Połączenie z narzędziami analitycznymi",
        "Konfiguracja remarketing i pixel tracking",
        "Automatyzacja procesów biznesowych",
        "Integracja z systemami księgowymi",
      ],
    },
    {
      title: "Testy i uruchomienie",
      details: [
        "Testy procesu zakupowego",
        "Testy płatności i dostaw",
        "Optymalizacja wydajności",
        "Szkolenie z obsługi sklepu",
        "Uruchomienie i monitoring",
      ],
    },
  ];

  const uniqueFeatures = [
    {
      title: "Optymalizacja konwersji",
      description:
        "Każdy element sklepu projektujemy z myślą o maksymalizacji sprzedaży i redukcji porzucania koszyka.",
    },
    {
      title: "Zaawansowana analityka",
      description:
        "Implementujemy narzędzia do śledzenia zachowań klientów i optymalizacji sprzedaży.",
    },
    {
      title: "Automatyzacja procesów",
      description:
        "Automatyzujemy zarządzanie zamówieniami, magazynem i komunikacją z klientami.",
    },
    {
      title: "Skalowalność",
      description:
        "Sklepy projektujemy tak, aby mogły rosnąć wraz z Twoim biznesem.",
    },
  ];

  const faqs = [
    {
      question: "Jaką platformę e-commerce polecacie?",
      answer:
        "Wybór platformy zależy od specyfiki biznesu. Dla małych i średnich sklepów polecamy WooCommerce, dla szybkiego startu Shopify, a dla dużych projektów rozwiązania custom. Pomożemy wybrać najlepszą opcję.",
    },
    {
      question: "Czy sklep będzie zintegrowany z systemami płatności?",
      answer:
        "Tak, integrujemy sklep z popularnymi systemami płatności w Polsce: PayU, Przelewy24, PayPal, BLIK, płatności kartą. Wybieramy najlepsze opcje dla Twojej branży.",
    },
    {
      question: "Jak długo trwa stworzenie sklepu internetowego?",
      answer:
        "Podstawowy sklep to 4-6 tygodni, profesjonalny 6-10 tygodni, a enterprise 10+ tygodni. Czas zależy od liczby produktów, integracji i złożoności funkcjonalności.",
    },
    {
      question: "Czy sklep będzie zoptymalizowany pod SEO?",
      answer:
        "Absolutnie. Każdy sklep optymalizujemy pod SEO: struktura URL, meta tagi, opisy produktów, szybkość ładowania. Dodatkowo oferujemy zaawansowane pakiety SEO dla e-commerce.",
    },
    {
      question: "Jakie wsparcie otrzymam po uruchomieniu sklepu?",
      answer:
        "Oferujemy wsparcie techniczne przez okres określony w pakiecie (3-12 miesięcy). Obejmuje to pomoc techniczną, aktualizacje, szkolenia i optymalizację sprzedaży.",
    },
  ];

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead
          title="Sklepy Internetowe | WebDKW"
          description="Profesjonalne sklepy internetowe i rozwiązania e-commerce. Zwiększ sprzedaż online z naszymi zaawansowanymi rozwiązaniami."
          keywords="sklep internetowy, e-commerce, sprzedaż online, WooCommerce, Shopify"
          url="https://webdkw.net/uslugi/sklep-internetowy"
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
                  <ShoppingCart className="h-16 w-16 text-orange-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Sklepy internetowe
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Kompleksowe sklepy internetowe, które nie tylko prezentują
                  produkty, ale skutecznie sprzedają i automatyzują procesy
                  biznesowe.
                </p>
              </div>
            </div>
          </section>

          {/* Features section */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Kluczowe funkcje naszych sklepów
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-lg text-center"
                  >
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* What makes our stores unique */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Co wyróżnia nasze sklepy internetowe?
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

          {/* Portfolio projects */}
          {projects.length > 0 && (
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Przykłady naszych realizacji
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
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Pakiety i cennik
                </h2>
                <p className="text-xl text-gray-600">
                  Wybierz pakiet dostosowany do skali Twojego biznesu
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
                          Czas realizacji: {pkg.timeframe}
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
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Proces tworzenia sklepu internetowego
              </h2>
              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg">
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

          {/* Integrations section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Integracje i połączenia
                  </h2>
                  <div className="space-y-3">
                    {integrations.map((integration, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{integration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Korzyści dla Twojego biznesu
                  </h2>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security section */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <Shield className="h-12 w-12 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Bezpieczeństwo i zgodność z prawem
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          Bezpieczeństwo:
                        </h4>
                        <ul className="text-gray-600 space-y-1">
                          <li>• Certyfikat SSL</li>
                          <li>• Szyfrowanie danych</li>
                          <li>• Regularne backupy</li>
                          <li>• Monitoring bezpieczeństwa</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          Zgodność prawna:
                        </h4>
                        <ul className="text-gray-600 space-y-1">
                          <li>• RODO compliance</li>
                          <li>• Regulamin sklepu</li>
                          <li>• Polityka prywatności</li>
                          <li>• Prawo odstąpienia</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
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
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
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
                Gotowy na start sprzedaży online?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Umów się na bezpłatną konsultację i otrzymaj spersonalizowaną
                strategię dla Twojego sklepu.
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
    </HelmetProvider>
  );
};

export default EcommercePage;
