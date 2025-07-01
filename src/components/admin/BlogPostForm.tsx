import { useState, useEffect, useRef } from 'react'
import { X, Save, Eye, Tag, AlertCircle, Plus, Minus, Globe } from 'lucide-react'
import { supabase, BlogPost } from '../../lib/supabase'
import MarkdownEditor from './MarkdownEditor'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FormValidator } from './FormValidation'
import FileUpload from './FileUpload'

interface BlogPostFormProps {
  post?: BlogPost | null
  isOpen: boolean
  onClose: () => void
  onSave: (post: BlogPost) => void
}

interface FormData {
  title: string
  content: string
  excerpt: string
  image_url: string
  published: boolean
  tags: string[]
  author: string
  meta_description: string
  slug: string
  tldr_summary: string
  tldr_takeaways: string[]
  categories: string[]
  faqs: Array<{ question: string; answer: string }>
  ctas: Array<{ title: string; url: string; color: string }>
  sources: string[]
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
    content: '',
    excerpt: '',
    image_url: '',
    published: false,
    tags: [],
    author: 'Marcin Kowalski',
    meta_description: '',
    slug: '',
    tldr_summary: '',
    tldr_takeaways: [],
    categories: [],
    faqs: [{ question: '', answer: '' }],
    ctas: [{ title: '', url: '', color: 'orange' }],
    sources: []
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [tagInput, setTagInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [takeawayInput, setTakeawayInput] = useState('')
  const [sourceInput, setSourceInput] = useState('')
  const [publishDate, setPublishDate] = useState<Date | null>(new Date())
  const [showFaqs, setShowFaqs] = useState(false)
  const [showCtas, setShowCtas] = useState(false)
  const [showTldr, setShowTldr] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const editorRef = useRef<any>(null)

  // Predefiniowane tagi
  const availableTags = [
    'Web Development', 'SEO', 'Marketing', 'Design', 'E-commerce', 
    'WordPress', 'React', 'JavaScript', 'CSS', 'HTML', 'Performance',
    'Accessibility', 'UX/UI', 'Mobile', 'Analytics'
  ]

  // Predefiniowane kategorie
  const availableCategories = [
    'Tworzenie stron', 'Pozycjonowanie', 'Marketing', 'E-commerce', 
    'Technologia', 'Porady', 'Case Study', 'Tutoriale'
  ]

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        image_url: post.image_url || '',
        published: post.published || false,
        tags: post.tags || [],
        author: post.author || 'Marcin Kowalski',
        meta_description: post.meta_description || '',
        slug: post.slug || '',
        tldr_summary: post.tldr_summary || '',
        tldr_takeaways: post.tldr_takeaways || [],
        categories: post.categories || [],
        faqs: post.faqs && post.faqs.length > 0 ? post.faqs : [{ question: '', answer: '' }],
        ctas: post.ctas && post.ctas.length > 0 ? post.ctas : [{ title: '', url: '', color: 'orange' }],
        sources: post.sources || []
      })
      setPublishDate(post.created_at ? new Date(post.created_at) : new Date())
      setShowTldr(!!post.tldr_summary || (post.tldr_takeaways && post.tldr_takeaways.length > 0))
      setShowFaqs(post.faqs && post.faqs.length > 0)
      setShowCtas(post.ctas && post.ctas.length > 0)
      setShowSources(post.sources && post.sources.length > 0)
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        image_url: '',
        published: false,
        tags: [],
        author: 'Marcin Kowalski',
        meta_description: '',
        slug: '',
        tldr_summary: '',
        tldr_takeaways: [],
        categories: [],
        faqs: [{ question: '', answer: '' }],
        ctas: [{ title: '', url: '', color: 'orange' }],
        sources: []
      })
      setPublishDate(new Date())
      setShowTldr(false)
      setShowFaqs(false)
      setShowCtas(false)
      setShowSources(false)
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

      // In real implementation, upload to storage service
      // For now, create a local URL
      const imageUrl = URL.createObjectURL(file)
      
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
    if (takeaway) {
      setFormData(prev => ({
        ...prev,
        tldr_takeaways: [...prev.tldr_takeaways, takeaway]
      }))
    }
    setTakeawayInput('')
  }

  const removeTakeaway = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tldr_takeaways: prev.tldr_takeaways.filter((_, i) => i !== index)
    }))
  }

  const addSource = (url: string) => {
    if (url && !formData.sources.includes(url)) {
      setFormData(prev => ({
        ...prev,
        sources: [...prev.sources, url]
      }))
    }
    setSourceInput('')
  }

  const removeSource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index)
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
      const postData = {
        ...formData,
        excerpt: formData.excerpt || FormValidator.generateExcerpt(formData.content),
        meta_description: formData.meta_description || FormValidator.generateMetaDescription(formData.content),
        created_at: publishDate?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        faqs: showFaqs ? formData.faqs.filter(faq => faq.question && faq.answer) : [],
        ctas: showCtas ? formData.ctas.filter(cta => cta.title && cta.url) : [],
        tldr_summary: showTldr ? formData.tldr_summary : '',
        tldr_takeaways: showTldr ? formData.tldr_takeaways : [],
        sources: showSources ? formData.sources : []
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
          .insert([postData])
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
          <div className="flex h-[calc(90vh-140px)]">
            {/* Form */}
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} overflow-y-auto p-6`}>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Treść artykułu *
                  </label>
                  <div className={`${errors.content ? 'border border-red-500 rounded-lg' : ''}`}>
                    <MarkdownEditor
                      ref={editorRef}
                      initialValue={formData.content}
                      onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                      placeholder="Napisz treść artykułu..."
                      height="400px"
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
                        <Tag className="h-4 w-4" />
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
                        .slice(0, 8)
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
                    rows={3}
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

                {/* TL;DR Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">TL;DR (W skrócie)</h3>
                    <button
                      type="button"
                      onClick={() => setShowTldr(!showTldr)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showTldr ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {showTldr && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Podsumowanie
                        </label>
                        <textarea
                          value={formData.tldr_summary}
                          onChange={(e) => setFormData(prev => ({ ...prev, tldr_summary: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                          rows={2}
                          placeholder="Krótkie podsumowanie artykułu (1-2 zdania)"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Kluczowe wnioski
                        </label>
                        
                        {/* Existing takeaways */}
                        {formData.tldr_takeaways.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {formData.tldr_takeaways.map((takeaway, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <span className="flex-1 p-2 bg-blue-50 rounded-lg text-sm">{takeaway}</span>
                                <button
                                  type="button"
                                  onClick={() => removeTakeaway(index)}
                                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
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
                            placeholder="Dodaj wniosek..."
                          />
                          <button
                            type="button"
                            onClick={() => addTakeaway(takeawayInput)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sources Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Źródła</h3>
                    <button
                      type="button"
                      onClick={() => setShowSources(!showSources)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showSources ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {showSources && (
                    <div className="space-y-4">
                      {/* Existing sources */}
                      {formData.sources.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {formData.sources.map((source, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="flex-1 p-2 bg-gray-50 rounded-lg text-sm flex items-center">
                                <Globe className="h-4 w-4 text-gray-500 mr-2" />
                                <a 
                                  href={source} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-orange-500 hover:text-orange-700 hover:underline truncate"
                                >
                                  {source}
                                </a>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSource(index)}
                                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add new source */}
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={sourceInput}
                          onChange={(e) => setSourceInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addSource(sourceInput)
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="https://example.com/article"
                        />
                        <button
                          type="button"
                          onClick={() => addSource(sourceInput)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-500 italic">
                        Dodaj linki do źródeł, które zostały wykorzystane w artykule. W treści możesz odwoływać się do źródeł używając [1], [2], itd.
                      </div>
                    </div>
                  )}
                </div>

                {/* FAQs Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">FAQ</h3>
                    <button
                      type="button"
                      onClick={() => setShowFaqs(!showFaqs)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showFaqs ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {showFaqs && (
                    <div className="space-y-4">
                      {formData.faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-900">FAQ #{index + 1}</h4>
                            {formData.faqs.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFaq(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pytanie
                              </label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                rows={3}
                                placeholder="Wpisz odpowiedź..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addFaq}
                        className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  )}
                </div>

                {/* CTAs Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Przyciski CTA</h3>
                    <button
                      type="button"
                      onClick={() => setShowCtas(!showCtas)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showCtas ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {showCtas && (
                    <div className="space-y-4">
                      {formData.ctas.map((cta, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-900">CTA #{index + 1}</h4>
                            {formData.ctas.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeCta(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tekst przycisku
                              </label>
                              <input
                                type="text"
                                value={cta.title}
                                onChange={(e) => updateCta(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="https://example.com"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kolor
                              </label>
                              <select
                                value={cta.color}
                                onChange={(e) => updateCta(index, 'color', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              >
                                <option value="orange">Pomarańczowy</option>
                                <option value="blue">Niebieski</option>
                                <option value="green">Zielony</option>
                                <option value="red">Czerwony</option>
                                <option value="gray">Szary</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addCta}
                        className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Publish Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Data publikacji
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={publishDate}
                        onChange={(date: Date) => setPublishDate(date)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        dateFormat="dd/MM/yyyy"
                        showYearDropdown
                        dropdownMode="select"
                      />
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
              </form>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="w-1/2 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Podgląd artykułu</h3>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Miniatura"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{formData.title || 'Tytuł artykułu'}</h1>
                  <p className="text-gray-600 mb-4">{formData.excerpt || 'Excerpt artykułu...'}</p>
                  
                  {/* TLDR Preview */}
                  {showTldr && (formData.tldr_summary || formData.tldr_takeaways.length > 0) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                      <h2 className="text-lg font-bold text-blue-900 mb-2">TL;DR - W skrócie</h2>
                      {formData.tldr_summary && (
                        <p className="text-blue-800 mb-2">{formData.tldr_summary}</p>
                      )}
                      {formData.tldr_takeaways.length > 0 && (
                        <ul className="space-y-1">
                          {formData.tldr_takeaways.map((takeaway, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-blue-800">{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  
                  <div className="prose max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    >
                      {formData.content || 'Treść artykułu...'}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Sources Preview */}
                  {showSources && formData.sources.length > 0 && (
                    <div className="mt-8 pt-4 border-t border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-3">Źródła</h2>
                      <ul className="space-y-2">
                        {formData.sources.map((source, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-gray-500">[{idx + 1}]</span>
                            <a 
                              href={source} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-orange-500 hover:text-orange-700 hover:underline flex items-center"
                            >
                              <span>{source}</span>
                              <ExternalLink className="h-4 w-4 ml-1 inline-block" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* FAQs Preview */}
                  {showFaqs && formData.faqs.some(faq => faq.question && faq.answer) && (
                    <div className="mt-8 pt-4 border-t border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900 mb-3">Najczęściej zadawane pytania</h2>
                      <div className="space-y-3">
                        {formData.faqs
                          .filter(faq => faq.question && faq.answer)
                          .map((faq, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                              <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                              <p className="text-gray-700">{faq.answer}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* CTAs Preview */}
                  {showCtas && formData.ctas.some(cta => cta.title && cta.url) && (
                    <div className="mt-8 flex flex-wrap gap-3 justify-center">
                      {formData.ctas
                        .filter(cta => cta.title && cta.url)
                        .map((cta, idx) => {
                          const colorClasses: Record<string, string> = {
                            orange: 'bg-orange-500 hover:bg-orange-600 text-white',
                            blue: 'bg-blue-500 hover:bg-blue-600 text-white',
                            green: 'bg-green-500 hover:bg-green-600 text-white',
                            red: 'bg-red-500 hover:bg-red-600 text-white',
                            gray: 'bg-gray-500 hover:bg-gray-600 text-white',
                          };
                          
                          return (
                            <a 
                              key={idx}
                              href={cta.url}
                              className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${colorClasses[cta.color] || colorClasses.orange}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {cta.title}
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </a>
                          );
                        })}
                    </div>
                  )}
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
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
                </div>
              </div>
            )}
          </div>

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