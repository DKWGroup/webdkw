import React from 'react'
import { ArrowRight, Globe, Database, ShoppingCart, Search, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const ServicesSection = () => {
  const services = [
    {
      icon: <Globe className="h-12 w-12 text-orange-500" />,
      title: "Tworzenie stron internetowych",
      description: "Profesjonalne strony wizytówkowe i landing page'y zoptymalizowane pod konwersję. Responsywny design, SEO i panel administracyjny w standardzie.",
      link: "/uslugi/tworzenie-stron",
      features: ["Responsywny design", "Optymalizacja SEO", "Panel CMS"]
    },
    {
      icon: <Database className="h-12 w-12 text-orange-500" />,
      title: "Platformy internetowe",
      description: "Zaawansowane systemy i aplikacje webowe dostosowane do specyficznych potrzeb Twojego biznesu. Od CRM po platformy edukacyjne.",
      link: "/uslugi/platformy-internetowe",
      features: ["Dedykowany kod", "Zaawansowane funkcje", "Skalowalność"]
    },
    {
      icon: <ShoppingCart className="h-12 w-12 text-orange-500" />,
      title: "Sklepy internetowe",
      description: "Kompleksowe sklepy e-commerce z systemami płatności, zarządzaniem produktami i integracjami z kurierami. Gotowe do sprzedaży.",
      link: "/uslugi/sklepy-internetowe",
      features: ["Systemy płatności", "Zarządzanie produktami", "Integracje"]
    },
    {
      icon: <Search className="h-12 w-12 text-orange-500" />,
      title: "Optymalizacja SEO",
      description: "Kompleksowa optymalizacja SEO zwiększająca widoczność w Google. Audyt, optymalizacja techniczna i content marketing.",
      link: "/uslugi/seo",
      features: ["Audyt SEO", "Content marketing", "Link building"]
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-orange-500" />,
      title: "Marketing i kampanie reklamowe",
      description: "Profesjonalne kampanie Google Ads i Facebook Ads generujące wysokiej jakości leady z mierzalnym ROI.",
      link: "/uslugi/marketing",
      features: ["Google Ads", "Facebook Ads", "Optymalizacja ROI"]
    }
  ]

  return (
    <section id="uslugi" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nasze usługi - kompleksowe rozwiązania internetowe
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Od prostych stron wizytówkowych po zaawansowane platformy e-commerce. 
            Każde rozwiązanie dostosowane do Twoich potrzeb biznesowych.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  {service.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={service.link}
                  className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:transform group-hover:-translate-y-1"
                >
                  <span>Dowiedz się więcej</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
            <p className="text-blue-800 font-semibold">
              💡 Nie wiesz, która usługa jest dla Ciebie? Umów się na bezpłatną konsultację!
            </p>
          </div>
          
          <Link
            to="/uslugi"
            className="inline-flex items-center space-x-2 bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Zobacz wszystkie usługi i cennik</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection