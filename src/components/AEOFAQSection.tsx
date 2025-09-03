import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const AEOFAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqs = [
    {
      question: "Czym różni się pozycjonowanie AEO od tradycyjnego SEO?",
      answer:
        "Tradycyjne SEO koncentruje się na wyświetlaniu w wynikach wyszukiwania Google. AEO (Answer Engine Optimization) to pozycjonowanie pod AI Overviews - nową funkcję Google, gdzie sztuczna inteligencja odpowiada bezpośrednio na pytania użytkowników. Gdy ktoś pyta Google o prawnika w Katowicach, AI może od razu polecić Twoją kancelarię, zamiast pokazywać listę linków. To oznacza, że użytkownicy mogą nigdy nie dotrzeć do tradycyjnych wyników SEO.",
    },
    {
      question: "Czy moja firma rzeczywiście potrzebuje pozycjonowania pod AI?",
      answer:
        "AI Overviews są już aktywne w Polsce i stale się rozwijają. Google oficjalnie potwierdził, że to przyszłość wyszukiwania. Firmy, które nie przygotują się na tę zmianę, staną się niewidoczne dla klientów szukających pomocy AI. To nie jest kwestia 'czy', ale 'kiedy' Twoja konkurencja zacznie dominować w odpowiedziach AI. Lepiej być pierwszym niż gonić.",
    },
    {
      question: "Jak szybko mogę spodziewać się pierwszych rezultatów?",
      answer:
        "Pierwsze efekty w postaci pojawienia się w Answer Share™ (udział w odpowiedziach AI) możesz zobaczyć już po 2-4 tygodniach. Znaczące rezultaty - gdy AI będzie regularnie polecać Twoją firmę - osiągniesz w ciągu 2-4 miesięcy. Pełna dominacja w odpowiedziach AI dla kluczowych zapytań w Twojej branży następuje zwykle po 4-6 miesiącach systematycznej pracy.",
    },
    {
      question:
        "Dlaczego Audyt Potencjału AEO kosztuje 800 zł, skoro inne agencje oferują darmowe analizy?",
      answer:
        "Darmowe analizy to zwykle automatyczne raporty wygenerowane przez narzędzia. Nasz Audyt Potencjału AEO to 100% ręcznej pracy eksperta, który przez kilka dni analizuje Twoją branżę, konkurencję i potencjał dominacji w AI. Otrzymujesz konkretny plan działania na 90 dni, nie ogólniki. Plus gwarancja zwrotu, jeśli uznasz, że audyt nie dostarczył wartości.",
    },
    {
      question: "Czy gwarantujecie rezultaty opisane w pakietach?",
      answer:
        "Tak! W pakiecie 'Lider Branży' gwarantujemy, że Twoja firma pojawi się w minimum 30% odpowiedzi AI dla top 10 zapytań w Twojej branży w ciągu 6 miesięcy. To pierwsza taka gwarancja na polskim rynku. Jeśli nie osiągniemy tego rezultatu, przedłużamy współpracę bez dodatkowych kosztów lub zwracamy różnicę.",
    },
    {
      question: "Co się stanie z moją stroną, jeśli Google zmieni algorytm AI?",
      answer:
        "Nasz AI-Growth Framework™ jest odporny na zmiany algorytmów, bo bazuje na fundamentalnych zasadach: tworzeniu wartościowej wiedzy, budowaniu autorytetu i odpowiadaniu na rzeczywiste pytania klientów. To samo podejście, które sprawdza się w SEO od lat. Dodatkowo stale monitorujemy zmiany w AI i dostosowujemy strategie.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Najczęstsze pytania o pozycjonowanie AEO i GEO
          </h2>
          <p className="text-xl text-gray-600">
            Odpowiedzi na pytania, które najczęściej otrzymujemy od firm
            przygotowujących się na erę AI. Nie znajdziesz tutaj swojego? Napisz
            do nas!
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
                    <Minus className="h-6 w-6 text-primary-500" />
                  ) : (
                    <Plus className="h-6 w-6 text-primary-500" />
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
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <p className="text-primary-800 font-semibold">
              💬 Masz inne pytanie o AI SEO? Skontaktuj się z nami - odpowiemy w
              ciągu 24 godzin!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AEOFAQSection;
