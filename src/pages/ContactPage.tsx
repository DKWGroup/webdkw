import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Clock, ArrowRight, CheckCircle, MapPin, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
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

      if (error) throw error

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
      alert('Wystąpił błąd. Spróbuj ponownie lub napisz bezpośrednio na email.')
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="bg-white rounded-2xl shadow-xl p-12">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-8" />
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Dziękuję za wiadomość!
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Otrzymałem Twoje zapytanie i odpowiem w ciągu 24 godzin. 
                  Sprawdź skrzynkę email (również spam) w poszukiwaniu mojej odpowiedzi.
                </p>
                <p className="text-gray-500 mb-8">
                  W pilnych sprawach dzwoń: <strong>+48 123 456 789</strong>
                </p>
                <Link
                  to="/"
                  className="inline-block bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300"
                >
                  Wróć na stronę główną
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Header section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4 mb-8">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Powrót na stronę główną</span>
              </Link>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Skontaktuj się z nami
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Gotowy na rozmowę o Twoim projekcie? Wypełnij formularz lub skorzystaj 
                z jednej z dostępnych form kontaktu.
              </p>
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Wyślij zapytanie
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Wypełnij formularz, a odpowiem w ciągu 24 godzin z propozycją 
                    bezpłatnej konsultacji strategicznej.
                  </p>

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
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                {/* Direct contact */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Kontakt bezpośredni
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-orange-500 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">Email</div>
                        <a href="mailto:contact.dkwgroup@gmail.com" className="text-orange-500 hover:text-orange-600">
                        contact.dkwgroup@gmail.com
                        </a>
                        <p className="text-sm text-gray-500 mt-1">Odpowiedź w ciągu 24h</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-orange-500 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">Telefon</div>
                        <a href="tel:+48881046689" className="text-orange-500 hover:text-orange-600">
                          +48 881 046 689
                        </a>
                        <p className="text-sm text-gray-500 mt-1">W pilnych sprawach</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-orange-500 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">Godziny pracy</div>
                        <div className="text-gray-600">Pon-Pt: 9:00-17:00</div>
                        <p className="text-sm text-gray-500 mt-1">Czas odpowiedzi: do 2h</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-orange-500 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">Lokalizacja</div>
                        <div className="text-gray-600">Warszawa, Polska</div>
                        <p className="text-sm text-gray-500 mt-1">Spotkania online i stacjonarne</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar booking */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 rounded-2xl text-white">
                  <Calendar className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-4">
                    Umów się na bezpłatną konsultację
                  </h3>
                  <p className="mb-6 opacity-90">
                    30 minut rozmowy o Twoim projekcie. Bez zobowiązań, 
                    pełna koncentracja na Twoich celach biznesowych.
                  </p>
                  <a
                    href="https://calendly.com/webexpert/konsultacja"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Rezerwuj termin w kalendarzu
                  </a>
                  <p className="text-sm mt-4 opacity-80">
                    ⚡ Najszybsze terminy dostępne już jutro
                  </p>
                </div>

                {/* Response guarantee */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
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
      </main>

      <Footer />
    </div>
  )
}

export default ContactPage