import { Search, TrendingUp, Target, BarChart3, ArrowRight } from 'lucide-react'

const SEOSection = () => {
  const seoFeatures = [
    {
      icon: <Search className="h-8 w-8 text-orange-500" />,
      title: "Analiza słów kluczowych",
      description: "Identyfikujemy najcenniejsze frazy dla Twojej branży i lokalnej konkurencji"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      title: "Optymalizacja techniczna",
      description: "Szybkość ładowania, struktura URL, schema markup i wszystkie techniczne aspekty SEO"
    },
    {
      icon: <Target className="h-8 w-8 text-orange-500" />,
      title: "Content marketing",
      description: "Strategia treści, która buduje autorytet i przyciąga idealnych klientów"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-500" />,
      title: "Monitoring i raporty",
      description: "Miesięczne raporty z pozycji, ruchu i konwersji z jasno określonym ROI"
    }
  ]

  const scrollToContact = () => {
    const element = document.getElementById('kontakt')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Pozycjonowanie stron w Google -
            <span className="text-orange-400"> Zdominujmy razem wyniki wyszukiwania.</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Najlepsza strona nic nie znaczy, jeśli nikt jej nie znajdzie. 
            SEO to inwestycja, która zwraca się przez lata.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {seoFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
          💪 Rezultat: Twoja strona + Profesjonalne SEO = Dominacja w Google
          </h3>
          <p className="text-xl mb-8 opacity-90">
          Pakiet: Strona internetowa + SEO to najlepsza inwestycja w długoterminowy sukces online
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">Strona + SEO</div>
              <div className="text-sm opacity-80">Pakiet startowy</div>
            </div>
            <ArrowRight className="h-8 w-8 transform rotate-90 sm:rotate-0" />
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">Pozycja #1-3</div>
              <div className="text-sm opacity-80">W 6-12 miesięcy</div>
            </div>
            <ArrowRight className="h-8 w-8 transform rotate-90 sm:rotate-0" />
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold">ROI 300%+</div>
              <div className="text-sm opacity-80">Zwrot z inwestycji</div>
            </div>
          </div>

          <button
            onClick={scrollToContact}
            className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Bezpłatny audyt SEO Twojej strony
          </button>
        </div>
      </div>
    </section>
  )
}

export default SEOSection