import React, { useState, useEffect } from 'react'
import { X, Save, Eye, Trash2, Plus, AlertCircle } from 'lucide-react'
import { supabase, BlogPost } from '../../lib/supabase'
import { FormValidator } from './FormValidation'
import FileUpload from './FileUpload'
import MarkdownEditor from './MarkdownEditor'
import Select from 'react-select'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

interface BlogPostFormProps {
  post?: BlogPost | null
  isOpen: boolean
  onClose: () => void
  onSave: (post: BlogPost) => void
}

interface FormData {
  title: string
  slug: string
  content: string
  excerpt: string
  image_url: string
  published: boolean
  tags: string[]
  categories: string[]
  author: string
  meta_description: string
  tldr_summary: string
  tldr_takeaways: string[]
  faqs: Array<{ question: string; answer: string }>
  ctas: Array<{ title: string; url: string; color: string }>
}

interface FormErrors {
  title?: string
  content?: string
  image_url?: string
  meta_description?: string
  slug?: string
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ post, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: false,
    tags: [],
    categories: [],
    author: 'Marcin Kowalski',
    meta_description: '',
    tldr_summary: '',
    tldr_takeaways: [],
    faqs: [{ question: '', answer: '' }],
    ctas: []
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [tagInput, setTagInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [takeawayInput, setTakeawayInput] = useState('')

  // Predefiniowane tagi i kategorie
  const availableTags = [
    'Web Development', 'SEO', 'Marketing', 'Design', 'E-commerce', 
    'WordPress', 'React', 'JavaScript', 'CSS', 'HTML', 'Performance',
    'Accessibility', 'UX/UI', 'Mobile', 'Analytics'
  ]
  
  const availableCategories = [
    'Poradniki', 'Tutoriale', 'Case Studies', 'Aktualności', 'Trendy',
    'Technologia', 'Marketing', 'Biznes', 'Design', 'Rozwój'
  ]
  
  // Kolory dla CTA
  const ctaColors = [
    { value: 'orange', label: 'Pomarańczowy' },
    { value: 'blue', label: 'Niebieski' },
    { value: 'green', label: 'Zielony' },
    { value: 'red', label: 'Czerwony' },
    { value: 'gray', label: 'Szary' }
  ]

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        image_url: post.image_url || '',
        published: post.published || false,
        tags: post.tags || [],
        categories: post.categories || [],
        author: post.author || 'Marcin Kowalski',
        meta_description: post.meta_description || '',
        tldr_summary: post.tldr_summary || '',
        tldr_takeaways: post.tldr_takeaways || [],
        faqs: post.faqs && post.faqs.length > 0 ? post.faqs : [{ question: '', answer: '' }],
        ctas: post.ctas || []
      })
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        image_url: '',
        published: false,
        tags: [],
        categories: [],
        author: 'Marcin Kowalski',
        meta_description: '',
        tldr_summary: '',
        tldr_takeaways: [],
        faqs: [{ question: '', answer: '' }],
        ctas: []
      })
    }
    setErrors({})
    setShowPreview(false)
    setImageFile(null)
  }, [post, isOpen])

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !post) {
      const slug = FormValidator.generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, post])

  // Auto-generate meta description from content
  useEffect(() => {
    if (formData.content && !formData.meta_description) {
      const metaDesc = FormValidator.generateMetaDescription(formData.content)
      setFormData(prev => ({ ...prev, meta_description: metaDesc }))
    }
  }, [formData.content])

  // Auto-generate excerpt from content
  useEffect(() => {
    if (formData.content && !formData.excerpt) {
      const excerpt = FormValidator.generateExcerpt(formData.content)
      setFormData(prev => ({ ...prev, excerpt }))
    }
  }, [formData.content])

  const validateForm = (): boolean => {
    const validator = new FormValidator({
      title: FormValidator.commonRules.title,
      content: FormValidator.commonRules.content,
      slug: FormValidator.commonRules.slug,
      meta_description: FormValidator.commonRules.metaDescription
    })

    const newErrors = validator.validate(formData)
    
    // Image validation
    if (!formData.image_url && !imageFile) {
      newErrors.image_url = 'Miniatura jest wymagana'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUpload = async (files: File[]) => {
    if (!files.length) return
    const file = files[0] // Take only the first file

    setImageFile(file)
    setUploadProgress(0)
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file)
      
      // In a real implementation, you would upload to Supabase Storage
      // For example:
      // const { data, error } = await supabase.storage
      //   .from('blog-images')
      //   .upload(`${Date.now()}-${file.name}`, file)
      
      // if (error) throw error
      // const imageUrl = supabase.storage.from('blog-images').getPublicUrl(data.path).publicURL

      setFormData(prev => ({ ...prev, image_url: imageUrl }))
      setUploadProgress(100)
      
      setTimeout(() => setUploadProgress(0), 1000)
    } catch (error) {
      setErrors(prev => ({ ...prev, image_url: 'Błąd podczas przesyłania pliku' }))
      setUploadProgress(0)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
    setTagInput('')
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }
  
  const addCategory = (category: string) => {
    if (category && !formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }))
    }
    setCategoryInput('')
  }

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category !== categoryToRemove)
    }))
  }
  
  const addTakeaway = (takeaway: string) => {
    if (takeaway && !formData.tldr_takeaways.includes(takeaway)) {
      setFormData(prev => ({
        ...prev,
        tldr_takeaways: [...prev.tldr_takeaways, takeaway]
      }))
    }
    setTakeawayInput('')
  }

  const removeTakeaway = (takeawayToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tldr_takeaways: prev.tldr_takeaways.filter(takeaway => takeaway !== takeawayToRemove)
    }))
  }
  
  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }))
  }
  
  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }))
  }
  
  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }))
  }
  
  const addCta = () => {
    setFormData(prev => ({
      ...prev,
      ctas: [...prev.ctas, { title: '', url: '', color: 'orange' }]
    }))
  }
  
  const removeCta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ctas: prev.ctas.filter((_, i) => i !== index)
    }))
  }
  
  const updateCta = (index: number, field: 'title' | 'url' | 'color', value: string) => {
    setFormData(prev => ({
      ...prev,
      ctas: prev.ctas.map((cta, i) => 
        i === index ? { ...cta, [field]: value } : cta
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Filter out empty FAQs
      const filteredFaqs = formData.faqs.filter(faq => faq.question.trim() && faq.answer.trim())
      
      // Filter out empty CTAs
      const filteredCtas = formData.ctas.filter(cta => cta.title.trim() && cta.url.trim())
      
      const postData = {
        ...formData,
        excerpt: formData.excerpt || FormValidator.generateExcerpt(formData.content),
        meta_description: formData.meta_description || FormValidator.generateMetaDescription(formData.content),
        faqs: filteredFaqs,
        ctas: filteredCtas,
        updated_at: new Date().toISOString()
      }

      if (post) {
        // Update existing post
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id)
          .select()
          .single()

        if (error) throw error
        onSave(data)
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([{
            ...postData,
            created_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (error) throw error
        onSave(data)
      }

      onClose()
    } catch (error) {
      console.error('Error saving post:', error)
      setErrors({ title: 'Błąd podczas zapisywania artykułu' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Custom components for markdown rendering in preview
  const components = {
    // Custom code block with syntax highlighting
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="rounded-lg my-4 overflow-hidden">
          <pre className={`language-${match[1]} p-4 bg-gray-800 text-white overflow-auto`}>
            <code {...props}>
              {String(children).replace(/\n$/, '')}
            </code>
          </pre>
        </div>
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
          
          const title = params.get('title') || 'Click Here';
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
            <div className="my-6 text-center">
              <a 
                href={url}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${buttonClass}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
            </div>
          );
        } catch (error) {
          console.error('Error parsing CTA:', error);
          return <p {...props}>{children}</p>;
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
    }
  };

  // Process markdown to add table of contents
  const processedMarkdown = (markdown: string) => {
    // Only add TOC if there are at least 2 h2 headings
    const h2Count = (markdown.match(/^## /gm) || []).length;
    
    if (h2Count >= 2) {
      // Find all h2 and h3 headings
      const headings: { level: number; text: string; id: string }[] = [];
      const lines = markdown.split('\n');
      
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
        const firstH2Index = markdown.indexOf('## ');
        if (firstH2Index !== -1) {
          return markdown.slice(0, firstH2Index) + toc + '\n\n' + markdown.slice(firstH2Index);
        }
      }
    }
    
    return markdown;
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {post ? 'Edytuj artykuł' : 'Nowy artykuł'}
            </h2>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Podgląd</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="h-[calc(90vh-140px)] overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Podstawowe informacje</h3>
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Tytuł artykułu *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Wprowadź tytuł artykułu..."
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.title && (
                      <span className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.title}
                      </span>
                    )}
                    <span className="text-gray-500 text-sm ml-auto">
                      {formData.title.length}/100
                    </span>
                  </div>
                </div>

                {/* URL Slug */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    URL Slug *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /blog/
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                        errors.slug ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="url-slug"
                    />
                  </div>
                  {errors.slug && (
                    <span className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.slug}
                    </span>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Miniatura artykułu *
                  </label>
                  <div className="space-y-4">
                    {formData.image_url && (
                      <div className="relative">
                        <img
                          src={formData.image_url}
                          alt="Miniatura"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    {!formData.image_url && (
                      <FileUpload
                        accept="image/*"
                        multiple={false}
                        maxSize={2 * 1024 * 1024} // 2MB
                        onFilesSelected={handleImageUpload}
                        onError={(error) => setErrors(prev => ({ ...prev, image_url: error }))}
                        preview={true}
                      />
                    )}

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}

                    {errors.image_url && (
                      <span className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.image_url}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Author */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                {/* Status */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Status publikacji
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="published"
                        checked={!formData.published}
                        onChange={() => setFormData(prev => ({ ...prev, published: false }))}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Szkic</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="published"
                        checked={formData.published}
                        onChange={() => setFormData(prev => ({ ...prev, published: true }))}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Opublikowany</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Treść artykułu</h3>
                
                {/* Markdown Editor */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Treść artykułu *
                  </label>
                  <div className={errors.content ? 'border border-red-500 rounded-lg' : ''}>
                    <MarkdownEditor
                      initialValue={formData.content}
                      onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                      height="400px"
                      placeholder="Napisz treść artykułu..."
                    />
                  </div>
                  {errors.content && (
                    <span className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.content}
                    </span>
                  )}
                </div>
                
                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Excerpt (opcjonalnie)
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Krótki opis artykułu (jeśli pusty, zostanie wygenerowany automatycznie)"
                    maxLength={300}
                  />
                  <span className="text-gray-500 text-sm">
                    {formData.excerpt.length}/300
                  </span>
                </div>
              </div>
              
              {/* TL;DR Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">TL;DR (W skrócie)</h3>
                
                {/* TLDR Summary */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Podsumowanie TL;DR
                  </label>
                  <textarea
                    value={formData.tldr_summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, tldr_summary: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    rows={2}
                    placeholder="Krótkie podsumowanie artykułu w 1-2 zdaniach"
                    maxLength={1000}
                  />
                  <span className="text-gray-500 text-sm">
                    {formData.tldr_summary.length}/1000
                  </span>
                </div>
                
                {/* TLDR Takeaways */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Kluczowe wnioski
                  </label>
                  <div className="space-y-3">
                    {/* Selected takeaways */}
                    {formData.tldr_takeaways.length > 0 && (
                      <div className="space-y-2">
                        {formData.tldr_takeaways.map((takeaway, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg">
                            <span className="flex-1 text-blue-800">{takeaway}</span>
                            <button
                              type="button"
                              onClick={() => removeTakeaway(takeaway)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new takeaway */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={takeawayInput}
                        onChange={(e) => setTakeawayInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTakeaway(takeawayInput)
                          }
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Dodaj kluczowy wniosek..."
                      />
                      <button
                        type="button"
                        onClick={() => addTakeaway(takeawayInput)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FAQ Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">Najczęściej zadawane pytania</h3>
                  <button
                    type="button"
                    onClick={addFaq}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Dodaj FAQ
                  </button>
                </div>
                
                {formData.faqs.map((faq, index) => (
                  <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900">FAQ #{index + 1}</h4>
                      {formData.faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pytanie
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Wpisz pytanie..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Odpowiedź
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        rows={3}
                        placeholder="Wpisz odpowiedź..."
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-bold text-gray-900">Przyciski CTA</h3>
                  <button
                    type="button"
                    onClick={addCta}
                    className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Dodaj CTA
                  </button>
                </div>
                
                {formData.ctas.map((cta, index) => (
                  <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900">CTA #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeCta(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tekst przycisku
                        </label>
                        <input
                          type="text"
                          value={cta.title}
                          onChange={(e) => updateCta(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="np. Dowiedz się więcej"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          value={cta.url}
                          onChange={(e) => updateCta(index, 'url', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kolor
                        </label>
                        <Select
                          options={ctaColors}
                          value={ctaColors.find(c => c.value === cta.color)}
                          onChange={(selected) => selected && updateCta(index, 'color', selected.value)}
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* SEO & Categorization Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">SEO i kategoryzacja</h3>
                
                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Meta opis (SEO)
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
                      errors.meta_description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows={2}
                    placeholder="Opis artykułu dla wyszukiwarek..."
                    maxLength={160}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.meta_description && (
                      <span className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.meta_description}
                      </span>
                    )}
                    <span className="text-gray-500 text-sm ml-auto">
                      {formData.meta_description.length}/160
                    </span>
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Tagi
                  </label>
                  <div className="space-y-3">
                    {/* Selected tags */}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-orange-500 hover:text-orange-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add new tag */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTag(tagInput)
                          }
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Dodaj tag..."
                      />
                      <button
                        type="button"
                        onClick={() => addTag(tagInput)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Suggested tags */}
                    <div className="flex flex-wrap gap-2">
                      {availableTags
                        .filter(tag => !formData.tags.includes(tag))
                        .slice(0, 8)
                        .map((tag, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => addTag(tag)}
                            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
                
                {/* Categories */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Kategorie
                  </label>
                  <div className="space-y-3">
                    {/* Selected categories */}
                    {formData.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.categories.map((category, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {category}
                            <button
                              type="button"
                              onClick={() => removeCategory(category)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add new category */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addCategory(categoryInput)
                          }
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Dodaj kategorię..."
                      />
                      <button
                        type="button"
                        onClick={() => addCategory(categoryInput)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Suggested categories */}
                    <div className="flex flex-wrap gap-2">
                      {availableCategories
                        .filter(category => !formData.categories.includes(category))
                        .slice(0, 6)
                        .map((category, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => addCategory(category)}
                            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            {category}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Podgląd artykułu</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="prose prose-lg max-w-none">
                    {/* Featured Image */}
                    {formData.image_url && (
                      <img
                        src={formData.image_url}
                        alt={formData.title}
                        className="w-full h-64 object-cover rounded-xl mb-6"
                      />
                    )}
                    
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title}</h1>
                    
                    {/* Author & Date */}
                    <div className="flex items-center text-sm text-gray-500 mb-6">
                      <span>By {formData.author} • {new Date().toLocaleDateString()}</span>
                    </div>
                    
                    {/* Tags */}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* TLDR Section */}
                    {(formData.tldr_summary || formData.tldr_takeaways.length > 0) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                        <h2 className="text-xl font-bold text-blue-900 mb-3">TL;DR - W skrócie</h2>
                        {formData.tldr_summary && (
                          <p className="text-blue-800 mb-4">{formData.tldr_summary}</p>
                        )}
                        {formData.tldr_takeaways.length > 0 && (
                          <div className="space-y-2">
                            {formData.tldr_takeaways.map((takeaway, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <span className="text-green-500 font-bold">✓</span>
                                <span className="text-blue-800">{takeaway}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Content */}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={components}
                    >
                      {processedMarkdown(formData.content)}
                    </ReactMarkdown>
                    
                    {/* FAQ Section */}
                    {formData.faqs.length > 0 && formData.faqs[0].question && (
                      <div className="mt-8 border-t border-gray-200 pt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Najczęściej zadawane pytania</h2>
                        <div className="space-y-4">
                          {formData.faqs.filter(faq => faq.question && faq.answer).map((faq, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                              <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                              <p className="text-gray-700">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* CTA Buttons */}
                    {formData.ctas.length > 0 && formData.ctas[0].title && (
                      <div className="mt-8 flex flex-wrap gap-4 justify-center">
                        {formData.ctas.filter(cta => cta.title && cta.url).map((cta, index) => {
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
                              className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${buttonClass}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {cta.title}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {formData.published ? 'Artykuł zostanie opublikowany' : 'Artykuł zostanie zapisany jako szkic'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Zapisywanie...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{post ? 'Zaktualizuj' : 'Zapisz'} artykuł</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPostForm