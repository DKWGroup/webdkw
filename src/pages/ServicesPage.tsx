import React from 'react'
import { Link } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ArrowLeft, ArrowRight, Globe, Database, ShoppingCart, Search, TrendingUp, Clock, DollarSign } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import StructuredData from '../components/StructuredData'

const ServicesPage = () => {
  const services = [
    {
      icon: <Globe className="h-12 w-12 text-orange-500" />,
      title: "Tworzenie stron internetowych",
      subtitle: "Landing page / Wizytówka",
      description: "Profesjonalne strony wizytówkowe i landing page'y zoptymalizowane pod konwersję",
      priceRange: "od 4 000 zł",
      timeframe: "1 tydzień",
      features: ["Responsywny design", "Optymalizacja SEO", "Formularz kontaktowy", "Panel administracyjny"],
      link: "/uslugi/tworzenie-stron"
    },
    {
      icon: <Database className="h-12 w-12 text-orange-500" />,
      title: "Platformy internetowe",
      subtitle: "Systemy i aplikacje web",
      description: "Zaawansowane platformy internetowe i systemy zarządzania dostosowane do Twoich potrzeb",
      priceRange: "od 9 000 zł",
      timeframe: "od 4 tygodni",
      features: ["Dedykowany kod", "Zaawansowane funkcje", "Integracje API", "Skalowalność"],
      link: "/uslugi/platformy-internetowe"
    },
    {
      icon: <ShoppingCart className="h-12 w-12 text-orange-500" />,
      title: "Sklepy internetowe",
      subtitle: "E-commerce",
      description: "Kompleksowe sklepy internetowe z systemami płatności i zarządzania zamówieniami",
      priceRange: "od 4 000 zł",
      timeframe: "od 2 tygodni",
      features: ["WooCommerce/Custom", "Systemy płatności", "Zarządzanie produktami", "Analityka sprzedaży"],
      link: "/uslugi/sklepy-internetowe"
    },
    {
      icon: <Search className="h-12 w-12 text-orange-500" />,
      title: "Optymalizacja SEO",
      subtitle: "Pozycjonowanie w Google",
      description: "Kompleksowa optymalizacja SEO zwiększająca widoczność w wyszukiwarkach",
      priceRange: "od 1 200 zł/mies",
      timeframe: "rezulataty po miesiącu",
      features: ["Audyt SEO", "Optymalizacja techniczna", "Content marketing", "Link building"],
      link: "/uslugi/seo"
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-orange-500" />,
      title: "Marketing i reklamy",
      subtitle: "Google Ads / Facebook Ads",
      description: "Profesjonalne kampanie reklamowe generujące wysokiej jakości leady",
      priceRange: "od 600 zł/mies",
      timeframe: "od tygodnia",
      features: ["Google Ads", "Facebook/Instagram Ads", "Optymalizacja konwersji", "Raportowanie"],
      link: "/uslugi/marketing"
    }
  ]

  const breadcrumbData = [
    { name: "Strona główna", url: "https://webdkw.net" },
    { name: "Usługi", url: "https://webdkw.net/uslugi" }
  ]

  const servicesStructuredData = services.map(service => ({
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "WebDKW"
    },
    "offers": {
      "@type": "Offer",
      "price": service.priceRange,
      "priceCurrency": "PLN"
    }
  }))

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Usługi WebDKW - Strony internetowe, SEO, Marketing"
          description="Kompleksowe rozwiązania internetowe dla Twojego biznesu. Od prostych stron wizytówkowych po zaawansowane platformy e-commerce."
          keywords="usługi, strony internetowe, sklepy online, SEO, pozycjonowanie, Google Ads, marketing internetowy"
          url="https://webdkw.net/uslugi"
        />
        <StructuredData type="breadcrumb" data={breadcrumbData} />
        <StructuredData 
          type="service" 
          data={{
            name: "Usługi WebDKW",
            description: "Kompleksowe rozwiązania internetowe dla firm",
            serviceType: "Web Development",
            offers: {
              price: "od 3000",
              priceCurrency: "PLN"
            }
          }} 
        />
        
        <Header />
        
        <main className="pt-20">
          {/* Header section */}
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-4 mb-8">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Powrót na stronę główną</span>
                </Link>
              </div>
              
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Nasze usługi
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Kompleksowe rozwiązania internetowe dla Twojego biznesu. 
                  Od prostych stron wizytówkowych po zaawansowane platformy e-commerce.
                </p>
              </div>
            </div>
          </section>

          {/* Services grid */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="flex-shrink-0">
                          {service.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {service.title}
                          </h3>
                          <p className="text-orange-500 font-semibold">
                            {service.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 leading-relaxed mb-6">
                        {service.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-gray-600">
                            <strong>{service.priceRange}</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <span className="text-sm text-gray-600">
                            <strong>{service.timeframe}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Kluczowe funkcje:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Link
                        to={service.link}
                        className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <span>Dowiedz się więcej</span>
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Nie wiesz, która usługa jest dla Ciebie?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Umów się na bezpłatną konsultację i wspólnie dobierzemy najlepsze rozwiązanie dla Twojego biznesu.
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
    </HelmetProvider>
  )
}

export default ServicesPage