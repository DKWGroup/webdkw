import { Search, Palette, Code, Rocket, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProcessSection = () => {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-orange-500" />,
      title: "Audyt strategiczny i analiza konkurencji",
      description: "Analizuję Twój biznes, konkurencję i cele. Definiujemy strategię konwersji i pozycjonowania.",
      duration: "1 tydzień"
    },
    {
      icon: <Palette className="h-8 w-8 text-orange-500" />,
      title: "Projektowanie UX/UI zoptymalizowane pod konwersję",
      description: "Tworzę design skupiony na konwersji, optymalizowany pod Twoją grupę docelową.",
      duration: "1-2 tygodnie"
    },
    {
      icon: <Code className="h-8 w-8 text-orange-500" />,
      title: "Programowanie i optymalizacja SEO",
      description: "Koduję stronę z naciskiem na wydajność, bezpieczeństwo i optymalizację pod wyszukiwarki.",
      duration: "2-3 tygodnie"
    },
    {
      icon: <Rocket className="h-8 w-8 text-orange-500" />,
      title: "Testy i wdrożenie",
      description: "Testujemy wszystkie funkcjonalności, uruchamiamy stronę i przekazujemy Ci pełną kontrolę.",
      duration: "1 tydzień"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-orange-500" />,
      title: "Wsparcie i optymalizacja wyników",
      description: "3 miesiące bezpłatnego wsparcia technicznego i optymalizacji wyników.",
      duration: "3 miesiące"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Sprawdzony proces tworzenia stron internetowych, który gwarantuje rezultaty
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          5 etapów współpracy, które zamieniają Twoją inwestycję w maszynkę do generowania klientów:
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-orange-200"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Mobile step number */}
                <div className="lg:hidden w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {index + 1}
                </div>
                
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                  <div className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      {step.icon}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        <p className="text-orange-500 font-semibold">{step.duration}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Step number - centered on timeline */}
                <div className="hidden lg:flex w-16 h-16 bg-orange-500 text-white rounded-full items-center justify-center text-2xl font-bold z-10 shadow-lg flex-shrink-0">
                  {index + 1}
                </div>

                {/* Spacer for alternating layout */}
                <div className={`hidden lg:block flex-1 ${index % 2 === 0 ? 'lg:pl-8' : 'lg:pr-8'}`}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
            <p className="text-green-800 font-semibold text-lg">
              ✅ Rezultat: Strona, która pracuje na Twój sukces 24/7
            </p>
          </div>
          
          <Link
            to="/proces-realizacji"
            className="inline-flex items-center space-x-2 bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Zobacz szczegółowy opis procesu współpracy</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ProcessSection