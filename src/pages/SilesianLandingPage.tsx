import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ArrowRight, MessageSquare, Settings, Lightbulb, ChevronLeft, ChevronRight, Star, Clock, CheckCircle, AlertTriangle, Mail, Phone, MapPin, Globe, Code, Database, TrendingUp, ExternalLink, Smartphone, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SilesianLandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    leadMagnet: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const testimonials = [
    {
      name: "Anna Kowalska",
      company: "TechStart Katowice",
      text: "Dzięki WebDKW nasza firma zyskała profesjonalną stronę internetową, która przyciąga klientów z całego Śląska.",
      rating: 5
    },
    {
      name: "Marek Nowak",
      company: "Śląskie Usługi",
      text: "Kompleksowa obsługa i świetne rezultaty. Polecam każdemu przedsiębiorcy z regionu!",
      rating: 5
    },
    {
      name: "Katarzyna Wiśniewska",
      company: "Gliwice Business",
      text: "Profesjonalne podejście i zrozumienie specyfiki śląskiego rynku. Jesteśmy bardzo zadowoleni.",
      rating: 5
    }
  ];

  const services = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Strony Internetowe",
      description: "Nowoczesne, responsywne strony dostosowane do śląskiego rynku",
      features: ["Responsywny design", "Optymalizacja SEO", "Szybkie ładowanie", "Bezpieczeństwo"]
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Pozycjonowanie SEO",
      description: "Skuteczne pozycjonowanie w Google dla firm ze Śląska",
      features: ["Lokalne SEO", "Analiza konkurencji", "Optymalizacja treści", "Raportowanie"]
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "E-commerce",
      description: "Sklepy internetowe dla śląskich przedsiębiorców",
      features: ["Integracje płatności", "Zarządzanie produktami", "Analityka sprzedaży", "Wsparcie techniczne"]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Marketing Cyfrowy",
      description: "Kompleksowe strategie marketingowe dla regionu",
      features: ["Google Ads", "Facebook Ads", "Email marketing", "Analityka"]
    }
  ];

  const caseStudies = [
    {
      title: "Śląska Firma Budowlana",
      industry: "Budownictwo",
      result: "+150% więcej zapytań",
      description: "Kompleksowa strona z pozycjonowaniem lokalnym",
      image: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg"
    },
    {
      title: "Katowicki Sklep Meblowy",
      industry: "E-commerce",
      result: "+200% sprzedaży online",
      description: "Nowoczesny sklep internetowy z integracjami",
      image: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg"
    },
    {
      title: "Gliwicka Klinika",
      industry: "Medycyna",
      result: "+80% nowych pacjentów",
      description: "Strona z systemem rezerwacji online",
      image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          message: formData.message,
          lead_magnet: formData.leadMagnet
        }]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
        leadMagnet: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-white">
        <SEOHead 
          title="WebDKW - Strony Internetowe i SEO dla Firm ze Śląska | Katowice, Gliwice, Zabrze"
          description="Profesjonalne strony internetowe, pozycjonowanie SEO i marketing cyfrowy dla firm ze Śląska. Obsługujemy Katowice, Gliwice, Zabrze i cały region śląski."
          keywords="strony internetowe śląsk, SEO katowice, pozycjonowanie gliwice, marketing cyfrowy zabrze, tworzenie stron śląsk"
          canonicalUrl="https://webdkw.com/slask"
        />
        
        <Header />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center bg-blue-500/20 text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <MapPin className="w-4 h-4 mr-2" />
                  Obsługujemy cały region śląski
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Strony Internetowe dla Firm ze 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"> Śląska</span>
                </h1>
                
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Tworzymy profesjonalne strony internetowe i skutecznie pozycjonujemy firmy z Katowic, Gliwic, Zabrza i całego regionu śląskiego. Zwiększ swoją obecność online i pozyskaj więcej klientów.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <a 
                    href="#contact" 
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Bezpłatna Konsultacja
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                  <a 
                    href="#services" 
                    className="inline-flex items-center justify-center border-2 border-blue-400 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-400 hover:text-blue-900 transition-all duration-300"
                  >
                    Nasze Usługi
                  </a>
                </div>
                
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-blue-700/50">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                    <div className="text-blue-200 text-sm">Firm ze Śląska</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">5+</div>
                    <div className="text-blue-200 text-sm">Lat Doświadczenia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">98%</div>
                    <div className="text-blue-200 text-sm">Zadowolonych Klientów</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Darmowa Analiza!
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-6">Sprawdź Potencjał Swojej Strony</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Imię i nazwisko"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="text"
                        name="company"
                        placeholder="Nazwa firmy"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Telefon"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <textarea
                        name="message"
                        placeholder="Opisz swoje potrzeby..."
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="leadMagnet"
                        id="leadMagnet"
                        checked={formData.leadMagnet}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="leadMagnet" className="ml-2 text-sm text-blue-200">
                        Chcę otrzymać darmowy przewodnik "SEO dla firm ze Śląska"
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Wysyłanie...
                        </>
                      ) : (
                        <>
                          Otrzymaj Darmową Analizę
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </button>
                    
                    {submitStatus === 'success' && (
                      <div className="flex items-center text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Dziękujemy! Skontaktujemy się z Tobą w ciągu 24 godzin.
                      </div>
                    )}
                    
                    {submitStatus === 'error' && (
                      <div className="flex items-center text-red-400 text-sm">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Wystąpił błąd. Spróbuj ponownie lub zadzwoń do nas.
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Kompleksowe Usługi Dla Firm ze Śląska
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Oferujemy pełen zakres usług internetowych dostosowanych do specyfiki śląskiego rynku i potrzeb lokalnych przedsiębiorców.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
                  <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <a href="#contact" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 flex items-center">
                      Dowiedz się więcej
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Sukcesy Naszych Klientów ze Śląska
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Zobacz, jak pomogliśmy firmom z regionu śląskiego osiągnąć spektakularne rezultaty w internecie.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {study.result}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-sm text-blue-600 font-semibold mb-2">{study.industry}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{study.title}</h3>
                    <p className="text-gray-600 mb-4">{study.description}</p>
                    
                    <a href="#contact" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 flex items-center">
                      Zobacz szczegóły
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Co Mówią o Nas Klienci ze Śląska
              </h2>
              <p className="text-xl text-gray-600">
                Opinie przedsiębiorców z Katowic, Gliwic, Zabrza i całego regionu
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl text-gray-700 text-center mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-blue-600 font-semibold">
                    {testimonials[currentTestimonial].company}
                  </div>
                </div>
              </div>
              
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-blue-600"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-blue-600"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Local SEO Section */}
        <section className="py-20 bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Pozycjonowanie Lokalne dla Firm ze Śląska
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                  Specjalizujemy się w pozycjonowaniu lokalnym, które pomaga firmom ze Śląska być widocznymi dla klientów z regionu. Nasze strategie SEO są dostosowane do specyfiki śląskiego rynku.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-500 rounded-lg p-3 mr-4">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Lokalne Frazy Kluczowe</h3>
                      <p className="text-blue-200">Optymalizujemy pod kątem fraz zawierających nazwy miast śląskich</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-500 rounded-lg p-3 mr-4">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Google Moja Firma</h3>
                      <p className="text-blue-200">Optymalizacja profilu w Google dla lepszej widoczności lokalnej</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-500 rounded-lg p-3 mr-4">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Analiza Konkurencji</h3>
                      <p className="text-blue-200">Badamy konkurencję w regionie śląskim i tworzymy lepsze strategie</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Miasta, które obsługujemy:</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'Katowice', 'Gliwice', 'Zabrze', 'Bytom',
                    'Sosnowiec', 'Ruda Śląska', 'Tychy', 'Dąbrowa Górnicza',
                    'Chorzów', 'Jaworzno', 'Mysłowice', 'Siemianowice Śląskie'
                  ].map((city, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-blue-100">{city}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                  <div className="flex items-center text-green-400 mb-2">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Lokalny Bonus</span>
                  </div>
                  <p className="text-green-100 text-sm">
                    Dla firm z regionu śląskiego oferujemy dodatkową optymalizację pod kątem lokalnych wydarzeń i trendów.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Skontaktuj się z Nami
              </h2>
              <p className="text-xl text-gray-600">
                Jesteśmy gotowi pomóc Twojej firmie ze Śląska osiągnąć sukces w internecie
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Dlaczego WebDKW?</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-lg p-3 mr-4">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Znajomość Lokalnego Rynku</h4>
                      <p className="text-gray-600">Doskonale znamy specyfikę śląskiego rynku i potrzeby lokalnych przedsiębiorców.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-lg p-3 mr-4">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Szybka Realizacja</h4>
                      <p className="text-gray-600">Realizujemy projekty sprawnie, bez zbędnych opóźnień.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-lg p-3 mr-4">
                      <Settings className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Kompleksowa Obsługa</h4>
                      <p className="text-gray-600">Od projektu strony po marketing - wszystko w jednym miejscu.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-lg p-3 mr-4">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Stały Kontakt</h4>
                      <p className="text-gray-600">Jesteśmy zawsze dostępni dla naszych klientów ze Śląska.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Dane Kontaktowe</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">+48 123 456 789</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">kontakt@webdkw.com</span>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">Obsługujemy cały region śląski</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Napisz do Nas</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nazwa firmy
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wiadomość *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Opisz swoje potrzeby i oczekiwania..."
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="leadMagnet"
                      id="leadMagnetForm"
                      checked={formData.leadMagnet}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="leadMagnetForm" className="ml-2 text-sm text-gray-700">
                      Chcę otrzymać darmowy przewodnik "SEO dla firm ze Śląska"
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Wysyłanie...
                      </>
                    ) : (
                      <>
                        Wyślij Wiadomość
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                  
                  {submitStatus === 'success' && (
                    <div className="flex items-center text-green-600 bg-green-50 p-4 rounded-lg">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Dziękujemy za wiadomość! Skontaktujemy się z Tobą w ciągu 24 godzin.
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="flex items-center text-red-600 bg-red-50 p-4 rounded-lg">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie lub zadzwoń do nas.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default SilesianLandingPage;