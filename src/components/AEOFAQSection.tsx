import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const AEOFAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqs = [
    {
      question: "Czym jest AI SEO i dlaczego jest ważne dla mojej firmy?",
      answer:
        "AI SEO to nowoczesne pozycjonowanie strony pod kątem wyszukiwarek wspieranych sztuczną inteligencją (np. Google AI Overview). Klasyczne SEO skupia się na frazach i linkach, a AI SEO dodatkowo dostosowuje treści pod nowe algorytmy AI, które dostarczają użytkownikowi gotowe odpowiedzi bez konieczności wchodzenia na stronę. Dlaczego to ważne? Bo jeśli Twoja firma nie pojawi się w tych wynikach, klienci trafią do konkurencji.",
    },
    {
      question: "Czy moja strona jest już niewidoczna w Google AI Overview?",
      answer:
        "Możliwe. Google AI Overview jest wdrażane stopniowo, ale w wielu branżach już teraz odpowiada zamiast strony firmowej, co oznacza, że użytkownicy nie klikają w Twój link. Prosty przykład: klient pyta w Google o usługę, a odpowiedź AI wyświetla dane konkurenta – a Ciebie tam nie ma. Możesz to sprawdzić już teraz w darmowym Raporcie AI SEO.",
    },
    {
      question: "Jakie konkretne efekty biznesowe mogę osiągnąć dzięki AI SEO?",
      answer:
        "AI SEO zwiększa szanse Twojej strony na widoczność w nowych wynikach Google, tworzonych przez sztuczną inteligencję. W praktyce przekłada się to na: większą liczbę odwiedzin strony, większe zainteresowanie Twoją ofertą i więcej zapytań od potencjalnych klientów. AI SEO pozwala także budować długoterminową przewagę nad konkurencją, która nie dostosowała się jeszcze do zmian w wyszukiwarce.",
    },
    {
      question:
        "Czy AI SEO zastąpi tradycyjne pozycjonowanie?",
      answer:
        "Nie, AI SEO nie zastępuje, a uzupełnia tradycyjne SEO. Klasyczne działania nadal są potrzebne, ale dzisiaj to za mało. AI SEO to dodatkowa warstwa optymalizacji, która przygotowuje stronę do widoczności w nowych wynikach tworzonych przez sztuczną inteligencję. Firmy, które zatrzymają się tylko na „starym SEO”, mogą tracić klientów.",
    },
    {
      question: "Ile kosztuje usługa AI SEO i jak wygląda proces współpracy?",
      answer:
        "Koszt zależy od wielkości strony i konkurencji w branży. Przygotowaliśmy dwa modele: AI SEO Start – jednorazowy audyt i wdrożenie podstawowych zmian od 500 zł; AI SEO PRO – pełna usługa abonamentowa od 1500 zł miesięcznie. Proces wygląda następująco: darmowy raport AI SEO, konsultacja online, przygotowanie planu działań, wdrożenie i regularna optymalizacja.",
    },
    {
      question: "Po jakim czasie zobaczę pierwsze rezultaty AI SEO?",
      answer:
        "Pierwsze zmiany w widoczności i CTR w Google zauważysz zwykle w ciągu kilku tygodni. Efekty sprzedażowe czy wzrost liczby zapytań najczęściej widoczne są w ciągu 2–3 miesięcy, w zależności od branży i konkurencji.",
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
            Najczęstsze pytania o pozycjonowanie AI SEO
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
