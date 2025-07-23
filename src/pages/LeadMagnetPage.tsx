import { ArrowLeft, CheckCircle, Download, FileText, Star } from "lucide-react";
import React, { useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SEOHead from "../components/SEOHead";
import { supabase } from "../lib/supabase";

const LeadMagnetPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Save to database first (this is the most important part)
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            message:
              "Pobranie Lead Magnet - Checklista 15 elementów skutecznej strony",
            lead_magnet: true,
          },
        ]);

      if (dbError) throw dbError;

      // Try to send emails via edge function (optional - if it fails, form is still submitted)
      try {
        const emailResponse = await fetch(
          `${
            import.meta.env.VITE_SUPABASE_URL
          }/functions/v1/send-contact-email`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              company: formData.company,
              message:
                "Pobranie Lead Magnet - Checklista 15 elementów skutecznej strony",
              lead_magnet: true,
            }),
          }
        );

        if (!emailResponse.ok) {
          console.warn(
            "Email sending failed, but form was submitted successfully"
          );
        }
      } catch (emailError) {
        console.warn("Email function error:", emailError);
        // Don't throw - form submission was successful
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const checklistItems = [
    "Jasno zdefiniowany cel strony i grupa docelowa",
    "Responsywny design dostosowany do wszystkich urządzeń",
    "Szybkość ładowania poniżej 3 sekund",
    "Intuicyjna nawigacja i struktura informacji",
    "Przekonująca propozycja wartości w nagłówku",
    "Wyraźne wezwania do działania (CTA)",
    "Formularze kontaktowe zoptymalizowane pod konwersję",
    "Dowody społeczne: opinie, referencje, case studies",
    "Optymalizacja SEO na stronie",
    "Certyfikat SSL i podstawowe zabezpieczenia",
    "Integracja z Google Analytics i narzędziami śledzenia",
    "Zgodność z RODO i polityką prywatności",
    "Testowanie na różnych przeglądarkach",
    "Backup i plan awaryjny",
    "Plan promocji i strategia content marketingu",
  ];

  if (isSubmitted) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-gray-50">
          <SEOHead
            title="Dziękujemy za pobranie materiału | WebDKW"
            description="Dziękujemy za pobranie checklisty. Sprawdź swoją skrzynkę email, aby uzyskać dostęp do materiału."
            keywords="checklist, lead magnet, strony internetowe, SEO"
            url="https://webdkw.net/lead-magnet"
          />
          <Header />
          <main className="pt-20">
            <section className="py-20">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white rounded-2xl shadow-xl p-12">
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-8" />
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Dziękujemy! Checklist jest już w drodze
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Sprawdź skrzynkę email (również spam) - powinieneś otrzymać
                    link do pobrania w ciągu kilku minut.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      Co dalej?
                    </h3>
                    <ul className="text-blue-800 text-left space-y-2">
                      <li>✅ Pobierz i przejrzyj checklistę</li>
                      <li>✅ Oceń swoją obecną stronę</li>
                      <li>✅ Zidentyfikuj obszary do poprawy</li>
                      <li>
                        ✅ Skontaktuj się ze mną, jeśli potrzebujesz pomocy
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <Link
                      to="/"
                      className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Wróć na stronę główną
                    </Link>
                    <div>
                      <Link
                        to="/kontakt"
                        className="text-orange-500 hover:text-orange-600 font-semibold"
                      >
                        Lub umów się na bezpłatną konsultację
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead
          title="Darmowa Checklist: 15 kluczowych elementów skutecznej strony | WebDKW"
          description="Pobierz darmową checklistę i sprawdź, czy Twoja strona zawiera wszystkie elementy niezbędne do generowania zapytań i sprzedaży online."
          keywords="checklist, lead magnet, strony internetowe, SEO"
          url="https://webdkw.net/lead-magnet"
        />
        <Header />

        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-4 mb-8">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Powrót na stronę główną</span>
                </Link>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <FileText className="h-16 w-16" />
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Darmowa Checklist: 15 kluczowych elementów skutecznej strony
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  Sprawdź, czy Twoja strona zawiera wszystkie elementy, które są
                  niezbędne do generowania zapytań i sprzedaży online.
                </p>

                <div className="flex items-center justify-center space-x-6 text-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="h-6 w-6 fill-current" />
                    <span>Wartość 299 PLN</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="h-6 w-6" />
                    <span>PDF do pobrania</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6" />
                    <span>Gotowe do użycia</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Pobierz checklistę za darmo
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Wypełnij formularz, a w ciągu kilku minut otrzymasz link do
                    pobrania na swój email. Bez spamu, bez ukrytych kosztów.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-bold text-gray-900 mb-2"
                      >
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Jan Kowalski"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-bold text-gray-900 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="jan@firma.pl"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-bold text-gray-900 mb-2"
                      >
                        Nazwa firmy (opcjonalnie)
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="ABC Sp. z o.o."
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Download className="h-5 w-5" />
                      <span>
                        {isSubmitting
                          ? "Wysyłanie..."
                          : "Pobierz checklistę za darmo"}
                      </span>
                    </button>

                    <p className="text-sm text-gray-500 text-center">
                      Gwarantuję, że nie otrzymasz spamu. Możesz zrezygnować z
                      subskrypcji w każdej chwili.
                    </p>
                  </form>
                </div>

                {/* Preview */}
                <div>
                  <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Co znajdziesz w checkliście:
                    </h3>
                    <div className="space-y-3">
                      {checklistItems.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-bold text-blue-900 mb-2">
                      💡 Dlaczego ta checklist jest wartościowa?
                    </h4>
                    <p className="text-blue-800">
                      Bazuje na 5+ latach doświadczenia i analizie setek
                      projektów. Każdy punkt to konkretny element, który
                      bezpośrednio wpływa na wyniki biznesowe strony.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Dołącz do 500+ przedsiębiorców, którzy pobrali tę checklistę
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    500+
                  </div>
                  <div className="text-gray-600">Pobrań w ciągu 3 miesięcy</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    4.9/5
                  </div>
                  <div className="text-gray-600">
                    Średnia ocena przydatności
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    89%
                  </div>
                  <div className="text-gray-600">
                    Znalazło błędy na swojej stronie
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default LeadMagnetPage;
