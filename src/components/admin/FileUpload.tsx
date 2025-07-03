import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  onFilesSelected: (files: File[]) => void
  onError?: (error: string) => void
  className?: string
  disabled?: boolean
  preview?: boolean
}

interface UploadedFile {
  file: File
  preview?: string
  error?: string
  uploading?: boolean
  progress?: number
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 10,
  onFilesSelected,
  onError,
  className = '',
  disabled = false,
  preview = true
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Size validation
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      return `Plik "${file.name}" jest za duży. Maksymalny rozmiar: ${maxSizeMB}MB`
    }

    // Type validation
    if (accept !== '*') {
      // Handle PDF files specifically
      if (accept === 'application/pdf' && file.type === 'application/pdf') {
        return null;
      }
      
      // Handle multiple accept types (e.g. "image/*,application/pdf")
      if (accept.includes(',')) {
        const acceptTypes = accept.split(',').map(type => type.trim());
        const isAccepted = acceptTypes.some(type => {
          if (type.includes('*')) {
            return file.type.startsWith(type.replace('*', ''));
          }
          return file.type === type;
        });
        
        if (isAccepted) return null;
      } 
      // Handle wildcard accept types (e.g. "image/*")
      else if (accept.includes('*')) {
        if (file.type.startsWith(accept.replace('*', ''))) {
          return null;
        }
      } 
      // Handle exact match
      else if (file.type === accept) {
        return null;
      }
      
      return `Plik "${file.name}" ma nieprawidłowy format`;
    }

    return null
  }

  const processFiles = useCallback(async (fileList: FileList) => {
    const newFiles: File[] = []
    const errors: string[] = []

    // Convert FileList to Array and validate
    Array.from(fileList).forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
      } else {
        newFiles.push(file)
      }
    })

    // Check total file count
    if (!multiple && newFiles.length > 1) {
      errors.push('Można wybrać tylko jeden plik')
      return
    }

    if (files.length + newFiles.length > maxFiles) {
      errors.push(`Maksymalnie ${maxFiles} plików`)
      return
    }

    // Report errors
    if (errors.length > 0) {
      onError?.(errors.join(', '))
      return
    }

    // Process valid files
    const processedFiles: UploadedFile[] = newFiles.map(file => ({
      file,
      uploading: true,
      progress: 0
    }))

    if (multiple) {
      setFiles(prev => [...prev, ...processedFiles])
    } else {
      setFiles(processedFiles)
    }

    // Upload files to Supabase Storage
    const uploadedFiles: File[] = []
    
    for (const fileData of processedFiles) {
      try {
        // Update progress
        fileData.progress = 10
        setFiles(prev => [...prev])
        
        // Generate a unique file name
        const fileExt = fileData.file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = `uploads/${fileName}`
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(filePath, fileData.file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (uploadError) throw uploadError
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('files')
          .getPublicUrl(filePath)
        
        // Update file with preview URL
        fileData.preview = publicUrl
        fileData.uploading = false
        fileData.progress = 100
        setFiles(prev => [...prev])
        
        uploadedFiles.push(fileData.file)
      } catch (error) {
        console.error('Error uploading file:', error)
        fileData.error = 'Błąd podczas przesyłania pliku'
        fileData.uploading = false
        setFiles(prev => [...prev])
      }
    }

    // Notify parent component
    onFilesSelected(uploadedFiles)
  }, [files, maxFiles, maxSize, multiple, onError, onFilesSelected, preview, accept])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList && fileList.length > 0) {
      processFiles(fileList)
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return

    const fileList = e.dataTransfer.files
    if (fileList && fileList.length > 0) {
      processFiles(fileList)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesSelected(newFiles.map(f => f.file))
  }

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // Format accept attribute for display
  const getAcceptDisplay = () => {
    if (accept === 'image/*') return 'JPG, PNG, WebP';
    if (accept === 'application/pdf') return 'PDF';
    if (accept === 'application/pdf,image/*' || accept === 'image/*,application/pdf') 
      return 'PDF, JPG, PNG, WebP';
    if (accept.includes('pdf') || accept.includes('doc')) 
      return 'PDF, DOC, DOCX, XLS, XLSX';
    return 'Wszystkie pliki';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
          ${isDragOver 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-gray-300 hover:border-orange-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragOver ? 'text-orange-500' : 'text-gray-400'}`} />
        
        <p className="text-gray-600 mb-2">
          {isDragOver 
            ? 'Upuść pliki tutaj...' 
            : 'Przeciągnij pliki lub kliknij aby wybrać'
          }
        </p>
        
        <button
          type="button"
          disabled={disabled}
          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Wybierz {multiple ? 'pliki' : 'plik'}
        </button>
        
        <p className="text-gray-500 text-sm mt-2">
          {getAcceptDisplay()} 
          {' '}(max {Math.round(maxSize / (1024 * 1024))}MB
          {multiple && `, max ${maxFiles} plików`})
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Wybrane pliki ({files.length})
          </h4>
          
          <div className="grid gap-3">
            {files.map((uploadedFile, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.preview && uploadedFile.file.type.startsWith('image/') ? (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      {uploadedFile.file.type.startsWith('image/') ? (
                        <Image className="h-6 w-6 text-gray-400" />
                      ) : (
                        <FileText className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                  
                  {/* Upload Progress */}
                  {uploadedFile.uploading && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {uploadedFile.error && (
                    <div className="flex items-center space-x-1 mt-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">{uploadedFile.error}</span>
                    </div>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.uploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
                  ) : uploadedFile.error ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload