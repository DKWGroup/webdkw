import { AlertCircle, Eye, Save, Tag, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { BlogPost, supabase } from '../../lib/supabase'
import FileUpload from './FileUpload'
import { FormValidator } from './FormValidation'

interface ArticleFormProps {
  article?: BlogPost | null
  isOpen: boolean
  onClose: () => void
  onSave: (article: BlogPost) => void
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
}

interface FormErrors {
  title?: string
  content?: string
  image_url?: string
  meta_description?: string
  slug?: string
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: false,
    tags: [],
    author: 'Marcin Kowalski',
    meta_description: '',
    slug: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [tagInput, setTagInput] = useState('')
  const [publishDate, setPublishDate] = useState<Date | null>(new Date())
  const quillRef = useRef<ReactQuill>(null)

  // Predefiniowane tagi
  const availableTags = [
    'Web Development', 'SEO', 'Marketing', 'Design', 'E-commerce', 
    'WordPress', 'React', 'JavaScript', 'CSS', 'HTML', 'Performance',
    'Accessibility', 'UX/UI', 'Mobile', 'Analytics'
  ]

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ]

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        image_url: article.image_url || '',
        published: article.published || false,
        tags: article.tags || [],
        author: article.author || 'Marcin Kowalski',
        meta_description: article.meta_description || '',
        slug: article.slug || ''
      })
      setPublishDate(article.created_at ? new Date(article.created_at) : new Date())
    } else {
      // Reset form for new article
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        image_url: '',
        published: false,
        tags: [],
        author: 'Marcin Kowalski',
        meta_description: '',
        slug: ''
      })
      setPublishDate(new Date())
    }
    setErrors({})
    setShowPreview(false)
    setImageFile(null)
  }, [article, isOpen])

  // Auto-generate slug from title (only once when title changes and not editing)
  useEffect(() => {
    if (formData.title && !article && !formData.slug) {
      const slug = FormValidator.generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, article])

  // Auto-generate meta description from content (debounced)
  useEffect(() => {
    if (formData.content && !formData.meta_description && !article) {
      const timer = setTimeout(() => {
        const metaDesc = FormValidator.generateMetaDescription(formData.content)
        setFormData(prev => ({ ...prev, meta_description: metaDesc }))
      }, 1000) // 1 second delay
      
      return () => clearTimeout(timer)
    }
  }, [formData.content, article])

  // Auto-generate excerpt from content (debounced)
  useEffect(() => {
    if (formData.content && !formData.excerpt && !article) {
      const timer = setTimeout(() => {
        const excerpt = FormValidator.generateExcerpt(formData.content)
        setFormData(prev => ({ ...prev, excerpt }))
      }, 1000) // 1 second delay
      
      return () => clearTimeout(timer)
    }
  }, [formData.content, article])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const articleData = {
        ...formData,
        excerpt: formData.excerpt || FormValidator.generateExcerpt(formData.content),
        meta_description: formData.meta_description || FormValidator.generateMetaDescription(formData.content),
        created_at: publishDate?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      if (article) {
        // Update existing article
        const { data, error } = await supabase
          .from('blog_posts')
          .update(articleData)
          .eq('id', article.id)
          .select()
          .single()

        if (error) throw error
        onSave(data)
      } else {
        // Create new article
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([articleData])
          .select()
          .single()

        if (error) throw error
        onSave(data)
      }

      onClose()
    } catch (error) {
      console.error('Error saving article:', error)
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
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {article ? 'Edytuj artykuł' : 'Nowy artykuł'}
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
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={formData.content}
                      onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                      modules={modules}
                      formats={formats}
                      placeholder="Napisz treść artykułu..."
                      className="h-64"
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
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: formData.content || 'Treść artykułu...' }} />
                  </div>
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
                    <span>{article ? 'Zaktualizuj' : 'Zapisz'} artykuł</span>
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

export default ArticleForm