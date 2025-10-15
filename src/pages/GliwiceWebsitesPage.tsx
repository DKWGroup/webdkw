import {
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Minus,
  Phone,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import ContactSection from "../components/ContactSection";
import FAQSchema from "../components/FAQSchema";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LocalBusinessSchema from "../components/LocalBusinessSchema";
import PortfolioSection from "../components/PortfolioSection";
import SEOHead from "../components/SEOHead";
import ServiceSchema from "../components/ServiceSchema";

const GliwiceWebsitesPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Packages - simplified
  const packages = [
    {
      name: "START",
      price: "od 3 000 zł",
      description: "Dla małych firm w Gliwicach",
      features: [
        "Strona wizytówka (do 5 podstron)",
        "Responsywny design",
        "Lokalne SEO (Gliwice)",
        "Formularz kontaktowy",
        "Google Maps",
      ],
      timeframe: "2-3 tygodnie",
    },
    {
      name: "BIZNES",
      price: "od 6 000 zł",
      recommended: true,
      description: "Najpopularniejszy w regionie",
      features: [
        "Pełna strona firmowa (do 15 podstron)",
        "Zaawansowane lokalne SEO",
        "Integracja z Google Business Profile",
        "Panel do edycji treści",
        "3 miesiące wsparcia gratis",
      ],
      timeframe: "4-6 tygodni",
    },
    {
      name: "E-COMMERCE",
      price: "od 10 000 zł",
      description: "Dla sklepów online",
      features: [
        "Sklep internetowy",
        "Płatności online (PayU, Przelewy24)",
        "Integracja z kurierami",
        "Lokalne SEO dla produktów",
        "6 miesięcy wsparcia gratis",
      ],
      timeframe: "6-10 tygodni",
    },
  ];

  // FAQ
  const faqs = [
    {
      question: "Ile kosztuje strona internetowa w Gliwicach?",
      answer:
        "Strona wizytówka od 3 000 zł, strona firmowa od 6 000 zł, sklep online od 10 000 zł. Dokładną cenę ustalimy po krótkiej rozmowie o Twoich potrzebach.",
    },
    {
      question: "Jak długo trzeba czekać na stronę?",
      answer:
        "Prosta strona: 2-3 tygodnie, strona firmowa: 4-6 tygodni, sklep: 6-10 tygodni. Działamy szybko i transparentnie.",
    },
    {
      question: "Czy strona będzie widoczna w Google w Gliwicach?",
      answer:
        "Tak! Optymalizujemy każdą stronę pod lokalne wyszukiwania. Dodajemy Twoją firmę do Google Maps, dbamy o opinie i lokalne SEO.",
    },
    {
      question: "Czy mogę sam edytować treści?",
      answer:
        "Oczywiście! Pokazujemy jak dodawać teksty i zdjęcia. To bardzo proste, nie potrzebujesz wiedzy technicznej.",
    },
    {
      question: "Co po uruchomieniu strony?",
      answer:
        "Przez 1-6 miesięcy (zależnie od pakietu) pomagamy, poprawiamy, monitorujemy i raportujemy wyniki. Jesteśmy z Tobą na każdym kroku.",
    },
  ];

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Tworzenie Stron Internetowych Gliwice - Strony, Które Sprzedają | WebDKW"
          description="Tworzymy strony internetowe w Gliwicach. Szybkie, widoczne w Google i Google Maps. WordPress, sklepy online. Lokalne SEO. Umów konsultację 15 min."
          keywords="tworzenie stron gliwice, strona internetowa gliwice, sklep internetowy gliwice, strony www gliwice, SEO gliwice, pozycjonowanie gliwice"
          url="https://webdkw.net/gliwice-tworzenie-stron"
        />

        <LocalBusinessSchema baseUrl="https://webdkw.net" />

        <ServiceSchema
          name="Tworzenie Stron Internetowych Gliwice"
          description="Profesjonalne tworzenie stron internetowych, landing pages i sklepów online w Gliwicach. Lokalne SEO i optymalizacja pod Google Maps."
          provider="WebDKW"
          areaServed="Gliwice, Śląskie"
          url="https://webdkw.net/gliwice-tworzenie-stron"
        />

        <FAQSchema items={faqs} />

        <Header />

        <main className="pt-16">
          {/* HERO Section */}
          <section className="relative bg-white py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-500 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <MapPin className="h-4 w-4" />
                  <span>Działamy lokalnie w Gliwicach i na Śląsku</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Projektujemy strony, które{" "}
                  <span className="text-primary-500">
                    sprzedają w Gliwicach
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                  Szybkie, widoczne w Google Maps i gotowe na lokalne
                  wyszukiwania. Kompleksowa obsługa od projektu po wsparcie.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  <Link
                    to="/kontakt"
                    className="group w-full sm:w-auto bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <span>Zamów wycenę</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="tel:+48881046689"
                    className="w-full sm:w-auto bg-white text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    <span>+48 881 046 689</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Problems & Solutions - Local */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Problemy firm w Gliwicach
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Znamy lokalne wyzwania i mamy sprawdzone rozwiązania
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="bg-white border-l-4 border-red-500 rounded-lg p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Nikt nie znajduje firmy w Google Maps
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Większość klientów szuka usług lokalnie przez telefon. Bez
                    widoczności w Google Maps tracisz zlecenia.
                  </p>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 font-semibold">
                      Optymalizujemy profil Google Business i lokalnie SEO
                    </p>
                  </div>
                </div>

                <div className="bg-white border-l-4 border-red-500 rounded-lg p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Strona nie przynosi zapytań ofertowych
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Masz stronę, ale klienci nie dzwonią ani nie piszą. Brakuje
                    formularzy lub są źle umieszczone.
                  </p>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 font-semibold">
                      Projektujemy strony, które prowadzą do kontaktu
                    </p>
                  </div>
                </div>

                <div className="bg-white border-l-4 border-red-500 rounded-lg p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Strona wolno się ładuje na telefonie
                  </h3>
                  <p className="text-gray-600 mb-4">
                    70% użytkowników odwiedza strony przez telefon. Wolna strona
                    = utraceni klienci.
                  </p>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 font-semibold">
                      Tworzymy błyskawiczne strony mobilne
                    </p>
                  </div>
                </div>

                <div className="bg-white border-l-4 border-red-500 rounded-lg p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Reklamy Google nie działają
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Płacisz za reklamy, ale nie wiesz które przynoszą klientów.
                    Wysokie koszty, mało efektów.
                  </p>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 font-semibold">
                      Przygotowujemy landing pages i śledzimy konwersje
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Oferta i zakres prac */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Co robimy?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Kompleksowa obsługa - od pomysłu do gotowej strony i rozwoju
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">🏢</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Strony firmowe
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Profesjonalne wizytówki dla firm z Gliwic. Szybkie,
                    responsywne, z formularzem kontaktowym i integracją z Google
                    Maps.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Landing pages
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Strony celowane pod konkretną usługę lub kampanię.
                    Maksymalna konwersja, analityka i śledzenie skuteczności.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">🌐</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Większe serwisy
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Rozbudowane strony korporacyjne, portale, platformy
                    rezerwacyjne. Panel administracyjny i integracje.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-4">🛒</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Sklepy online
                  </h3>
                  <p className="text-gray-600 text-sm">
                    E-commerce z płatnościami (PayU, Przelewy24), integracją
                    kurierską, zarządzaniem produktami i CRM.
                  </p>
                </div>
              </div>

              <div className="mt-16 bg-primary-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Pełen zakres obsługi
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        Strategia i projekt
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Analiza konkurencji, dobór technologii, wireframes i
                        mockupy
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        Treści i SEO
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Teksty sprzedażowe, lokalne SEO, optymalizacja Google
                        Maps
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        Wdrożenie
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Kodowanie, testy, uruchomienie na szybkim hostingu
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        Integracje
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Google Analytics, Meta Pixel, systemy płatności, CRM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        Analityka
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Śledzenie konwersji, raporty, heat mapy, optymalizacja
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Wsparcie</h4>
                      <p className="text-gray-600 text-sm">
                        Pomoc po starcie, aktualizacje, rozwój, szkolenia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio Section */}
          <PortfolioSection />

          {/* Packages - Simplified */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Pakiety i Cennik
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Proste pakiety dla firm z Gliwic
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {packages.map((pkg, index) => (
                  <div
                    key={index}
                    className={`border rounded-2xl p-8 hover:shadow-xl transition-shadow relative ${
                      pkg.recommended
                        ? "border-primary-500 shadow-xl"
                        : "border-gray-200"
                    }`}
                  >
                    {pkg.recommended && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Najpopularniejszy
                        </span>
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{pkg.description}</p>
                    <div className="mb-8">
                      <span className="text-4xl font-bold text-gray-900">
                        {pkg.price}
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mb-6 text-center">
                      <p className="text-sm text-gray-600">
                        <Clock className="inline h-4 w-4 mr-1" />
                        Czas realizacji: <strong>{pkg.timeframe}</strong>
                      </p>
                    </div>
                    <Link
                      to="/kontakt"
                      className={`block text-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                        pkg.recommended
                          ? "bg-primary-500 text-white hover:bg-primary-600"
                          : "border-2 border-primary-500 text-primary-500 hover:bg-primary-50"
                      }`}
                    >
                      Zamów wycenę
                    </Link>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Nie wiesz, który pakiet wybrać? Umów bezpłatną konsultację.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/kontakt"
                    className="inline-block bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                  >
                    Zamów wycenę
                  </Link>
                  <a
                    href="tel:+48881046689"
                    className="inline-block border-2 border-primary-500 text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                  >
                    Zadzwoń: +48 881 046 689
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* O nas - Gliwice */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Dlaczego my?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Lokalna agencja, która zna realia firm na Śląsku
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left side - founder photo and bio */}
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src="/images/Kamil-Krukowski.webp"
                      alt="Kamil Krukowski - Założyciel WebDKW"
                      className="w-48 h-48 rounded-full object-cover mb-6 shadow-xl"
                    />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Kamil Krukowski
                    </h3>
                    <p className="text-primary-500 font-semibold mb-4">
                      Założyciel WebDKW
                    </p>
                    <div className="bg-primary-50 rounded-2xl p-6 text-left">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Od ponad 5 lat tworzę strony internetowe, które naprawdę
                        sprzedają. Specjalizuję się w lokalnym SEO i
                        optymalizacji stron pod konwersję.
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Działam w Gliwicach i na całym Śląsku. Rozumiem
                        specyfikę lokalnego rynku, znam konkurencję i wiem, jak
                        przyciągnąć klientów z regionu.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Stawiamy na prostą komunikację, szybkie działanie i
                        konkretne efekty. Każdy projekt traktuję indywidualnie.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side - benefits */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        Lokalnie w Gliwicach
                      </h4>
                      <p className="text-gray-600">
                        Znamy lokalny rynek, konkurencję i potrzeby firm z
                        regionu. Spotykamy się osobiście, jeśli potrzebujesz.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        Szybko i transparentnie
                      </h4>
                      <p className="text-gray-600">
                        Wycena w 24-48h, start projektu w ciągu tygodnia. Zawsze
                        wiesz na jakim etapie jesteśmy.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        Kompleksowa obsługa
                      </h4>
                      <p className="text-gray-600">
                        Od strategii przez projekt, treści, kodowanie po
                        wsparcie i rozwój. Wszystko w jednym miejscu.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        Mierzalne efekty
                      </h4>
                      <p className="text-gray-600">
                        Analityka, raporty, śledzenie konwersji. Widzisz
                        dokładnie ile zapytań przynosi strona.
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                    <h4 className="font-bold text-green-800 mb-2">
                      🎯 Gwarancje
                    </h4>
                    <p className="text-green-700 text-sm">
                      Gwarantujemy terminowość, jakość kodu, szybkość ładowania
                      i wsparcie po starcie. Jesteśmy z Tobą na każdym etapie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Najczęściej zadawane pytania
                </h2>
                <p className="text-xl text-gray-600">
                  Odpowiedzi na pytania firm z Gliwic
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
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

              <div className="text-center mt-12">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-800 font-semibold">
                    💬 Masz inne pytanie? Skontaktuj się ze mną - odpowiem w
                    ciągu 24 godzin!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section - Local */}
          <ContactSection />

          {/* Internal Linking - Other Cities */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Działamy również w innych miastach na Śląsku
                </h2>
                <p className="text-xl text-gray-600">
                  Tworzymy strony internetowe dla firm z całego regionu
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <Link
                  to="/katowice-tworzenie-stron"
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="h-6 w-6 text-primary-500" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Katowice
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Tworzenie stron internetowych w Katowicach. Lokalne SEO i
                    widoczność w Google Maps.
                  </p>
                  <span className="text-primary-500 font-semibold group-hover:underline">
                    Zobacz ofertę dla Katowic →
                  </span>
                </Link>

                <Link
                  to="/chorzow-tworzenie-stron"
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="h-6 w-6 text-primary-500" />
                    <h3 className="text-xl font-bold text-gray-900">Chorzów</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Tworzenie stron internetowych w Chorzowie. Profesjonalne
                    strony dla firm z regionu.
                  </p>
                  <span className="text-primary-500 font-semibold group-hover:underline">
                    Zobacz ofertę dla Chorzowa →
                  </span>
                </Link>

                <Link
                  to="/strony-internetowe-seo-slask"
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="h-6 w-6 text-primary-500" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Cały Śląsk
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Strony internetowe dla firm z całego województwa śląskiego.
                    Kompleksowa obsługa.
                  </p>
                  <span className="text-primary-500 font-semibold group-hover:underline">
                    Zobacz ofertę regionalną →
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default GliwiceWebsitesPage;
