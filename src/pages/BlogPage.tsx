import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react'
import { supabase, BlogPost } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min czytania`
  }

  // Sample blog posts for demonstration
  const samplePosts: BlogPost[] = [
    {
      id: '1',
      title: 'WordPress vs. Strona "szyta na miarę" – kiedy warto dopłacić za dedykowane rozwiązanie?',
      slug: 'wordpress-vs-custom-website',
      excerpt: 'Czy zawsze warto inwestować w drogie rozwiązania custom? Dowiedz się, kiedy WordPress wystarcza, a kiedy potrzebujesz czegoś więcej.',
      content: 'Kompletny przewodnik porównujący WordPress z rozwiązaniami custom...',
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: 'Marcin Kowalski',
      image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['WordPress', 'Development', 'Porady']
    },
    {
      id: '2',
      title: '5 powodów, dla których Twoja strona internetowa nie sprzedaje (i jak to naprawić)',
      slug: '5-powodow-dlaczego-strona-nie-sprzedaje',
      excerpt: 'Masz ruch na stronie, ale brak konwersji? Sprawdź najczęstsze błędy, które blokują sprzedaż i dowiedz się, jak je naprawić.',
      content: 'Szczegółowa analiza problemów z konwersją...',
      published: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      author: 'Marcin Kowalski',
      image_url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Konwersja', 'UX', 'Marketing']
    },
    {
      id: '3',
      title: 'Jak przygotować się do stworzenia strony internetowej? Checklist dla przedsiębiorcy',
      slug: 'checklist-tworzenie-strony-internetowej',
      excerpt: 'Przygotowanie to podstawa sukcesu. Zobacz, co musisz przygotować przed rozmową z web developerem, żeby projekt przebiegł sprawnie.',
      content: 'Kompletny checklist do przygotowania projektu strony...',
      published: true,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
      author: 'Marcin Kowalski',
      image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Planowanie', 'Biznes', 'Porady']
    }
  ]

  const displayPosts = posts.length > 0 ? posts : samplePosts

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie artykułów...</p>
        </div>
      </div>
    )
  }

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
            
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Blog WebExpert
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Praktyczne porady, case studies i najnowsze trendy w tworzeniu stron internetowych. 
                Wiedza, która pomaga budować lepsze rozwiązania online.
              </p>
            </div>
          </div>
        </section>

        {/* Blog posts */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {displayPosts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Blog będzie wkrótce dostępny
                </h2>
                <p className="text-gray-600">
                  Pracuję nad pierwszymi artykułami. Wróć wkrótce!
                </p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {displayPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                      index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={post.image_url || 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={post.title}
                        className={`w-full object-cover ${
                          index === 0 ? 'h-64 lg:h-80' : 'h-48'
                        }`}
                      />
                      <div className="absolute top-4 left-4">
                        {post.tags && post.tags.length > 0 && (
                          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {post.tags[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`p-6 ${index === 0 ? 'lg:p-8' : ''}`}>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{getReadingTime(post.content)}</span>
                        </div>
                      </div>
                      
                      <h2 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${
                        index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                      }`}>
                        {post.title}
                      </h2>
                      
                      <p className={`text-gray-600 leading-relaxed mb-4 ${
                        index === 0 ? 'text-lg' : ''
                      }`}>
                        {post.excerpt}
                      </p>
                      
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                      >
                        <span>Czytaj dalej</span>
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </Link>
                      
                      {post.tags && post.tags.length > 1 && (
                        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(1).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Potrzebujesz strony, która rzeczywiście sprzedaje?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Skorzystaj z darmowej konsultacji i dowiedz się, jak zwiększyć konwersję swojej strony.
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

export default BlogPage