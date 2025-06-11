import React from 'react'
import { ArrowRight, Star } from 'lucide-react'

const HeroSection = () => {
  const scrollToContact = () => {
    const element = document.getElementById('kontakt')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust indicators */}
          {/* <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600 text-sm">5.0 • 50+ zadowolonych klientów</span>
          </div> */}

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Profesjonalne strony internetowe dla firm -{' '}
          Twój <span className="text-orange-500">najlepszy sprzedawca</span> 24/7.
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Tworzenie stron www i sklepów internetowych z gwarancją rezultatów. Zoptymalizowane pod SEO, Google Ads i realne cele biznesowe Twojej firmy.
          </p>

          <div className="flex flex-col gap-4 justify-center items-center mb-12">
            <button
              onClick={scrollToContact}
              className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Bezpłatna konsultacja + wycena w 24h</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="text-sm text-gray-500">
              ⏱️ 30 minut • 🎯 Bez zobowiązań
            </div>
          </div>

          {/* Social proof logos */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-500 text-sm mb-4">Zaufali mi:</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <img src="/images/clients/akademia-lutowania.webp" alt="LAkademia Lutowania" className="h-16 w-auto" />
              <img src="/images/clients/contenty.webp" alt="Contenty" className="h-16 w-auto" />
              <img src="/images/clients/gk.webp" alt="Grzegorz Kusz" className="h-16 w-auto" />
              <img src="/images/clients/glowup.webp" alt="GlowUP" className="h-16 w-auto" />
              <img src="/images/clients/inp.svg" alt="Investment Partners" className="h-16 w-auto" />
              <img src="/images/clients/mkhelicopters.webp" alt="MKHelicopters" className="h-16 w-auto" />
              <img src="/images/clients/welldone.webp" alt="WellDone" className="h-16 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection