import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ArrowLeft, Calendar, User, Clock, Tag, Share2, ChevronRight, MessageCircle, BookOpen, CheckCircle, HelpCircle } from 'lucide-react'
import { supabase, BlogPost } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import StructuredData from '../components/StructuredData'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableOfContents, setTableOfContents] = useState<{id: string, text: string, level: number}[]>([])

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
      
      // Extract headings for table of contents
      if (data?.content) {
        const headings = extractHeadings(data.content)
        setTableOfContents(headings)
      }
      
      // Fetch related posts based on categories or tags
      if (data) {
        fetchRelatedPosts(data)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      setError('Nie znaleziono artykułu')
    } finally {
      setLoading(false)
    }
  }
  
  const extractHeadings = (content: string) => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const headings = []
    let match
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      
      headings.push({ id, text, level })
    }
    
    return headings
  }
  
  const fetchRelatedPosts = async (currentPost: BlogPost) => {
    try {
      // Try to match by categories first
      let query = supabase
        .from('blog_posts')
        .select('*')
        .neq('id', currentPost.id)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3)
      
      if (currentPost.categories && currentPost.categories.length > 0) {
        query = query.overlaps('categories', currentPost.categories)
      } else if (currentPost.tags && currentPost.tags.length > 0) {
        // Fall back to tags if no categories
        query = query.overlaps('tags', currentPost.tags)
      }
      
      const { data } = await query
      
      if (data && data.length > 0) {
        setRelatedPosts(data)
      } else {
        // If no related posts found, just get the latest posts
        const { data: latestPosts } = await supabase
          .from('blog_posts')
          .select('*')
          .neq('id', currentPost.id)
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3)
        
        setRelatedPosts(latestPosts || [])
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
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

  // Custom components for markdown rendering
  const MarkdownComponents = {
    // Custom code block with syntax highlighting
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          className="rounded-lg my-4"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600" {...props}>
          {children}
        </code>
      );
    },
    
    // Add IDs to headings for TOC
    h2({ node, children, ...props }: any) {
      const id = children
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      
      return (
        <h2 id={id} className="text-3xl font-bold text-gray-900 mt-10 mb-6" {...props}>
          {children}
        </h2>
      );
    },
    
    h3({ node, children, ...props }: any) {
      const id = children
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      
      return (
        <h3 id={id} className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props}>
          {children}
        </h3>
      );
    },
    
    // Style paragraphs
    p({ node, children, ...props }: any) {
      // Check for CTA syntax
      const child = children?.[0];
      
      if (typeof child === 'string' && child.startsWith('[CTA:') && child.endsWith(']')) {
        try {
          const ctaContent = child.slice(5, -1);
          const params = new Map();
          
          ctaContent.split(',').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
              params.set(key.trim(), value.trim());
            }
          });
          
          const title = params.get('title') || 'Kliknij tutaj';
          const url = params.get('url') || '#';
          const color = params.get('color') || 'orange';
          
          const colorClasses: Record<string, string> = {
            orange: 'bg-orange-500 hover:bg-orange-600 text-white',
            blue: 'bg-blue-500 hover:bg-blue-600 text-white',
            green: 'bg-green-500 hover:bg-green-600 text-white',
            red: 'bg-red-500 hover:bg-red-600 text-white',
            gray: 'bg-gray-500 hover:bg-gray-600 text-white',
          };
          
          const buttonClass = colorClasses[color] || colorClasses.orange;
          
          return (
            <div className="my-8 text-center">
              <a 
                href={url}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${buttonClass}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          );
        } catch (error) {
          console.error('Error parsing CTA:', error);
        }
      }
      
      return <p className="text-gray-700 leading-relaxed mb-6" {...props}>{children}</p>;
    },
    
    // Style links
    a({ node, children, ...props }: any) {
      return (
        <a 
          className="text-orange-500 hover:text-orange-700 underline" 
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
    
    // Style blockquotes
    blockquote({ node, children, ...props }: any) {
      return (
        <blockquote 
          className="border-l-4 border-orange-500 pl-4 py-2 my-6 bg-orange-50 rounded-r-lg text-gray-700 italic"
          {...props}
        >
          {children}
        </blockquote>
      );
    },
    
    // Style lists
    ul({ node, children, ...props }: any) {
      return (
        <ul className="list-disc list-inside mb-6 space-y-2" {...props}>
          {children}
        </ul>
      );
    },
    
    ol({ node, children, ...props }: any) {
      return (
        <ol className="list-decimal list-inside mb-6 space-y-2" {...props}>
          {children}
        </ol>
      );
    },
    
    // Style list items
    li({ node, children, ...props }: any) {
      return (
        <li className="text-gray-700" {...props}>
          {children}
        </li>
      );
    },
    
    // Style tables
    table({ node, children, ...props }: any) {
      return (
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-300 rounded-lg" {...props}>
            {children}
          </table>
        </div>
      );
    },
    
    thead({ node, children, ...props }: any) {
      return (
        <thead className="bg-gray-100" {...props}>
          {children}
        </thead>
      );
    },
    
    tbody({ node, children, ...props }: any) {
      return (
        <tbody className="divide-y divide-gray-300" {...props}>
          {children}
        </tbody>
      );
    },
    
    tr({ node, children, ...props }: any) {
      return (
        <tr className="hover:bg-gray-50" {...props}>
          {children}
        </tr>
      );
    },
    
    th({ node, children, ...props }: any) {
      return (
        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700" {...props}>
          {children}
        </th>
      );
    },
    
    td({ node, children, ...props }: any) {
      return (
        <td className="px-4 py-3 text-sm text-gray-700 border-t border-gray-300" {...props}>
          {children}
        </td>
      );
    },
    
    // Style images
    img({ node, ...props }: any) {
      return (
        <figure className="my-8">
          <img 
            className="w-full rounded-lg shadow-lg" 
            {...props} 
            loading="lazy"
            alt={props.alt || 'Blog image'}
          />
          {props.alt && (
            <figcaption className="text-center text-gray-500 mt-2 text-sm italic">
              {props.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  };

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
      <HelmetProvider>
        <div className="min-h-screen bg-gray-50">
          <SEOHead 
            title="Artykuł nie został znaleziony"
            description="Przepraszamy, ale artykuł o podanym adresie nie istnieje lub został usunięty."
            url={`https://webdkw.net/blog/${slug}`}
          />
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
      </HelmetProvider>
    )
  }

  const breadcrumbData = [
    { name: "Strona główna", url: "https://webdkw.net" },
    { name: "Blog", url: "https://webdkw.net/blog" },
    { name: post.title, url: `https://webdkw.net/blog/${post.slug}` }
  ]

  const articleData = {
    title: post.title,
    description: post.excerpt || post.title,
    image: post.image_url,
    author: post.author,
    publishedTime: post.created_at,
    modifiedTime: post.updated_at,
    url: `https://webdkw.net/blog/${post.slug}`
  }
  
  // Generate FAQ structured data if available
  const faqData = post.faqs && post.faqs.length > 0 
    ? post.faqs.map((faq: any) => ({
        question: faq.question,
        answer: faq.answer
      }))
    : null

  // Process markdown to add table of contents
  const processedContent = React.useMemo(() => {
    // Only add TOC if there are at least 2 h2 headings
    const h2Count = (post.content.match(/^## /gm) || []).length;
    
    if (h2Count >= 2) {
      // Find all h2 and h3 headings
      const headings: { level: number; text: string; id: string }[] = [];
      const lines = post.content.split('\n');
      
      lines.forEach(line => {
        if (line.startsWith('## ')) {
          const text = line.replace(/^## /, '');
          const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          headings.push({ level: 2, text, id });
        } else if (line.startsWith('### ')) {
          const text = line.replace(/^### /, '');
          const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          headings.push({ level: 3, text, id });
        }
      });
      
      if (headings.length > 0) {
        let toc = '## Spis treści\n\n';
        
        headings.forEach(heading => {
          const indent = heading.level === 3 ? '  ' : '';
          toc += `${indent}- [${heading.text}](#${heading.id})\n`;
        });
        
        // Find the first h2 heading and insert TOC before it
        const firstH2Index = post.content.indexOf('## ');
        if (firstH2Index !== -1) {
          return post.content.slice(0, firstH2Index) + toc + '\n\n' + post.content.slice(firstH2Index);
        }
      }
    }
    
    return post.content;
  }, [post.content]);

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title={post.title}
          description={post.meta_description || post.excerpt || post.title}
          keywords={post.tags?.join(', ') || 'blog, porady, strony internetowe'}
          image={post.image_url}
          url={`https://webdkw.net/blog/${post.slug}`}
          type="article"
          author={post.author}
          publishedTime={post.created_at}
          modifiedTime={post.updated_at}
        />
        <StructuredData type="breadcrumb" data={breadcrumbData} />
        <StructuredData type="article" data={articleData} />
        {faqData && <StructuredData type="faq" data={faqData} />}
        
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
                
                {/* TLDR Section */}
                {(post.tldr_summary || (post.tldr_takeaways && post.tldr_takeaways.length > 0)) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-blue-900 mb-3">TL;DR - W skrócie</h2>
                        {post.tldr_summary && (
                          <p className="text-blue-800 mb-4">{post.tldr_summary}</p>
                        )}
                        {post.tldr_takeaways && post.tldr_takeaways.length > 0 && (
                          <div className="space-y-2">
                            {post.tldr_takeaways.map((takeaway, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-blue-800">{takeaway}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Table of Contents */}
                {tableOfContents.length >= 2 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Spis treści</h2>
                    <nav>
                      <ul className="space-y-2">
                        {tableOfContents.map((heading, index) => (
                          <li key={index} style={{ marginLeft: `${(heading.level - 2) * 1}rem` }}>
                            <a 
                              href={`#${heading.id}`}
                              className="text-orange-500 hover:text-orange-700 hover:underline flex items-center"
                            >
                              <ChevronRight className="h-4 w-4 mr-1" />
                              <span>{heading.text}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}
                
                {/* Article content */}
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={MarkdownComponents}
                  >
                    {processedContent}
                  </ReactMarkdown>
                </div>
                
                {/* FAQ Section */}
                {post.faqs && post.faqs.length > 0 && (
                  <div className="mt-12 mb-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <HelpCircle className="h-6 w-6 text-orange-500" />
                      <h2 className="text-2xl font-bold text-gray-900">Najczęściej zadawane pytania</h2>
                    </div>
                    <div className="space-y-4">
                      {post.faqs.map((faq: any, index: number) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                              <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                              <span className="transition group-open:rotate-180">
                                <ChevronRight className="h-5 w-5 text-orange-500" />
                              </span>
                            </summary>
                            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                              <p className="text-gray-700">{faq.answer}</p>
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* CTA Buttons */}
                {post.ctas && post.ctas.length > 0 && (
                  <div className="my-10 flex flex-col sm:flex-row gap-4 justify-center">
                    {post.ctas.map((cta: any, index: number) => {
                      const colorClasses: Record<string, string> = {
                        orange: 'bg-orange-500 hover:bg-orange-600 text-white',
                        blue: 'bg-blue-500 hover:bg-blue-600 text-white',
                        green: 'bg-green-500 hover:bg-green-600 text-white',
                        red: 'bg-red-500 hover:bg-red-600 text-white',
                        gray: 'bg-gray-500 hover:bg-gray-600 text-white',
                      };
                      
                      const buttonClass = colorClasses[cta.color] || colorClasses.orange;
                      
                      return (
                        <a 
                          key={index}
                          href={cta.url}
                          className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors ${buttonClass}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {cta.title}
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </a>
                      );
                    })}
                  </div>
                )}
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700 font-medium">Tagi:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags.map((tag, index) => (
                        <Link
                          key={index}
                          to={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
          
          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <section className="py-16 bg-gray-50">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Podobne artykuły
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
                    >
                      {relatedPost.image_url && (
                        <img
                          src={relatedPost.image_url}
                          alt={relatedPost.title}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-5 flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                      <div className="px-5 pb-5 pt-2 border-t border-gray-100 text-sm text-gray-500 flex justify-between">
                        <span>{formatDate(relatedPost.created_at)}</span>
                        <span className="text-orange-500">Czytaj więcej</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Comment/Contact CTA */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
                <MessageCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Masz pytania dotyczące tego artykułu?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Skontaktuj się z nami, aby uzyskać więcej informacji lub omówić, jak możemy pomóc Twojemu biznesowi.
                </p>
                <Link
                  to="/kontakt"
                  className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  <span>Skontaktuj się z nami</span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
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
    </HelmetProvider>
  )
}

export default BlogPostPage