import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, MessageCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const FAQPage = () => {
  const [openItem, setOpenItem] = useState<number | null>(0)

  const faqs = [
    {
      category: "Ogólne",
      questions: [
        {
          question: "Dlaczego nie warto wybierać najtańszych ofert z rynku?",
          answer: "Najtańsza opcja to często najdroższa inwestycja. Strony tworzone 'na szybko' za 2000 PLN wymagają przebudowy już po kilku miesiącach. Brak strategii, słaba optymalizacja i problemy techniczne generują dodatkowe koszty. Moja filozofia: lepiej zapłacić raz za rozwiązanie, które będzie działać przez lata, niż oszczędzać i później wydawać wielokrotnie więcej na naprawy."
        },
        {
          question: "Jak długo trwa realizacja projektu?",
          answer: "Czas zależy od zakresu projektu i szybkości przekazywania materiałów przez klienta. Każdy projekt rozpoczynam od szczegółowej analizy i harmonogramu, który otrzymujesz przed rozpoczęciem prac."
        },
        {
          question: "Co wliczone jest w cenę pakietu?",
          answer: "Cena obejmuje kompletny projekt od A do Z: analizę strategiczną, projektowanie UX/UI, programowanie, optymalizację SEO, testy, wdrożenie oraz wsparcie techniczne. Dodatkowe koszty mogą wystąpić tylko przy niestandardowych integracjach zewnętrznych, o których informuję wcześniej."
        }
      ]
    },
    {
      category: "Techniczne",
      questions: [
        {
          question: "Czy mogę zarządzać stroną samodzielnie po wdrożeniu?",
          answer: "Oczywiście! W przypadku WordPress dostajesz intuicyjny panel administracyjny plus szkolenie z obsługi. Dla rozwiązań custom tworzę dedykowany panel CMS dostosowany do Twoich potrzeb. Dodatkowo przygotowuję dokumentację i instrukcje obsługi."
        },
        {
          question: "Jak wygląda wsparcie techniczne po wdrożeniu?",
          answer: "3 miesiące bezpłatnego wsparcia przy Wordpress. Wsparcie obejmuje poprawki błędów, aktualizacje bezpieczeństwa i konsultacje. Po tym okresie oferuję abonamenty serwisowe lub wsparcie na godziny według potrzeb."
        },
        {
          question: "Czy strona będzie szybka i zoptymalizowana?",
          answer: "Tak! Każda strona jest optymalizowana pod kątem szybkości ładowania, SEO i wydajności. Używam najnowszych technologii, optymalizuję obrazy, minimuję kod i konfiguruję caching. Cel to czas ładowania poniżej 3 sekund."
        }
      ]
    },
    {
      category: "Biznesowe",
      questions: [
        {
          question: "Czy gwarantujesz rezultaty biznesowe?",
          answer: "Nie mogę zagwarantować konkretnych liczb, bo sukces zależy od wielu czynników (jakość oferty, konkurencyjność rynku, budżet marketingowy). Mogę zagwarantować, że strona będzie technicznie perfekcyjna, zoptymalizowana pod konwersję i SEO. Moje portfolio pokazuje, że prawidłowo wykonane projekty generują średnio 200-400% wzrost konwersji."
        },
        {
          question: "Czy tworzysz sklepy internetowe?",
          answer: "Tak, wykonuję sklepy e-commerce opartych na WooCommerce lub rozwiązaniach custom. Każdy sklep optymalizuję pod konwersję, integruje z systemami płatności, logistyki i analityki. Ceny sklepów ustalamy indywidualnie po analizie wymagań."
        },
        {
          question: "Jak przygotować się do współpracy?",
          answer: "Przed naszą konsultacją przygotuj: cele biznesowe strony, informacje o grupie docelowej, preferowany styl wizualny (przykłady stron, które Ci się podobają), listę funkcjonalności które musi mieć strona, oraz budżet jaki możesz przeznaczyć na projekt. To pozwoli mi lepiej dopasować rozwiązanie do Twoich potrzeb."
        }
      ]
    },
    {
      category: "SEO i Marketing",
      questions: [
        {
          question: "Czy strona będzie widoczna w Google?",
          answer: "Każda strona jest podstawowo zoptymalizowana pod SEO (meta tagi, struktura URL, szybkość, responsywność). Dla lepszych rezultatów polecam dodatkowy pakiet SEO, który obejmuje research słów kluczowych, content marketing i link building."
        },
        {
          question: "Czy oferujesz kampanie reklamowe Google Ads?",
          answer: "Tak! Oferuję kompleksowe zarządzanie kampaniami Google Ads i Facebook Ads. Pakiety zaczynają się już od 600zł. Każda kampania jest optymalizowana pod ROI i generowanie leadów."
        },
        {
          question: "Jak długo trzeba czekać na efekty SEO?",
          answer: "Pierwsze efekty SEO widać po 2-3 miesiącach, znaczące rezultaty po 6 miesiącach. SEO to inwestycja długoterminowa - raz osiągnięte pozycje generują ruch przez lata bez dodatkowych kosztów reklamowych."
        }
      ]
    }
  ]

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  let questionIndex = 0

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
                Często zadawane pytania
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Znajdź odpowiedzi na najczęstsze pytania dotyczące współpracy, 
                procesu realizacji i naszych usług.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ sections */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-orange-500">
                  {category.category}
                </h2>
                
                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const currentIndex = questionIndex++
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleItem(currentIndex)}
                          className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
                        >
                          <h3 className="text-lg font-bold text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                          <div className="flex-shrink-0">
                            {openItem === currentIndex ? (
                              <Minus className="h-6 w-6 text-orange-500" />
                            ) : (
                              <Plus className="h-6 w-6 text-orange-500" />
                            )}
                          </div>
                        </button>
                        
                        {openItem === currentIndex && (
                          <div className="px-8 pb-6">
                            <div className="border-t border-gray-100 pt-6">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8 text-center">
              <MessageCircle className="h-16 w-16 text-orange-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nie znalazłeś odpowiedzi na swoje pytanie?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Skontaktuj się z nami bezpośrednio - odpowiemy w ciągu 24 godzin!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/kontakt"
                  className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Zadaj pytanie
                </Link>
                <a
                  href="mailto:marcin@webexpert.pl"
                  className="bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  Napisz email
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default FAQPage