import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Clock, Tag, Share2 } from 'lucide-react'
import { supabase, BlogPost } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
      setError('Nie znaleziono artykułu')
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

  const sharePost = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt || '',
        url: window.location.href,
      })
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link skopiowany do schowka!')
    }
  }

  const formatContent = (content: string) => {
    // Convert markdown-like formatting to HTML
    let formattedContent = content
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold text-gray-900 mt-10 mb-6">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold text-gray-900 mt-12 mb-8">$1</h1>')
      // Images with captions
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<figure class="my-8"><img src="$2" alt="$1" class="w-full rounded-lg shadow-lg"><figcaption class="text-center text-gray-600 mt-3 italic">$1</figcaption></figure>')
      // Lists
      .replace(/^- (.*$)/gm, '<li class="mb-2">$1</li>')
      // Wrap consecutive list items in ul
      .replace(/(<li.*<\/li>\s*)+/g, '<ul class="list-disc list-inside my-6 space-y-2">$&</ul>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-6">')

    // Wrap in paragraph tags if not already wrapped
    if (!formattedContent.startsWith('<')) {
      formattedContent = '<p class="mb-6">' + formattedContent + '</p>'
    }

    return formattedContent
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie artykułu...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Artykuł nie został znaleziony
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Przepraszamy, ale artykuł o podanym adresie nie istnieje lub został usunięty.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Wróć do bloga</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Header section */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 mb-8">
              <Link
                to="/blog"
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Wróć do bloga</span>
              </Link>
            </div>
            
            {/* Article header */}
            <article>
              <header className="mb-8">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg mb-8"
                  />
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
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
                  <button
                    onClick={sharePost}
                    className="flex items-center space-x-1 hover:text-orange-500 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Udostępnij</span>
                  </button>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                )}
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-8">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </header>
              
              {/* Article content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                />
              </div>
            </article>
          </div>
        </section>

        {/* Author section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-start space-x-6">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt={post.author}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {post.author}
                  </h3>
                  <p className="text-orange-500 font-semibold mb-3">
                    Senior Web Developer & SEO Strategist
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Specjalista od tworzenia stron internetowych i pozycjonowania. 
                    Pomagam firmom budować skuteczną obecność online od ponad 5 lat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Potrzebujesz pomocy z projektem?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Skorzystaj z bezpłatnej konsultacji i dowiedz się, jak mogę pomóc Twojemu biznesowi.
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

export default BlogPostPage