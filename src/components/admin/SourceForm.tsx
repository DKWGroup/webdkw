import React, { useState } from 'react'
import { X, Plus, Book, Globe, FileText, BarChart, HelpCircle, AlertCircle } from 'lucide-react'
import { Source } from '../../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

interface SourceFormProps {
  sources: Source[]
  onChange: (sources: Source[]) => void
  citationStyle: string
  onCitationStyleChange: (style: string) => void
}

const SourceForm: React.FC<SourceFormProps> = ({ 
  sources, 
  onChange, 
  citationStyle, 
  onCitationStyleChange 
}) => {
  const [newSource, setNewSource] = useState<Source>({
    id: '',
    type: 'book',
    author: '',
    title: '',
    year: '',
    publisher: '',
    website: '',
    url: '',
    doi: '',
    isbn: '',
    access_date: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const sourceTypes = [
    { value: 'book', label: 'Książka', icon: <Book className="h-4 w-4" /> },
    { value: 'article', label: 'Artykuł', icon: <FileText className="h-4 w-4" /> },
    { value: 'website', label: 'Strona internetowa', icon: <Globe className="h-4 w-4" /> },
    { value: 'research', label: 'Badanie', icon: <BarChart className="h-4 w-4" /> },
    { value: 'other', label: 'Inne', icon: <HelpCircle className="h-4 w-4" /> }
  ]

  const citationStyles = [
    { value: 'apa', label: 'APA' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'mla', label: 'MLA' }
  ]

  const validateSource = (source: Source) => {
    const errors: Record<string, string> = {}
    
    if (!source.author.trim()) {
      errors.author = 'Autor jest wymagany'
    }
    
    if (!source.title.trim()) {
      errors.title = 'Tytuł jest wymagany'
    }
    
    if (!source.year.trim()) {
      errors.year = 'Rok jest wymagany'
    } else if (!/^\d{4}$/.test(source.year)) {
      errors.year = 'Rok musi być w formacie RRRR'
    }
    
    if (source.type === 'book' && !source.publisher?.trim()) {
      errors.publisher = 'Wydawnictwo jest wymagane dla książki'
    }
    
    if (source.type === 'website' && !source.url?.trim()) {
      errors.url = 'URL jest wymagany dla strony internetowej'
    }
    
    if (source.type === 'website' && !source.access_date?.trim()) {
      errors.access_date = 'Data dostępu jest wymagana dla strony internetowej'
    }
    
    if (source.url && !/^https?:\/\/.+/.test(source.url)) {
      errors.url = 'URL musi zaczynać się od http:// lub https://'
    }
    
    return errors
  }

  const handleAddSource = () => {
    const validationErrors = validateSource(newSource)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    const sourceWithId = {
      ...newSource,
      id: uuidv4()
    }
    
    onChange([...sources, sourceWithId])
    
    // Reset form
    setNewSource({
      id: '',
      type: 'book',
      author: '',
      title: '',
      year: '',
      publisher: '',
      website: '',
      url: '',
      doi: '',
      isbn: '',
      access_date: ''
    })
    setErrors({})
  }

  const handleRemoveSource = (id: string) => {
    onChange(sources.filter(source => source.id !== id))
  }

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewSource(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const formatSourceCitation = (source: Source, style: string) => {
    switch (style) {
      case 'apa':
        return formatAPA(source)
      case 'chicago':
        return formatChicago(source)
      case 'mla':
        return formatMLA(source)
      default:
        return formatAPA(source)
    }
  }

  const formatAPA = (source: Source) => {
    switch (source.type) {
      case 'book':
        return `${source.author} (${source.year}). ${source.title}. ${source.publisher}.`
      case 'article':
        return `${source.author} (${source.year}). ${source.title}. ${source.publisher}.`
      case 'website':
        return `${source.author} (${source.year}). ${source.title}. ${source.website}. ${source.url}`
      case 'research':
        return `${source.author} (${source.year}). ${source.title}.`
      default:
        return `${source.author} (${source.year}). ${source.title}.`
    }
  }

  const formatChicago = (source: Source) => {
    switch (source.type) {
      case 'book':
        return `${source.author}. ${source.title}. ${source.publisher}, ${source.year}.`
      case 'article':
        return `${source.author}. "${source.title}." ${source.publisher}, ${source.year}.`
      case 'website':
        return `${source.author}. "${source.title}." ${source.website}, ${source.year}. ${source.url}.`
      case 'research':
        return `${source.author}. "${source.title}." ${source.year}.`
      default:
        return `${source.author}. "${source.title}." ${source.year}.`
    }
  }

  const formatMLA = (source: Source) => {
    switch (source.type) {
      case 'book':
        return `${source.author}. ${source.title}. ${source.publisher}, ${source.year}.`
      case 'article':
        return `${source.author}. "${source.title}." ${source.publisher}, ${source.year}.`
      case 'website':
        return `${source.author}. "${source.title}." ${source.website}, ${source.year}, ${source.url}.`
      case 'research':
        return `${source.author}. "${source.title}." ${source.year}.`
      default:
        return `${source.author}. "${source.title}." ${source.year}.`
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Źródła i bibliografia</h3>
        
        {/* Citation Style Selector */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Styl cytowania
          </label>
          <select
            value={citationStyle}
            onChange={(e) => onCitationStyleChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {citationStyles.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sources List */}
        {sources.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Dodane źródła:</h4>
            <div className="space-y-3">
              {sources.map((source, index) => (
                <div key={source.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {sourceTypes.find(t => t.value === source.type)?.icon}
                      <span className="text-sm font-medium text-gray-700">
                        [{index + 1}] {sourceTypes.find(t => t.value === source.type)?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatSourceCitation(source, citationStyle)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSource(source.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Add New Source Form */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Dodaj nowe źródło</h4>
          
          <div className="space-y-4">
            {/* Source Type */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Typ źródła *
              </label>
              <select
                name="type"
                value={newSource.type}
                onChange={handleSourceChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {sourceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Author */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Autor *
              </label>
              <input
                type="text"
                name="author"
                value={newSource.author}
                onChange={handleSourceChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.author ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nazwisko, I."
              />
              {errors.author && (
                <p className="text-red-500 text-xs mt-1">{errors.author}</p>
              )}
            </div>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Tytuł *
              </label>
              <input
                type="text"
                name="title"
                value={newSource.title}
                onChange={handleSourceChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tytuł książki/artykułu/strony"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>
            
            {/* Year */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Rok publikacji *
              </label>
              <input
                type="text"
                name="year"
                value={newSource.year}
                onChange={handleSourceChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="RRRR"
              />
              {errors.year && (
                <p className="text-red-500 text-xs mt-1">{errors.year}</p>
              )}
            </div>
            
            {/* Conditional fields based on source type */}
            {(newSource.type === 'book' || newSource.type === 'article') && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Wydawnictwo {newSource.type === 'book' ? '*' : ''}
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={newSource.publisher || ''}
                  onChange={handleSourceChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.publisher ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nazwa wydawnictwa"
                />
                {errors.publisher && (
                  <p className="text-red-500 text-xs mt-1">{errors.publisher}</p>
                )}
              </div>
            )}
            
            {newSource.type === 'website' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Nazwa strony *
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={newSource.website || ''}
                    onChange={handleSourceChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.website ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nazwa portalu/strony"
                  />
                  {errors.website && (
                    <p className="text-red-500 text-xs mt-1">{errors.website}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    URL *
                  </label>
                  <input
                    type="text"
                    name="url"
                    value={newSource.url || ''}
                    onChange={handleSourceChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.url ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com"
                  />
                  {errors.url && (
                    <p className="text-red-500 text-xs mt-1">{errors.url}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Data dostępu *
                  </label>
                  <input
                    type="date"
                    name="access_date"
                    value={newSource.access_date || ''}
                    onChange={handleSourceChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.access_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.access_date && (
                    <p className="text-red-500 text-xs mt-1">{errors.access_date}</p>
                  )}
                </div>
              </>
            )}
            
            {/* Optional fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newSource.type === 'book' && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    ISBN
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={newSource.isbn || ''}
                    onChange={handleSourceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="978-3-16-148410-0"
                  />
                </div>
              )}
              
              {(newSource.type === 'article' || newSource.type === 'research') && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    DOI
                  </label>
                  <input
                    type="text"
                    name="doi"
                    value={newSource.doi || ''}
                    onChange={handleSourceChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="10.1000/xyz123"
                  />
                </div>
              )}
              
              {(newSource.type === 'article' || newSource.type === 'research') && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    URL
                  </label>
                  <input
                    type="text"
                    name="url"
                    value={newSource.url || ''}
                    onChange={handleSourceChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.url ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com"
                  />
                  {errors.url && (
                    <p className="text-red-500 text-xs mt-1">{errors.url}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Add Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddSource}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Dodaj źródło</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Help Text */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold">Jak dodawać odnośniki do źródeł w treści:</p>
              <p>Użyj składni <code>[n]</code> w treści artykułu, gdzie n to numer źródła (np. [1], [2], [3]).</p>
              <p>Przykład: "Według badań przeprowadzonych przez Kowalskiego [1], efektywność wzrasta o 25%."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SourceForm