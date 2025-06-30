import React, { useState } from 'react'
import { Mail, Phone, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
            message: formData.message,
            lead_magnet: false
          }
        ])

      if (dbError) throw dbError

      // Send emails via edge function
      const emailResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          message: formData.message,
          lead_magnet: false
        })
      })

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json()
        console.error('Email sending failed:', errorData)
        // Don't throw error - form submission was successful even if email failed
      }

      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie lub napisz bezpośrednio na email.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isSubmitted) {
    return (
      <section id="kontakt" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dziękuję za wiadomość!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Otrzymałem Twoje zapytanie i odpowiem w ciągu 24 godzin. 
              Sprawdź skrzynkę email (również spam) w poszukiwaniu potwierdzenia i mojej odpowiedzi.
            </p>
            <p className="text-gray-500">
              W pilnych sprawach dzwoń: <strong>+48 881 046 689</strong>
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="kontakt" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Skontaktuj się - bezpłatna konsultacja i wycena w 24h
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Wypełnij formularz lub umów się na 30-minutową, niezobowiązującą 
            rozmowę strategiczną w moim kalendarzu.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Jan Kowalski"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-bold text-gray-900 mb-2">
                    Nazwa firmy
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="ABC Sp. z o.o."
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="jan@firma.pl"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="+48 123 456 789"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                  Opisz swój projekt *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="Opowiedz o swoim biznesie, jaką stronę potrzebujesz, jaki jest Twój budżet i deadline..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Wysyłanie...' : 'Wyślij zapytanie'}</span>
                {!isSubmitting && <ArrowRight className="h-5 w-5" />}
              </button>

              <p className="text-sm text-gray-500 text-center">
                * Pola wymagane. Odpowiem w ciągu 24 godzin.
              </p>
            </form>
          </div>

          {/* Contact Info & Calendar */}
          <div className="space-y-8">
            {/* Direct contact */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Kontakt bezpośredni
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <a href="mailto:contact.dkwgroup@gmail.com" className="text-orange-500 hover:text-orange-600">
                    contact.dkwgroup@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Telefon</div>
                    <a href="tel:+48881046689" className="text-orange-500 hover:text-orange-600">
                      +48 881 046 689
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Godziny pracy</div>
                    <div className="text-gray-600">Pon-Pt: 9:00-17:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Response time guarantee */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-bold text-blue-900 mb-2">Gwarancja odpowiedzi</h4>
              <p className="text-blue-800">
                Odpowiadam na wszystkie zapytania w ciągu <strong>24 godzin</strong>. 
                W pilnych sprawach dzwoń bezpośrednio - zawsze znajdę czas na rozmowę.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection