import React, { useState, useEffect } from 'react'
import { ArrowRight, Star } from 'lucide-react'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const clients = [
    { name: "Akademia Lutowania", logo: "/images/clients/akademia-lutowania.webp" },
    { name: "Contenty", logo: "/images/clients/contenty.webp" },
    { name: "Grzegorz Kusz", logo: "/images/clients/gk.webp" },
    { name: "GlowUP", logo: "/images/clients/glowup.webp" },
    { name: "Investment Partners", logo: "/images/clients/inp.svg" },
    { name: "MKHelicopters", logo: "/images/clients/mkhelicopters.webp" },
    { name: "WellDone", logo: "/images/clients/welldone.webp" }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(clients.length / 4))
    }, 3000)
    return () => clearInterval(timer)
  }, [clients.length])

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

          {/* Client carousel */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-500 text-sm mb-6">Zaufali mi:</p>
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(clients.length / 4) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
                      {clients.slice(slideIndex * 4, (slideIndex + 1) * 4).map((client, index) => (
                        <div 
                          key={index}
                          className="group transition-all duration-300 hover:scale-110"
                        >
                          <img 
                            src={client.logo} 
                            alt={client.name} 
                            className="h-16 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Carousel indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {Array.from({ length: Math.ceil(clients.length / 4) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection