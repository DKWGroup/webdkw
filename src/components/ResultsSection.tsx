import { TrendingUp, Users, DollarSign, Target, ArrowRight } from 'lucide-react'

const ResultsSection = () => {
  const results = [
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      metric: "+340%",
      description: "Średni wzrost konwersji",
      detail: "po wdrożeniu naszych rozwiązań"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      metric: "85+",
      description: "Zapytań miesięcznie",
      detail: "generowanych przez nasze strony"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-orange-500" />,
      metric: "450%",
      description: "ROI w 6 miesięcy",
      detail: "zwrot z inwestycji w stronę"
    },
    {
      icon: <Target className="h-8 w-8 text-orange-500" />,
      metric: "95%",
      description: "Klientów zadowolonych",
      detail: "poleca nas dalej"
    }
  ]

  const caseExamples = [
    {
      company: "MK Helicopterss",
      industry: "Lotnictwo helikopterowe",
      result: "370% wzrostu kliknięć w stronę",
      description: "Przeprojektowanie strony i optymalizacja ścieżki konwersji"
    },
    {
      company: "Paweł Węglarz",
      industry: "Trener personalny", 
      result: "145% wzrostu sprzedaży",
      description: "Kompleksowa strategia kampanii reklamowych"
    },
    {
      company: "Vis Naturae",
      industry: "Masaż i Refleksologia",
      result: "50 pozyskiwanych klientów miesięcznie",
      description: "Tworzenie strony i dostosowanie pod konwersję"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nasze strony generują 
            <span className="text-orange-500"> mierzalne rezultaty</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nie tworzymy tylko ładnych stron - budujemy narzędzia sprzedażowe, 
            które rzeczywiście zwiększają Twoje przychody.
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100"
            >
              <div className="flex justify-center mb-4">
                {result.icon}
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {result.metric}
              </div>
              <div className="text-lg font-semibold text-gray-700 mb-1">
                {result.description}
              </div>
              <div className="text-sm text-gray-500">
                {result.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Case examples */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Przykłady sukcesów naszych klientów
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {caseExamples.map((example, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl hover:bg-orange-50 transition-all duration-300"
              >
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {example.company}
                  </h4>
                  <p className="text-orange-500 font-semibold text-sm">
                    {example.industry}
                  </p>
                </div>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {example.result}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {example.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-green-800 font-semibold text-lg">
                🎯 Twoja firma może być następna w tej galerii sukcesów
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              const element = document.getElementById('kontakt')
              if (element) element.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Porozmawiajmy o Twoich celach</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default ResultsSection