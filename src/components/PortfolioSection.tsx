import React from 'react'
import { ExternalLink, TrendingUp, Users, DollarSign, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const PortfolioSection = () => {
  const caseStudies = [
    {
      company: "TechStart Solutions",
      industry: "Technologie B2B",
      challenge: "Brak zapytań ofertowych mimo wysokiego ruchu na stronie",
      solution: "Przeprojektowanie ścieżki konwersji i optymalizacja formularzy kontaktowych",
      results: [
        { metric: "Wzrost konwersji", value: "+340%", icon: <TrendingUp className="h-5 w-5" /> },
        { metric: "Zapytania miesięcznie", value: "85+", icon: <Users className="h-5 w-5" /> },
        { metric: "ROI w 6 miesięcy", value: "450%", icon: <DollarSign className="h-5 w-5" /> }
      ],
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",
      url: "#"
    },
    {
      company: "EcoGreen Consulting",
      industry: "Doradztwo ekologiczne",
      challenge: "Niska pozycja w Google i brak organicznego ruchu",
      solution: "Kompleksowa optymalizacja SEO i content marketing strategy",
      results: [
        { metric: "Wzrost ruchu SEO", value: "+280%", icon: <TrendingUp className="h-5 w-5" /> },
        { metric: "Pozycje TOP 3", value: "47", icon: <Users className="h-5 w-5" /> },
        { metric: "Nowi klienci", value: "+120%", icon: <DollarSign className="h-5 w-5" /> }
      ],
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
      url: "#"
    },
    {
      company: "LuxuryHome Design",
      industry: "Projektowanie wnętrz",
      challenge: "Trudność w prezentacji portfolio i zdobywaniu premium klientów",
      solution: "Luksusowy design z interaktywnym portfolio i systemem bookingu",
      results: [
        { metric: "Średnia wartość projektu", value: "+85%", icon: <DollarSign className="h-5 w-5" /> },
        { metric: "Bookings online", value: "95%", icon: <Users className="h-5 w-5" /> },
        { metric: "Czas na stronie", value: "+220%", icon: <TrendingUp className="h-5 w-5" /> }
      ],
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
      url: "#"
    }
  ]

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Portfolio - strony internetowe, które generują konkretne wyniki
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Liczby nie kłamią. Zobacz jak nasze rozwiązania przekładają się na 
            konkretne korzyści biznesowe naszych klientów.
          </p>
        </div>

        <div className="space-y-16">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className="flex-1">
                <div className="relative group">
                  <img
                    src={study.image}
                    alt={study.company}
                    className="w-full h-80 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                    <a
                      href={study.url}
                      className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                    >
                      <span>Zobacz projekt</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="bg-gray-50 p-8 rounded-2xl">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{study.company}</h3>
                    <p className="text-orange-500 font-semibold">{study.industry}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">🎯 Wyzwanie:</h4>
                      <p className="text-gray-600">{study.challenge}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">💡 Rozwiązanie:</h4>
                      <p className="text-gray-600">{study.solution}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">📈 Rezultaty:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {study.results.map((result, idx) => (
                          <div key={idx} className="text-center p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex justify-center mb-2 text-orange-500">
                              {result.icon}
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              {result.value}
                            </div>
                            <div className="text-sm text-gray-600">
                              {result.metric}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
            <p className="text-green-800 font-semibold text-lg">
            🚀 Twój projekt może być następny w tej galerii sukcesów
            </p>
          </div>
          
          <Link
            to="/portfolio"
            className="inline-flex items-center space-x-2 bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Zobacz wszystkie realizacje i case studies</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PortfolioSection