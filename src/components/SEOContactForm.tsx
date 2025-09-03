import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Globe,
  ListChecks,
  Mail,
  Phone,
} from "lucide-react";
import React, { useState } from "react";
import { track } from "../lib/analytics";
import { supabase } from "../lib/supabase";

const INTEREST_OPTIONS = [
  "SEO",
  "Audyt SEO AI (darmowy)",
  "Płatny Audyt AEO",
  "GA4 / Analityka",
  "Content / AI",
  "Google Ads",
  "Local SEO / GBP",
  "Inne",
];

const SEOContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    website: "",
    message: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
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
      setError("Wymagana jest zgoda na przetwarzanie danych osobowych");
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
            company: formData.company,
            phone: formData.phone,
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
              company: formData.company,
              phone: formData.phone,
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
        company: "",
        phone: "",
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

  if (isSubmitted) {
    return (
      <section id="kontakt" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dziękuję za wiadomość!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Otrzymałem Twoje zapytanie i odpowiem w ciągu 24 godzin.
            </p>
            <p className="text-gray-500">
              W pilnych sprawach dzwoń: <strong>+48 881 046 689</strong>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="kontakt" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Formularz SEO — bezpłatna konsultacja i wycena
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Wypełnij formularz — sprawdzimy potencjał AI SEO Twojej strony i
            wrócimy z rekomendacjami.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <form
              id="contact-form-seo"
              data-gtm-form="contact_seo"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
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
                    htmlFor="company"
                    className="block text-sm font-bold text-gray-900 mb-2"
                  >
                    Nazwa firmy
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
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
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
                    htmlFor="phone"
                    className="block text-sm font-bold text-gray-900 mb-2"
                  >
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="+48 123 456 789"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-bold text-gray-900 mb-2"
                >
                  Adres Twojej strony internetowej
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="https://twojadomena.pl"
                  />
                  <Globe className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Interests checklist */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Czym jesteś zainteresowany?
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {INTEREST_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        checked={interests.includes(opt)}
                        onChange={() => toggleInterest(opt)}
                      />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-bold text-gray-900 mb-2"
                >
                  Opisz swój projekt *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="Napisz, z czym potrzebujesz pomocy (SEO/AEO/GA4/Ads itd.)..."
                />
              </div>

              {/* RODO */}
              <div className="relative">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="rodo-consent-seo"
                      type="checkbox"
                      checked={rodoConsent}
                      onChange={(e) => setRodoConsent(e.target.checked)}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="rodo-consent-seo" className="text-gray-600">
                      Zapoznałem/am się z{" "}
                      <button
                        type="button"
                        className="text-orange-500 hover:text-orange-700 underline"
                        onClick={() => setShowRodoInfo(!showRodoInfo)}
                        onMouseEnter={() => setShowRodoInfo(true)}
                        onMouseLeave={() => setShowRodoInfo(false)}
                      >
                        informacją o administratorze i przetwarzaniu danych
                      </button>
                      . *
                    </label>
                  </div>
                </div>
                {showRodoInfo && (
                  <div className="absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-xl border border-gray-200 text-sm text-gray-700 max-w-md">
                    <p>
                      Wyrażam zgodę na przetwarzanie moich danych osobowych
                      zgodnie z ustawą o ochronie danych osobowych w celu
                      wysyłania informacji handlowej. Podanie danych osobowych
                      jest dobrowolne. Zostałem poinformowany, że przysługuje mi
                      prawo dostępu do swoich danych, możliwości ich
                      poprawiania, żądania zaprzestania ich przetwarzania.
                      Administratorem danych jest DM.me Dawid Myszka ul.
                      Bolesława Chrobrego 32/103, Katowice 40-881.
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <button
                id="contact-seo-submit"
                data-gtm="contact_seo_submit"
                data-gtm-location="contact_form_seo"
                type="submit"
                disabled={isSubmitting || !rodoConsent}
                className="w-full bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>
                  {isSubmitting ? "Wysyłanie..." : "Wyślij zapytanie SEO"}
                </span>
                {!isSubmitting && <ArrowRight className="h-5 w-5" />}
              </button>

              <p className="text-sm text-gray-500 text-center">
                * Pola wymagane. Odpowiem w ciągu 24 godzin.
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

            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ListChecks className="h-6 w-6 text-orange-500" /> Jak
                pracujemy
              </h3>
              <ul className="text-gray-700 text-sm space-y-2 list-disc pl-5">
                <li>Szybka weryfikacja AI/SEO readiness</li>
                <li>Telefon zwrotny do 24h</li>
                <li>
                  Propozycja kolejnych kroków: Audyt SEO AI → Płatny Audyt AEO →
                  abonament
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Kontakt bezpośredni
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <a
                      id="contact-email-seo"
                      data-gtm="contact_email"
                      data-gtm-location="contact_section_seo"
                      href="mailto:contact.dkwgroup@gmail.com"
                      onClick={() =>
                        track({
                          event: "contact_click",
                          category: "engagement",
                          method: "email",
                          location: "contact_section_seo",
                        })
                      }
                      className="text-orange-500 hover:text-orange-600"
                    >
                      contact.dkwgroup@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Telefon</div>
                    <a
                      id="contact-phone-seo"
                      data-gtm="contact_phone"
                      data-gtm-location="contact_section_seo"
                      href="tel:+48881046689"
                      onClick={() =>
                        track({
                          event: "contact_click",
                          category: "engagement",
                          method: "phone",
                          location: "contact_section_seo",
                        })
                      }
                      className="text-orange-500 hover:text-orange-600"
                    >
                      +48 881 046 689
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      Godziny pracy
                    </div>
                    <div className="text-gray-600">Pon-Pt: 9:00-17:00</div>
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
