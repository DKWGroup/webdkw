import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  ExternalLink,
  Lightbulb,
  Tag,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SEOHead from "../components/SEOHead";
import { Project, supabase } from "../lib/supabase";

interface CaseStudyData extends Project {
  case_study_header?: string;
  case_study_introduction?: string;
  case_study_goals?: string;
  case_study_implementation?: string;
  case_study_results?: string;
  case_study_summary?: string;
  case_study_cta?: string;
}

const CaseStudyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [caseStudy, setCaseStudy] = useState<CaseStudyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchCaseStudy();
    }
  }, [slug]);

  const fetchCaseStudy = async () => {
    try {
      // Try by case_study_slug first, then fallback to project slug
      let { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("case_study_slug", slug)
        .eq("case_study", true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const fallback = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .eq("case_study", true)
          .maybeSingle();
        if (fallback.error) throw fallback.error;
        data = fallback.data as any;
      }

      if (!data) {
        setError("Nie znaleziono case study");
      } else {
        setCaseStudy(data as any);
      }
    } catch (error) {
      console.error("Error fetching case study:", error);
      setError("Nie znaleziono case study");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie case study...</p>
        </div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Case study nie został znaleziony
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Przepraszamy, ale case study o podanym adresie nie istnieje lub
              został usunięty.
            </p>
            <Link
              to="/case-studies"
              className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Wróć do case studies</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead
          title={
            caseStudy.case_study_seo_title ||
            caseStudy.case_study_header ||
            caseStudy.title
          }
          description={
            caseStudy.case_study_meta_description || caseStudy.description
          }
          image={caseStudy.case_study_og_image || caseStudy.image_url}
          url={`https://webdkw.net/case-studies/${
            caseStudy.case_study_slug || caseStudy.slug
          }`}
          type="article"
          publishedTime={caseStudy.created_at}
          modifiedTime={caseStudy.updated_at}
        />
        <Header />

        <main className="pt-20">
          {/* Header section */}
          <section className="bg-white py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-4 mb-8">
                <Link
                  to="/case-studies"
                  className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Wróć do case studies</span>
                </Link>
              </div>

              {/* Case study header */}
              <article>
                <header className="mb-8">
                  <img
                    src={caseStudy.image_url}
                    alt={caseStudy.title}
                    className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg mb-8"
                  />

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{caseStudy.completion_date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span>{caseStudy.category}</span>
                    </div>
                    {caseStudy.project_url && (
                      <a
                        href={caseStudy.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 hover:text-orange-500 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Zobacz projekt</span>
                      </a>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {caseStudy.case_study_header || caseStudy.title}
                  </h1>

                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    {caseStudy.industry} • {caseStudy.category}
                  </p>
                </header>
              </article>
            </div>
          </section>

          {/* Case study content */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none">
                {/* Introduction */}
                {caseStudy.case_study_introduction && (
                  <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                      <Lightbulb className="h-8 w-8 text-orange-500" />
                      <h2 className="text-3xl font-bold text-gray-900 m-0">
                        Wprowadzenie
                      </h2>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                      <div className="prose prose-lg max-w-none text-gray-700">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        >
                          {caseStudy.case_study_introduction}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* Client profile and context */}
                {caseStudy.case_study_client_profile && (
                  <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                      <Lightbulb className="h-8 w-8 text-orange-500" />
                      <h2 className="text-3xl font-bold text-gray-900 m-0">
                        Profil klienta i kontekst
                      </h2>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                      <div className="prose prose-lg max-w-none text-gray-700">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        >
                          {caseStudy.case_study_client_profile}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* Goals */}
                {caseStudy.case_study_goals && (
                  <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                      <Target className="h-8 w-8 text-orange-500" />
                      <h2 className="text-3xl font-bold text-gray-900 m-0">
                        Cele projektu
                      </h2>
                    </div>
                    <div className="bg-blue-50 p-8 rounded-2xl border border-blue-200">
                      <div className="prose prose-lg max-w-none text-gray-700">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        >
                          {caseStudy.case_study_goals}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* Challenges */}
                {caseStudy.case_study_challenges && (
                  <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                      <Target className="h-8 w-8 text-orange-500" />
                      <h2 className="text-3xl font-bold text-gray-900 m-0">
                        Wyzwania
                      </h2>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                      <div className="prose prose-lg max-w-none text-gray-700">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        >
                          {caseStudy.case_study_challenges}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* Strategy and implementation */}
                {caseStudy.case_study_implementation && (
                  <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                      <CheckCircle className="h-8 w-8 text-orange-500" />
                      <h2 className="text-3xl font-bold text-gray-900 m-0">
                        Realizacja projektu
                      </h2>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                      <div className="prose prose-lg max-w-none text-gray-700 mb-6">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        >
                          {caseStudy.case_study_implementation}
                        </ReactMarkdown>
                      </div>
                      {caseStudy.case_study_strategy && (
                        <div className="prose prose-lg max-w-none text-gray-700 mb-6">
                          <h3 className="text-2xl font-bold">
                            Strategia i wdrożone działania
                          </h3>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          >
                            {caseStudy.case_study_strategy}
                          </ReactMarkdown>
                        </div>
                      )}

                      {/* Technologies used */}
                      {caseStudy.technologies &&
                        caseStudy.technologies.length > 0 && (
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3">
                              Użyte technologie:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {caseStudy.technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Results */}
                <div className="mb-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                    <h2 className="text-3xl font-bold text-gray-900 m-0">
                      Wyniki
                    </h2>
                  </div>

                  {/* Metrics */}
                  {Array.isArray(caseStudy.results) &&
                    caseStudy.results.length > 0 && (
                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {caseStudy.results.map((result, index) => (
                          <div
                            key={index}
                            className="text-center p-6 bg-green-50 rounded-xl border border-green-200"
                          >
                            <div className="text-4xl font-bold text-green-600 mb-2">
                              {result.value}
                            </div>
                            <div className="text-gray-700 font-semibold">
                              {result.metric}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Results description */}
                  {caseStudy.case_study_results && (
                    <div className="bg-green-50 p-8 rounded-2xl border border-green-200">
                      <div className="prose prose-lg max-w-none text-gray-700">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        >
                          {caseStudy.case_study_results}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conclusions */}
                {caseStudy.case_study_summary && (
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Podsumowanie i wnioski
                    </h2>
                    <div className="bg-gray-100 p-8 rounded-2xl">
                      <div className="prose prose-lg max-w-none text-gray-700">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        >
                          {caseStudy.case_study_summary}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* Links and CTAs */}
                {Array.isArray(caseStudy.case_study_links) &&
                  caseStudy.case_study_links.length > 0 && (
                    <div className="mb-12">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        🎯 Skorzystaj z efektów WebDKW
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {caseStudy.case_study_links.map((lnk, i) => (
                          <a
                            key={i}
                            href={lnk.url}
                            className="block p-4 rounded-xl border bg-white hover:shadow-md transition"
                          >
                            <div className="font-semibold text-orange-600">
                              {lnk.title}
                            </div>
                            <div className="text-sm text-gray-600 break-all">
                              {lnk.url}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {/* FAQ */}
                {Array.isArray(caseStudy.case_study_faqs) &&
                  caseStudy.case_study_faqs.length > 0 && (
                    <div className="mb-12">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        FAQ
                      </h2>
                      <div className="space-y-4">
                        {caseStudy.case_study_faqs.map((faq, i) => (
                          <div
                            key={i}
                            className="bg-white p-4 rounded-xl border"
                          >
                            <div className="font-semibold text-gray-900 mb-2">
                              {faq.question}
                            </div>
                            <div className="prose max-w-none text-gray-700">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                              >
                                {faq.answer}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {caseStudy.case_study_cta ||
                  "Chcesz podobne rezultaty dla swojego projektu?"}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Porozmawiajmy o Twoich celach i stwórzmy razem projekt, który
                będzie generował mierzalne rezultaty dla Twojego biznesu.
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
    </HelmetProvider>
  );
};

export default CaseStudyPage;
