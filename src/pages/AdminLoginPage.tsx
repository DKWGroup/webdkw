import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react'
import { authSecurity } from '../lib/auth'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import { HelmetProvider } from 'react-helmet-async'

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Sprawdź czy użytkownik jest już zalogowany
    const checkAuth = async () => {
      const isAuth = await authSecurity.isAuthenticated()
      if (isAuth) {
        navigate('/admin')
      }
    }
    checkAuth()
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await authSecurity.login(email, password)
      
      if (result.success) {
        navigate('/admin')
      } else {
        setError(result.error || 'Błąd podczas logowania')
      }
    } catch (error) {
      setError('Wystąpił nieoczekiwany błąd')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setResetMessage('')

    try {
      const result = await authSecurity.resetPassword(resetEmail)
      
      if (result.success) {
        setResetMessage('Link do resetowania hasła został wysłany na podany adres email.')
        setShowResetForm(false)
      } else {
        setError(result.error || 'Błąd podczas resetowania hasła')
      }
    } catch (error) {
      setError('Wystąpił nieoczekiwany błąd')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Panel Administracyjny - Logowanie"
          description="Bezpieczny panel logowania dla administratorów"
          keywords=""
          url={`${window.location.origin}/admin/login`}
        />
        
        {/* Meta tagi bezpieczeństwa */}
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow" />
        
        <Header />
        
        <main className="pt-20">
          <section className="py-20">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-4 mb-8">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Powrót na stronę główną</span>
                </Link>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                {/* Security indicator */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <Shield className="h-4 w-4" />
                    <span>Połączenie zabezpieczone SSL</span>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <Lock className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Panel Administracyjny
                  </h1>
                  <p className="text-gray-600">
                    Zaloguj się, aby uzyskać dostęp do systemu zarządzania
                  </p>
                </div>

                {!showResetForm ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                        Email administratora
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="admin@example.com"
                        required
                        autoComplete="username"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-2">
                        Hasło
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          placeholder="Wprowadź hasło"
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <p className="text-red-800 text-sm">{error}</p>
                        </div>
                      </div>
                    )}

                    {resetMessage && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-sm">{resetMessage}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Logowanie...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5" />
                          <span>Zaloguj się</span>
                        </>
                      )}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowResetForm(true)}
                        className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                      >
                        Zapomniałeś hasła?
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Resetowanie hasła</h2>
                      <label htmlFor="resetEmail" className="block text-sm font-bold text-gray-900 mb-2">
                        Email administratora
                      </label>
                      <input
                        type="email"
                        id="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="admin@example.com"
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 transition-all duration-300"
                      >
                        {isLoading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetForm(false)}
                        className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
                      >
                        Anuluj
                      </button>
                    </div>
                  </form>
                )}

                {/* Security notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-bold text-blue-900 mb-2">Informacje o bezpieczeństwie:</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Maksymalnie 5 prób logowania w ciągu 15 minut</li>
                    <li>• Automatyczne wylogowanie po 30 minutach nieaktywności</li>
                    <li>• Wszystkie próby logowania są monitorowane</li>
                    <li>• Połączenie zabezpieczone protokołem SSL/TLS</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  )
}

export default AdminLoginPage