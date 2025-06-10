import React from 'react'
import { Check, ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const ServicesSection = () => {
  const packages = [
    {
      name: "Professional WordPress",
      price: "od 6 000 PLN netto",
      description: "Idealne dla małych i średnich firm, które potrzebują profesjonalnej obecności online",
      features: [
        "Responsywny design dostosowany do marki",
        "Optymalizacja SEO na stronie",
        "Integracja z Google Analytics",
        "Formularz kontaktowy z powiadomieniami",
        "Panel administracyjny WordPress",
        "3 miesiące wsparcia technicznego",
        "Szkolenie z obsługi systemu",
        "Certyfikat SSL i podstawowe zabezpieczenia"
      ],
      popular: false,
      additionalInfo: "Czas realizacji: 4-6 tygodni"
    },
    {
      name: "Custom Performance",
      price: "od 15 000 PLN netto",
      description: "Dedykowane rozwiązanie dla firm, które stawiają na maksymalną wydajność i unikalne funkcjonalności",
      features: [
        "Wszystko z pakietu Professional",
        "Dedykowany kod napisany od podstaw",
        "Zaawansowane optymalizacje wydajności",
        "Integracje z systemami zewnętrznymi",
        "Zaawansowana analityka i tracking",
        "A/B testy i optymalizacja konwersji",
        "6 miesięcy wsparcia technicznego",
        "Miesięczne raporty i optymalizacje",
        "Backup i monitoring 24/7"
      ],
      popular: true,
      additionalInfo: "Czas realizacji: 6-10 tygodni"
    }
  ]

  return (
    <section id="uslugi" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Wybierz fundament dla Twojego biznesu online
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Dwa sprawdzone pakiety dostosowane do różnych potrzeb i budżetów. 
            Każda wycena jest indywidualna po przeprowadzeniu bezpłatnej konsultacji.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 font-semibold">
              💰 Wszystkie ceny są orientacyjne i ustalane indywidualnie po analizie projektu
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ${
                pkg.popular ? 'ring-2 ring-orange-500 transform lg:scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>NAJPOPULARNIEJSZY</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-orange-500 mb-4">{pkg.price}</div>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-6">{pkg.additionalInfo}</p>
                  <Link
                    to="/kontakt"
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      pkg.popular
                        ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <span>Umów konsultację</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-3xl mx-auto mb-8">
            <p className="text-yellow-800 font-semibold">
              🎯 <strong>Pamiętaj:</strong> Najtańsza opcja to często najdroższa inwestycja. 
              Inwestycja w jakość zwraca się wielokrotnie w postaci lepszych wyników biznesowych.
            </p>
          </div>
          
          <Link
            to="/uslugi"
            className="inline-flex items-center space-x-2 bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Zobacz wszystkie usługi</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection