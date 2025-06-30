import { Star, Quote } from 'lucide-react'

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Anna Nowak",
      position: "CEO",
      company: "TechStart Solutions",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200",
      text: "Marcin podszedł do naszego projektu strategicznie. Nie tylko stworzył piękną stronę, ale przede wszystkim narzędzie, które generuje nam 3x więcej leadów niż poprzednia. ROI zwrócił się w 4 miesiące.",
      rating: 5
    },
    {
      name: "Tomasz Wiśniewski",
      position: "Founder",
      company: "EcoGreen Consulting",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200",
      text: "Po wdrożeniu SEO przez Marcina nasze zapytania wzrosły o 280%. Najważniejsze, że to są jakościowi klienci z odpowiednim budżetem. Współpraca przebiegła bez zarzutu.",
      rating: 5
    },
    {
      name: "Katarzyna Kowalczyk",
      position: "Marketing Director",
      company: "LuxuryHome Design",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200",
      text: "Marcin to nie tylko świetny developer, ale prawdziwy partner biznesowy. Jego doradztwo strategiczne pomogło nam podnieść średnią wartość zamówienia o 85%. Zdecydowanie polecam.",
      rating: 5
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mówią, że dobrze jest ze mną pracować
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Opinie moich klientów mówią więcej niż tysiąc słów. 
            Zobacz, co sądzą o współpracy ze mną.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="h-8 w-8 text-orange-500 mb-6" />
              
              <p className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {testimonial.position}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted by section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Zaufali mi:</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-3xl font-bold text-gray-400">TechCorp</div>
            <div className="text-3xl font-bold text-gray-400">InnovateLab</div>
            <div className="text-3xl font-bold text-gray-400">DigitalPro</div>
            <div className="text-3xl font-bold text-gray-400">StartupHub</div>
            <div className="text-3xl font-bold text-gray-400">WebSolutions</div>
            <div className="text-3xl font-bold text-gray-400">DataFlow</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection