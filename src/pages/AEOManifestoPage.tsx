import {
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Search,
  Shield,
  Target,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import AEOFAQSection from "../components/AEOFAQSection";
import FAQSchema from "../components/FAQSchema";
import Footer from "../components/Footer";
import Header from "../components/Header";
import OrganizationSchema from "../components/OrganizationSchema";
import SEOContactForm from "../components/SEOContactForm";
import SEOHead from "../components/SEOHead";
import ServiceSchema from "../components/ServiceSchema";
import WebsiteSchema from "../components/WebsiteSchema";
import { track } from "../lib/analytics";
import { BlogPost, supabase } from "../lib/supabase";

const AEOManifestoPage = () => {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [csIndex, setCsIndex] = useState(0);
  const csImages = [
    {
      src: "https://obeabrdrtlxhucegkkiq.supabase.co/storage/v1/object/public/files/blog/mkheli-w-gpt3.png",
      alt: "MK Helicopters - zrzut z odpowiedzi AI/ChatGPT (przykład 1)",
    },
    {
      src: "https://obeabrdrtlxhucegkkiq.supabase.co/storage/v1/object/public/files/blog/mkheli-w-gpt2.png",
      alt: "MK Helicopters - zrzut z odpowiedzi AI/ChatGPT (przykład 2)",
    },
  ];

  // FAQ data for schema
  const faqItems = [
    {
      question: "Czym jest AI SEO i dlaczego jest ważne dla mojej firmy?",
      answer:
        "AI SEO to nowoczesne pozycjonowanie strony pod kątem wyszukiwarek wspieranych sztuczną inteligencją (np. Google AI Overview). Klasyczne SEO skupia się na frazach i linkach, a AI SEO dodatkowo dostosowuje treści pod nowe algorytmy AI, które dostarczają użytkownikowi gotowe odpowiedzi bez konieczności wchodzenia na stronę. Dlaczego to ważne? Bo jeśli Twoja firma nie pojawi się w tych wynikach, klienci trafią do konkurencji.",
    },
    {
      question: "Czy moja strona jest już niewidoczna w Google AI Overview?",
      answer:
        "Możliwe. Google AI Overview jest wdrażane stopniowo, ale w wielu branżach już teraz odpowiada zamiast strony firmowej, co oznacza, że użytkownicy nie klikają w Twój link. Prosty przykład: klient pyta w Google o usługę, a odpowiedź AI wyświetla dane konkurenta – a Ciebie tam nie ma. Możesz to sprawdzić już teraz w darmowym Raporcie AI SEO.",
    },
    {
      question: "Jakie konkretne efekty biznesowe mogę osiągnąć dzięki AI SEO?",
      answer:
        "AI SEO zwiększa szanse Twojej strony na widoczność w nowych wynikach Google, tworzonych przez sztuczną inteligencję. W praktyce przekłada się to na: większą liczbę odwiedzin strony, większe zainteresowanie Twoją ofertą i więcej zapytań od potencjalnych klientów. AI SEO pozwala także budować długoterminową przewagę nad konkurencją, która nie dostosowała się jeszcze do zmian w wyszukiwarce.",
    },
    {
      question: "Czy AI SEO zastąpi tradycyjne pozycjonowanie?",
      answer:
        "Nie, AI SEO nie zastępuje, a uzupełnia tradycyjne SEO. Klasyczne działania nadal są potrzebne, ale dzisiaj to za mało. AI SEO to dodatkowa warstwa optymalizacji, która przygotowuje stronę do widoczności w nowych wynikach tworzonych przez sztuczną inteligencję. Firmy, które zatrzymają się tylko na „starym SEO\", mogą tracić klientów.",
    },
    {
      question: "Ile kosztuje usługa AI SEO i jak wygląda proces współpracy?",
      answer:
        "Koszt zależy od wielkości strony i konkurencji w branży. Przygotowaliśmy dwa modele: AI SEO Start – jednorazowy audyt i wdrożenie podstawowych zmian od 500 zł; AI SEO PRO – pełna usługa abonamentowa od 1500 zł miesięcznie. Proces wygląda następująco: darmowy raport AI SEO, konsultacja online, przygotowanie planu działań, wdrożenie i regularna optymalizacja.",
    },
    {
      question: "Po jakim czasie zobaczę pierwsze rezultaty AI SEO?",
      answer:
        "Pierwsze zmiany w widoczności i CTR w Google zauważysz zwykle w ciągu kilku tygodni. Efekty sprzedażowe czy wzrost liczby zapytań najczęściej widoczne są w ciągu 2–3 miesięcy, w zależności od branży i konkurencji.",
    },
  ];

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  const fetchFeaturedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setFeaturedPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min czytania`;
  };

  const handleMouseLeave = () => {
    // Popup temporarily disabled
    // if (!showExitPopup) {
    //   setShowExitPopup(true);
    // }
  };

  const scrollToContact = () => {
    const contactSection = document.querySelector("[data-contact-section]");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAuditClick = () => {
    scrollToContact();
  };

  const handleDownloadGuide = () => {
    // Tu można dodać logikę pobierania przewodnika
    window.open("/contact", "_blank");
    setShowExitPopup(false);
  };

  return (
    <HelmetProvider>
      <div
        className="min-h-screen bg-white"
        onMouseLeave={handleMouseLeave}
        data-gtm-page="pozycjonowanie-ai"
      >
        <SEOHead
          title="Nowa Era Google AI – Zwiększ Widoczność Swojej Firmy | WebDKW"
          description="Google AI ukrywa Twoją stronę. 99% firm nie ma planu. Sprawdź ilu klientów tracisz – zamów darmowy Raport AI SEO w 24h!"
          keywords="pozycjonowanie AI, AI Overviews, pozycjonowanie pod sztuczną inteligencję, ai seo, audyt seo ai, google ai seo, answer engine optimization"
          url="https://webdkw.net/uslugi/pozycjonowanie-ai"
        />

        {/* Structured Data - Schema.org */}
        <WebsiteSchema baseUrl="https://webdkw.net" />
        <OrganizationSchema baseUrl="https://webdkw.net" />

        {/* Service Schema for AI SEO */}
        <ServiceSchema
          name="Pozycjonowanie AI SEO"
          description="Profesjonalne pozycjonowanie stron internetowych pod sztuczną inteligencję Google AI Overview, ChatGPT, Gemini i Perplexity. Zwiększ widoczność swojej firmy w erze AI."
          url="https://webdkw.net/uslugi/pozycjonowanie-ai"
          provider="WebDKW"
          price="1500"
          priceCurrency="PLN"
          areaServed="Poland"
          serviceType="SEO Services"
        />

        {/* FAQ Schema */}
        <FAQSchema items={faqItems} />

        {/* Breadcrumb Schema */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Strona główna",
                  "item": "https://webdkw.net"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Usługi",
                  "item": "https://webdkw.net/uslugi"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Pozycjonowanie AI",
                  "item": "https://webdkw.net/uslugi/pozycjonowanie-ai"
                }
              ]
            })}
          </script>
        </Helmet>

        {/* WebPage Schema with detailed information */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Pozycjonowanie AI SEO - Zwiększ Widoczność w Google AI",
              "description": "Google AI ukrywa Twoją stronę. 99% firm nie ma planu. Sprawdź ilu klientów tracisz – zamów darmowy Raport AI SEO w 24h!",
              "url": "https://webdkw.net/uslugi/pozycjonowanie-ai",
              "inLanguage": "pl-PL",
              "isPartOf": {
                "@type": "WebSite",
                "name": "WebDKW",
                "url": "https://webdkw.net"
              },
              "about": {
                "@type": "Thing",
                "name": "AI SEO",
                "description": "Pozycjonowanie stron internetowych pod sztuczną inteligencję"
              },
              "mainEntity": {
                "@type": "Service",
                "name": "Pozycjonowanie AI SEO",
                "provider": {
                  "@type": "Organization",
                  "name": "WebDKW"
                }
              },
              "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": ["h1", "h2", ".faq-question"]
              }
            })}
          </script>
        </Helmet>

        <Header />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-primary-50/30 to-blue-50/50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,139,0,0.1),rgba(255,255,255,0))]"></div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/20 rounded-full blur-xl animate-pulse hidden lg:block"></div>
          <div
            className="absolute bottom-20 right-20 w-48 h-48 bg-blue-200/20 rounded-full blur-xl animate-pulse hidden lg:block"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-10 w-24 h-24 bg-purple-200/20 rounded-full blur-lg animate-pulse hidden md:block"
            style={{ animationDelay: "2s" }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left">
                <div className="mb-8 animate-fade-in">
                  {/* Badge with improved styling */}
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-100 to-primary-50 border border-primary-200 text-primary-700 rounded-full text-sm font-semibold mb-8 shadow-lg backdrop-blur-sm">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></span>
                    🔥 Przygotuj się na rewolucję w wyszukiwaniu - AI zmienia zasady
                    gry
                  </div>

                  {/* Main Headline with improved typography */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Odzyskaj{" "}
                    <span className="relative">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                        34,5% klientów
                      </span>
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-primary-600/20 blur-lg -z-10"></div>
                    </span>
                    , których dziś zabiera Google AI
                  </h1>

                  {/* Subtitle with enhanced styling */}
                  <div className="relative mb-8">
                    <h2 className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl lg:max-w-none mx-auto lg:mx-0 leading-relaxed font-medium">
                      Google AI odpowiada zamiast Twojej strony –{" "}
                      <span className="text-primary-600 font-semibold">
                        Tracisz klientów
                      </span>
                      , którzy powinni trafiać do Ciebie.
                    </h2>
                  </div>

                  {/* Lead paragraph with icon */}
                  <div className="flex flex-col items-center lg:items-start mb-12">
                    <div className="mb-4 p-3 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full">
                      <svg
                        className="w-8 h-8 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl lg:max-w-none mx-auto lg:mx-0 leading-relaxed">
                      Nowe wyniki AI w Google już zabierają ruch większości firm.
                      <br className="hidden md:block" />
                      <span className="font-semibold text-gray-700">
                        99% przedsiębiorców nie ma na to planu.
                      </span>{" "}
                      Czy Ty masz?
                    </p>
                  </div>
                </div>

                {/* Enhanced CTA with gradient background */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                  <button
                    id="cta-hero-audyt-seo-ai"
                    data-gtm="cta_hero_audyt_seo_ai"
                    data-gtm-location="hero"
                    aria-label="CTA: Darmowy Audyt SEO AI"
                    onClick={() => {
                      track({
                        event: "cta_click",
                        category: "engagement",
                        label: "audyt_seo_ai_free",
                        location: "hero",
                      });
                      scrollToContact();
                    }}
                    className="relative group bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Search className="h-5 w-5 relative z-10" />
                    <span className="relative z-10">
                      Sprawdź swoją stronę teraz – darmowy audyt AI SEO
                    </span>
                  </button>
                </div>

                {/* Trust indicators with improved design */}
                <div
                  className="grid md:grid-cols-3 gap-4 lg:gap-6"
                  data-gtm-section="trust_indicators"
                >
                  <div className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 p-2 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors duration-300">
                        <Shield className="h-6 w-6 text-primary-500" />
                      </div>
                      <span className="font-semibold text-gray-700 text-sm">
                        Specjaliści od widoczności w ChatGPT, Gemini i Perplexity
                      </span>
                    </div>
                  </div>
                  <div className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 p-2 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors duration-300">
                        <Brain className="h-6 w-6 text-primary-500" />
                      </div>
                      <span className="font-semibold text-gray-700 text-sm">
                        Śledzenie trendów AI od początku rewolucji
                      </span>
                    </div>
                  </div>
                  <div className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 p-2 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors duration-300">
                        <CheckCircle className="h-6 w-6 text-primary-500" />
                      </div>
                      <span className="font-semibold text-gray-700 text-sm">
                        Sprawdzone metody dla firm z różnych branż
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Vertical Video */}
              <div className="w-full max-w-sm mt-12 lg:mt-0 lg:ml-24">
                <div className="relative">
                  {/* Video Container with aspect ratio for vertical video (9:16) */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 aspect-[9/16]">
                    {/* Placeholder - Replace with actual video */}
                    {/* <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-primary-600/20">
                      <div className="text-center p-8">
                        <div className="w-20 h-20 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-white font-semibold text-lg">
                          Miejsce na film pionowy
                        </p>
                        <p className="text-white/80 text-sm mt-2">
                          Format 9:16 (1080x1920px)
                        </p>
                      </div>
                    </div> */}

                    {/* Uncomment and configure when video is ready */}
                    
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      controls
                      loop
                      playsInline
                    >
                      <source src="/videos/aiseo.webm" type="video/webm" />
                      Twoja przeglądarka nie obsługuje odtwarzania wideo.
                    </video>
                   
                  </div>

                  {/* Decorative elements around video */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-3xl blur-2xl -z-10 opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section for SEO AI */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Eyebrow */}
            <div className="text-center mb-4">
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-primary-50 border border-primary-200 text-primary-700 rounded-full text-xs md:text-sm font-semibold">
                ✨ AI SEO
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Co Twoja firma zyska dzięki AI SEO
            </h2>
            <p className="text-lg text-gray-700 mb-10 max-w-4xl mx-auto text-center">
              🤖 AI SEO to nie tylko „pozycje” w Google. To dominacja w
              odpowiedziach generowanych przez AI — od{" "}
              <strong>AI Overviews</strong> w Google, przez{" "}
              <strong>ChatGPT</strong> i <strong>Gemini</strong>, po{" "}
              <strong>Perplexity</strong> i <strong>Bing Copilot</strong>. 📈
              Efekt? Więcej zapytań od klientów gotowych do zakupu i rosnący
              udział Twojej marki w odpowiedziach AI.
            </p>

            {/* Benefits grid - simplified */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* 1 */}
              <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover-scale">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      🚀 Pojawianie się w wynikach AI
                    </h3>
                    <p className="text-sm text-gray-600">
                      Twoja marka pojawia się w odpowiedziach AI (AI Overviews,
                      ChatGPT, Gemini), docierając do klientów.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2 */}
              <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover-scale">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      💡 Zdobywanie klientów bez kliknięć
                    </h3>
                    <p className="text-sm text-gray-600">
                      Gdy AI odpowiada za Ciebie, zdobywasz klientów, którzy nie
                      muszą już klikać w linki.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 */}
              <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover-scale">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      ⏱️ Krótszy cykl sprzedaży
                    </h3>
                    <p className="text-sm text-gray-600">
                      Dostarczając precyzyjne odpowiedzi, skracasz drogę klienta
                      od pytania do zakupu.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 */}
              <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover-scale">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      📊 Mierzalne rezultaty biznesowe
                    </h3>
                    <p className="text-sm text-gray-600">
                      Raportujemy wzrost zapytań i telefonów – metryki, które
                      mają znaczenie dla sprzedaży.
                    </p>
                  </div>
                </div>
              </div>

              {/* 5 */}
              <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover-scale">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      🛡️ Odporność na zmiany algorytmów
                    </h3>
                    <p className="text-sm text-gray-600">
                      Budujemy autorytet Twojej marki, który jest odporny na
                      przyszłe aktualizacje Google.
                    </p>
                  </div>
                </div>
              </div>

              {/* 6 */}
              <div className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover-scale">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      ⚡ Szybkie efekty i długa strategia
                    </h3>
                    <p className="text-sm text-gray-600">
                      Zapewniamy szybkie wygrane w 30-45 dni oraz tworzymy
                      długoterminową strategię AI SEO.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Section: AI SEO Explained */}
        <section id="ai-seo-explained" className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Czym jest AI SEO? To po prostu ewolucja.
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
                Wyobraź sobie, jak zmienił się sposób, w jaki szukamy
                informacji. AI SEO to kolejny, naturalny krok w tej podróży.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* KIEDYŚ: Tradycyjne SEO */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center h-full">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Kiedyś: Tradycyjne SEO
                </h3>
                <p className="text-gray-600">
                  Celem było zdobycie jak najwyższej pozycji na liście{" "}
                  <strong>10 niebieskich linków</strong>. Klient musiał sam
                  klikać i szukać odpowiedzi na Twojej stronie.
                </p>
              </div>

              {/* DZISIAJ: AI SEO */}
              <div className="bg-primary-50 border border-primary-200 rounded-2xl p-8 text-center h-full">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <Brain className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-primary-700 mb-3">
                  Dziś: AI SEO
                </h3>
                <p className="text-gray-700">
                  Celem jest stanie się{" "}
                  <strong>bezpośrednią odpowiedzią</strong>, której AI udziela
                  klientowi. Twoja firma jest prezentowana jako gotowe
                  rozwiązanie, budując zaufanie od pierwszego kontaktu.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-lg text-gray-700 bg-gray-100 p-6 rounded-xl inline-block shadow-sm">
                <strong>AI SEO to nie magia.</strong> To dostosowanie
                sprawdzonych metod SEO do świata, w którym AI jest nowym
                pośrednikiem między Tobą a klientem.
              </p>
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              Case Study: Jak MK Helicopters zwiększyło liczbę zapytań o 40%
              dzięki AI SEO
            </h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Firma MK Helicopters, lider w branży ekskluzywnego transportu
              helikopterem, walczyła z niską widocznością w Google. Wdrożyliśmy
              precyzyjną strategię AI SEO, skoncentrowaną na intencjach
              użytkowników i odpowiedziach AI.
            </p>

            <article className="grid md:grid-cols-2 gap-10 items-start">
              <figure className="relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                <div className="relative aspect-[819/662]">
                  {csImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.src}
                      alt={img.alt}
                      className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                        idx === csIndex ? "opacity-100" : "opacity-0"
                      }`}
                      loading="lazy"
                      decoding="async"
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setCsIndex(
                        (csIndex - 1 + csImages.length) % csImages.length
                      )
                    }
                    aria-label="Poprzednie zdjęcie"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 border border-gray-200 rounded-full p-2 shadow-sm hover-scale"
                  >
                    <ArrowRight className="h-5 w-5 -scale-x-100" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCsIndex((csIndex + 1) % csImages.length)}
                    aria-label="Następne zdjęcie"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 border border-gray-200 rounded-full p-2 shadow-sm hover-scale"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    {csImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCsIndex(i)}
                        aria-label={`Pokaż slajd ${i + 1}`}
                        className={`h-2.5 w-2.5 rounded-full border border-white/60 ${
                          i === csIndex ? "bg-primary-500" : "bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <figcaption className="px-4 py-3 text-sm text-gray-500">
                  Klient: MK Helicopters
                </figcaption>
              </figure>

              <div>
                <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 border border-primary-200 rounded-full px-4 py-2 mb-6">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  40% więcej zapytań ofertowych w 3 miesiące
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Nasze działania
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
                        <p className="text-gray-700">
                          Tworzenie treści Q&A: przygotowaliśmy artykuły
                          odpowiadające na konkretne pytania osób szukających
                          transportu helikopterem.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
                        <p className="text-gray-700">
                          Rozbudowa sekcji FAQ: zbudowaliśmy wyczerpującą bazę
                          wiedzy, która rozwiewa kluczowe wątpliwości klientów.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
                        <p className="text-gray-700">
                          Wdrożenie znaczników strukturalnych: dodaliśmy
                          specjalne kody, które pomagają Google lepiej zrozumieć
                          treść FAQ i wyróżnić ją w wynikach wyszukiwania.
                        </p>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Rezultaty w 3 miesiące
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                        <p className="text-gray-700">
                          Znaczący wzrost ruchu organicznego.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                        <p className="text-gray-700">
                          Widoczność w AI Overviews i odpowiedziach ChatGPT –
                          wzmocnienie autorytetu marki.
                        </p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-1 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                        <p className="text-gray-700">
                          Wzrost liczby zapytań ofertowych o{" "}
                          <strong>40%</strong>.
                        </p>
                      </li>
                    </ul>
                  </section>

                  <div className="pt-4">
                    <Link
                      id="cta-case-study-contact"
                      data-gtm="cta_case_study_contact"
                      data-gtm-location="case_study"
                      onClick={() =>
                        track({
                          event: "cta_click",
                          category: "engagement",
                          label: "case_study_contact",
                          location: "case_study",
                        })
                      }
                      to="/kontakt"
                      className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600"
                    >
                      Chcę podobne wyniki
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Structured Data for Case Study */}
            <Helmet>
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "CaseStudy",
                  headline:
                    "Jak MK Helicopters zwiększyło liczbę zapytań o 40% dzięki AI SEO",
                  description:
                    "Strategia Q&A, rozbudowana sekcja FAQ i wdrożenie danych strukturalnych FAQPage przyniosły 40% wzrost zapytań w 3 miesiące.",
                  image: "https://webdkw.net/images/clients/mkhelicopters.webp",
                  author: { "@type": "Organization", name: "WebDKW" },
                  publisher: {
                    "@type": "Organization",
                    name: "WebDKW",
                    logo: {
                      "@type": "ImageObject",
                      url: "https://webdkw.net/images/webdkw-logo.svg",
                    },
                  },
                  about: "MK Helicopters",
                  mainEntityOfPage:
                    "https://webdkw.net/uslugi/pozycjonowanie-ai",
                  keywords: [
                    "case study SEO",
                    "AI SEO",
                    "pozycjonowanie AI",
                    "MK Helicopters",
                    "FAQPage",
                    "Q&A content",
                  ],
                  inLanguage: "pl-PL",
                })}
              </script>
            </Helmet>
          </div>
        </section>

        {/* Methodology Section - Reworked */}
        <section id="process-ai-growth" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Jak wprowadzamy Twoją firmę do świata AI?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">
                Nasz proces jest prosty i przejrzysty. W 4 krokach sprawiamy, że
                Twoja firma staje się odpowiedzią na pytania klientów.
              </p>
            </div>

            <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Dashed line for desktop */}
              <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px">
                <svg
                  width="100%"
                  height="100%"
                  className="absolute inset-0"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="50%"
                    x2="100%"
                    y2="50%"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                </svg>
              </div>

              {/* Step 1 */}
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold border-4 border-gray-50">
                  1
                </div>
                <div className="pt-8">
                  <Search className="h-10 w-10 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Analiza i Potencjał
                  </h3>
                  <p className="text-gray-600">
                    Sprawdzamy, o co pytają Twoi klienci i gdzie tkwi największy
                    potencjał, by AI polecało właśnie Ciebie.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold border-4 border-gray-50">
                  2
                </div>
                <div className="pt-8">
                  <Target className="h-10 w-10 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Plan Działania
                  </h3>
                  <p className="text-gray-600">
                    Tworzymy jasny plan – wiemy, jakie treści przygotować, by
                    Twoja firma stała się odpowiedzią na kluczowe pytania.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold border-4 border-gray-50">
                  3
                </div>
                <div className="pt-8">
                  <Zap className="h-10 w-10 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Wdrożenie i Tworzenie
                  </h3>
                  <p className="text-gray-600">
                    Zajmujemy się wszystkim: od poprawek na stronie, po
                    tworzenie wartościowych treści, które pokocha AI.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold border-4 border-gray-50">
                  4
                </div>
                <div className="pt-8">
                  <BarChart3 className="h-10 w-10 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Wyniki i Optymalizacja
                  </h3>
                  <p className="text-gray-600">
                    Monitorujemy Twoją widoczność w AI i raportujemy konkretne
                    wyniki – wzrost zapytań i telefonów.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        {/* <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
              Nie wierz nam na słowo. Zobacz, co mówią liczby i nasi klienci.
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Po 3 miesiącach współpracy nasze wzrost udziału w odpowiedziach AI o 45%. 
                  Teraz gdy klienci pytają Google o prawnika w Katowicach, AI poleca naszą kancelarię."
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">Jan Kowalski</div>
                  <div className="text-sm text-gray-500">Kancelaria Prawna Kowalski</div>
                  <div className="text-primary-600 font-bold mt-2">Wzrost Answer Share™: +45%</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Nasza klinika jest teraz pierwszym wyborem AI dla pacjentów szukających 
                  dentysty. Wzrost nowych pacjentów o 60% w 4 miesiące."
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">Dr Anna Nowak</div>
                  <div className="text-sm text-gray-500">Klinika Stomatologiczna Dent+</div>
                  <div className="text-primary-600 font-bold mt-2">Wzrost pacjentów: +60%</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Dzięki strategii AEO jesteśmy głównym źródłem informacji o naszej branży. 
                  AI cytuje nas w 40% odpowiedzi dla naszych kluczowych fraz."
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">Marcin Wiśniewski</div>
                  <div className="text-sm text-gray-500">TechSolutions B2B</div>
                  <div className="text-primary-600 font-bold mt-2">Answer Share™: 40%</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-8">Zaufali nam również:</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                  Logo Klienta 1
                </div>
                <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                  Logo Klienta 2
                </div>
                <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                  Logo Klienta 3
                </div>
                <div className="h-12 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                  Logo Klienta 4
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Featured Blog Articles Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Pogłęb swoją wiedzę o pozycjonowaniu AI
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Odkryj nasze najlepsze artykuły o pozycjonowaniu pod AI i
                przygotuj swoją firmę na przyszłość wyszukiwania
              </p>
            </div>

            {featuredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    id={`blog-card-${post.slug}`}
                    data-gtm="blog_card"
                    data-gtm-location="featured_articles"
                    onClick={() =>
                      track({
                        event: "blog_card_click",
                        category: "engagement",
                        label: post.slug,
                        location: "featured_articles",
                      })
                    }
                    to={`/blog/${post.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                      <div className="relative">
                        <img
                          src={
                            post.image_url ||
                            "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"
                          }
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          {post.tags && post.tags.length > 0 && (
                            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {post.tags[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{getReadingTime(post.content)}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center space-x-2 text-primary-500 group-hover:text-primary-600 font-semibold transition-colors">
                          <span>Czytaj dalej</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="max-w-2xl mx-auto px-4">
                  <div className="text-6xl mb-6">📖</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Artykuły wkrótce dostępne
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Pracujemy nad wartościowymi artykułami o pozycjonowaniu AI,
                    które pomogą Ci zrozumieć przyszłość pozycjonowania.
                  </p>
                  <Link
                    id="cta-blog-list"
                    data-gtm="cta_blog_list"
                    data-gtm-location="featured_articles"
                    onClick={() =>
                      track({
                        event: "cta_click",
                        category: "engagement",
                        label: "blog_list",
                        location: "featured_articles",
                      })
                    }
                    to="/blog"
                    className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                  >
                    Przejdź do bloga
                  </Link>
                </div>
              </div>
            )}

            {featuredPosts.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  to="/blog"
                  className="inline-flex items-center px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 gap-2"
                >
                  <span>Zobacz wszystkie artykuły</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            )}

            {/* Blog Articles Schema */}
            {featuredPosts.length > 0 && (
              <Helmet>
                <script type="application/ld+json">
                  {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "itemListElement": featuredPosts.map((post, index) => ({
                      "@type": "ListItem",
                      "position": index + 1,
                      "item": {
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "description": post.excerpt,
                        "image": post.image_url || "https://webdkw.net/images/webdkw-open-graph.png",
                        "datePublished": post.created_at,
                        "dateModified": post.updated_at || post.created_at,
                        "author": {
                          "@type": "Organization",
                          "name": "WebDKW"
                        },
                        "publisher": {
                          "@type": "Organization",
                          "name": "WebDKW",
                          "logo": {
                            "@type": "ImageObject",
                            "url": "https://webdkw.net/images/webdkw-logo.svg"
                          }
                        },
                        "mainEntityOfPage": {
                          "@type": "WebPage",
                          "@id": `https://webdkw.net/blog/${post.slug}`
                        },
                        "url": `https://webdkw.net/blog/${post.slug}`,
                        "keywords": post.tags?.join(", ") || "AI SEO, pozycjonowanie AI"
                      }
                    }))
                  })}
                </script>
              </Helmet>
            )}
          </div>
        </section>

        {/* Packages Section */}
        <section id="pakiety-ai-seo" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
              Wybierz swój pakiet AI SEO
            </h2>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* GEO Launchpad Package */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary-500 transition-all duration-300 hover:shadow-lg">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Search className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Lokalny Lider
                  </h3>
                  <h4 className="text-xl text-primary-600 font-semibold mb-4">
                    Zdominuj lokalny rynek
                  </h4>
                  <p className="text-gray-600">
                    Idealny dla firm usługowych takich jak prawnicy, lekarze czy
                    restauratorzy, które chcą być pierwszym wyborem AI dla
                    klientów w swoim mieście.
                  </p>
                </div>

                <div className="bg-primary-50 p-6 rounded-xl mb-8">
                  <h5 className="font-bold text-gray-900 mb-2">
                    Główna obietnica:
                  </h5>
                  <p className="text-gray-700">
                    Sprawimy, że AI będzie polecać Twoją firmę lokalnym klientom
                    gotowym do zakupu.
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>
                        Mistrzowska optymalizacja Google Business Profile
                      </strong>{" "}
                      - pełna konfiguracja i optymalizacja wizytówki
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>10-15 "Knowledge Assets" miesięcznie</strong> -
                      tworzenie i optymalizacja treści odpowiadających na
                      kluczowe pytania klientów
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Wdrożenie znaczników strukturalnych</strong> -
                      specjalne kody dla wizytówki firmy, FAQ i opinii klientów
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Strategia zarządzania reputacją</strong> - aktywne
                      monitorowanie i pozyskiwanie opinii
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Dashboard z wynikami</strong> - widzisz swój
                      procentowy udział w odpowiedziach AI
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Monitoring pozycji w Local Pack</strong> na mapach
                      Google
                    </span>
                  </li>
                </ul>

                <button
                  onClick={scrollToContact}
                  className="w-full bg-primary-500 text-white py-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 mt-8"
                >
                  Chcę zdominować rynek lokalny
                </button>
              </div>

              {/* AEO Dominator Package */}
              <div className="bg-gradient-to-b from-primary-50 to-white border-2 border-primary-300 rounded-2xl p-8 relative overflow-hidden flex flex-col">
                <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  NAJPOPULARNIEJSZY
                </div>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Lider Branży
                  </h3>
                  <h4 className="text-xl text-primary-600 font-semibold mb-4">
                    Zostań krajowym liderem myśli
                  </h4>
                  <p className="text-gray-600">
                    Stworzony dla e-commerce, firm B2B i SaaS, które chcą
                    osiągnąć status głównego źródła odpowiedzi dla AI w całej
                    Polsce.
                  </p>
                </div>

                <div className="bg-primary-100 p-6 rounded-xl mb-8">
                  <h5 className="font-bold text-gray-900 mb-2">
                    Główna obietnica:
                  </h5>
                  <p className="text-gray-700">
                    Osiągnij status autorytetu, którego AI cytuje jako pierwsze
                    i najważniejsze źródło w Twojej branży.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">
                      Nasze doświadczenie:
                    </span>
                  </div>
                  <p className="text-blue-800 text-sm">
                    Klienci osiągają średnio 20-35% udziału w odpowiedziach AI
                    dla kluczowych zapytań w ciągu 6 miesięcy współpracy.
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Wszystko z pakietu Lokalny Lider</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>
                        Zaawansowany content marketing oparty na AI
                      </strong>{" "}
                      - projektowanie i wdrażanie strategii pillar page i
                      klastrów tematycznych
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Strategiczne budowanie autorytetu E-E-A-T</strong>{" "}
                      - wykraczające poza stronę
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Optymalizacja pod wyszukiwanie komercyjne</strong>{" "}
                      - frazy prowadzące do sprzedaży
                    </span>
                  </li>
                </ul>

                <div className="mt-auto">
                  <button
                    onClick={scrollToContact}
                    className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-300 mt-8"
                  >
                    Chcę zostać liderem branży
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Schema for Packages */}
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "position": 1,
                    "name": "Lokalny Lider - AI SEO",
                    "description": "Idealny dla firm usługowych takich jak prawnicy, lekarze czy restauratorzy, które chcą być pierwszym wyborem AI dla klientów w swoim mieście.",
                    "price": "1500",
                    "priceCurrency": "PLN",
                    "availability": "https://schema.org/InStock",
                    "url": "https://webdkw.net/uslugi/pozycjonowanie-ai#pakiety-ai-seo",
                    "seller": {
                      "@type": "Organization",
                      "name": "WebDKW"
                    },
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Lokalny Lider - AI SEO",
                      "serviceType": "Local AI SEO Optimization"
                    }
                  },
                  {
                    "@type": "Offer",
                    "position": 2,
                    "name": "Lider Branży - AI SEO",
                    "description": "Stworzony dla e-commerce, firm B2B i SaaS, które chcą osiągnąć status głównego źródła odpowiedzi dla AI w całej Polsce.",
                    "price": "3000",
                    "priceCurrency": "PLN",
                    "availability": "https://schema.org/InStock",
                    "url": "https://webdkw.net/uslugi/pozycjonowanie-ai#pakiety-ai-seo",
                    "seller": {
                      "@type": "Organization",
                      "name": "WebDKW"
                    },
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Lider Branży - AI SEO",
                      "serviceType": "National AI SEO Optimization"
                    }
                  }
                ]
              })}
            </script>
          </Helmet>
        </section>

        <div id="faq-ai-seo">
          <AEOFAQSection />
        </div>

        <div data-contact-section>
          <SEOContactForm />
        </div>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Gotowy na dominację w erze AI?
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Nie czekaj, aż konkurencja Cię wyprzedzi. Rewolucja AI już trwa, a
              my jesteśmy jedyną agencją w Polsce, która wie, jak ją wykorzystać
              dla Twojego zysku.
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="flex justify-center mb-6">
                <button
                  id="cta-final-audit"
                  data-gtm="cta_final_audit"
                  data-gtm-location="final_cta"
                  onClick={() => {
                    track({
                      event: "cta_click",
                      category: "engagement",
                      label: "audyt_potencjalu",
                      location: "final_cta",
                    });
                    handleAuditClick();
                  }}
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Target className="h-5 w-5" />
                  Darmowy Audyt SEO AI
                </button>
              </div>
              <div className="text-center">
                <a
                  id="cta-final-phone"
                  data-gtm="cta_final_phone"
                  data-gtm-location="final_cta"
                  href="tel:+48881046689"
                  className="text-white/90 hover:text-white transition-colors underline"
                  onClick={() =>
                    track({
                      event: "contact_click",
                      category: "engagement",
                      method: "phone",
                      location: "final_cta",
                    })
                  }
                >
                  Lub zadzwoń: +48 881 046 689
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Exit Intent Popup */}
        {showExitPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center animate-scale-in">
              <button
                onClick={() => setShowExitPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Czekaj! Nie odchodź jeszcze
              </h3>
              <p className="text-gray-600 mb-6">
                Pobierz BEZPŁATNY przewodnik "5 sposobów na przygotowanie firmy
                na erę AI"
              </p>
              <button
                id="cta-exit-download"
                data-gtm="cta_exit_download"
                data-gtm-location="exit_intent"
                onClick={() => {
                  track({
                    event: "lead_magnet_download",
                    category: "engagement",
                    label: "exit_intent_guide",
                    location: "exit_intent",
                  });
                  handleDownloadGuide();
                }}
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors mb-4 flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Pobierz przewodnik za darmo
              </button>
              <button
                id="cta-exit-dismiss"
                data-gtm="cta_exit_dismiss"
                data-gtm-location="exit_intent"
                onClick={() => {
                  track({
                    event: "exit_intent_dismiss",
                    category: "engagement",
                    location: "exit_intent",
                  });
                  setShowExitPopup(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Nie, dziękuję
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default AEOManifestoPage;
