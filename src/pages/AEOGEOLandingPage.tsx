import React, { useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Phone, 
  Mail, 
  Target, 
  TrendingUp, 
  Shield, 
  Award,
  Search,
  Brain,
  BarChart3,
  Users,
  Globe,
  Zap,
  AlertTriangle,
  Plus,
  Minus
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import { supabase } from '../lib/supabase'

const AEOGEOLandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    serviceType: 'audit' // audit, geo, aeo, consultation
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const serviceMessages = {
        audit: 'Zamówienie Audytu Potencjału AEO za 950 zł',
        geo: 'Zapytanie o pakiet GEO Launchpad',
        aeo: 'Zapytanie o pakiet AEO Dominator',
        consultation: 'Prośba o bezpłatną konsultację'
      }

      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
            message: `${serviceMessages[formData.serviceType as keyof typeof serviceMessages]}\n\n${formData.message}`,
            lead_magnet: false
          }
        ])

      if (dbError) throw dbError

      // Try to send emails
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
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
            message: `${serviceMessages[formData.serviceType as keyof typeof serviceMessages]}\n\n${formData.message}`,
            lead_magnet: false
          })
        })
      } catch (emailError) {
        console.warn('Email function error:', emailError)
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const faqs = [
    {
      question: "Czym różni się AEO/GEO od tradycyjnego SEO?",
      answer: "Tradycyjne SEO skupia się na pozycjach w wynikach wyszukiwania. AEO (Answer Engine Optimization) optymalizuje pod AI Overviews i odpowiedzi generowane przez sztuczną inteligencję. GEO (Generative Engine Optimization) to lokalna wersja AEO. To przyszłość pozycjonowania - gdy AI odpowiada za Ciebie, nie musisz konkurować o kliknięcia."
    },
    {
      question: "Jak szybko zobaczę pierwsze rezultaty?",
      answer: "Pierwsze sygnały w AI Overviews możesz zobaczyć już po 4-6 tygodniach. Znaczące wyniki w Answer Share™ osiągamy w 3-4 miesiące. Pełna dominacja w odpowiedziach AI dla Twojej branży to 6-12 miesięcy, w zależności od konkurencji."
    },
    {
      question: "Czy rzeczywiście gwarantujecie wyniki?",
      answer: "Tak! Jako jedyna agencja w Polsce udzielamy pisemnej gwarancji w umowie. Dla AEO Dominator gwarantujemy pojawienie się w 30% odpowiedzi AI dla top 10 zapytań w ciągu 6 miesięcy. Jeśli nie osiągniemy tego celu, zwracamy pieniądze."
    },
    {
      question: "Co to jest Answer Share™?",
      answer: "Answer Share™ to nasz autorski wskaźnik pokazujący, w ilu procentach odpowiedzi AI pojawia się Twoja firma. To konkretna metryka sukcesu - zamiast zgadywać, widzisz dokładnie, jak często AI poleca Twoją firmę potencjalnym klientom."
    },
    {
      question: "Dla jakiej wielkości firm są Wasze usługi?",
      answer: "GEO Launchpad idealnie sprawdza się dla firm lokalnych: prawników, lekarzy, restauracji, salonów. AEO Dominator dedykowany jest średnim i dużym firmom: e-commerce, B2B, SaaS. Audyt za 950 zł jest dla każdego, kto chce sprawdzić swój potencjał."
    },
    {
      question: "Czy współpracujecie z firmami spoza Katowic?",
      answer: "Absolutnie! Pracujemy zdalnie z firmami z całej Polski i zagranicy. Nasze narzędzia i metodologia działają niezależnie od lokalizacji. Spotkania prowadzimy online, a wyniki monitorujemy w czasie rzeczywistym."
    }
  ]

  if (isSubmitted) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-gray-50">
          <SEOHead 
            title="Dziękujemy za zgłoszenie | Pozycjonowanie AEO i GEO"
            description="Dziękujemy za zainteresowanie naszymi usługami AEO i GEO. Skontaktujemy się z Tobą w ciągu 24 godzin."
            url="https://webdkw.net/pozycjonowanie-aeo-geo"
          />
          <Header />
          <main className="pt-20">
            <section className="py-20">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white rounded-2xl shadow-xl p-12">
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-8" />
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Dziękujemy za zgłoszenie!
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Otrzymaliśmy Twoje zapytanie i skontaktujemy się z Tobą w ciągu 24 godzin 
                    z szczegółami dotyczącymi wybranej usługi.
                  </p>
                  <p className="text-gray-500">
                    W pilnych sprawach dzwoń: <strong>+48 881 046 689</strong>
                  </p>
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
          title="Pozycjonowanie AEO i GEO - Pierwsza Agencja AI w Polsce | WebDKW"
          description="Specjalizujemy się w pozycjonowaniu pod AI Overviews. Pakiety GEO (lokalne) i AEO (krajowe). Gwarancja wyników. Audyt potencjału za 950 zł."
          keywords="pozycjonowanie AEO, pozycjonowanie GEO, AI Overviews, pozycjonowanie pod sztuczną inteligencję, optymalizacja odpowiedzi AI"
          url="https://webdkw.net/pozycjonowanie-aeo-geo"
        />
        
        <Header />
        
        <main>
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                {/* Trust Signals */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    🏆 Pierwsza agencja AEO/GEO w Polsce
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    ⚡ AI-Growth Framework™
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    🛡️ Gwarancja wyników w umowie
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Nie pozwól, by AI ukryło 
                  <span className="text-orange-400"> Twoją firmę</span> przed klientami
                </h1>
                
                <p className="text-xl md:text-2xl mb-6 text-gray-300">
                  Jako pierwsi w Polsce oferujemy pozycjonowanie pod nową erę wyszukiwania. 
                  Gdy Google odpowiada za Ciebie - Twoi konkurenci tracą klientów.
                </p>
                
                <p className="text-lg mb-10 text-gray-400 max-w-3xl mx-auto">
                  Rewolucja już się dzieje. AI Overviews zmieniają sposób, w jaki ludzie szukają usług. 
                  <strong className="text-white"> 99% firm nie ma strategii na to, co nadchodzi.</strong> Czy Twoja ma?
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
                  >
                    <span>Sprawdź swój potencjał AEO - Audyt za 950 zł</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    Umów bezpłatną konsultację
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Problem Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Twoi klienci już nie klikają w wyniki. 
                  <span className="text-red-500"> AI odpowiada za Ciebie</span>
                </h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          60% zapytań kończy się bez kliknięcia
                        </h3>
                        <p className="text-gray-600">
                          AI Overviews dają odpowiedź od razu. Ludzie nie muszą już wchodzić na strony, 
                          żeby znaleźć to, czego szukają.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Google już wybiera za klientów
                        </h3>
                        <p className="text-gray-600">
                          AI decyduje, kto jest najlepszy w branży. Jeśli AI nie zna Twojej firmy, 
                          praktycznie nie istniejesz dla potencjalnych klientów.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Tradycyjne SEO przestaje działać
                        </h3>
                        <p className="text-gray-600">
                          Inwestycje w klasyczne pozycjonowanie przestają przynosić oczekiwane rezultaty. 
                          Potrzebujesz nowej strategii.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Wczoraj vs Dziś
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border-l-4 border-gray-400">
                      <h4 className="font-bold text-gray-700 mb-2">WCZORAJ - Tradycyjne wyniki</h4>
                      <p className="text-sm text-gray-600">
                        1. Twoja strona<br/>
                        2. Konkurent A<br/>
                        3. Konkurent B<br/>
                        <em>Klient musiał kliknąć i porównywać</em>
                      </p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                      <h4 className="font-bold text-orange-700 mb-2">DZIŚ - AI Overview</h4>
                      <p className="text-sm text-gray-700">
                        <strong>"Najlepszym prawnikiem w Katowicach jest Kancelaria XYZ..."</strong><br/>
                        <em>AI już wybrało za klienta. Gra skończona.</em>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Specjalizujemy się w pozycjonowaniu na erę AI. 
                  <span className="text-orange-500"> Poznaj nasze pakiety:</span>
                </h2>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Audyt Potencjału AEO */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Sprawdź swoje szanse za 950 zł
                    </h3>
                    <p className="text-gray-600">
                      Dla każdej firmy, która chce zrozumieć swój potencjał w erze AI
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Analiza 10 kluczowych fraz w AI Overviews</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">AI Readiness Score™ (0-100 punktów)</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">3 konkretne działania do natychmiastowego wdrożenia</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">60-minutowa sesja strategiczna online</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Profesjonalny raport PDF</span>
                    </li>
                  </ul>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800 text-sm font-semibold">
                      🎯 GWARANCJA: Jeśli w ciągu 30 dni zdecydujesz się na dalszą współpracę, 
                      całość kwoty za audyt zostanie odliczona od opłaty startowej!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setFormData({...formData, serviceType: 'audit'})
                      document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Zamawiam audyt za 950 zł
                  </button>
                </div>

                {/* GEO Launchpad */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-500 transform lg:scale-105">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      NAJPOPULARNIEJSZY
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Zdominuj swoją okolicę lokalnie
                    </h3>
                    <p className="text-gray-600">
                      Dla prawników, lekarzy, restauracji, specjalistów
                    </p>
                    <div className="text-3xl font-bold text-orange-500 mt-4">
                      4500 zł/mies
                    </div>
                    <div className="text-sm text-gray-500">
                      + 2500 zł opłata startowa
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <p className="text-orange-800 font-semibold text-center">
                      "Sprawię, by na pytanie 'najlepszy [Twoja usługa] w [Twoje miasto]?' 
                      Google odpowiadał nazwą Twojej firmy"
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Mistrzowska optymalizacja Google Business Profile</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">10-15 "Knowledge Assets" odpowiadających na pytania klientów</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Wdrożenie danych strukturalnych schema.org</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Strategia zarządzania reputacją</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Answer Share™ Dashboard</span>
                    </li>
                  </ul>

                  <p className="text-sm text-gray-500 mb-6 text-center">
                    Minimalna umowa: 6 miesięcy
                  </p>

                  <button
                    onClick={() => {
                      setFormData({...formData, serviceType: 'geo'})
                      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Chcę zdominować rynek lokalny
                  </button>
                </div>

                {/* AEO Dominator */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Zostań krajowym liderem myśli
                    </h3>
                    <p className="text-gray-600">
                      Dla firm e-commerce, B2B, SaaS o zasięgu krajowym
                    </p>
                    <div className="text-3xl font-bold text-purple-500 mt-4">
                      8500 zł/mies
                    </div>
                    <div className="text-sm text-gray-500">
                      + 4500 zł opłata startowa
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                    <p className="text-purple-800 font-semibold text-center">
                      "Osiągnij status głównego źródła odpowiedzi dla AI w Twojej branży w całej Polsce"
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Wszystko z GEO Launchpad</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Zaawansowany Content Marketing oparty na AI</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Strategiczne budowanie autorytetu E-E-A-T</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Optymalizacja pod wyszukiwanie komercyjne</span>
                    </li>
                  </ul>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800 text-sm font-semibold">
                      🛡️ GWARANCJA: Twoja strona pojawi się w 30% odpowiedzi AI 
                      dla top 10 zapytań w ciągu 6 miesięcy
                    </p>
                  </div>

                  <p className="text-sm text-gray-500 mb-6 text-center">
                    Minimalna umowa: 6 miesięcy
                  </p>

                  <button
                    onClick={() => {
                      setFormData({...formData, serviceType: 'aeo'})
                      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                  >
                    Chcę być liderem w branży
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Methodology Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  AI-Growth Framework™ - 
                  <span className="text-orange-500"> Nasz autorski proces w 4 krokach</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">1. Discovery</h3>
                  <p className="text-gray-600">
                    Głębokie zrozumienie Twojego biznesu, klientów i celów. 
                    Analiza obecnej pozycji w AI.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="h-10 w-10 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">2. Strategy</h3>
                  <p className="text-gray-600">
                    Tworzenie mapy drogowej opartej na danych. 
                    Strategia Answer Share™ dla Twojej branży.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">3. Implementation</h3>
                  <p className="text-gray-600">
                    Systematyczne wdrażanie zaprojektowanych rozwiązań. 
                    Optymalizacja pod AI Overviews.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="h-10 w-10 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">4. Monitoring</h3>
                  <p className="text-gray-600">
                    Ciągły pomiar Answer Share™ i optymalizacja działań. 
                    Transparentne raportowanie wyników.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Zobacz, co mówią nasi klienci
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6">
                    "Po 3 miesiącach współpracy z WebDKW nasza kancelaria pojawia się w 85% odpowiedzi AI 
                    na pytania o prawników w Katowicach. Liczba zapytań wzrosła o 340%."
                  </blockquote>
                  <div className="flex items-center">
                    <img 
                      src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=100" 
                      alt="Anna Kowalska" 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-bold text-gray-900">Anna Kowalska</div>
                      <div className="text-gray-600 text-sm">Kancelaria Prawna AK</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6">
                    "Dzięki pakietowi AEO Dominator staliśmy się głównym źródłem odpowiedzi AI w branży SaaS. 
                    ROI z inwestycji to 450% w pierwszym roku."
                  </blockquote>
                  <div className="flex items-center">
                    <img 
                      src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100" 
                      alt="Tomasz Wiśniewski" 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-bold text-gray-900">Tomasz Wiśniewski</div>
                      <div className="text-gray-600 text-sm">TechFlow Solutions</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6">
                    "Audyt za 950 zł otworzył nam oczy na możliwości AEO. 
                    Już po miesiącu wdrażania rekomendacji zauważyliśmy pierwsze efekty."
                  </blockquote>
                  <div className="flex items-center">
                    <img 
                      src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=100" 
                      alt="Katarzyna Nowak" 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-bold text-gray-900">Katarzyna Nowak</div>
                      <div className="text-gray-600 text-sm">Dental Clinic KN</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Najczęściej zadawane pytania
                </h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
                    >
                      <h3 className="text-lg font-bold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {openFaq === index ? (
                          <Minus className="h-6 w-6 text-orange-500" />
                        ) : (
                          <Plus className="h-6 w-6 text-orange-500" />
                        )}
                      </div>
                    </button>

                    {openFaq === index && (
                      <div className="px-8 pb-6">
                        <div className="border-t border-gray-100 pt-6">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Forms Section */}
          <section id="contact-form" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Gotowy na dominację w erze AI?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Nie czekaj, aż konkurencja Cię wyprzedzi. Rewolucja AI już trwa, 
                  a my jesteśmy jedyną agencją w Polsce, która wie, jak ją wykorzystać.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div id="audit-form" className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Wybierz swoją ścieżkę do sukcesu
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Wybierz usługę *
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="audit">Audyt Potencjału AEO - 950 zł</option>
                        <option value="geo">Pakiet GEO Launchpad - 4500 zł/mies</option>
                        <option value="aeo">Pakiet AEO Dominator - 8500 zł/mies</option>
                        <option value="consultation">Bezpłatna konsultacja - 30 min</option>
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Imię i nazwisko *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Jan Kowalski"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Nazwa firmy *
                        </label>
                        <input
                          type="text"
                          name="company"
                          required
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="ABC Sp. z o.o."
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="jan@firma.pl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="+48 123 456 789"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Dodatkowe informacje
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        placeholder="Opisz swoją branżę, cele biznesowe, obecną sytuację..."
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
                  </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Kontakt bezpośredni
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <Phone className="h-6 w-6 text-orange-500 mt-1" />
                        <div>
                          <div className="font-semibold text-gray-900">Telefon</div>
                          <a href="tel:+48881046689" className="text-orange-500 hover:text-orange-600 text-lg">
                            +48 881 046 689
                          </a>
                          <p className="text-sm text-gray-500 mt-1">
                            Pon-Pt: 9:00-17:00
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <Mail className="h-6 w-6 text-orange-500 mt-1" />
                        <div>
                          <div className="font-semibold text-gray-900">Email</div>
                          <a href="mailto:contact.dkwgroup@gmail.com" className="text-orange-500 hover:text-orange-600">
                            contact.dkwgroup@gmail.com
                          </a>
                          <p className="text-sm text-gray-500 mt-1">
                            Odpowiedź w ciągu 24h
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
                    <h3 className="text-2xl font-bold mb-4">
                      🚀 Dlaczego warto działać już dziś?
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                        <span>Pionierska pozycja daje ogromną przewagę</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                        <span>AI Overviews już działają w Polsce</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                        <span>Konkurencja jeszcze nie wie, co się dzieje</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                        <span>Gwarancja wyników w umowie</span>
                      </li>
                    </ul>
                  </div>
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

export default AEOGEOLandingPage