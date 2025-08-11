import React from "react";
import { Brain, MapPin, Search, ListChecks, BarChart3, ExternalLink, Sparkles, Rocket } from "lucide-react";
import { track } from "../lib/analytics";

const differences = [
  {
    icon: MapPin,
    title: "Zasięg i kontekst",
    desc: "GEO – lokalne odpowiedzi AI (miasto/region). AEO – zapytania ogólnopolskie i tematyczne.",
  },
  {
    icon: Search,
    title: "Cel optymalizacji",
    desc: "SEO – pozycje w SERP. AEO/GEO – udział w odpowiedziach AI (Answer Share).",
  },
  {
    icon: Brain,
    title: "Sygnały rankingowe",
    desc: "SEO – technikalia, content, linki. AEO/GEO – intencja, encje, dane strukturalne, E‑E‑A‑T.",
  },
  {
    icon: ListChecks,
    title: "Format treści",
    desc: "SEO – artykuły i landing pages. AEO/GEO – treści Q&A, poradniki, cytowalne źródła dla AI.",
  },
  {
    icon: BarChart3,
    title: "Pomiar efektów",
    desc: "SEO – pozycje i ruch. AEO/GEO – widoczność w AI Overviews i Answer Share.",
  },
];

const AEOVsSEOSection: React.FC = () => {
  return (
    <section id="aeo-vs-seo" aria-labelledby="aeo-vs-seo-title" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-primary-50 border border-primary-200 text-primary-700 rounded-full text-xs md:text-sm font-semibold">
            <Sparkles className="h-4 w-4 mr-2" /> Nowość: AEO/GEO w praktyce
          </span>
        </div>

        {/* Heading */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 id="aeo-vs-seo-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AEO/GEO a SEO – to samo, tylko dalej
          </h2>
          <p className="text-lg text-gray-600">
            SEO to fundament. AEO (Answer Engine Optimization) i GEO <strong className="text-gray-800">rozszerzają SEO</strong>
            {" "}o sygnały, które sprawiają, że <strong className="text-gray-800">AI poleca Twoją firmę</strong> w odpowiedziach.
            Nie walczysz tylko o pozycję – walczysz o bycie rekomendowanym.
          </p>
        </div>

        {/* Content */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {differences.map((item, idx) => (
            <div
              key={idx}
              className="group bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sales CTA below cards */}
        <div className="mt-10">
          <div className="bg-gradient-to-r from-primary-500/10 to-orange-500/10 border border-orange-200 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <Rocket className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">To nie alternatywa dla SEO – to jego turbo‑doładowanie</h3>
            <p className="text-gray-700 max-w-3xl mx-auto mb-5">
              Zadbamy o fundamenty SEO, a następnie dołożymy warstwę AEO/GEO, aby zwiększyć Twój <strong className="text-gray-900">udział w odpowiedziach AI</strong>
              i szybciej doprowadzać realnych klientów – zanim klikną w wyniki.
            </p>
            <a
              id="cta-aeo-guide"
              data-gtm="cta_aeo_guide"
              data-gtm-location="aeo_vs_seo_section"
              href="https://webdkw.net/blog/seo-ai-jak-zoptymalizowac-strone-pod-aeo-i-zamienic-odpowiedzi-ai-w-realnych-klientow"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track({ event: 'blog_cta_click', category: 'engagement', label: 'seo_ai_przewodnik', location: 'aeo_vs_seo_section' })}
              className="inline-flex items-center font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-4"
            >
              Przeczytaj przewodnik SEO + AI
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AEOVsSEOSection;

