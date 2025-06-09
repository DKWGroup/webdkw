import React from 'react'
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

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ProblemSection />
      <ProcessSection />
      <ServicesSection />
      <PortfolioSection />
      <ResultsSection />
      <SEOSection />
      <AboutSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default HomePage