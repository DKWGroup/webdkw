import { supabase } from './supabase'

export interface LoginAttempt {
  ip: string
  timestamp: number
  success: boolean
  email?: string
}

export interface SecurityLog {
  id: string
  event_type: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'session_timeout' | 'password_reset'
  ip_address: string
  user_agent: string
  email?: string
  timestamp: string
  details?: any
}

class AuthSecurity {
  private loginAttempts: Map<string, LoginAttempt[]> = new Map()
  private blockedIPs: Set<string> = new Set()
  private sessionTimeout = 30 * 60 * 1000 // 30 minut
  private maxAttempts = 5
  private attemptWindow = 15 * 60 * 1000 // 15 minut

  constructor() {
    this.initializeSessionTimeout()
    this.loadBlockedIPs()
  }

  // Walidacja silnego hasła
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < 12) {
      errors.push('Hasło musi mieć minimum 12 znaków')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Hasło musi zawierać małe litery')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Hasło musi zawierać wielkie litery')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Hasło musi zawierać cyfry')
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Hasło musi zawierać znaki specjalne')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Sprawdzenie czy IP jest zablokowane
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip)
  }

  // Sprawdzenie limitów prób logowania
  canAttemptLogin(ip: string): boolean {
    if (this.isIPBlocked(ip)) {
      return false
    }

    const attempts = this.loginAttempts.get(ip) || []
    const now = Date.now()
    
    // Usuń stare próby (starsze niż 15 minut)
    const recentAttempts = attempts.filter(
      attempt => now - attempt.timestamp < this.attemptWindow
    )
    
    this.loginAttempts.set(ip, recentAttempts)
    
    // Sprawdź czy przekroczono limit
    const failedAttempts = recentAttempts.filter(attempt => !attempt.success)
    return failedAttempts.length < this.maxAttempts
  }

  // Rejestracja próby logowania
  recordLoginAttempt(ip: string, success: boolean, email?: string) {
    const attempts = this.loginAttempts.get(ip) || []
    attempts.push({
      ip,
      timestamp: Date.now(),
      success,
      email
    })
    
    this.loginAttempts.set(ip, attempts)
    
    // Jeśli przekroczono limit, zablokuj IP
    if (!success) {
      const recentFailures = attempts.filter(
        attempt => !attempt.success && 
        Date.now() - attempt.timestamp < this.attemptWindow
      )
      
      if (recentFailures.length >= this.maxAttempts) {
        this.blockIP(ip)
      }
    }
    
    // Zapisz w logach
    this.logSecurityEvent(
      success ? 'login_success' : 'login_failure',
      ip,
      navigator.userAgent,
      email
    )
  }

  // Blokowanie IP
  private blockIP(ip: string) {
    this.blockedIPs.add(ip)
    localStorage.setItem('blockedIPs', JSON.stringify([...this.blockedIPs]))
    
    // Powiadom administratora
    this.notifyAdminAboutSuspiciousActivity(ip)
  }

  // Ładowanie zablokowanych IP z localStorage
  private loadBlockedIPs() {
    try {
      const stored = localStorage.getItem('blockedIPs')
      if (stored) {
        const ips = JSON.parse(stored)
        this.blockedIPs = new Set(ips)
      }
    } catch (error) {
      console.error('Error loading blocked IPs:', error)
    }
  }

  // Powiadomienie administratora o podejrzanej aktywności
  private async notifyAdminAboutSuspiciousActivity(ip: string) {
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/security-alert`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'blocked_ip',
          ip_address: ip,
          timestamp: new Date().toISOString(),
          details: 'IP blocked due to excessive failed login attempts'
        })
      })
    } catch (error) {
      console.error('Failed to send security alert:', error)
    }
  }

  // Logowanie zdarzeń bezpieczeństwa
  async logSecurityEvent(
    eventType: SecurityLog['event_type'],
    ipAddress: string,
    userAgent: string,
    email?: string,
    details?: any
  ) {
    try {
      const { error } = await supabase
        .from('security_logs')
        .insert([{
          event_type: eventType,
          ip_address: ipAddress,
          user_agent: userAgent,
          email,
          timestamp: new Date().toISOString(),
          details
        }])

      if (error) {
        console.error('Failed to log security event:', error)
      }
    } catch (error) {
      console.error('Error logging security event:', error)
    }
  }

  // Inicjalizacja automatycznego wylogowania
  private initializeSessionTimeout() {
    let timeoutId: NodeJS.Timeout

    const resetTimeout = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        this.handleSessionTimeout()
      }, this.sessionTimeout)
    }

    // Resetuj timeout przy aktywności użytkownika
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true)
    })

    resetTimeout()
  }

  // Obsługa timeout sesji
  private async handleSessionTimeout() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await this.logout('session_timeout')
      alert('Sesja wygasła z powodu nieaktywności. Zostaniesz przekierowany do strony logowania.')
      window.location.href = '/admin/login'
    }
  }

  // Bezpieczne logowanie
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const ip = await this.getClientIP()
    
    // Sprawdź czy IP może próbować logowania
    if (!this.canAttemptLogin(ip)) {
      return {
        success: false,
        error: 'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie za 15 minut.'
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        this.recordLoginAttempt(ip, false, email)
        return {
          success: false,
          error: 'Nieprawidłowe dane logowania'
        }
      }

      if (data.user) {
        this.recordLoginAttempt(ip, true, email)
        return { success: true }
      }

      return {
        success: false,
        error: 'Wystąpił błąd podczas logowania'
      }
    } catch (error) {
      this.recordLoginAttempt(ip, false, email)
      return {
        success: false,
        error: 'Wystąpił błąd podczas logowania'
      }
    }
  }

  // Bezpieczne wylogowanie
  async logout(reason: 'manual' | 'session_timeout' = 'manual') {
    const ip = await this.getClientIP()
    
    try {
      await supabase.auth.signOut()
      
      this.logSecurityEvent(
        reason === 'session_timeout' ? 'session_timeout' : 'logout',
        ip,
        navigator.userAgent
      )
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  // Resetowanie hasła
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    const ip = await this.getClientIP()
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      })

      if (error) {
        return {
          success: false,
          error: 'Wystąpił błąd podczas wysyłania emaila resetującego'
        }
      }

      this.logSecurityEvent(
        'password_reset',
        ip,
        navigator.userAgent,
        email
      )

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: 'Wystąpił błąd podczas resetowania hasła'
      }
    }
  }

  // Pobranie IP klienta
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      return 'unknown'
    }
  }

  // Sprawdzenie czy użytkownik jest zalogowany
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        // Clear any stale session data when there's an authentication error
        await supabase.auth.signOut()
        return false
      }
      
      return !!user
    } catch (error) {
      // Clear any stale session data on any error
      try {
        await supabase.auth.signOut()
      } catch (signOutError) {
        console.error('Error clearing stale session:', signOutError)
      }
      return false
    }
  }
}

export const authSecurity = new AuthSecurity()