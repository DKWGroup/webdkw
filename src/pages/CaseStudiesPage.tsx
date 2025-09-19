import { ArrowLeft, ArrowRight, Calendar, Tag, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Project, supabase } from "../lib/supabase";

const CaseStudiesPage = () => {
  const [caseStudies, setCaseStudies] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("case_study", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
    } catch (error) {
      console.error("Error fetching case studies:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayCaseStudies = caseStudies;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie case studies...</p>
        </div>
      </div>
    );
  }

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
                Case Studies
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Szczegółowe analizy naszych projektów z opisem wyzwań, rozwiązań
                i mierzalnych rezultatów biznesowych.
              </p>
            </div>
          </div>
        </section>

        {/* Case studies grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {displayCaseStudies.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="max-w-2xl mx-auto px-4">
                  <div className="text-6xl mb-6">📊</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Case studies będą wkrótce dostępne
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Pracuję nad szczegółowymi opisami naszych projektów, które
                    pokażą Ci, jak pomagamy firmom osiągać ich cele biznesowe
                    poprzez nowoczesne rozwiązania internetowe.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      to="/portfolio"
                      className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Zobacz portfolio
                    </Link>
                    <Link
                      to="/kontakt"
                      className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Skontaktuj się ze mną
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {displayCaseStudies.map((caseStudy, index) => (
                  <article
                    key={caseStudy.id}
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                      index === 0 ? "lg:col-span-2" : ""
                    }`}
                  >
                    <div
                      className={`${
                        index === 0 ? "lg:grid lg:grid-cols-2" : ""
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={caseStudy.image_url}
                          alt={caseStudy.title}
                          className={`w-full object-cover ${
                            index === 0 ? "h-64 lg:h-full" : "h-48"
                          }`}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Case Study
                          </span>
                        </div>
                      </div>

                      <div className={`p-6 ${index === 0 ? "lg:p-8" : ""}`}>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{caseStudy.completion_date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag className="h-4 w-4" />
                            <span>{caseStudy.category}</span>
                          </div>
                        </div>

                        <h2
                          className={`font-bold text-gray-900 mb-3 line-clamp-2 ${
                            index === 0 ? "text-2xl lg:text-3xl" : "text-xl"
                          }`}
                        >
                          {caseStudy.title}
                        </h2>

                        <p
                          className={`text-gray-600 leading-relaxed mb-4 ${
                            index === 0 ? "text-lg" : ""
                          }`}
                        >
                          {caseStudy.description}
                        </p>

                        {/* Results preview */}
                        {Array.isArray(caseStudy.results) &&
                          caseStudy.results.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-semibold text-gray-900 mb-3">
                                Kluczowe rezultaty:
                              </h4>
                              <div
                                className={`grid gap-3 ${
                                  index === 0 ? "grid-cols-3" : "grid-cols-2"
                                }`}
                              >
                                {caseStudy.results
                                  .slice(0, index === 0 ? 3 : 2)
                                  .map((result, idx) => (
                                    <div
                                      key={idx}
                                      className="text-center p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex justify-center mb-1 text-orange-500">
                                        <TrendingUp className="h-4 w-4" />
                                      </div>
                                      <div className="text-lg font-bold text-gray-900">
                                        {result.value}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {result.metric}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                        <Link
                          to={`/case-studies/${
                            caseStudy.case_study_slug || caseStudy.slug
                          }`}
                          className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                        >
                          <span>Przeczytaj pełny case study</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Twój projekt może być następnym case study
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Porozmawiajmy o Twoich celach i stwórzmy razem projekt, który
              będzie generował mierzalne rezultaty.
            </p>
            <Link
              to="/kontakt"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Umów bezpłatną konsultację
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CaseStudiesPage;
