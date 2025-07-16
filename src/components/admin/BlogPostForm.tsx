import { useState, useEffect } from 'react'
import { X, Save, Eye, Calendar, AlertCircle } from 'lucide-react'
import { supabase, BlogPost, Source } from '../../lib/supabase'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FormValidator } from './FormValidation'
import FileUpload from './FileUpload'
import MarkdownEditor from './MarkdownEditor'
import SourceForm from './SourceForm'
import DownloadMaterialForm from './DownloadMaterialForm'

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
  categories: string[]
  tldr_summary: string
  tldr_takeaways: string[]
  faqs: Array<{ question: string; answer: string }>
  ctas: Array<{ title: string; url: string; color: string }>
  sources: Source[]
  download_materials: Array<{
    id: string
    title: string
    description: string
    file_url: string
    file_size: string
    file_type: string
    button_color: string
    button_size: string
    download_count: number
  }>
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
    categories: [],
    tldr_summary: '',
    tldr_takeaways: [],
    faqs: [],
    ctas: [],
    sources: [],
    download_materials: []
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [sources, setSources] = useState<any[]>([])
  const [takeawayInput, setTakeawayInput] = useState('')
  const [publishDate, setPublishDate] = useState<Date | null>(new Date())
  const [activeTab, setActiveTab] = useState('content')
  const [citationStyle, setCitationStyle] = useState('apa')
  const [faqInput, setFaqInput] = useState({ question: '', answer: '' })
  const [ctaInput, setCtaInput] = useState({ title: '', url: '', color: 'orange' })
  const [categoryInput, setCategoryInput] = useState('')

  // Predefiniowane tagi
  const availableTags = [
    'Web Development', 'SEO', 'Marketing', 'Design', 'E-commerce', 
    'WordPress', 'React', 'JavaScript', 'CSS', 'HTML', 'Performance',
    'Accessibility', 'UX/UI', 'Mobile', 'Analytics'
  ]

  // Predefiniowane kategorie
  const availableCategories = [
    'Tworzenie stron', 'Sklepy internetowe', 'Platformy', 'SEO', 
    'Marketing', 'Porady', 'Technologia', 'Biznes', 'Case Study'
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
        categories: post.categories || [],
        tldr_summary: post.tldr_summary || '',
        tldr_takeaways: post.tldr_takeaways || [],
        faqs: post.faqs || [],
        ctas: post.ctas || [],
        sources: (post.sources || []).map((s: any) => typeof s === 'string' ? { title: s, url: '', author: '', year: '' } : s),
        download_materials: (post.download_materials || []).map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          file_url: m.file_url,
          file_size: m.file_size || '',
          file_type: m.file_type,
          button_color: m.button_color,
          button_size: m.button_size,
          download_count: m.download_count
        }))
      })
      setSources(Array.isArray(post.sources) ? post.sources : [])
      setCitationStyle(post.source_citation_style || 'apa')
      setPublishDate(post.created_at ? new Date(post.created_at) : new Date())
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
        categories: [],
        tldr_summary: '',
        tldr_takeaways: [],
        faqs: [],
        ctas: [],
        sources: [],
        download_materials: []
      })
      setSources([])
      setCitationStyle('apa')
      setPublishDate(new Date())
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
    
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `blog/${fileName}`
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) throw uploadError
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath)
      
      setFormData(prev => ({ ...prev, image_url: publicUrl }))
    } catch (error) {
      console.error('Error uploading file:', error)
      setErrors(prev => ({ ...prev, image_url: 'Błąd podczas przesyłania pliku' }))
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
    if (faqInput.question && faqInput.answer) {
      setFormData(prev => ({
        ...prev,
        faqs: [...prev.faqs, { ...faqInput }]
      }))
      setFaqInput({ question: '', answer: '' })
    }
  }

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }))
  }

  const addCta = () => {
    if (ctaInput.title && ctaInput.url) {
      setFormData(prev => ({
        ...prev,
        ctas: [...prev.ctas, { ...ctaInput }]
      }))
      setCtaInput({ title: '', url: '', color: 'orange' })
    }
  }

  const removeCta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ctas: prev.ctas.filter((_, i) => i !== index)
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
        sources: sources,
        source_citation_style: citationStyle,
        created_at: publishDate?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      if (post) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id)
          .select()

        if (error) throw error
        onSave({
          ...post,
          ...postData,
          sources: (postData.sources || []).map((s: any) => typeof s === 'string' ? s : s.title)
        })
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()

        if (error) throw error
      }

      onClose()
    } catch (error) {
      console.error('Error saving post:', error)
      setErrors({ title: 'Błąd podczas zapisywania artykułu' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }

  const handleDownloadMaterialsChange = (materials: any[]) => {
    setFormData(prev => ({ ...prev, download_materials: materials }))
  }

  const handleSourcesChange = (sources: Source[]) => {
    setFormData(prev => ({ ...prev, sources }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
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

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'content' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('content')}
            >
              Treść
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'seo' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('seo')}
            >
              SEO i Metadata
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'tldr' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('tldr')}
            >
              TL;DR i FAQ
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'downloads' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('downloads')}
            >
              Materiały do pobrania
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'sources' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('sources')}
            >
              Źródła
            </button>
          </div>

          {/* Content */}
          <div className="flex h-[calc(90vh-200px)]">
            {/* Form */}
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} overflow-y-auto p-6`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'content' && (
                  <>
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
                          initialValue={formData.content}
                          onChange={handleContentChange}
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

                        {errors.image_url && (
                          <span className="text-red-500 text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.image_url}
                          </span>
                        )}
                      </div>
                    </div>

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
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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
                  </>
                )}

                {activeTab === 'seo' && (
                  <>
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

                    {/* Excerpt */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Excerpt (streszczenie)
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
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            Dodaj
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
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Dodaj
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
                  </>
                )}

                {activeTab === 'tldr' && (
                  <>
                    {/* TL;DR Summary */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        TL;DR - Krótkie podsumowanie
                      </label>
                      <textarea
                        value={formData.tldr_summary}
                        onChange={(e) => setFormData(prev => ({ ...prev, tldr_summary: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                        rows={3}
                        placeholder="Krótkie podsumowanie artykułu dla osób, które chcą szybko przeczytać najważniejsze informacje"
                        maxLength={300}
                      />
                      <span className="text-gray-500 text-sm">
                        {formData.tldr_summary.length}/300
                      </span>
                    </div>

                    {/* TL;DR Takeaways */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        TL;DR - Kluczowe wnioski
                      </label>
                      <div className="space-y-3">
                        {/* Selected takeaways */}
                        {formData.tldr_takeaways.length > 0 && (
                          <div className="space-y-2">
                            {formData.tldr_takeaways.map((takeaway, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                              >
                                <span className="text-gray-700">{takeaway}</span>
                                <button
                                  type="button"
                                  onClick={() => removeTakeaway(takeaway)}
                                  className="text-red-500 hover:text-red-700"
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
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Dodaj
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* FAQs */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        FAQ - Najczęściej zadawane pytania
                      </label>
                      <div className="space-y-4">
                        {/* Existing FAQs */}
                        {formData.faqs.length > 0 && (
                          <div className="space-y-3">
                            {formData.faqs.map((faq, index) => (
                              <div
                                key={index}
                                className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                                  <button
                                    type="button"
                                    onClick={() => removeFaq(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="text-gray-600 text-sm">{faq.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add new FAQ */}
                        <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pytanie
                            </label>
                            <input
                              type="text"
                              value={faqInput.question}
                              onChange={(e) => setFaqInput(prev => ({ ...prev, question: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                              placeholder="Wpisz pytanie..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Odpowiedź
                            </label>
                            <textarea
                              value={faqInput.answer}
                              onChange={(e) => setFaqInput(prev => ({ ...prev, answer: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 resize-none"
                              rows={3}
                              placeholder="Wpisz odpowiedź..."
                            />
                          </div>
                          <button
                            type="button"
                            onClick={addFaq}
                            disabled={!faqInput.question || !faqInput.answer}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Dodaj FAQ
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Przyciski CTA
                      </label>
                      <div className="space-y-4">
                        {/* Existing CTAs */}
                        {formData.ctas.length > 0 && (
                          <div className="space-y-3">
                            {formData.ctas.map((cta, index) => (
                              <div
                                key={index}
                                className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-gray-900">{cta.title}</h4>
                                  <button
                                    type="button"
                                    onClick={() => removeCta(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{cta.url}</p>
                                <div 
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    cta.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                    cta.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                    cta.color === 'green' ? 'bg-green-100 text-green-700' :
                                    cta.color === 'red' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {cta.color}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add new CTA */}
                        <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tekst przycisku
                            </label>
                            <input
                              type="text"
                              value={ctaInput.title}
                              onChange={(e) => setCtaInput(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                              placeholder="np. Umów konsultację"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              URL
                            </label>
                            <input
                              type="text"
                              value={ctaInput.url}
                              onChange={(e) => setCtaInput(prev => ({ ...prev, url: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                              placeholder="https://example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Kolor
                            </label>
                            <select
                              value={ctaInput.color}
                              onChange={(e) => setCtaInput(prev => ({ ...prev, color: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                            >
                              <option value="orange">Pomarańczowy</option>
                              <option value="blue">Niebieski</option>
                              <option value="green">Zielony</option>
                              <option value="red">Czerwony</option>
                              <option value="gray">Szary</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={addCta}
                            disabled={!ctaInput.title || !ctaInput.url}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Dodaj CTA
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'downloads' && (
                  <DownloadMaterialForm
                    materials={formData.download_materials}
                    onChange={handleDownloadMaterialsChange}
                  />
                )}

                {activeTab === 'sources' && (
                  <SourceForm
                    sources={formData.sources}
                    onChange={handleSourcesChange}
                    citationStyle={citationStyle}
                    onCitationStyleChange={setCitationStyle}
                  />
                )}
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
                  
                  {/* TL;DR Section */}
                  {(formData.tldr_summary || formData.tldr_takeaways.length > 0) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                      <h2 className="text-xl font-bold text-blue-900 mb-3">TL;DR - W skrócie</h2>
                      {formData.tldr_summary && (
                        <p className="text-blue-800 mb-4">{formData.tldr_summary}</p>
                      )}
                      {formData.tldr_takeaways.length > 0 && (
                        <div className="space-y-2">
                          {formData.tldr_takeaways.map((takeaway, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <span className="text-green-500">✓</span>
                              <span className="text-blue-800">{takeaway}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: formData.content || 'Treść artykułu...' }} />
                  </div>
                  
                  {/* FAQs */}
                  {formData.faqs.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Najczęściej zadawane pytania</h2>
                      <div className="space-y-4">
                        {formData.faqs.map((faq, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* CTAs */}
                  {formData.ctas.length > 0 && (
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                      {formData.ctas.map((cta, index) => (
                        <button
                          key={index}
                          className={`px-6 py-3 rounded-lg font-semibold ${
                            cta.color === 'orange' ? 'bg-orange-500 text-white' :
                            cta.color === 'blue' ? 'bg-blue-500 text-white' :
                            cta.color === 'green' ? 'bg-green-500 text-white' :
                            cta.color === 'red' ? 'bg-red-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}
                        >
                          {cta.title}
                        </button>
                      ))}
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