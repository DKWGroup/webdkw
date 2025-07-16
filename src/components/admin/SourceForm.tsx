import React, { useState } from 'react'
import { X, Plus, Globe, AlertCircle } from 'lucide-react'

interface SourceFormProps {
  sources: string[]
  onChange: (sources: string[]) => void
}

const SourceForm: React.FC<SourceFormProps> = ({ sources, onChange }) => {
  const [newSourceUrl, setNewSourceUrl] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateSourceUrl = (url: string) => {
    const errors: Record<string, string> = {}
    
    if (!url.trim()) {
      errors.url = 'URL jest wymagany'
    } else if (!/^https?:\/\/.+/.test(url)) {
      errors.url = 'URL musi zaczynać się od http:// lub https://'
    }
    
    return errors
  }

  const handleAddSource = () => {
    const validationErrors = validateSourceUrl(newSourceUrl)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    onChange([...sources, newSourceUrl])
    
    // Reset form
    setNewSourceUrl('')
    setErrors({})
  }

  const handleRemoveSource = (index: number) => {
    onChange(sources.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Źródła i bibliografia</h3>

        {/* Sources List */}
        {sources.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Dodane źródła:</h4>
            <div className="space-y-3">
              {sources.map((sourceUrl, index) => (
                <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">
                        [{index + 1}] Źródło zewnętrzne
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {sourceUrl}
                      </a>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSource(index)}
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
          <h4 className="font-semibold text-gray-900 mb-4">Dodaj nowy link do źródła</h4>
          
          <div className="space-y-4">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                URL źródła *
              </label>
              <input
                type="text"
                value={newSourceUrl}
                onChange={(e) => {
                  setNewSourceUrl(e.target.value)
                  if (errors.url) {
                    setErrors({})
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.url ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com/article"
              />
              {errors.url && (
                <p className="text-red-500 text-xs mt-1">{errors.url}</p>
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
                <span>Dodaj link do źródła</span>
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
              <p>Przykład: "Według najnowszych badań [1], efektywność wzrasta o 25%."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SourceForm