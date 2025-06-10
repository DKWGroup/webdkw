import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const FAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(0)

  const faqs = [
    {
      question: "Dlaczego nie warto wybierać najtańszych ofert z rynku?",
      answer: "Najtańsza opcja to często najdroższa inwestycja. Strony tworzone 'na szybko' za 2000 PLN wymagają przebudowy już po kilku miesiącach. Brak strategii, słaba optymalizacja i problemy techniczne generują dodatkowe koszty. Moja filozofia: lepiej zapłacić raz za rozwiązanie, które będzie działać przez lata, niż oszczędzać i później wydawać wielokrotnie więcej na naprawy."
    },
    {
      question: "Jak długo trwa realizacja projektu?",
      answer: "Pakiet Professional WordPress: 4-6 tygodni. Pakiet Custom Performance: 6-10 tygodni. Czas zależy od zakresu projektu i szybkości przekazywania materiałów przez klienta. Każdy projekt rozpoczynam od szczegółowej analizy i harmonogramu, który otrzymujesz przed rozpoczęciem prac."
    },
    {
      question: "Co wliczone jest w cenę pakietu?",
      answer: "Cena obejmuje kompletny projekt od A do Z: analizę strategiczną, projektowanie UX/UI, programowanie, optymalizację SEO, testy, wdrożenie oraz wsparcie techniczne. Dodatkowe koszty mogą wystąpić tylko przy niestandardowych integracjach zewnętrznych, o których informuję wcześniej."
    },
    {
      question: "Czy mogę zarządzać stroną samodzielnie po wdrożeniu?",
      answer: "Oczywiście! W przypadku WordPress dostajesz intuicyjny panel administracyjny plus szkolenie z obsługi. Dla rozwiązań custom tworzę dedykowany panel CMS dostosowany do Twoich potrzeb. Dodatkowo przygotowuję dokumentację i instrukcje obsługi."
    },
    {
      question: "Jak wygląda wsparcie techniczne po wdrożeniu?",
      answer: "Professional WordPress: 3 miesiące bezpłatnego wsparcia. Custom Performance: 6 miesięcy. Wsparcie obejmuje poprawki błędów, aktualizacje bezpieczeństwa i konsultacje. Po tym okresie oferuję abonamenty serwisowe lub wsparcie na godziny według potrzeb."
    },
    {
      question: "Czy gwarantujesz rezultaty biznesowe?",
      answer: "Nie mogę zagwarantować konkretnych liczb, bo sukces zależy od wielu czynników (jakość oferty, konkurencyjność rynku, budżet marketingowy). Mogę zagwarantować, że strona będzie technicznie perfekcyjna, zoptymalizowana pod konwersję i SEO. Moje portfolio pokazuje, że prawidłowo wykonane projekty generują średnio 200-400% wzrost konwersji."
    },
    {
      question: "Czy tworzysz sklepy internetowe?",
      answer: "Tak, specjalizuję się w sklepach e-commerce opartych na WooCommerce lub rozwiązaniach custom. Każdy sklep optymalizuję pod konwersję, integruje z systemami płatności, logistyki i analityki. Ceny sklepów ustalamy indywidualnie po analizie wymagań."
    },
    {
      question: "Jak przygotować się do współpracy?",
      answer: "Przed naszą konsultacją przygotuj: cele biznesowe strony, informacje o grupie docelowej, preferowany styl wizualny (przykłady stron, które Ci się podobają), listę funkcjonalności które musi mieć strona, oraz budżet jaki możesz przeznaczyć na projekt. To pozwoli mi lepiej dopasować rozwiązanie do Twoich potrzeb."
    }
  ]

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Najczęstsze pytania o tworzenie stron internetowych
          </h2>
          <p className="text-xl text-gray-600">
            Najczęstsze pytania, które otrzymuję od klientów. 
            Nie znajdziesz tutaj swojego? Napisz do mnie!
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
              >
                <h3 className="text-lg font-bold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openItem === index ? (
                    <Minus className="h-6 w-6 text-orange-500" />
                  ) : (
                    <Plus className="h-6 w-6 text-orange-500" />
                  )}
                </div>
              </button>
              
              {openItem === index && (
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

        <div className="text-center mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 font-semibold">
              💬 Masz inne pytanie? Skontaktuj się ze mną - odpowiem w ciągu 24 godzin!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection