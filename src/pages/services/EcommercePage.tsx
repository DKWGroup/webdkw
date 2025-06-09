import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, ShoppingCart, CreditCard, Package, BarChart3, Shield, Truck } from 'lucide-react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const EcommercePage = () => {
  const packages = [
    {
      name: "Sklep Podstawowy",
      price: "8 000 - 15 000 PLN",
      description: "Idealny dla małych sklepów z podstawowym asortymentem",
      features: [
        "Do 100 produktów",
        "WooCommerce lub Shopify",
        "Podstawowe płatności online",
        "Zarządzanie zamówieniami",
        "Responsywny design",
        "Podstawowe SEO",
        "Integracja z kurierami",
        "3 miesiące wsparcia"
      ],
      timeframe: "4-6 tygodni"
    },
    {
      name: "Sklep Profesjonalny",
      price: "15 000 - 30 000 PLN",
      description: "Zaawansowany sklep z rozszerzonymi funkcjami",
      features: [
        "Nieograniczona liczba produktów",
        "Zaawansowane płatności",
        "System magazynowy",
        "Program lojalnościowy",
        "Zaawansowana analityka",
        "Multi-waluta i multi-język",
        "Integracje z ERP/CRM",
        "6 miesięcy wsparcia"
      ],
      timeframe: "6-10 tygodni",
      popular: true
    },
    {
      name: "Sklep Enterprise",
      price: "30 000+ PLN",
      description: "Kompleksowe rozwiązanie dla dużych sklepów",
      features: [
        "Wszystko z pakietu Profesjonalnego",
        "Dedykowane rozwiązania custom",
        "B2B marketplace funkcje",
        "Zaawansowana automatyzacja",
        "Dedykowane integracje",
        "Multi-store management",
        "SLA i monitoring 24/7",
        "12 miesięcy wsparcia"
      ],
      timeframe: "10+ tygodni"
    }
  ]

  const features = [
    {
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,
      title: "Płatności online",
      description: "Integracja z PayU, Przelewy24, PayPal, BLIK i kartami płatniczymi"
    },
    {
      icon: <Package className="h-8 w-8 text-orange-500" />,
      title: "Zarządzanie produktami",
      description: "Intuicyjny panel do dodawania produktów, kategorii i wariantów"
    },
    {
      icon: <Truck className="h-8 w-8 text-orange-500" />,
      title: "Integracja z kurierami",
      description: "Automatyczne generowanie etykiet i śledzenie przesyłek"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-500" />,
      title: "Analityka sprzedaży",
      description: "Szczegółowe raporty sprzedaży, najpopularniejsze produkty, ROI"
    }
  ]

  const integrations = [
    "Systemy płatności: PayU, Przelewy24, PayPal, Stripe",
    "Kurierzy: DPD, InPost, UPS, DHL, Poczta Polska",
    "Księgowość: iFirma, Wfirma, Comarch",
    "Marketing: Google Analytics, Facebook Pixel, Mailchimp",
    "ERP/CRM: Salesforce, HubSpot, systemy dedykowane",
    "Magazyn: BaseLinker, Allegro, Amazon, eBay"
  ]

  const benefits = [
    "Zwiększenie sprzedaży o 200-400% w pierwszym roku",
    "Automatyzacja procesów sprzedażowych",
    "Lepsze zarządzanie magazynem i zamówieniami",
    "Dotarcie do nowych grup klientów",
    "Możliwość sprzedaży 24/7",
    "Szczegółowa analityka i raportowanie"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Header section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 mb-8">
              <Link
                to="/uslugi"
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Powrót do usług</span>
              </Link>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <ShoppingCart className="h-16 w-16 text-orange-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Sklepy internetowe
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Kompleksowe sklepy internetowe, które nie tylko prezentują produkty, 
                ale skutecznie sprzedają i automatyzują procesy biznesowe.
              </p>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Kluczowe funkcje naszych sklepów
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pakiety i cennik
              </h2>
              <p className="text-xl text-gray-600">
                Wybierz pakiet dostosowany do skali Twojego biznesu
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl ${
                    pkg.popular ? 'border-orange-500 transform lg:scale-105' : 'border-gray-200'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                        NAJPOPULARNIEJSZY
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <div className="text-3xl font-bold text-orange-500 mb-4">{pkg.price}</div>
                      <p className="text-gray-600">{pkg.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-6">Czas realizacji: {pkg.timeframe}</p>
                      <Link
                        to="/#kontakt"
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 inline-block ${
                          pkg.popular
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        Umów konsultację
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Integracje i połączenia
                </h2>
                <div className="space-y-3">
                  {integrations.map((integration, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{integration}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Korzyści dla Twojego biznesu
                </h2>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl">
              <div className="flex items-start space-x-4">
                <Shield className="h-12 w-12 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Bezpieczeństwo i zgodność z prawem
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Bezpieczeństwo:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Certyfikat SSL</li>
                        <li>• Szyfrowanie danych</li>
                        <li>• Regularne backupy</li>
                        <li>• Monitoring bezpieczeństwa</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Zgodność prawna:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• RODO compliance</li>
                        <li>• Regulamin sklepu</li>
                        <li>• Polityka prywatności</li>
                        <li>• Prawo odstąpienia</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Gotowy na start sprzedaży online?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Umów się na bezpłatną konsultację i otrzymaj spersonalizowaną strategię dla Twojego sklepu.
            </p>
            <Link
              to="/#kontakt"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Umów bezpłatną konsultację
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default EcommercePage