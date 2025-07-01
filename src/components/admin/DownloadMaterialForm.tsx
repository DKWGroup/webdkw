import React, { useState, useEffect } from 'react'
import { Plus, Trash2, FileText, Download, AlertCircle, Edit, Eye } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { DownloadMaterial } from '../../lib/supabase'
import FileUpload from './FileUpload'

interface DownloadMaterialFormProps {
  materials: DownloadMaterial[]
  onChange: (materials: DownloadMaterial[]) => void
}

const DownloadMaterialForm: React.FC<DownloadMaterialFormProps> = ({ materials, onChange }) => {
  const [newMaterial, setNewMaterial] = useState<DownloadMaterial>({
    id: '',
    title: '',
    description: '',
    file_url: '',
    file_size: '',
    file_type: 'PDF',
    button_color: 'orange',
    button_size: 'medium',
    download_count: 0
  })
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewMaterial, setPreviewMaterial] = useState<DownloadMaterial | null>(null)

  // Reset form when editing changes
  useEffect(() => {
    if (editingId) {
      const materialToEdit = materials.find(m => m.id === editingId)
      if (materialToEdit) {
        setNewMaterial(materialToEdit)
      }
    } else {
      setNewMaterial({
        id: '',
        title: '',
        description: '',
        file_url: '',
        file_size: '',
        file_type: 'PDF',
        button_color: 'orange',
        button_size: 'medium',
        download_count: 0
      })
    }
  }, [editingId, materials])

  const validateMaterial = (material: DownloadMaterial) => {
    const errors: Record<string, string> = {}
    
    if (!material.title.trim()) {
      errors.title = 'Tytuł materiału jest wymagany'
    }
    
    if (!material.description.trim()) {
      errors.description = 'Opis materiału jest wymagany'
    }
    
    if (!material.file_url.trim()) {
      errors.file_url = 'Plik jest wymagany'
    }
    
    return errors
  }

  const handleAddMaterial = () => {
    const validationErrors = validateMaterial(newMaterial)
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    if (editingId) {
      // Update existing material
      onChange(materials.map(m => m.id === editingId ? newMaterial : m))
      setEditingId(null)
    } else {
      // Add new material
      const materialWithId = {
        ...newMaterial,
        id: uuidv4()
      }
      onChange([...materials, materialWithId])
    }
    
    // Reset form
    setNewMaterial({
      id: '',
      title: '',
      description: '',
      file_url: '',
      file_size: '',
      file_type: 'PDF',
      button_color: 'orange',
      button_size: 'medium',
      download_count: 0
    })
    setErrors({})
  }

  const handleRemoveMaterial = (id: string) => {
    onChange(materials.filter(material => material.id !== id))
  }

  const handleEditMaterial = (id: string) => {
    setEditingId(id)
  }

  const handlePreviewMaterial = (material: DownloadMaterial) => {
    setPreviewMaterial(material)
  }

  const handleClosePreview = () => {
    setPreviewMaterial(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewMaterial(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      // In a real implementation, this would be the URL from storage
      // For now, we'll just use the file name
      const file = files[0]
      
      // Format file size
      const size = file.size
      let formattedSize = ''
      
      if (size < 1024) {
        formattedSize = `${size} B`
      } else if (size < 1024 * 1024) {
        formattedSize = `${(size / 1024).toFixed(1)} KB`
      } else {
        formattedSize = `${(size / (1024 * 1024)).toFixed(1)} MB`
      }
      
      // Get file extension
      const fileExtension = file.name.split('.').pop()?.toUpperCase() || 'PDF'
      
      setNewMaterial(prev => ({
        ...prev,
        file_url: URL.createObjectURL(file), // This would be the storage URL in production
        file_size: formattedSize,
        file_type: fileExtension
      }))
    }
  }

  const buttonColorOptions = [
    { value: 'orange', label: 'Pomarańczowy' },
    { value: 'blue', label: 'Niebieski' },
    { value: 'green', label: 'Zielony' },
    { value: 'red', label: 'Czerwony' },
    { value: 'gray', label: 'Szary' }
  ]

  const buttonSizeOptions = [
    { value: 'small', label: 'Mały' },
    { value: 'medium', label: 'Średni' },
    { value: 'large', label: 'Duży' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Materiały do pobrania</h3>
        
        {/* Materials List */}
        {materials.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Dodane materiały:</h4>
            <div className="space-y-3">
              {materials.map((material) => (
                <div key={material.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-gray-900">{material.title}</h5>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handlePreviewMaterial(material)}
                          className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                          title="Podgląd"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditMaterial(material.id)}
                          className="p-1 text-orange-500 hover:text-orange-700 transition-colors"
                          title="Edytuj"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(material.id)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          title="Usuń"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-3">{material.file_type}</span>
                      <span>{material.file_size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Add New Material Form */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">
            {editingId ? 'Edytuj materiał' : 'Dodaj nowy materiał'}
          </h4>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Tytuł materiału *
              </label>
              <input
                type="text"
                name="title"
                value={newMaterial.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="np. Checklist SEO"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Opis materiału *
              </label>
              <textarea
                name="description"
                value={newMaterial.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Krótki opis zachęcający do pobrania materiału"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>
            
            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Plik do pobrania *
              </label>
              {newMaterial.file_url ? (
                <div className="relative mb-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-orange-500 mr-2" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {newMaterial.file_url.split('/').pop()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {newMaterial.file_type} • {newMaterial.file_size}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewMaterial(prev => ({ ...prev, file_url: '' }))}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <FileUpload
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                  multiple={false}
                  maxSize={10 * 1024 * 1024} // 10MB
                  onFilesSelected={handleFileUpload}
                  onError={(error) => setErrors(prev => ({ ...prev, file_url: error }))}
                  preview={false}
                />
              )}
              {errors.file_url && (
                <p className="text-red-500 text-xs mt-1">{errors.file_url}</p>
              )}
            </div>
            
            {/* Button Customization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Kolor przycisku
                </label>
                <select
                  name="button_color"
                  value={newMaterial.button_color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {buttonColorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Rozmiar przycisku
                </label>
                <select
                  name="button_size"
                  value={newMaterial.button_size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {buttonSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Add/Update Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddMaterial}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>{editingId ? 'Aktualizuj materiał' : 'Dodaj materiał'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Help Text */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold">Wskazówki:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Dodaj materiały, które uzupełniają treść artykułu</li>
                <li>Używaj krótkich, ale zachęcających opisów</li>
                <li>Optymalna wielkość pliku to maksymalnie 5MB</li>
                <li>Preferowane formaty to PDF, DOC lub XLSX</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClosePreview} />
            
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Podgląd elementu CTA</h3>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{previewMaterial.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{previewMaterial.description}</p>
                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <span className="mr-3">{previewMaterial.file_type}</span>
                        <span>{previewMaterial.file_size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className={`w-full flex items-center justify-center space-x-2 rounded-lg font-semibold transition-colors
                      ${previewMaterial.button_size === 'small' ? 'px-4 py-2 text-sm' : 
                        previewMaterial.button_size === 'large' ? 'px-6 py-4 text-lg' : 'px-5 py-3 text-base'}
                      ${previewMaterial.button_color === 'orange' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                        previewMaterial.button_color === 'blue' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                        previewMaterial.button_color === 'green' ? 'bg-green-500 hover:bg-green-600 text-white' :
                        previewMaterial.button_color === 'red' ? 'bg-red-500 hover:bg-red-600 text-white' :
                        'bg-gray-500 hover:bg-gray-600 text-white'}`}
                  >
                    <Download className="h-5 w-5" />
                    <span>Pobierz materiał</span>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Zamknij podgląd
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DownloadMaterialForm