import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import ProblemSection from '../components/ProblemSection'
import ProcessSection from '../components/ProcessSection'
import ServicesSection from '../components/ServicesSection'
import PortfolioSection from '../components/PortfolioSection'
import ResultsSection from '../components/ResultsSection'
import SEOSection from '../components/SEOSection'
import AboutSection from '../components/AboutSection'
import TestimonialsSection from '../components/TestimonialsSection'
import FAQSection from '../components/FAQSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import StructuredData from '../components/StructuredData'

const HomePage = () => {
  const breadcrumbData = [
    { name: "Strona główna", url: "https://webdkw.pl" }
  ]

  const faqData = [
    {
      question: "Dlaczego nie warto wybierać najtańszych ofert z rynku?",
      answer: "Najtańsza opcja to często najdroższa inwestycja. Strony tworzone 'na szybko' za 2000 PLN wymagają przebudowy już po kilku miesiącach. Brak strategii, słaba optymalizacja i problemy techniczne generują dodatkowe koszty."
    },
    {
      question: "Jak długo trwa realizacja projektu?",
      answer: "Czas zależy od zakresu projektu i szybkości przekazywania materiałów przez klienta. Każdy projekt rozpoczynam od szczegółowej analizy i harmonogramu, który otrzymujesz przed rozpoczęciem prac."
    },
    {
      question: "Co wliczone jest w cenę pakietu?",
      answer: "Cena obejmuje kompletny projekt od A do Z: analizę strategiczną, projektowanie UX/UI, programowanie, optymalizację SEO, testy, wdrożenie oraz wsparcie techniczne."
    }
  ]

  return (
    <HelmetProvider>
      <div className="min-h-screen">
        <SEOHead 
          title="WebDKW - Profesjonalne strony internetowe dla firm"
          description="Tworzenie stron internetowych i sklepów online z gwarancją rezultatów. Zoptymalizowane pod SEO, Google Ads i realne cele biznesowe Twojej firmy."
          keywords="strony internetowe, tworzenie stron www, sklepy internetowe, pozycjonowanie SEO, Google Ads, marketing internetowy, Warszawa"
          url="https://webdkw.pl"
        />
        <StructuredData type="website" data={{}} />
        <StructuredData type="breadcrumb" data={breadcrumbData} />
        <StructuredData type="faq" data={faqData} />
        
        <Header />
        <HeroSection />
        <ProblemSection />
        <ProcessSection />
        <ServicesSection />
        <PortfolioSection />
        <ResultsSection />
        <SEOSection />
        <AboutSection />
        {/* <TestimonialsSection /> */}
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </HelmetProvider>
  )
}

export default HomePage