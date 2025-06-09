import React from 'react'
import { Award, Users, TrendingUp, Coffee } from 'lucide-react'

const AboutSection = () => {
  const stats = [
    { icon: <Award className="h-8 w-8" />, number: "5+", label: "Lat doświadczenia" },
    { icon: <Users className="h-8 w-8" />, number: "50+", label: "Zadowolonych klientów" },
    { icon: <TrendingUp className="h-8 w-8" />, number: "300%", label: "Średni wzrost konwersji" },
    { icon: <Coffee className="h-8 w-8" />, number: "1000+", label: "Kawy wypitych przy kodowaniu" }
  ]

  return (
    <section id="o-mnie" className="py-20 bg-gray-50">
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
                Nazywam się <strong>Marcin Kowalski</strong> i od ponad 5 lat pomagam firmom 
                budować ich obecność online w sposób, który rzeczywiście przekłada się 
                na wyniki biznesowe.
              </p>
              
              <p>
                Moja filozofia jest prosta: <strong>każda strona internetowa musi się zwracać</strong>. 
                Nie tworzę "ładnych stron" - tworzę narzędzia sprzedażowe, które pracują 
                na Twój sukces 24 godziny na dobę.
              </p>
              
              <p>
                Specjalizuję się w projektach dla firm B2B i usługowych, gdzie każdy 
                lead ma wysoką wartość, a jakość jest ważniejsza niż ilość. 
                Moi klienci to firmy, które <strong>inwestują w jakość</strong> i oczekują 
                mierzalnych rezultatów.
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
                alt="Marcin Kowalski - Web Developer"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">Marcin Kowalski</h3>
                <p className="text-orange-300">Senior Web Developer & SEO Strategist</p>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-1">5.0</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">Średnia ocena</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 max-w-4xl mx-auto">
            "Nie chodzi o to, żeby mieć najładniejszą stronę w internecie. 
            Chodzi o to, żeby mieć stronę, która <span className="text-orange-500">najlepiej sprzedaje</span>."
          </blockquote>
          <cite className="text-gray-600 text-lg mt-4 block">- Marcin Kowalski</cite>
        </div>
      </div>
    </section>
  )
}

export default AboutSection