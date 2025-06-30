import { AlertTriangle, TrendingDown, DollarSign, Clock } from 'lucide-react'

const ProblemSection = () => {
  const problems = [
    {
      icon: <TrendingDown className="h-8 w-8 text-red-500" />,
      title: "Twoja strona nie generuje zapytań ofertowych?",
      description: "Masz ruch na stronie, ale zero kontaktów. Potencjalni klienci uciekają do konkurencji, która lepiej prezentuje swoją ofertę."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-red-500" />,
      title: "Boisz się spalić budżet na reklamach Google Ads?",
      description: "Nie masz pewności, czy Twoja strona jest przygotowana na płatny ruch reklamowy i czy inwestycja się zwróci."
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
      title: 'Masz dość tanich "profesjonalnych" stron za 500 zł?',
      description: "Doświadczyłeś już niskiej jakości usług, ukrytych kosztów i stron, które wyglądają jak z 2010 roku."
    },
    {
      icon: <Clock className="h-8 w-8 text-red-500" />,
      title: "Konkurencja wyprzedza Cię w Google?",
      description: "Każdy dzień zwłoki to stracone zapytania, które trafiają do Twoich konkurentów z lepiej zoptymalizowanymi stronami."
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Czy Twoja strona internetowa zarabia dla Ciebie pieniądze?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Te problemy dotykają 90% małych i średnich firm w Polsce. Sprawdź, czy to również Twój case:
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