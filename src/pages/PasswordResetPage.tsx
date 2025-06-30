import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Lock, Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { authSecurity } from '../lib/auth'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import { HelmetProvider } from 'react-helmet-async'

const PasswordResetPage = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{isValid: boolean; errors: string[]}>({
    isValid: false,
    errors: []
  })
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Waliduj hasło w czasie rzeczywistym
    if (password) {
      const validation = authSecurity.validatePassword(password)
      setPasswordStrength(validation)
    } else {
      setPasswordStrength({ isValid: false, errors: [] })
    }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Sprawdź czy hasła się zgadzają
    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne')
      setIsLoading(false)
      return
    }

    // Sprawdź siłę hasła
    if (!passwordStrength.isValid) {
      setError('Hasło nie spełnia wymagań bezpieczeństwa')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      setIsSuccess(true)
      
      // Przekieruj do panelu logowania po 3 sekundach
      setTimeout(() => {
        navigate('/admin/login')
      }, 3000)

    } catch (error: any) {
      console.error('Error resetting password:', error)
      setError(error.message || 'Wystąpił błąd podczas resetowania hasła')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-gray-50">
          <SEOHead 
            title="Hasło zostało zmienione"
            description="Hasło zostało pomyślnie zmienione"
            keywords=""
            url={`${window.location.origin}/admin/reset-password`}
          />
          
          <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
          <meta name="googlebot" content="noindex, nofollow" />
          
          <Header />
          
          <main className="pt-20">
            <section className="py-20">
              <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-8" />
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Hasło zostało zmienione!
                  </h1>
                  <p className="text-gray-600 mb-6">
                    Twoje hasło zostało pomyślnie zaktualizowane. 
                    Za chwilę zostaniesz przekierowany do strony logowania.
                  </p>
                  <Link
                    to="/admin/login"
                    className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Przejdź do logowania
                  </Link>
                </div>
              </div>
            </section>
          </main>
          
          <Footer />
        </div>
      </HelmetProvider>
    )
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Resetowanie hasła - Panel Administracyjny"
          description="Ustaw nowe hasło do panelu administracyjnego"
          keywords=""
          url={`${window.location.origin}/admin/reset-password`}
        />
        
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow" />
        
        <Header />
        
        <main className="pt-20">
          <section className="py-20">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-4 mb-8">
                <Link
                  to="/admin/login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Powrót do logowania</span>
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
                    Ustaw nowe hasło
                  </h1>
                  <p className="text-gray-600">
                    Wprowadź nowe, bezpieczne hasło do swojego konta
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-2">
                      Nowe hasło
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Wprowadź nowe bezpieczne hasło"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password strength indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className={`text-sm ${passwordStrength.isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {passwordStrength.isValid ? (
                            <div className="flex items-center space-x-1">
                              <Shield className="h-4 w-4" />
                              <span>Hasło spełnia wymagania bezpieczeństwa</span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center space-x-1 mb-1">
                                <AlertTriangle className="h-4 w-4" />
                                <span>Wymagania hasła:</span>
                              </div>
                              <ul className="text-xs space-y-1 ml-5">
                                {passwordStrength.errors.map((error, index) => (
                                  <li key={index}>• {error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-900 mb-2">
                      Potwierdź nowe hasło
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Powtórz nowe hasło"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password match indicator */}
                    {confirmPassword && (
                      <div className="mt-2">
                        <div className={`text-sm ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                          {password === confirmPassword ? (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4" />
                              <span>Hasła są identyczne</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="h-4 w-4" />
                              <span>Hasła nie są identyczne</span>
                            </div>
                          )}
                        </div>
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

                  <button
                    type="submit"
                    disabled={isLoading || !passwordStrength.isValid || password !== confirmPassword}
                    className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Aktualizowanie hasła...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        <span>Ustaw nowe hasło</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Security notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-bold text-blue-900 mb-2">Wymagania bezpieczeństwa:</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Minimum 12 znaków</li>
                    <li>• Wielkie i małe litery</li>
                    <li>• Cyfry i znaki specjalne</li>
                    <li>• Unikalne hasło nieużywane wcześniej</li>
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

export default PasswordResetPage