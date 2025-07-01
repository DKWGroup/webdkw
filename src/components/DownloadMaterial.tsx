import React, { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { DownloadMaterial as DownloadMaterialType } from '../lib/supabase'
import { supabase } from '../lib/supabase'

interface DownloadMaterialProps {
  material: DownloadMaterialType
  postId?: string
}

const DownloadMaterial: React.FC<DownloadMaterialProps> = ({ material, postId }) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      // Track download count if postId is provided
      if (postId) {
        try {
          // Get current post data
          const { data: post } = await supabase
            .from('blog_posts')
            .select('download_materials')
            .eq('id', postId)
            .single()
          
          if (post && post.download_materials) {
            // Update download count for this material
            const updatedMaterials = post.download_materials.map((m: DownloadMaterialType) => {
              if (m.id === material.id) {
                return {
                  ...m,
                  download_count: (m.download_count || 0) + 1
                }
              }
              return m
            })
            
            // Update the post with new download count
            await supabase
              .from('blog_posts')
              .update({ download_materials: updatedMaterials })
              .eq('id', postId)
          }
        } catch (error) {
          console.error('Error updating download count:', error)
          // Continue with download even if tracking fails
        }
      }
      
      // Initiate download
      window.open(material.file_url, '_blank')
    } catch (error) {
      console.error('Error during download:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  // Determine button color classes
  const getButtonColorClasses = () => {
    switch (material.button_color) {
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600 text-white'
      case 'green':
        return 'bg-green-500 hover:bg-green-600 text-white'
      case 'red':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'gray':
        return 'bg-gray-500 hover:bg-gray-600 text-white'
      case 'orange':
      default:
        return 'bg-orange-500 hover:bg-orange-600 text-white'
    }
  }

  // Determine button size classes
  const getButtonSizeClasses = () => {
    switch (material.button_size) {
      case 'small':
        return 'px-4 py-2 text-sm'
      case 'large':
        return 'px-6 py-4 text-lg'
      case 'medium':
      default:
        return 'px-5 py-3 text-base'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm my-8">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="h-6 w-6 text-orange-500" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">{material.title}</h4>
          <p className="text-gray-600 text-sm mb-2">{material.description}</p>
          <div className="flex items-center text-xs text-gray-500 mb-4">
            <span className="mr-3">{material.file_type}</span>
            <span>{material.file_size}</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        className={`w-full flex items-center justify-center space-x-2 rounded-lg font-semibold transition-colors
          ${getButtonSizeClasses()}
          ${getButtonColorClasses()}
          ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        {isDownloading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Pobieranie...</span>
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            <span>Pobierz materiał</span>
          </>
        )}
      </button>
    </div>
  )
}

export default DownloadMaterial