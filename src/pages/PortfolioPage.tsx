import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, TrendingUp, Users, DollarSign, Calendar, Tag, FileText } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PortfolioPage = () => {
  const projects = [
    {
      id: 1,
      title: "TechStart Solutions",
      category: "Platforma B2B",
      industry: "Technologie",
      description: "Kompleksowa platforma do zarządzania projektami technologicznymi z zaawansowanym systemem CRM.",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
      results: [
        { metric: "Wzrost konwersji", value: "+340%", icon: <TrendingUp className="h-5 w-5" /> },
        { metric: "Zapytania miesięcznie", value: "85+", icon: <Users className="h-5 w-5" /> },
        { metric: "ROI w 6 miesięcy", value: "450%", icon: <DollarSign className="h-5 w-5" /> }
      ],
      completionDate: "2024",
      url: "#",
      featured: true,
      hasCaseStudy: true,
      caseStudySlug: "techstart-solutions"
    },
    {
      id: 2,
      title: "EcoGreen Consulting",
      category: "Strona firmowa + SEO",
      industry: "Doradztwo ekologiczne",
      description: "Profesjonalna strona firmowa z kompleksową strategią SEO i content marketingiem.",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["WordPress", "Custom Theme", "SEO", "Analytics"],
      results: [
        { metric: "Wzrost ruchu SEO", value: "+280%", icon: <TrendingUp className="h-5 w-5" /> },
        { metric: "Pozycje TOP 3", value: "47", icon: <Users className="h-5 w-5" /> },
        { metric: "Nowi klienci", value: "+120%", icon: <DollarSign className="h-5 w-5" /> }
      ],
      completionDate: "2024",
      url: "#",
      hasCaseStudy: true,
      caseStudySlug: "ecogreen-consulting"
    },
    {
      id: 3,
      title: "LuxuryHome Design",
      category: "Sklep internetowy",
      industry: "Projektowanie wnętrz",
      description: "Ekskluzywny sklep internetowy z produktami premium do projektowania wnętrz.",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["WooCommerce", "Custom Design", "Payment Gateway", "CRM"],
      results: [
        { metric: "Średnia wartość zamówienia", value: "+85%", icon: <DollarSign className="h-5 w-5" /> },
        { metric: "Konwersja", value: "4.2%", icon: <Users className="h-5 w-5" /> },
        { metric: "Czas na stronie", value: "+220%", icon: <TrendingUp className="h-5 w-5" /> }
      ],
      completionDate: "2023",
      url: "#"
    },
    {
      id: 4,
      title: "MedClinic Pro",
      category: "System rezerwacji",
      industry: "Opieka zdrowotna",
      description: "Zaawansowany system rezerwacji wizyt z integracją kalendarza i płatnościami online.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["React", "Express", "MongoDB", "Stripe"],
      results: [
        { metric: "Rezerwacje online", value: "95%", icon: <Users className="h-5 w-5" /> },
        { metric: "Redukcja no-show", value: "-60%", icon: <TrendingUp className="h-5 w-5" /> },
        { metric: "Oszczędność czasu", value: "8h/dzień", icon: <DollarSign className="h-5 w-5" /> }
      ],
      completionDate: "2023",
      url: "#"
    },
    {
      id: 5,
      title: "FitnessPro Academy",
      category: "Platforma edukacyjna",
      industry: "Fitness i zdrowie",
      description: "Platforma LMS do kursów fitness online z systemem certyfikacji trenerów.",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Vue.js", "Laravel", "MySQL", "Video Streaming"],
      results: [
        { metric: "Aktywni użytkownicy", value: "2500+", icon: <Users className="h-5 w-5" /> },
        { metric: "Ukończone kursy", value: "1200+", icon: <TrendingUp className="h-5 w-5" /> },
        { metric: "Retention rate", value: "78%", icon: <DollarSign className="h-5 w-5" /> }
      ],
      completionDate: "2023",
      url: "#"
    },
    {
      id: 6,
      title: "AutoParts Express",
      category: "Sklep B2B",
      industry: "Motoryzacja",
      description: "Sklep internetowy B2B z zaawansowanym systemem katalogowym części samochodowych.",
      image: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800",
      technologies: ["Magento", "Custom Modules", "API Integration", "ERP"],
      results: [
        { metric: "Zamówienia B2B", value: "+190%", icon: <DollarSign className="h-5 w-5" /> },
        { metric: "Średnie zamówienie", value: "2400 PLN", icon: <TrendingUp className="h-5 w-5" /> },
        { metric: "Klienci biznesowi", value: "450+", icon: <Users className="h-5 w-5" /> }
      ],
      completionDate: "2022",
      url: "#"
    }
  ]

  const categories = ["Wszystkie", "Strona firmowa", "Sklep internetowy", "Platforma B2B", "System rezerwacji", "Platforma edukacyjna"]
  const [selectedCategory, setSelectedCategory] = React.useState("Wszystkie")

  const filteredProjects = selectedCategory === "Wszystkie" 
    ? projects 
    : projects.filter(project => project.category.includes(selectedCategory))

  return (
    <div className="min-h-screen bg-gray-50">
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
                Portfolio projektów
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Poznaj projekty, które zrealizowałem dla moich klientów. 
                Każdy z nich to historia sukcesu i mierzalnych rezultatów biznesowych.
              </p>
            </div>
          </div>
        </section>

        {/* Filter section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    project.featured ? 'lg:col-span-2' : ''
                  }`}
                >
                  <div className={`grid ${project.featured ? 'lg:grid-cols-2' : ''} gap-0`}>
                    {/* Image */}
                    <div className="relative group">
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`w-full object-cover ${
                          project.featured ? 'h-80 lg:h-full' : 'h-64'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                        <a
                          href={project.url}
                          className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                        >
                          <span>Zobacz projekt</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {project.title}
                          </h3>
                          <p className="text-orange-500 font-semibold">{project.industry}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{project.completionDate}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 leading-relaxed mb-6">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-700">Technologie:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Results */}
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-4">Rezultaty:</h4>
                        <div className={`grid ${project.featured ? 'grid-cols-3' : 'grid-cols-1'} gap-4`}>
                          {project.results.map((result, idx) => (
                            <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="flex justify-center mb-2 text-orange-500">
                                {result.icon}
                              </div>
                              <div className="text-xl font-bold text-gray-900 mb-1">
                                {result.value}
                              </div>
                              <div className="text-sm text-gray-600">
                                {result.metric}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Case Study Link */}
                      {project.hasCaseStudy && (
                        <div className="mb-4">
                          <Link
                            to={`/case-studies/${project.caseStudySlug}`}
                            className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                            <span>Przeczytaj szczegółowy case study</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              Podsumowanie wszystkich projektów
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-orange-500 mb-2">50+</div>
                <div className="text-gray-600">Zrealizowanych projektów</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-orange-500 mb-2">300%</div>
                <div className="text-gray-600">Średni wzrost konwersji</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-orange-500 mb-2">98%</div>
                <div className="text-gray-600">Zadowolonych klientów</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl font-bold text-orange-500 mb-2">5+</div>
                <div className="text-gray-600">Lat doświadczenia</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Twój projekt może być następny
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Porozmawiajmy o Twoich celach i stwórzmy razem projekt, 
              który będzie generował mierzalne rezultaty dla Twojego biznesu.
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

export default PortfolioPage