import React from 'react'
import { Link } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ArrowLeft, Award, Users, TrendingUp, Coffee, Target, Code, Heart } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'

const AboutPage = () => {
  const stats = [
    { icon: <Award className="h-8 w-8" />, number: "4+", label: "Lat doświadczenia" },
    { icon: <Users className="h-8 w-8" />, number: "20+", label: "Zadowolonych klientów" },
    { icon: <TrendingUp className="h-8 w-8" />, number: "250%", label: "Średni wzrost konwersji" },
    { icon: <Coffee className="h-8 w-8" />, number: "500+", label: "Kawy wypitych przy kodowaniu" }
  ]

  const values = [
    {
      icon: <Target className="h-12 w-12 text-orange-500" />,
      title: "Strategiczne podejście",
      description: "Każdy projekt rozpoczynam od dogłębnej analizy biznesu i celów. Nie tworzę 'ładnych stron' - tworzę narzędzia sprzedażowe."
    },
    {
      icon: <Code className="h-12 w-12 text-orange-500" />,
      title: "Jakość bez kompromisów",
      description: "Używam najnowszych technologii i najlepszych praktyk. Każda linia kodu jest przemyślana i zoptymalizowana."
    },
    {
      icon: <Heart className="h-12 w-12 text-orange-500" />,
      title: "Długoterminowe partnerstwo",
      description: "Nie jestem tylko wykonawcą - jestem partnerem w rozwoju Twojego biznesu. Dbam o Twój sukces jak o swój własny."
    }
  ]

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Tworzenie Stron i Sklepów Internetowych | Profesjonalne Usługi"
          description="Zaufaj ekspertom w tworzeniu stron i sklepów internetowych. Oferujemy kompleksowe usługi, od projektu po optymalizację SEO i marketing. Sprawdź nas!"
          keywords="strony internetowe, tworzenie stron www, sklepy internetowe, pozycjonowanie SEO, Google Ads, marketing internetowy, Warszawa"
          url="https://webdkw.pl"
        />
        
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
                  O nas
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Poznaj historię, wartości i filozofię pracy, która stoi za każdym projektem WebExpert.
                </p>
              </div>
            </div>
          </section>

          {/* Main about section */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Content */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Partner w rozwoju Twojego biznesu, 
                    <span className="text-orange-500"> nie tylko wykonawca</span>
                  </h2>
                  
                  <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-8">
                    <p>
                      Nazywam się <strong>Kamil Krukowski</strong> i jako ekspert WebDKW, należącego do DKW Group, od ponad 4 lat pomagam firmom B2B i usługowym budować silną i skuteczną obecność w internecie. Moim celem jest, aby Twoja inwestycja w stronę internetową przynosiła realne zyski.
                    </p>
                    
                    <p>
                    Zapomnij o "ładnych stronach", które nie generują leadów. Tworzę narzędzia sprzedażowe, które pracują dla Ciebie 24/7, generując wartościowe zapytania i zwiększając Twoją sprzedaż.
                    </p>
                    
                    <p>
                    Specjalizuję się w tworzeniu stron internetowych i optymalizacji SEO dla firm, które cenią sobie jakość leadów nad ich ilość. Jeśli szukasz partnera, który rozumie specyfikę rynku B2B i potrafi przełożyć Twoje cele biznesowe na konkretne działania w internecie, zapraszam do współpracy. Inwestycja w moją wiedzę i doświadczenie to gwarancja mierzalnych rezultatów i zwrotu z inwestycji.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="flex justify-center mb-3 text-orange-500">
                          {stat.icon}
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {stat.number}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div className="relative">
                  <div className="relative">
                    <img
                      src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Kamil Krukowski - Web Developer"
                      className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold">Kamil Krukowski</h3>
                      <p className="text-orange-300">Web Developer & SEO Strategist</p>
                    </div>
                  </div>

                  {/* Floating card */}
                  {/* <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-500 mb-1">5.0</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">Średnia ocena</div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </section>

          {/* Values section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Nasze wartości
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-6">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quote section */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 max-w-4xl mx-auto">
                "Nie chodzi o to, żeby mieć najładniejszą stronę w internecie. 
                Chodzi o to, żeby mieć stronę, która <span className="text-orange-500">najlepiej sprzedaje</span>."
              </blockquote>
              <cite className="text-gray-600 text-lg mt-4 block">- Kamil Krukowski</cite>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Gotowy na współpracę z ekspertem?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Porozmawiajmy o Twoim projekcie i wspólnie stwórzmy coś wyjątkowego.
              </p>
              <Link
                to="/kontakt"
                className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Umów bezpłatną konsultację
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  )
}

export default AboutPage