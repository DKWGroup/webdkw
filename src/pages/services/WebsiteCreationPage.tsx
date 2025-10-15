import {
  ArrowRight,
  BarChart,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Code,
  Globe,
  Lightbulb,
  Minus,
  Palette,
  Phone,
  Plus,
  Rocket,
  Search,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import ContactSection from "../../components/ContactSection";
import FAQSchema from "../../components/FAQSchema";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import SEOHead from "../../components/SEOHead";
import ServiceSchema from "../../components/ServiceSchema";
import { supabase } from "../../lib/supabase";

const WebsiteCreationPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch portfolio projects
  useEffect(() => {
    const fetchPortfolioProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (data && !error) {
        setPortfolioProjects(data);
      }
    };
    fetchPortfolioProjects();
  }, []);

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (data && !error) {
        setBlogPosts(data);
      }
    };
    fetchBlogPosts();
  }, []);

  // Auto-scroll for client logos
  useEffect(() => {
    const scroll = () => {
      setScrollPosition((prev) => {
        if (scrollRef.current) {
          const maxScroll = scrollRef.current.scrollWidth / 2;
          return prev >= maxScroll ? 0 : prev + 0.5;
        }
        return prev;
      });
    };

    const intervalId = setInterval(scroll, 20);
    return () => clearInterval(intervalId);
  }, []);

  // Hero services (replacing stats)
  const heroServices = [
    {
      label: "Strony firmowe",
      icon: <Building2 className="h-6 w-6 text-orange-500" />,
      description: "Profesjonalna wizytówka Twojej firmy",
    },
    {
      label: "Landing pages",
      icon: <Rocket className="h-6 w-6 text-orange-500" />,
      description: "Strony zoptymalizowane pod konwersję",
    },
    {
      label: "Serwisy WWW",
      icon: <Globe className="h-6 w-6 text-orange-500" />,
      description: "Rozbudowane portale i platformy",
    },
  ];

  // Problems & Solutions
  const problems = [
    {
      icon: <Target className="h-8 w-8 text-red-500" />,
      problem: "Strona nie przynosi klientów",
      solution:
        "Tworzymy strony, które zachęcają odwiedzających do kontaktu i zakupu",
    },
    {
      icon: <Search className="h-8 w-8 text-red-500" />,
      problem: "Nikt nie znajduje Twojej firmy w Google",
      solution:
        "Dbamy o to, żeby Twoja strona była widoczna dla potencjalnych klientów",
    },
    {
      icon: <Zap className="h-8 w-8 text-red-500" />,
      problem: "Strona wolno się ładuje i odstrasza użytkowników",
      solution:
        "Strona ładuje się błyskawicznie - nawet na słabszym łączu i telefonie",
    },
    {
      icon: <BarChart className="h-8 w-8 text-red-500" />,
      problem: "Reklamy Google nie przynoszą efektów",
      solution:
        "Przygotowujemy strony pod kampanie, żeby każda złotówka się liczyła",
    },
  ];

  // Solutions features
  const solutions = [
    {
      icon: <Target className="h-8 w-8 text-orange-500" />,
      title: "Strona, która skutecznie sprzedaje",
      description:
        "Każdy przycisk i formularz jest zaprojektowany tak, żeby odwiedzający łatwo się z Tobą skontaktował",
    },
    {
      icon: <Search className="h-8 w-8 text-orange-500" />,
      title: "Widoczność w Google i wyszukiwarkach AI",
      description:
        "Twoja strona będzie odpowiadać na pytania klientów - zarówno w Google, jak i w ChatGPT czy innych asystentach AI",
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Błyskawiczna szybkość na każdym urządzeniu",
      description:
        "Strona ładuje się natychmiastowo - niezależnie czy klient wchodzi z telefonu, tabletu czy komputera",
    },
    {
      icon: <BarChart className="h-8 w-8 text-orange-500" />,
      title: "Gotowa na reklamy Google i Meta",
      description:
        "Wiemy dokładnie, które reklamy przynoszą klientów - śledzimy każde kliknięcie i telefon",
    },
  ];

  // Offer scope
  const offerScope = [
    {
      category: "Typy stron",
      items: [
        "Strony sprzedażowe jednego produktu",
        "Strony firmowe wizytówki",
        "Strony typu one-page",
        "Strony z blogiem i aktualnościami",
      ],
    },
    {
      category: "Sklepy internetowe",
      items: [
        "Sklepy z płatnościami online",
        "Połączenie z systemami płatności (PayU, Przelewy24)",
        "Integracja z magazynem i systemami firmowymi",
        "Sprzedaż na marketplace",
      ],
    },
    {
      category: "Widoczność w Google i AI",
      items: [
        "Strategia słów kluczowych",
        "Przygotowanie pod wyszukiwarki AI",
        "Optymalizacja dla lokalnych firm",
        "Informacje o firmie czytelne dla Google",
      ],
    },
    {
      category: "Projekt i treści",
      items: [
        "Nowoczesny design dopasowany do Twojej marki",
        "Profesjonalne teksty zachęcające do zakupu",
        "Strona działa idealnie na telefonach",
        "Testy różnych wersji przycisków i formularzy",
      ],
    },
    {
      category: "Szybkość",
      items: [
        "Strona ładuje się błyskawicznie",
        "Zdjęcia w najnowszych formatach",
        "Szybkie serwery",
        "Priorytet dla wersji mobilnej",
      ],
    },
    {
      category: "Mierzenie efektów",
      items: [
        "Google Analytics i Search Console",
        "Kody śledzące dla reklam",
        "Nagrania sesji użytkowników",
        "Śledzenie połączeń telefonicznych",
      ],
    },
    {
      category: "Opieka po wdrożeniu",
      items: [
        "Instrukcje i szkolenie jak zarządzać stroną",
        "Wsparcie techniczne",
        "Regularne aktualizacje i kopie zapasowe",
        "Gwarancja poprawnego działania",
      ],
    },
  ];

  // Process steps
  const processSteps = [
    {
      number: 1,
      icon: <Lightbulb className="h-8 w-8 text-orange-500" />,
      title: "Poznajemy Twój biznes",
      description:
        "Sprawdzamy czego potrzebują Twoi klienci, co robią konkurenci i jak najlepiej zaprezentować Twoją ofertę",
      duration: "1 tydzień",
      deliverables: [
        "Dokument z ustaleniami",
        "Analiza konkurencji",
        "Plan działania",
      ],
    },
    {
      number: 2,
      icon: <Palette className="h-8 w-8 text-orange-500" />,
      title: "Projektujemy i piszemy treści",
      description:
        "Tworzymy szkice strony, nowoczesny design i profesjonalne teksty, które zachęcają do kontaktu",
      duration: "1-2 tygodnie",
      deliverables: [
        "Szkice układu strony",
        "Projekt graficzny",
        "Gotowe teksty",
      ],
    },
    {
      number: 3,
      icon: <Code className="h-8 w-8 text-orange-500" />,
      title: "Tworzymy stronę",
      description:
        "Budujemy stronę, łączymy ją z potrzebnymi systemami i dbamy o to, żeby Google ją polubił",
      duration: "2-3 tygodnie",
      deliverables: [
        "Działająca strona",
        "Połączenia z systemami",
        "Przygotowanie pod Google",
      ],
    },
    {
      number: 4,
      icon: <CheckCircle className="h-8 w-8 text-orange-500" />,
      title: "Testujemy i uruchamiamy",
      description:
        "Sprawdzamy czy wszystko działa jak należy, testujemy szybkość i bezpieczeństwo, po czym publikujemy stronę",
      duration: "1 tydzień",
      deliverables: [
        "Raport z testów",
        "Opublikowana strona",
        "Instrukcja obsługi",
      ],
    },
    {
      number: 5,
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      title: "Pomagamy rosnąć",
      description:
        "Przez 3 miesiące pomagamy ulepszyć wyniki, szkolimy z obsługi strony i regularnie raportujemy postępy",
      duration: "3 miesiące",
      deliverables: [
        "Co-miesięczne raporty",
        "Pomoc techniczna",
        "Sugestie ulepszeń",
      ],
    },
  ];

  // Packages - Simplified
  const packages = [
    {
      name: "START",
      price: "od 5 000 zł",
      description: "Dla małych firm i startupów",
      recommended: false,
      features: [
        "Do 5 podstron",
        "Responsywny design",
        "Podstawowe SEO",
        "Formularz kontaktowy",
      ],
      timeframe: "2-3 tygodnie",
    },
    {
      name: "BIZNES",
      price: "od 10 000 zł",
      description: "Dla rozwijających się firm",
      recommended: true,
      features: [
        "Do 15 podstron",
        "Zaawansowane SEO",
        "Integracje (CRM, analityka)",
        "Panel zarządzania treścią",
        "3 miesiące wsparcia gratis",
      ],
      timeframe: "4-6 tygodni",
    },
    {
      name: "E-COMMERCE",
      price: "od 18 000 zł",
      description: "Dla sklepów internetowych",
      recommended: false,
      features: [
        "Pełna funkcjonalność sklepu",
        "Płatności online",
        "Integracja z kurierami",
        "SEO dla produktów",
        "6 miesięcy wsparcia gratis",
      ],
      timeframe: "6-10 tygodni",
    },
  ];

  // Add-ons - Hidden but kept for future use
  // const addOns = [
  //   { name: "Profesjonalne artykuły na blog", price: "500-1500 zł/artykuł" },
  //   { name: "Sesja zdjęciowa/filmowa", price: "2000-5000 zł" },
  //   { name: "Automatyzacje i łączenie systemów", price: "1500-3000 zł" },
  //   { name: "Dodatkowe wersje językowe", price: "2000-4000 zł/język" },
  //   { name: "Dedykowane integracje", price: "3000-8000 zł" },
  //   { name: "Materiały do pobrania dla klientów (PDF)", price: "1000-2500 zł" },
  // ];

  // Social proof - clients
  const clients = [
    {
      name: "Akademia Lutowania",
      logo: "/images/clients/akademia-lutowania.webp",
    },
    { name: "Contenty", logo: "/images/clients/contenty.webp" },
    { name: "Grzegorz Kusz", logo: "/images/clients/gk.webp" },
    { name: "GlowUP", logo: "/images/clients/glowup.webp" },
    { name: "Investment Partners", logo: "/images/clients/inp.svg" },
    { name: "MKHelicopters", logo: "/images/clients/mkhelicopters.webp" },
    { name: "WellDone", logo: "/images/clients/welldone.webp" },
  ];

  // FAQ
  const faqs = [
    {
      question: "Ile kosztuje strona internetowa?",
      answer:
        "Cena zależy od tego, czego potrzebujesz. Prosta strona sprzedażowa to 5-8 tys. zł. Pełna strona firmowa z blogiem i widocznością w Google to 10-18 tys. zł. Sklep internetowy to 18-35 tys. zł. Dokładną cenę ustalimy po krótkiej rozmowie, w której poznamy Twoje potrzeby.",
    },
    {
      question: "Jak długo trzeba czekać na gotową stronę?",
      answer:
        "Prosta strona: 2-3 tygodnie. Strona firmowa: 4-6 tygodni. Sklep online: 6-10 tygodni. To czas od rozmowy o Twoich potrzebach, przez projekt i tworzenie, aż po uruchomienie. Dokładny termin ustalimy razem.",
    },
    {
      question: "Co jeśli coś nie będzie działać?",
      answer:
        "Wszystko jest objęte gwarancją zgodnie z umową. Odpowiadamy na zgłoszenia w 12-48 godzin (w zależności od pakietu). Naprawiamy wszystkie błędy bezpłatnie. Strona, kod i wszystkie konta są w 100% Twoje. Robimy codzienne kopie zapasowe. Po uruchomieniu pomagamy przez 1-6 miesięcy.",
    },
    {
      question: "WordPress czy dedykowana strona - co lepsze?",
      answer:
        "WordPress to szybsze wdrożenie, niższy koszt i łatwa edycja treści - świetny dla większości firm i blogów. Dedykowana strona (bez WordPress) to maksymalna szybkość i dowolne funkcje - idealny dla sklepów i bardziej złożonych projektów. Doradzimy co będzie najlepsze dla Ciebie.",
    },
    {
      question: "Czy będę mógł sam zmieniać teksty na stronie?",
      answer:
        "Tak! Pokażemy Ci jak edytować teksty, dodawać zdjęcia i publikować artykuły. To jest bardzo proste i nie wymaga żadnej wiedzy technicznej. Dostaniesz też filmy instruktażowe i zawsze możesz zapytać nas o pomoc.",
    },
    {
      question: "Czy możecie połączyć stronę z moimi systemami?",
      answer:
        "Tak, łączymy strony z najpopularniejszymi systemami: CRM (np. HubSpot, Salesforce), systemami firmowymi, płatnościami online (PayU, Przelewy24, Stripe), emailingiem (Mailchimp, GetResponse), Allegro, Amazon i wieloma innymi. Powiemy Ci co jest możliwe w Twoim przypadku.",
    },
    {
      question: "Co się dzieje po uruchomieniu strony?",
      answer:
        "Przez określony czas (1-6 miesięcy w zależności od pakietu) pomagamy i poprawiamy wszystko co trzeba. Aktualizujemy zabezpieczenia, robimy kopie zapasowe, monitorujemy czy strona działa, wysyłamy raporty z wyników i radzimy jak poprawić efekty.",
    },
    {
      question: "Czy strona będzie działać z reklamami Google?",
      answer:
        "Tak! Przygotowujemy specjalne strony pod reklamy Google i Facebook. Dodajemy kody śledzące, dzięki którym będziesz wiedział które reklamy przynoszą klientów. Śledzimy też telefony z reklam. Testujemy różne wersje, żeby reklamy jak najlepiej działały.",
    },
  ];

  // Team
  const team = {
    name: "Kamil Krukowski",
    role: "Założyciel i główny specjalista",
    bio: "4 lata doświadczenia w tworzeniu stron i marketingu internetowym. Pomagam firmom być widocznymi w Google, w ChatGPT i innych narzędziach AI. Tworzę strony, które nie tylko ładnie wyglądają, ale przede wszystkim przynoszą klientów.",
    image: "/images/Kamil-Krukowski-small.webp",
  };

  // NAP data
  const nap = {
    company: "WebDKW - DKW Group",
    phone: "+48 881 046 689",
    email: "contact.dkwgroup@gmail.com",
    coverage: "Cała Polska (zdalnie)",
    hours: "Pn-Pt: 9:00-18:00",
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Tworzenie Stron Internetowych - Strony, Które Sprzedają | WebDKW"
          description="Projektujemy strony, które sprzedają. Szybkie, responsywne, zoptymalizowane pod SEO/GEO/AEO. WordPress, custom, e-commerce. Gwarancje jakości, SLA, transparentne ceny. Umów konsultację 15 min."
          keywords="tworzenie stron internetowych, strona firmowa, landing page, sklep online, e-commerce, SEO, GEO, AEO, WordPress, headless, UX/UI, Core Web Vitals, Google Ads"
          url="https://webdkw.net/uslugi/tworzenie-stron"
        />

        <ServiceSchema
          name="Tworzenie Stron Internetowych"
          description="Profesjonalne tworzenie stron internetowych, landing pages i sklepów online. Szybkie, responsywne, zoptymalizowane pod SEO/GEO/AEO i dane strukturalne."
          provider="WebDKW"
          areaServed="Polska"
          url="https://webdkw.net/uslugi/tworzenie-stron"
        />

        <FAQSchema items={faqs} />

        <Header />

        <main className="pt-16">
          {/* HERO Section */}
          <section className="relative bg-white py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Projektujemy strony, które{" "}
                  <span className="text-primary-500">sprzedają</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                  Tworzymy strony i sklepy internetowe, które szybko pojawiają
                  się w Google, są gotowe na AI i gwarantują realne wyniki
                  biznesowe.
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
                  <Link
                    to="/kontakt"
                    className="w-full sm:w-auto bg-white text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Umów konsultację 15 min</span>
                  </Link>
                </div>

                {/* Main Services */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {heroServices.map((service, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-6 text-center"
                    >
                      <div className="flex justify-center mb-3">
                        {service.icon}
                      </div>
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {service.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {service.description}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Client logos - Auto Scroll */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <p className="text-gray-500 text-sm mb-6">Zaufali nam:</p>
                  <div className="relative overflow-hidden">
                    <div
                      ref={scrollRef}
                      className="flex gap-12 items-center"
                      style={{ transform: `translateX(-${scrollPosition}px)` }}
                    >
                      {[...clients, ...clients].map((client, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 transition-all duration-300"
                        >
                          <img
                            src={client.logo}
                            alt={client.name}
                            className="h-12 sm:h-16 w-auto filter grayscale invert opacity-60 hover:opacity-100 transition-all duration-300 object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Problems & Solutions Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Znasz te problemy?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  90% MŚP w Polsce zmaga się z tymi wyzwaniami. Mamy sprawdzone
                  rozwiązania.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                {problems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border-l-4 border-red-500 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">{item.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {item.problem}
                        </h3>
                        <div className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-600">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Solutions grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {solutions.map((solution, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="mb-4">{solution.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {solution.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {solution.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Offer & Scope Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Kompleksowa oferta i zakres
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Od strategii i projektu, przez wdrożenie i integracje, po
                  analitykę i wsparcie
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {offerScope.map((scope, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary-500" />
                      </div>
                      {scope.category}
                    </h3>
                    <ul className="space-y-2">
                      {scope.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Sprawdzony proces 5 kroków
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Transparentny harmonogram z gwarancjami jakości i SLA
                </p>
              </div>

              <div className="space-y-8">
                {processSteps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      {/* Number */}
                      <div className="flex-shrink-0 w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                        {step.number}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          {step.icon}
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {step.title}
                            </h3>
                            <p className="text-primary-500 font-semibold">
                              {step.duration}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{step.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {step.deliverables.map((deliverable, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                            >
                              {deliverable}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/proces-realizacji"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span>Zobacz szczegółowy opis procesu</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Portfolio Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Sprawdzone rezultaty
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Zobacz nasze najnowsze realizacje
                </p>
              </div>

              {portfolioProjects.length > 0 ? (
                <>
                  <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {portfolioProjects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="relative group">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-64 object-cover filter transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                            {project.project_url && (
                              <a
                                href={project.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>Zobacz projekt</span>
                                <ArrowRight className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          <div className="absolute top-4 left-4">
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {project.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-8">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {project.title}
                              </h3>
                              <p className="text-orange-500 font-semibold">
                                {project.industry}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {project.completion_date
                                  ? new Date(
                                      project.completion_date
                                    ).getFullYear()
                                  : "2024"}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 leading-relaxed mb-6">
                            {project.description}
                          </p>

                          {project.technologies &&
                            project.technologies.length > 0 && (
                              <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                  {project.technologies.map(
                                    (tech: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                      >
                                        {tech}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {project.results && project.results.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-bold text-gray-900 mb-4">
                                Rezultaty:
                              </h4>
                              <div className="grid grid-cols-1 gap-4">
                                {project.results.map(
                                  (result: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="text-center p-4 bg-gray-50 rounded-lg"
                                    >
                                      <div className="text-xl font-bold text-gray-900 mb-1">
                                        {result.value}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {result.metric}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {project.case_study && (
                            <Link
                              to={`/case-studies/${project.slug}`}
                              className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                            >
                              <span>Przeczytaj szczegółowy case study</span>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <Link
                      to="/portfolio"
                      className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span>Zobacz całe portfolio</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Wkrótce dodamy nasze najnowsze realizacje</p>
                </div>
              )}
            </div>
          </section>

          {/* Packages Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Pakiety i cennik
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Transparentne widełki cenowe. Finalna wycena po konsultacji 15
                  min.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {packages.map((pkg, index) => (
                  <div
                    key={index}
                    className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                      pkg.recommended
                        ? "border-primary-500 transform lg:scale-105"
                        : "border-gray-200"
                    }`}
                  >
                    {pkg.recommended && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-primary-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                          NAJPOPULARNIEJSZY
                        </div>
                      </div>
                    )}

                    <div className="p-8">
                      <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          {pkg.name}
                        </h3>
                        <div className="text-3xl font-bold text-primary-500 mb-4">
                          {pkg.price}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {pkg.description}
                        </p>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">
                              {feature}
                            </span>
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
                        className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                          pkg.recommended
                            ? "bg-primary-500 text-white hover:bg-primary-600"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        Zamów wycenę
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add-ons - Hidden */}

              <div className="text-center mt-12">
                <p className="text-gray-600 mb-6">
                  Potrzebujesz indywidualnej wyceny? Umów bezpłatną konsultację.
                </p>
                <Link
                  to="/kontakt"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Phone className="h-5 w-5" />
                  <span>Umów konsultację 15 min</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Blog Posts Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Najnowsze artykuły
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Poznaj nasze porady i insights z branży
                </p>
              </div>

              {blogPosts.length > 0 ? (
                <>
                  <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {blogPosts.map((post) => (
                      <article
                        key={post.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="relative">
                          <img
                            src={
                              post.image_url ||
                              "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"
                            }
                            alt={post.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            {post.tags && post.tags.length > 0 && (
                              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {post.tags[0]}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(post.created_at).toLocaleDateString(
                                  "pl-PL",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>

                          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                            {post.title}
                          </h2>

                          <p className="text-gray-600 leading-relaxed mb-4">
                            {post.excerpt}
                          </p>

                          <Link
                            to={`/blog/${post.slug}`}
                            className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                          >
                            <span>Czytaj dalej</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="text-center">
                    <Link
                      to="/blog"
                      className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span>Zobacz wszystkie artykuły</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Wkrótce pojawią się nowe artykuły</p>
                </div>
              )}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  Najczęściej zadawane pytania
                </h2>
                <p className="text-xl text-gray-600">
                  Wszystko, co musisz wiedzieć przed rozpoczęciem współpracy
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

          {/* About/Team Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  O nas
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Doświadczenie w IT i marketingu. Misja: AI-ready web.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 rounded-lg p-8 shadow-lg flex flex-col md:flex-row items-center gap-8">
                  <img
                    src={team.image}
                    alt={team.name}
                    className="w-32 h-32 rounded-full object-cover shadow-md"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {team.name}
                    </h3>
                    <p className="text-primary-500 font-semibold mb-4">
                      {team.role}
                    </p>
                    <p className="text-gray-600 leading-relaxed">{team.bio}</p>
                  </div>
                </div>

                {/* NAP data */}
                <div className="mt-12 grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">
                      Dane kontaktowe
                    </h4>
                    <div className="space-y-3 text-gray-600">
                      <p>
                        <strong>Firma:</strong> {nap.company}
                      </p>
                      <p>
                        <strong>Telefon:</strong>{" "}
                        <a
                          href={`tel:${nap.phone}`}
                          className="text-primary-500 hover:underline"
                        >
                          {nap.phone}
                        </a>
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        <a
                          href={`mailto:${nap.email}`}
                          className="text-primary-500 hover:underline"
                        >
                          {nap.email}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-900 mb-4">
                      Zasięg działania
                    </h4>
                    <div className="space-y-3 text-gray-600">
                      <p>
                        <strong>Obszar:</strong> {nap.coverage}
                      </p>
                      <p>
                        <strong>Godziny pracy:</strong> {nap.hours}
                      </p>
                      <p className="pt-4">
                        <Link
                          to="/o-nas"
                          className="text-primary-500 hover:underline inline-flex items-center gap-2"
                        >
                          <span>Dowiedz się więcej o nas</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Local Pages - Minimalist Linking */}
          <section className="py-12 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Tworzenie stron internetowych w Twoim regionie:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <Link
                    to="/katowice-tworzenie-stron"
                    className="text-primary-500 hover:text-primary-600 font-semibold hover:underline transition-colors"
                  >
                    Katowice
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link
                    to="/chorzow-tworzenie-stron"
                    className="text-primary-500 hover:text-primary-600 font-semibold hover:underline transition-colors"
                  >
                    Chorzów
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link
                    to="/gliwice-tworzenie-stron"
                    className="text-primary-500 hover:text-primary-600 font-semibold hover:underline transition-colors"
                  >
                    Gliwice
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link
                    to="/strony-internetowe-seo-slask"
                    className="text-primary-500 hover:text-primary-600 font-semibold hover:underline transition-colors"
                  >
                    Cały Śląsk
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-20 bg-primary-500 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Gotowy na stronę, która sprzedaje?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Umów bezpłatną konsultację 15 min i otrzymaj indywidualną wycenę
                w 24-48h
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/kontakt"
                  className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <span>Zamów wycenę teraz</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/kontakt"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur text-white border-2 border-white/20 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>Zarezerwuj termin</span>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <ContactSection />

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default WebsiteCreationPage;
