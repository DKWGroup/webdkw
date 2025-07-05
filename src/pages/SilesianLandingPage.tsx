import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ArrowRight, MessageSquare, Settings, Lightbulb, ChevronLeft, ChevronRight, Star, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

const SilesianLandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'Zapytanie ze strony śląskiej'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [rodoConsent, setRodoConsent] = useState(false);
  const [showRodoInfo, setShowRodoInfo] = useState(false);

  const clients = [
    { name: "Akademia Lutowania", city: "Katowice", logo: "/images/clients/akademia-lutowania.webp" },
    { name: "Contenty", city: "Chorzów", logo: "/images/clients/contenty.webp" },
    { name: "Grzegorz Kusz", city: "Gliwice", logo: "/images/clients/gk.webp" },
    { name: "GlowUP", city: "Zabrze", logo: "/images/clients/glowup.webp" },
    { name: "Investment Partners", city: "Bytom", logo: "/images/clients/inp.svg" },
    { name: "MKHelicopters", city: "Ruda Śląska", logo: "/images/clients/mkhelicopters.webp" },
    { name: "WellDone", city: "Tychy", logo: "/images/clients/welldone.webp" }
  ];

  const testimonials = [
    {
      text: "Robota zrobiono na zicher! Strona śmigo, klienci dzwonią. Polecom tego ancuga!",
      author: "Grzegorz",
      company: "firma budowlano",
      city: "Gliwice"
    },
    {
      text: "Myślałach, że te internety to je czorno magia. A terozki mom tak gryfny sklep, że aż miło klikać. Dziynki!",
      author: "Barbara",
      company: "sklep z rynkodziełym",
      city: "Zabrze"
    },
    {
      text: "Niy do wiary! Strona działo jak szwajcarski zegar, a klienty sami dzwonią. Lepszego biznesu nie szło zrobić.",
      author: "Mariusz",
      company: "warsztat samochodowy",
      city: "Katowice"
    }
  ];

  const processSteps = [
    {
      title: "Gyszynk (Pogawędka)",
      description: "Godomy, coby zrozumieć Twój biznes",
      icon: <MessageSquare className="h-12 w-12 text-yellow-500" />
    },
    {
      title: "Szryń (Szkic)",
      description: "Projektujemy, jak to mo wyglondać",
      icon: <Lightbulb className="h-12 w-12 text-yellow-500" />
    },
    {
      title: "Bajtlowani (Majsterkowanie)",
      description: "Klepiemy kod, coby wszystko działało",
      icon: <Settings className="h-12 w-12 text-yellow-500" />
    },
    {
      title: "Glanc (Polerka)",
      description: "Dopiyszczomy detale i optymalizujemy",
      icon: <Star className="h-12 w-12 text-yellow-500" />
    },
    {
      title: "Fajer (Impreza!)",
      description: "Odpolomy strona i świętujemy Twój sukces!",
      icon: <CheckCircle className="h-12 w-12 text-yellow-500" />
    }
  ];

  const whyUs = [
    {
      title: "Godosz po naszymu",
      description: "Rozumiemy nie tylko Twoją mowę, ale i specyfikę śląskiego rynku",
      icon: <MessageSquare className="h-12 w-12 text-yellow-500" />
    },
    {
      title: "Niy robimy fuszerki",
      description: "U nas liczy się jakość i solidność. Twoja strona będzie działać bezawaryjnie",
      icon: <Settings className="h-12 w-12 text-yellow-500" />
    },
    {
      title: "Momy fantazjo",
      description: "Łączymy śląską pracowitość z nowoczesną kreatywnością",
      icon: <Lightbulb className="h-12 w-12 text-yellow-500" />
    }
  ];

  const dictionary = [
    { word: "Gryfny", definition: "ładny, fajny, super" },
    { word: "Porzondno", definition: "porządna, solidna" },
    { word: "Fuszerka", definition: "partactwo, byle jaka robota" },
    { word: "Karlus", definition: "chłopak, gość, swój człowiek" },
    { word: "Na zicher", definition: "na pewno, na 100%" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!rodoConsent) {
      setError('Wymagana jest zgoda na przetwarzanie danych osobowych');
      setIsSubmitting(false);
      return;
    }

    try {
      // Save to database first (this is the most important part)
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            lead_magnet: false
          }
        ]);

      if (dbError) throw dbError;

      // Try to send emails via edge function (optional - if it fails, form is still submitted)
      try {
        const emailResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            lead_magnet: false
          })
        });

        if (!emailResponse.ok) {
          console.warn('Email sending failed, but form was submitted successfully');
        }
      } catch (emailError) {
        console.warn('Email function error:', emailError);
        // Don't throw - form submission was successful
      }

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: 'Zapytanie ze strony śląskiej'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie lub napisz bezpośrednio na email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-gray-100">
          <SEOHead 
            title="Dziękujemy za wiadomość | Strony internetowe na Śląsku"
            description="Dziękujemy za kontakt. Odpowiemy na Twoje zapytanie w ciągu 24 godzin."
            keywords="strony internetowe, Śląsk, tworzenie stron www, Katowice, Gliwice, Zabrze"
            url="https://webdkw.net/slask"
          />
          
          <main>
            <section className="py-20">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white rounded-2xl shadow-xl p-12">
                  <CheckCircle className="h-20 w-20 text-yellow-500 mx-auto mb-8" />
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Dziynkujymy za wiadomość!
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Dostalimy Twoje zapytanie i odpowiemy w ciągu 24 godzin. 
                    Sprawdź skrzynkę email (również spam) w poszukiwaniu potwierdzenia i naszej odpowiedzi.
                  </p>
                  
                  <p className="text-gray-500 mb-8">
                    W pilnych sprawach dzwoń: <strong>+48 881 046 689</strong>
                  </p>
                  
                  <a
                    href="/"
                    className="inline-block bg-yellow-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition-all duration-300"
                  >
                    Wróć na strona główno
                  </a>
                </div>
              </div>
            </section>
          </main>
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-100">
        <SEOHead 
          title="Strony internetowe na Śląsku | Profesjonalne usługi web design"
          description="Tworzymy gryfne strony internetowe dla firm ze Śląska. Nowoczesny design, optymalizacja pod SEO i wsparcie techniczne. Sprawdź naszą ofertę!"
          keywords="strony internetowe, Śląsk, tworzenie stron www, Katowice, Gliwice, Zabrze"
          url="https://webdkw.net/slask"
        />
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.pexels.com/photos/2845219/pexels-photo-2845219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Panorama Śląska" 
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/90"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              TWOJA STRONA WYGLONDO JAK Z FAMILOKA PO PRZEJŚCIACH?
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
              Zrobimy Ci tak gryfno strona, że hej! Koniec z fuszerkom w internecie. 
              Czas na porzondno robota, kero zarobio na Wos piniądze.
            </p>
            
            <a 
              href="#contact" 
              className="inline-block bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-xl font-bold hover:bg-yellow-400 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              DEJ POZÓR! CHCA DARMOWO WYCENA
            </a>
          </div>
        </section>

        {/* Problems & Solutions Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Znamy te ślonskie bolączki... i momy na nie plastry!
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Konkurencja Ci ucieko?</h3>
                <div className="h-1 w-20 bg-yellow-500 mb-6"></div>
                <p className="text-gray-700 text-lg mb-4">
                  Wyprzedzymy ich na A4! Nasze strony są szybsze niż pyndolino do Warszawy.
                </p>
              </div>
              
              <div className="bg-gray-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Telefon niy dzwoni?</h3>
                <div className="h-1 w-20 bg-yellow-500 mb-6"></div>
                <p className="text-gray-700 text-lg mb-4">
                  Będzie dzwonił czynścij niż szwagier, co chce pożyczyć bor-maszyna. Generujemy realne zapytania.
                </p>
              </div>
              
              <div className="bg-gray-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Strona wyglondo staro jak węgiel?</h3>
                <div className="h-1 w-20 bg-yellow-500 mb-6"></div>
                <p className="text-gray-700 text-lg mb-4">
                  Będzie lśnić jak nowo glajza! Projektujemy nowoczesny i świeży design, który przyciąga klientów.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16">
              Karlusy ze Ślonska już nom zaufali
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {clients.map((client, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img 
                    src={client.logo} 
                    alt={client.name} 
                    className="h-16 object-contain mb-4 filter grayscale invert opacity-70"
                  />
                  <p className="text-center text-gray-400">{client.name}, {client.city}</p>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
                        <div className="text-yellow-500 text-6xl font-serif mb-6">"</div>
                        <p className="text-xl text-gray-300 mb-6 italic">
                          {testimonial.text}
                        </p>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl">
                            {testimonial.author.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <p className="font-bold">{testimonial.author}</p>
                            <p className="text-gray-400">{testimonial.company}, {testimonial.city}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-yellow-500 text-gray-900 p-2 rounded-full shadow-lg hover:bg-yellow-400 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-yellow-500 text-gray-900 p-2 rounded-full shadow-lg hover:bg-yellow-400 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Nasz Plan na Robota (w 5 szrytach)
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-yellow-300"></div>
              
              <div className="space-y-12">
                {processSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex flex-col md:flex-row items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="bg-gray-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center space-x-4 mb-4">
                          {step.icon}
                          <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        </div>
                        <p className="text-gray-700 text-lg">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Step number - centered on timeline */}
                    <div className="flex md:absolute md:left-1/2 md:transform md:-translate-x-1/2 my-8 md:my-0 z-10">
                      <div className="w-16 h-16 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className={`hidden md:block flex-1 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Czamu my, a niy jaki gorol z Warszawy?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {whyUs.map((item, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className="flex justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">
                Chcesz mieć strona, kero bydzie Twojom maszynkom do robienio piniyndzy?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Wypełnij formularz. Zadzwonimy, pogodomy. Bez zobowiązań.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold mb-2">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    placeholder="Francik Nowok"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="francik@firma.pl"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-700 bg-gray-800 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="+48 123 456 789"
                    />
                  </div>
                </div>

                {/* RODO Consent Checkbox */}
                <div className="relative">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="rodo-consent"
                        type="checkbox"
                        checked={rodoConsent}
                        onChange={(e) => setRodoConsent(e.target.checked)}
                        className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-700 rounded"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="rodo-consent" className="text-gray-300">
                        Zapoznałem/am się z{' '}
                        <button
                          type="button"
                          className="text-yellow-500 hover:text-yellow-400 underline"
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
                    <div className="absolute z-10 mt-2 p-4 bg-gray-700 rounded-lg shadow-xl border border-gray-600 text-sm text-gray-300 max-w-md">
                      <p>
                        Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z ustawą o ochronie danych osobowych w celu wysyłania informacji handlowej. Podanie danych osobowych jest dobrowolne. Zostałem poinformowany, że przysługuje mi prawo dostępu do swoich danych, możliwości ich poprawiania, żądania zaprzestania ich przetwarzania. Administratorem danych jest DM.me Dawid Myszka ul. Bolesława Chrobrego 32/103, Katowice 40-881.
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !rodoConsent}
                  className="w-full bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-xl font-bold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>{isSubmitting ? 'Wysyłanie...' : 'JO! BIERYMY SIE ZA ROBOTA!'}</span>
                  {!isSubmitting && <ArrowRight className="h-5 w-5" />}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-yellow-500 mb-6">Mały Słowniczek dla Goroli</h3>
                <div className="grid grid-cols-2 gap-4">
                  {dictionary.map((item, index) => (
                    <div key={index} className="mb-3">
                      <p className="font-bold text-yellow-400">{item.word}</p>
                      <p className="text-gray-400">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6">Kontakt</h3>
                <p className="mb-2">WebDKW - Profesjonalne strony internetowe</p>
                <p className="mb-2">Adres: Katowice, Śląsk</p>
                <p className="mb-2">Email: contact.dkwgroup@gmail.com</p>
                <p className="mb-2">Telefon: +48 881 046 689</p>
                <div className="mt-6">
                  <a href="/polityka-prywatnosci" className="text-yellow-400 hover:text-yellow-300">
                    Polityka prywatności
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} WebDKW. Wszyskie prawa obwarowane.</p>
            </div>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
};

export default SilesianLandingPage;