import { CheckCircle, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { track } from "../lib/analytics";
import { supabase } from "../lib/supabase";

const Loader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };
  return (
    <svg
      className={`animate-spin ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

const INTEREST_OPTIONS = [
  "Darmowy Audyt AI SEO",
  "Płatny Audyt AI SEO",
  "AI SEO",
  "GA4 / Analityka",
  "Google Ads",
  "Inne",
];

const SEOContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    message: "",
  });
  const [interests, setInterests] = useState<string[]>([
    "Darmowy Audyt AI SEO",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [rodoConsent, setRodoConsent] = useState(false);
  const [showRodoInfo, setShowRodoInfo] = useState(false);

  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!rodoConsent) {
      setError("Zgoda na przetwarzanie danych jest wymagana");
      setIsSubmitting(false);
      return;
    }

    // Enrich message with website + interests to avoid DB changes
    const enrichedMessage = [
      formData.message?.trim(),
      formData.website ? `\n\n[Strona WWW] ${formData.website}` : "",
      interests.length ? `\n[Zainteresowania] ${interests.join(", ")}` : "",
    ].join("");

    try {
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: enrichedMessage,
            lead_magnet: false,
          },
        ]);

      if (dbError) throw dbError;

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
              message: enrichedMessage,
              lead_magnet: false,
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
      }

      try {
        track({
          event: "form_submit",
          category: "lead",
          label: "contact_form_seo",
          form_id: "contact-form-seo",
          page: window.location.pathname,
          interests,
        });
      } catch {}
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        website: "",
        message: "",
      });
      setInterests([]);
    } catch (err) {
      console.error("Error submitting form:", err);
      try {
        track({
          event: "form_submit_error",
          category: "lead",
          label: "contact_form_seo",
          form_id: "contact-form-seo",
          page: window.location.pathname,
          error: String(err),
        });
      } catch {}
      setError(
        "Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub napisz bezpośrednio na email."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isAuditSelected = interests.includes("Darmowy Audyt AI SEO");
  const submitButtonText = isAuditSelected
    ? "Zamów bezpłatny audyt AI SEO"
    : "Wyślij wiadomość";

  if (isSubmitted) {
    return (
      <section id="kontakt" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Dziękujemy za zgłoszenie!
            </h2>
            <p className="text-gray-700 mb-2">
              Otrzymaliśmy Twoją wiadomość i odpowiemy najszybciej jak to
              możliwe.
            </p>
            <p className="text-gray-700 mb-2">
              Jeśli wybrałeś/aś audyt AI SEO, nasz specjalista skontaktuje się z
              Tobą w ciągu 24 godzin roboczych, aby omówić szczegóły.
            </p>
            <p className="font-medium text-gray-900 mt-4">
              Masz pilne pytanie? Zadzwoń: +48 881 046 689
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="kontakt" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Zamów bezpłatny audyt AI SEO dla swojej firmy
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sprawdź, gdzie Twoja firma traci pozycje w odpowiedziach AI i jakie
            możliwości wzrostu czekają na Ciebie.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
            >
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Twoje dane
                </h3>
                <p className="text-gray-600">
                  Wypełnij formularz, a skontaktujemy się w ciągu 24h
                </p>
              </div>

              <div className="grid gap-6 mb-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Imię i nazwisko *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                        placeholder="Jan Kowalski"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Adres e-mail *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                        placeholder="twoj@email.pl"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Strona internetowa *
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    placeholder="https://twojastrona.pl"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Jakich wyników oczekujesz?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    placeholder="Opisz krótko swoją firmę i czego oczekujesz od współpracy"
                  ></textarea>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Co Cię interesuje?
                </h3>
                <div className="flex flex-wrap gap-3">
                  {INTEREST_OPTIONS.map((option) => {
                    const isSelected = interests.includes(option);
                    const isSpecial = option === "Darmowy Audyt AI SEO";

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleInterest(option)}
                        className={`
                          px-4 py-2 rounded-full font-medium transition-all duration-200 border-2
                          ${isSpecial ? "text-base font-semibold" : "text-sm"}
                          ${
                            isSelected
                              ? "bg-primary-500 text-white border-primary-500" // Zaznaczony: border w kolorze tła (niewidoczny)
                              : isSpecial
                              ? "bg-primary-100 text-primary-800 hover:bg-primary-200 border-primary-500" // Specjalny: zawsze widoczny border
                              : "bg-gray-100 text-gray-800 border-transparent hover:border-gray-300" // Zwykły: border tylko na hover
                          }
                        `}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="rodo"
                      type="checkbox"
                      checked={rodoConsent}
                      onChange={(e) => setRodoConsent(e.target.checked)}
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                      required
                    />
                  </div>
                  <label htmlFor="rodo" className="ml-2 text-sm text-gray-600">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu
                    odpowiedzi na zapytanie*{" "}
                    <button
                      type="button"
                      onClick={() => setShowRodoInfo(!showRodoInfo)}
                      className="text-primary-600 hover:underline"
                    >
                      (więcej)
                    </button>
                  </label>
                </div>
                {showRodoInfo && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych
                    zgodnie z ustawą o ochronie danych osobowych w celu
                    wysyłania informacji handlowej. Podanie danych osobowych
                    jest dobrowolne. Zostałem poinformowany, że przysługuje mi
                    prawo dostępu do swoich danych, możliwości ich poprawiania,
                    żądania zaprzestania ich przetwarzania. Administratorem
                    danych jest DM.me Dawid Myszka ul. Bolesława Chrobrego
                    32/103, Katowice 40-881.
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-5 py-4 text-center transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader size="sm" /> Wysyłanie...
                  </span>
                ) : (
                  submitButtonText
                )}
              </button>
              <p className="text-sm text-gray-500 text-center mt-4">
                * Pola wymagane. Odpowiadamy w ciągu 24 godzin.
              </p>
            </form>
          </div>

          {/* Contact Info & Photo */}
          <div className="space-y-8">
            {/* Author/Trust Box */}
            <div className="bg-gray-50 p-8 rounded-2xl flex items-center gap-6">
              <img
                src="/images/Kamil-Krukowski-small.webp"
                alt="Kamil Krukowski - Specjalista AI SEO"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                loading="lazy"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Masz pytania?
                </h3>
                <p className="text-gray-600 mt-1">
                  Chętnie na nie odpowiem. Jestem do Twojej dyspozycji.
                </p>
                <p className="font-semibold text-gray-800 mt-3">
                  Kamil Krukowski
                </p>
                <p className="text-sm text-gray-500">Specjalista AI SEO</p>
              </div>
            </div>

            {/* Process Timeline */}
            <div className="bg-primary-50 border border-primary-100 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Co stanie się po wysłaniu formularza?
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div className="w-0.5 h-full bg-primary-100 mt-2"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Potwierdzenie zgłoszenia
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      W ciągu 24h roboczych potwierdzimy otrzymanie Twojego
                      zgłoszenia i rozpoczęcie prac nad audytem.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div className="w-0.5 h-full bg-primary-100 mt-2"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Przygotowanie audytu
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Przeanalizujemy Twoją stronę pod kątem AI SEO i
                      przygotujemy raport z najważniejszymi wnioskami i
                      rekomendacjami.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Omówienie wyników
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Zaproponujemy termin rozmowy, podczas której omówimy
                      wyniki audytu i odpowiemy na Twoje pytania dotyczące
                      możliwości współpracy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOContactForm;
