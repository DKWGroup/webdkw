import { useState, useEffect, useRef } from 'react'
import { X, Save, Eye, Calendar, Tag, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { supabase, Project } from '../../lib/supabase'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'
import { FormValidator } from './FormValidation'
import FileUpload from './FileUpload'

interface ProjectFormProps {
  project?: Project | null
  isOpen: boolean
  onClose: () => void
  onSave: (project: Project) => void
}

interface FormData {
  title: string
  slug: string
  category: string
  industry: string
  description: string
  image_url: string
  technologies: string[]
  results: Array<{ metric: string; value: string }>
  completion_date: string
  project_url: string
  featured: boolean
  case_study: boolean
}

interface FormErrors {
  title?: string
  description?: string
  image_url?: string
  category?: string
  industry?: string
  slug?: string
}

interface SelectOption {
  value: string
  label: string
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    category: '',
    industry: '',
    description: '',
    image_url: '',
    technologies: [],
    results: [{ metric: '', value: '' }],
    completion_date: '',
    project_url: '',
    featured: false,
    case_study: false
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [techInput, setTechInput] = useState('')
  const [completionDate, setCompletionDate] = useState<Date | null>(new Date())
  const quillRef = useRef<ReactQuill>(null)

  // Predefiniowane kategorie
  const categories: SelectOption[] = [
    { value: 'Strona firmowa', label: 'Strona firmowa' },
    { value: 'Landing page', label: 'Landing page' },
    { value: 'Sklep internetowy', label: 'Sklep internetowy' },
    { value: 'Platforma B2B', label: 'Platforma B2B' },
    { value: 'System rezerwacji', label: 'System rezerwacji' },
    { value: 'Platforma edukacyjna', label: 'Platforma edukacyjna' },
    { value: 'Aplikacja webowa', label: 'Aplikacja webowa' },
    { value: 'Portal internetowy', label: 'Portal internetowy' }
  ]

  // Predefiniowane technologie
  const availableTechnologies = [
    'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'Node.js',
    'WordPress', 'WooCommerce', 'Shopify', 'PHP', 'Laravel', 'Python',
    'HTML5', 'CSS3', 'Sass', 'Tailwind CSS', 'Bootstrap',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Supabase',
    'AWS', 'Vercel', 'Netlify', 'Docker', 'Git'
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
    if (project) {
      setFormData({
        title: project.title || '',
        slug: project.slug || '',
        category: project.category || '',
        industry: project.industry || '',
        description: project.description || '',
        image_url: project.image_url || '',
        technologies: project.technologies || [],
        results: Array.isArray(project.results) && project.results.length > 0 
          ? project.results 
          : [{ metric: '', value: '' }],
        completion_date: project.completion_date || '',
        project_url: project.project_url || '',
        featured: project.featured || false,
        case_study: project.case_study || false
      })
      setCompletionDate(project.completion_date ? new Date(project.completion_date) : new Date())
    } else {
      // Reset form for new project
      setFormData({
        title: '',
        slug: '',
        category: '',
        industry: '',
        description: '',
        image_url: '',
        technologies: [],
        results: [{ metric: '', value: '' }],
        completion_date: new Date().toISOString().split('T')[0],
        project_url: '',
        featured: false,
        case_study: false
      })
      setCompletionDate(new Date())
    }
    setErrors({})
    setShowPreview(false)
    setGalleryFiles([])
  }, [project, isOpen])

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !project) {
      const slug = FormValidator.generateSlug(formData.title)
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, project])

  const validateForm = (): boolean => {
    const validator = new FormValidator({
      title: FormValidator.commonRules.title,
      description: {
        required: true,
        minLength: 10
      },
      slug: FormValidator.commonRules.slug,
      category: {
        required: true
      },
      industry: {
        required: true
      }
    })

    const newErrors = validator.validate(formData)
    
    // Image validation
    if (!formData.image_url && galleryFiles.length === 0) {
      newErrors.image_url = 'Przynajmniej jedno zdjęcie jest wymagane'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUpload = async (files: File[]) => {
    if (!files.length) return

    if (galleryFiles.length + files.length > 10) {
      setErrors(prev => ({ ...prev, image_url: 'Maksymalnie 10 zdjęć' }))
      return
    }

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

      // Upload files to Supabase Storage
      const uploadedFiles: File[] = []
      const uploadedUrls: string[] = []
      
      for (const file of files) {
        try {
          // Generate a unique file name
          const fileExt = file.name.split('.').pop()
          const fileName = `project_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
          const filePath = `projects/${fileName}`
          
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
          
          uploadedFiles.push(file)
          uploadedUrls.push(publicUrl)
        } catch (error) {
          console.error('Error uploading file:', error)
        }
      }
      
      // Add uploaded files to gallery
      setGalleryFiles(prev => [...prev, ...uploadedFiles])
      
      // Set the first image as main image if none exists
      if (!formData.image_url && uploadedUrls.length > 0) {
        setFormData(prev => ({ ...prev, image_url: uploadedUrls[0] }))
      }
      
      setUploadProgress(100)
      
      setTimeout(() => setUploadProgress(0), 1000)
    } catch (error) {
      setErrors(prev => ({ ...prev, image_url: 'Błąd podczas przesyłania plików' }))
      setUploadProgress(0)
    }
  }

  const removeImage = (index: number) => {
    const newFiles = [...galleryFiles]
    newFiles.splice(index, 1)
    setGalleryFiles(newFiles)
    
    // If removing the main image, set the next one as main
    if (index === 0 && newFiles.length > 0) {
      setFormData(prev => ({ ...prev, image_url: URL.createObjectURL(newFiles[0]) }))
    } else if (newFiles.length === 0) {
      setFormData(prev => ({ ...prev, image_url: '' }))
    }
  }

  const addTechnology = (tech: string) => {
    if (tech && !formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }))
    }
    setTechInput('')
  }

  const removeTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }))
  }

  const addResult = () => {
    setFormData(prev => ({
      ...prev,
      results: [...prev.results, { metric: '', value: '' }]
    }))
  }

  const removeResult = (index: number) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
    }))
  }

  const updateResult = (index: number, field: 'metric' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.map((result, i) => 
        i === index ? { ...result, [field]: value } : result
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Strip HTML tags from description before saving
      const cleanDescription = formData.description.replace(/<[^>]*>/g, '')
      
      const projectData = {
        ...formData,
        description: cleanDescription,
        results: formData.results.filter(result => result.metric && result.value),
        completion_date: completionDate?.toISOString().split('T')[0] || '',
        updated_at: new Date().toISOString()
      }

      if (project) {
        // Update existing project
        const { data, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id)
          .select()
          .single()

        if (error) throw error
        onSave(data)
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single()

        if (error) throw error
        onSave(data)
      }

      onClose()
    } catch (error) {
      console.error('Error saving project:', error)
      setErrors({ title: 'Błąd podczas zapisywania projektu' })
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
              {project ? 'Edytuj projekt' : 'Nowy projekt'}
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
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Nazwa projektu *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nazwa projektu..."
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

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Branża *
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                        errors.industry ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="np. E-commerce, Fintech, Edukacja..."
                    />
                    {errors.industry && (
                      <span className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.industry}
                      </span>
                    )}
                  </div>
                </div>

                {/* URL Slug */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    URL Slug *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /portfolio/
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

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Kategoria *
                  </label>
                  <Select
                    options={categories}
                    value={categories.find(option => option.value === formData.category)}
                    onChange={(selected) => selected && setFormData(prev => ({ ...prev, category: selected.value }))}
                    placeholder="Wybierz kategorię..."
                    className={errors.category ? 'border border-red-500 rounded-lg' : ''}
                    classNamePrefix="react-select"
                  />
                  {errors.category && (
                    <span className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.category}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Opis projektu *
                  </label>
                  <div className={`${errors.description ? 'border border-red-500 rounded-lg' : ''}`}>
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={formData.description}
                      onChange={(description) => setFormData(prev => ({ ...prev, description }))}
                      modules={modules}
                      formats={formats}
                      placeholder="Opisz projekt, jego cele i wyzwania..."
                      className="h-48"
                    />
                  </div>
                  {errors.description && (
                    <span className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </span>
                  )}
                </div>

                {/* Gallery Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Galeria zdjęć *
                  </label>
                  <div className="space-y-4">
                    {/* Current images */}
                    {galleryFiles.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {galleryFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Zdjęcie ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                Główne
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Upload area */}
                    {galleryFiles.length < 10 && (
                      <FileUpload
                        accept="image/*"
                        multiple={true}
                        maxSize={5 * 1024 * 1024} // 5MB
                        maxFiles={10 - galleryFiles.length}
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

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Technologie
                  </label>
                  <div className="space-y-3">
                    {/* Selected technologies */}
                    {formData.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => removeTechnology(tech)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add new technology */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTechnology(techInput)
                          }
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Dodaj technologię..."
                      />
                      <button
                        type="button"
                        onClick={() => addTechnology(techInput)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Tag className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Suggested technologies */}
                    <div className="flex flex-wrap gap-2">
                      {availableTechnologies
                        .filter(tech => !formData.technologies.includes(tech))
                        .slice(0, 10)
                        .map((tech, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => addTechnology(tech)}
                            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                          >
                            {tech}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Rezultaty projektu
                  </label>
                  <div className="space-y-3">
                    {formData.results.map((result, index) => (
                      <div key={index} className="flex space-x-3">
                        <input
                          type="text"
                          value={result.metric}
                          onChange={(e) => updateResult(index, 'metric', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Metryka (np. Wzrost konwersji)"
                        />
                        <input
                          type="text"
                          value={result.value}
                          onChange={(e) => updateResult(index, 'value', e.target.value)}
                          className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Wartość (np. +250%)"
                        />
                        {formData.results.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeResult(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addResult}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Dodaj rezultat</span>
                    </button>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Completion Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Data realizacji
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={completionDate}
                        onChange={(date: Date) => setCompletionDate(date)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        dateFormat="dd/MM/yyyy"
                        showYearDropdown
                        dropdownMode="select"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Project URL */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      URL projektu
                    </label>
                    <input
                      type="url"
                      value={formData.project_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Projekt wyróżniony (będzie wyświetlany na górze)
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="case_study"
                      checked={formData.case_study}
                      onChange={(e) => setFormData(prev => ({ ...prev, case_study: e.target.checked }))}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="case_study" className="text-sm font-medium text-gray-700">
                      Dostępny jako case study
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="w-1/2 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Podgląd projektu</h3>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Główne zdjęcie"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{formData.title || 'Nazwa projektu'}</h1>
                    {formData.featured && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                        Wyróżniony
                      </span>
                    )}
                  </div>
                  <p className="text-orange-500 font-semibold mb-2">{formData.industry}</p>
                  <div className="prose max-w-none mb-4">
                    <div dangerouslySetInnerHTML={{ __html: formData.description || 'Opis projektu...' }} />
                  </div>
                  
                  {formData.technologies.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Technologie:</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.results.some(r => r.metric && r.value) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Rezultaty:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {formData.results
                          .filter(result => result.metric && result.value)
                          .map((result, index) => (
                            <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                              <span className="text-gray-700">{result.metric}</span>
                              <span className="font-semibold text-green-600">{result.value}</span>
                            </div>
                          ))}
                      </div>
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
                {formData.featured ? 'Projekt zostanie wyróżniony' : 'Projekt standardowy'}
                {formData.case_study && ' • Dostępny jako case study'}
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
                    <span>{project ? 'Zaktualizuj' : 'Zapisz'} projekt</span>
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

export default ProjectForm