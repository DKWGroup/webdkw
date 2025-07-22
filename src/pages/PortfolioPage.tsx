import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Calendar, Tag, FileText } from 'lucide-react'
import { HelmetProvider } from 'react-helmet-async'
import { supabase, Project } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'

const PortfolioPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const categories = ["Wszystkie", "Strona firmowa", "Landing page"]
  const [selectedCategory, setSelectedCategory] = React.useState("Wszystkie")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Wystąpił błąd podczas pobierania projektów. Spróbuj ponownie później.')
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = selectedCategory === "Wszystkie" 
    ? projects 
    : projects.filter(project => project.category.includes(selectedCategory))

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Portfolio | Strony Internetowe, Sklepy Online, SEO"
          description="Zobacz nasze realizacje! Prezentujemy portfolio stron internetowych, sklepów online i projektów SEO. Przekonaj się o naszym doświadczeniu i jakości!"
          keywords="strony internetowe, tworzenie stron www, sklepy internetowe, pozycjonowanie SEO, Google Ads, marketing internetowy"
          url="https://webdkw.net"
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
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Ładowanie projektów...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                  <button
                    onClick={fetchProjects}
                    className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Spróbuj ponownie
                  </button>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-12">
                  {filteredProjects.map((project) => (
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
                            src={project.image_url}
                            alt={project.title}
                            className={`w-full object-cover filter transition-all duration-300 ${
                              project.featured ? 'h-80 lg:h-full' : 'h-64'
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                            {project.project_url && (
                              <a
                                href={project.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                              >
                                <span>Zobacz projekt</span>
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
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
                              <span>{new Date(project.completion_date).getFullYear()}</span>
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
                          {project.case_study && (
                            <div className="mb-4">
                              <Link
                                to={`/case-studies/${project.slug}`}
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
              )}
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
    </HelmetProvider>
  )
}

export default PortfolioPage