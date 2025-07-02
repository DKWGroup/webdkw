import React, { useState } from 'react'
import { Download, FileText, AlertTriangle } from 'lucide-react'
import { DownloadMaterial as DownloadMaterialType } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

interface DownloadMaterialProps {
  material: DownloadMaterialType
  postId?: string
  requiresEmail?: boolean
}

const DownloadMaterial: React.FC<DownloadMaterialProps> = ({ material, postId, requiresEmail = true }) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [rodoConsent, setRodoConsent] = useState(false)
  const [showRodoInfo, setShowRodoInfo] = useState(false)

  const handleDirectDownload = async () => {
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!rodoConsent) {
      setError('Wymagana jest zgoda na przetwarzanie danych osobowych')
      setIsSubmitting(false)
      return
    }

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: name,
            email: email,
            message: `Pobranie materiału: ${material.title}`,
            lead_magnet: true
          }
        ])

      if (dbError) throw dbError

      // Try to send email with the download link
      try {
        const emailResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: `Pobranie materiału: ${material.title}`,
            lead_magnet: true,
            download_url: material.file_url,
            download_title: material.title
          })
        })

        if (!emailResponse.ok) {
          console.warn('Email sending failed, but form was submitted successfully')
        }
      } catch (emailError) {
        console.warn('Email function error:', emailError)
      }

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
        }
      }

      setSuccess(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('Wystąpił błąd. Spróbuj ponownie.')
    } finally {
      setIsSubmitting(false)
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

  if (success) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm my-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-green-500" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">Materiał wysłany!</h4>
          <p className="text-gray-600 mb-6">
            Link do pobrania został wysłany na adres {email}. Sprawdź swoją skrzynkę (również folder spam).
          </p>
          <Link 
            to="/#kontakt"
            className="inline-flex items-center justify-center space-x-2 rounded-lg font-semibold transition-colors px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <span>Masz pytania? Skontaktuj się z nami</span>
          </Link>
        </div>
      </div>
    )
  }

  if (showEmailForm && requiresEmail) {
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
        
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-blue-800 text-sm">
            Aby pobrać ten materiał, prosimy o podanie adresu email. Wyślemy link do pobrania bezpośrednio na Twoją skrzynkę.
          </p>
        </div>
        
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Imię i nazwisko *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="Jan Kowalski"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adres email *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="jan@example.com"
              required
            />
          </div>
          
          {/* RODO Consent Checkbox */}
          <div className="relative">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="rodo-consent-download"
                  type="checkbox"
                  checked={rodoConsent}
                  onChange={(e) => setRodoConsent(e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="rodo-consent-download" className="text-gray-600">
                  Zapoznałem/am się z{' '}
                  <button
                    type="button"
                    className="text-orange-500 hover:text-orange-700 underline"
                    onClick={() => setShowRodoInfo(!showRodoInfo)}
                    onMouseEnter={() => setShowRodoInfo(true)}
                    onMouseLeave={() => setShowRodoInfo(false)}
                  >
                    informacją o administratorze i przetwarzaniu danych
                  </button>
                  . *
                </label>
              </div>
            </div>
            
            {/* RODO Info Popup */}
            {showRodoInfo && (
              <div className="absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-xl border border-gray-200 text-sm text-gray-700 max-w-md">
                <p>
                  Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z ustawą o ochronie danych osobowych w celu wysyłania informacji handlowej. Podanie danych osobowych jest dobrowolne. Zostałem poinformowany, że przysługuje mi prawo dostępu do swoich danych, możliwości ich poprawiania, żądania zaprzestania ich przetwarzania. Administratorem danych jest DM.me Dawid Myszka ul. Bolesława Chrobrego 32/103, Katowice 40-881.
                </p>
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button 
              type="submit"
              disabled={isSubmitting || !rodoConsent}
              className={`flex-1 flex items-center justify-center space-x-2 rounded-lg font-semibold transition-colors
                ${getButtonSizeClasses()}
                ${getButtonColorClasses()}
                ${isSubmitting || !rodoConsent ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Wysyłanie...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>Wyślij link do pobrania</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setShowEmailForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Anuluj
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Twój adres email będzie używany tylko do wysłania materiału i okazjonalnych informacji o nowych treściach. Możesz zrezygnować w każdej chwili.
          </p>
        </form>
      </div>
    )
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
        onClick={requiresEmail ? () => setShowEmailForm(true) : handleDirectDownload}
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