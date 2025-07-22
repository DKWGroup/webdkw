import { useState, useEffect } from 'react'
import { ExternalLink, TrendingUp, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase, Project } from '../lib/supabase'

const PortfolioSection = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetchLatestProjects()
  }, [])

  const fetchLatestProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const displayProjects = projects

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayProjects.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayProjects.length) % displayProjects.length)
  }

  if (loading) {
    return (
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Ładowanie projektów...</p>
          </div>
        </div>
      </section>
    )
  }
  
  if (error || displayProjects.length === 0) {
    return (
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Portfolio - strony internetowe, które generują konkretne wyniki
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Liczby nie kłamią. Zobacz jak nasze rozwiązania przekładają się na 
              konkretne korzyści biznesowe naszych klientów.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">Wkrótce dodamy nasze najnowsze projekty.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Portfolio - strony internetowe, które generują konkretne wyniki
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Liczby nie kłamią. Zobacz jak nasze rozwiązania przekładają się na 
            konkretne korzyści biznesowe naszych klientów.
          </p>
        </div>

        {/* Desktop version */}
        {displayProjects.length > 0 && (
          <>
            <div className="hidden md:block space-y-16">
              {displayProjects.map((study, index) => (
                <div
                  key={study.id}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="flex-1">
                    <div className="relative group">
                      <img
                        src={study.image_url}
                        alt={study.title}
                        className="w-full h-80 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                        <a
                          href={study.project_url || "#"}
                          className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                        >
                          <span>Zobacz projekt</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="bg-gray-50 p-8 rounded-2xl">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{study.title}</h3>
                        <p className="text-orange-500 font-semibold">{study.industry}</p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">🎯 Wyzwanie:</h4>
                          <div 
                            className="text-gray-600 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: study.description }}
                          />
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">📈 Rezultaty:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {Array.isArray(study.results) && study.results.map((result, idx) => (
                              <div key={idx} className="text-center p-4 bg-white rounded-lg shadow-sm">
                                <div className="flex justify-center mb-2 text-orange-500">
                                  <TrendingUp className="h-5 w-5" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                  {result.value}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {result.metric}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile carousel version */}
            <div className="md:hidden">
              <div className="relative">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {displayProjects.map((study) => (
                      <div key={study.id} className="w-full flex-shrink-0 px-4">
                        <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
                          {/* Image */}
                          <div className="relative">
                            <img
                              src={study.image_url}
                              alt={study.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-4 right-4">
                              <a
                                href={study.project_url || "#"}
                                className="bg-white/90 backdrop-blur-sm text-gray-900 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{study.title}</h3>
                              <p className="text-orange-500 font-semibold text-sm">{study.industry}</p>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="font-bold text-gray-900 mb-2 text-sm">🎯 Wyzwanie:</h4>
                                <div 
                                  className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: study.description }}
                                />
                              </div>

                              <div>
                                <h4 className="font-bold text-gray-900 mb-3 text-sm">📈 Rezultaty:</h4>
                                <div className="grid grid-cols-1 gap-3">
                                  {Array.isArray(study.results) && study.results.slice(0, 2).map((result, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                      <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm text-gray-600">{result.metric}</span>
                                      </div>
                                      <span className="text-lg font-bold text-gray-900">{result.value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>

                {/* Dots indicator */}
                <div className="flex justify-center space-x-2 mt-6">
                  {displayProjects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index ? 'bg-orange-500 w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-center mt-16">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
            <p className="text-green-800 font-semibold text-lg">
            🚀 Twój projekt może być następny w tej galerii sukcesów
            </p>
          </div>
          
          <Link
            to="/portfolio"
            className="inline-flex items-center space-x-2 bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mr-4 mb-4"
          >
            <span>Zobacz wszystkie realizacje</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          <Link
            to="/case-studies"
            className="inline-flex items-center space-x-2 bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-all duration-300"
          >
            <span>Przeczytaj case studies</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PortfolioSection