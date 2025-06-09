import React from 'react'
import { AlertTriangle, TrendingDown, DollarSign, Clock } from 'lucide-react'

const ProblemSection = () => {
  const problems = [
    {
      icon: <TrendingDown className="h-8 w-8 text-red-500" />,
      title: "Twoja obecna strona nie generuje zapytań?",
      description: "Masz ruch, ale brak konwersji. Odwiedzający szybko opuszczają stronę bez kontaktu."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-red-500" />,
      title: "Obawiasz się przepalić budżet na reklamy?",
      description: "Nie masz pewności, czy Twoja strona jest przygotowana na płatny ruch reklamowy."
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
      title: "Nie ufasz tanich ofert z rynku?",
      description: "Doświadczyłeś już niskiej jakości usług lub obawiasz się ukrytych kosztów."
    },
    {
      icon: <Clock className="h-8 w-8 text-red-500" />,
      title: "Czas ucieka, a konkurencja wyprzedza?",
      description: "Każdy dzień zwłoki to stracone okazje biznesowe i przewaga konkurencji."
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Brzmi znajomo?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Te problemy dotykają 90% firm, które próbują konkurować online. 
            Ale nie musi tak być.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-500"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {problem.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-orange-100 border border-orange-200 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-orange-800 font-semibold">
              💡 Dobra wiadomość: każdy z tych problemów ma sprawdzone rozwiązanie.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProblemSection