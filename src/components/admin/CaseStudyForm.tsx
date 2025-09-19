import { AlertCircle, BookMarked, Eye, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Project, supabase } from "../../lib/supabase";
import MarkdownEditor from "./MarkdownEditor";

interface CaseStudyFormProps {
  project?: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

interface FormData {
  project_id: string;
  case_study_header: string;
  case_study_introduction: string;
  case_study_goals: string;
  case_study_implementation: string;
  case_study_results: string;
  case_study_summary: string;
  case_study_cta: string;
  case_study: boolean;
  // SEO
  case_study_seo_title: string;
  case_study_meta_description: string;
  case_study_slug: string;
  case_study_og_image: string;
  case_study_schema_jsonld: string;
  // Extended sections
  case_study_client_profile: string;
  case_study_objective: string;
  case_study_challenges: string;
  case_study_strategy: string;
  case_study_conclusions: string;
  case_study_links: Array<{ title: string; url: string }>;
  case_study_faqs: Array<{ question: string; answer: string }>;
}

interface FormErrors {
  project_id?: string;
  case_study_header?: string;
}

const CaseStudyForm: React.FC<CaseStudyFormProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [jsonLdError, setJsonLdError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    project_id: "",
    case_study_header: "",
    case_study_introduction: "",
    case_study_goals: "",
    case_study_implementation: "",
    case_study_results: "",
    case_study_summary: "",
    case_study_cta: "",
    case_study: true,
    case_study_seo_title: "",
    case_study_meta_description: "",
    case_study_slug: "",
    case_study_og_image: "",
    case_study_schema_jsonld: "",
    case_study_client_profile: "",
    case_study_objective: "",
    case_study_challenges: "",
    case_study_strategy: "",
    case_study_conclusions: "",
    case_study_links: [],
    case_study_faqs: [],
  });

  const selectedProject = useMemo(() => {
    return (projects || []).find((p) => p.id === formData.project_id) || null;
  }, [projects, formData.project_id]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setProjects(data || []);
      } catch (e) {
        console.error("Error loading projects", e);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [isOpen]);

  useEffect(() => {
    if (project) {
      setFormData({
        project_id: project.id,
        case_study_header: project.case_study_header || "",
        case_study_introduction: project.case_study_introduction || "",
        case_study_goals: project.case_study_goals || "",
        case_study_implementation: project.case_study_implementation || "",
        case_study_results: project.case_study_results || "",
        case_study_summary: project.case_study_summary || "",
        case_study_cta: project.case_study_cta || "",
        case_study: project.case_study ?? true,
        case_study_seo_title: project.case_study_seo_title || "",
        case_study_meta_description: project.case_study_meta_description || "",
        case_study_slug: project.case_study_slug || project.slug || "",
        case_study_og_image:
          project.case_study_og_image || project.image_url || "",
        case_study_schema_jsonld: project.case_study_schema_jsonld
          ? JSON.stringify(project.case_study_schema_jsonld, null, 2)
          : "",
        case_study_client_profile: project.case_study_client_profile || "",
        case_study_objective: project.case_study_objective || "",
        case_study_challenges: project.case_study_challenges || "",
        case_study_strategy: project.case_study_strategy || "",
        case_study_conclusions: project.case_study_conclusions || "",
        case_study_links: project.case_study_links || [],
        case_study_faqs: project.case_study_faqs || [],
      });
    } else {
      setFormData((prev) => ({ ...prev, project_id: "" }));
    }
    setErrors({});
    setShowPreview(false);
  }, [project, isOpen]);

  // When adding a case study and a project is selected from the dropdown,
  // prefill fields if that project already has case study content
  useEffect(() => {
    if (project) return; // in explicit edit mode we already prefilled above
    if (!formData.project_id) return;
    const p = projects.find((prj) => prj.id === formData.project_id);
    if (!p) return;
    setFormData((prev) => ({
      ...prev,
      case_study_header: p.case_study_header || prev.case_study_header,
      case_study_introduction:
        p.case_study_introduction || prev.case_study_introduction,
      case_study_goals: p.case_study_goals || prev.case_study_goals,
      case_study_implementation:
        p.case_study_implementation || prev.case_study_implementation,
      case_study_results: p.case_study_results || prev.case_study_results,
      case_study_summary: p.case_study_summary || prev.case_study_summary,
      case_study_cta: p.case_study_cta || prev.case_study_cta,
      case_study: p.case_study ?? prev.case_study,
      case_study_seo_title: p.case_study_seo_title || prev.case_study_seo_title,
      case_study_meta_description:
        p.case_study_meta_description || prev.case_study_meta_description,
      case_study_slug: p.case_study_slug || p.slug || prev.case_study_slug,
      case_study_og_image:
        p.case_study_og_image || p.image_url || prev.case_study_og_image,
      case_study_schema_jsonld: p.case_study_schema_jsonld
        ? JSON.stringify(p.case_study_schema_jsonld, null, 2)
        : prev.case_study_schema_jsonld,
      case_study_client_profile:
        p.case_study_client_profile || prev.case_study_client_profile,
      case_study_objective: p.case_study_objective || prev.case_study_objective,
      case_study_challenges:
        p.case_study_challenges || prev.case_study_challenges,
      case_study_strategy: p.case_study_strategy || prev.case_study_strategy,
      case_study_conclusions:
        p.case_study_conclusions || prev.case_study_conclusions,
      case_study_links: p.case_study_links || prev.case_study_links,
      case_study_faqs: p.case_study_faqs || prev.case_study_faqs,
    }));
  }, [formData.project_id, project, projects]);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.project_id) newErrors.project_id = "Wybierz projekt";
    if (!formData.case_study_header?.trim())
      newErrors.case_study_header = "Nagłówek jest wymagany";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;
    setSubmitError(null);
    setJsonLdError(null);
    setIsSubmitting(true);
    try {
      // Validate JSON-LD early
      let parsedJsonLd: any = null;
      if (formData.case_study_schema_jsonld?.trim()) {
        try {
          parsedJsonLd = JSON.parse(formData.case_study_schema_jsonld);
        } catch (err) {
          setJsonLdError("Niepoprawny JSON-LD. Sprawdź składnię.");
          return; // abort submit
        }
      }

      const payload = {
        case_study: formData.case_study,
        case_study_header: formData.case_study_header,
        case_study_introduction: formData.case_study_introduction,
        case_study_goals: formData.case_study_goals,
        case_study_implementation: formData.case_study_implementation,
        case_study_results: formData.case_study_results,
        case_study_summary: formData.case_study_summary,
        case_study_cta: formData.case_study_cta,
        case_study_seo_title: formData.case_study_seo_title || null,
        case_study_meta_description:
          formData.case_study_meta_description || null,
        case_study_slug: formData.case_study_slug || null,
        case_study_og_image: formData.case_study_og_image || null,
        case_study_schema_jsonld: parsedJsonLd,
        case_study_client_profile: formData.case_study_client_profile || null,
        case_study_objective: formData.case_study_objective || null,
        case_study_challenges: formData.case_study_challenges || null,
        case_study_strategy: formData.case_study_strategy || null,
        case_study_conclusions: formData.case_study_conclusions || null,
        case_study_links: formData.case_study_links || null,
        case_study_faqs: formData.case_study_faqs || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", formData.project_id)
        .select()
        .single();

      if (error) throw error;
      if (data) onSave(data);
      onClose();
    } catch (error) {
      console.error("Error saving case study:", error);
      const message =
        (error as any)?.message ||
        "Nie udało się zapisać case study. Spróbuj ponownie lub skontaktuj się z administratorem.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {project ? "Edytuj Case Study" : "Nowe Case Study"}
            </h2>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Podgląd</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(90vh-140px)]">
            {/* Form */}
            <div
              className={`${
                showPreview ? "w-1/2" : "w-full"
              } overflow-y-auto p-6`}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project selector */}
                {!project && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Projekt *
                    </label>
                    <select
                      value={formData.project_id}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          project_id: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                        errors.project_id ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="" disabled>
                        {loadingProjects
                          ? "Ładowanie projektów..."
                          : "Wybierz projekt"}
                      </option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.slug})
                        </option>
                      ))}
                    </select>
                    {errors.project_id && (
                      <span className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.project_id}
                      </span>
                    )}
                  </div>
                )}

                {/* Header */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Nagłówek Case Study *
                  </label>
                  <input
                    type="text"
                    value={formData.case_study_header}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        case_study_header: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                      errors.case_study_header
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={
                      selectedProject?.title ||
                      "np. Jak zwiększyliśmy konwersję o 250%"
                    }
                    maxLength={140}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.case_study_header && (
                      <span className="text-red-500 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.case_study_header}
                      </span>
                    )}
                    <span className="text-gray-500 text-sm ml-auto">
                      {formData.case_study_header.length}/140
                    </span>
                  </div>
                </div>

                {/* SEO Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.case_study_seo_title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          case_study_seo_title: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Tytuł SEO"
                      maxLength={70}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.case_study_slug}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          case_study_slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-ąęćłńóśżź]/g, "-")
                            .replace(/-+/g, "-")
                            .replace(/^-|-$/g, ""),
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="unikalny-slug"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Meta description
                    </label>
                    <textarea
                      value={formData.case_study_meta_description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          case_study_meta_description: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      rows={3}
                      placeholder="Krótki opis do wyników wyszukiwania"
                      maxLength={160}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Open Graph Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.case_study_og_image}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          case_study_og_image: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="https://.../og-image.png"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Schema JSON-LD
                    </label>
                    <textarea
                      value={formData.case_study_schema_jsonld}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          case_study_schema_jsonld: e.target.value,
                        }))
                      }
                      className="font-mono w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      rows={6}
                      placeholder='{"@context":"https://schema.org","@type":"Article",...}'
                    />
                    {jsonLdError && (
                      <p className="text-red-600 text-sm mt-1">{jsonLdError}</p>
                    )}
                  </div>
                </div>

                {/* Sections using MarkdownEditor */}
                {/* Extended structure sections */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Profil klienta i kontekst
                  </label>
                  <MarkdownEditor
                    initialValue={formData.case_study_client_profile}
                    onChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        case_study_client_profile: v,
                      }))
                    }
                    height="200px"
                    placeholder="Kim jest klient, branża, kontekst biznesowy..."
                  />
                </div>

                {/* Removed "Cel" section on request */}

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Wyzwania
                  </label>
                  <MarkdownEditor
                    initialValue={formData.case_study_challenges}
                    onChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        case_study_challenges: v,
                      }))
                    }
                    height="200px"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Strategia i wdrożone działania
                  </label>
                  <MarkdownEditor
                    initialValue={formData.case_study_strategy}
                    onChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        case_study_strategy: v,
                      }))
                    }
                    height="240px"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Wprowadzenie
                  </label>
                  <MarkdownEditor
                    initialValue={formData.case_study_introduction}
                    onChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        case_study_introduction: v,
                      }))
                    }
                    height="220px"
                    placeholder="Kontekst biznesowy, punkt wyjścia, problem do rozwiązania..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Cele projektu
                  </label>
                  <MarkdownEditor
                    initialValue={formData.case_study_goals}
                    onChange={(v) =>
                      setFormData((prev) => ({ ...prev, case_study_goals: v }))
                    }
                    height="200px"
                    placeholder="Lista celów biznesowych, KPI, oczekiwane wyniki..."
                  />
                </div>

                {/* Removed "Realizacja" section on request */}

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Wyniki
                  </label>
                  <MarkdownEditor
                    initialValue={formData.case_study_results}
                    onChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        case_study_results: v,
                      }))
                    }
                    height="200px"
                    placeholder="Opis rezultatów, interpretacja metryk, wpływ na biznes..."
                  />
                </div>

                {/* Conclusions (renamed: Wnioski) */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Wnioski
                  </label>
                  <MarkdownEditor
                    initialValue={formData.case_study_summary}
                    onChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        case_study_summary: v,
                      }))
                    }
                    height="180px"
                    placeholder="Wnioski, następne kroki, rekomendacje..."
                  />
                </div>

                {/* Links and CTA list */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    🎯 Skorzystaj z efektów WebDKW (linki + CTA)
                  </label>
                  <div className="space-y-3">
                    {(formData.case_study_links || []).map((link, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      >
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => {
                            const next = [...(formData.case_study_links || [])];
                            next[idx] = { ...next[idx], title: e.target.value };
                            setFormData((prev) => ({
                              ...prev,
                              case_study_links: next,
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          placeholder="Tytuł linku"
                        />
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => {
                              const next = [
                                ...(formData.case_study_links || []),
                              ];
                              next[idx] = { ...next[idx], url: e.target.value };
                              setFormData((prev) => ({
                                ...prev,
                                case_study_links: next,
                              }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            placeholder="https://..."
                          />
                          <button
                            type="button"
                            className="px-3 py-2 border rounded text-red-600"
                            onClick={() => {
                              const next = (
                                formData.case_study_links || []
                              ).filter((_, i) => i !== idx);
                              setFormData((prev) => ({
                                ...prev,
                                case_study_links: next,
                              }));
                            }}
                          >
                            Usuń
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="px-3 py-2 border rounded"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          case_study_links: [
                            ...(prev.case_study_links || []),
                            { title: "", url: "" },
                          ],
                        }))
                      }
                    >
                      Dodaj link
                    </button>
                  </div>
                </div>

                {/* FAQ */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    FAQ
                  </label>
                  <div className="space-y-3">
                    {(formData.case_study_faqs || []).map((faq, idx) => (
                      <div key={idx} className="space-y-2 border p-3 rounded">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const next = [...(formData.case_study_faqs || [])];
                            next[idx] = {
                              ...next[idx],
                              question: e.target.value,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              case_study_faqs: next,
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          placeholder="Pytanie"
                        />
                        <MarkdownEditor
                          initialValue={faq.answer}
                          onChange={(v) => {
                            const next = [...(formData.case_study_faqs || [])];
                            next[idx] = { ...next[idx], answer: v };
                            setFormData((prev) => ({
                              ...prev,
                              case_study_faqs: next,
                            }));
                          }}
                          height="140px"
                          placeholder="Odpowiedź"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="px-3 py-2 border rounded text-red-600"
                            onClick={() => {
                              const next = (
                                formData.case_study_faqs || []
                              ).filter((_, i) => i !== idx);
                              setFormData((prev) => ({
                                ...prev,
                                case_study_faqs: next,
                              }));
                            }}
                          >
                            Usuń pytanie
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="px-3 py-2 border rounded"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          case_study_faqs: [
                            ...(prev.case_study_faqs || []),
                            { question: "", answer: "" },
                          ],
                        }))
                      }
                    >
                      Dodaj pytanie
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    CTA (nagłówek)
                  </label>
                  <input
                    type="text"
                    value={formData.case_study_cta}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        case_study_cta: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Chcesz podobne rezultaty dla swojego projektu?"
                    maxLength={160}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="case_study"
                    checked={formData.case_study}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        case_study: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="case_study"
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <BookMarked className="h-4 w-4 text-orange-500 mr-2" />{" "}
                    Opublikuj jako case study (widoczne na stronie)
                  </label>
                </div>
              </form>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="w-1/2 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Podgląd case study
                </h3>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {selectedProject?.image_url && (
                    <img
                      src={selectedProject.image_url}
                      alt={selectedProject.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {formData.case_study_header ||
                      selectedProject?.title ||
                      "Nagłówek Case Study"}
                  </h1>
                  <div className="prose max-w-none">
                    {formData.case_study_client_profile && (
                      <>
                        <h3 className="font-bold text-gray-900 mt-4">
                          Profil klienta i kontekst
                        </h3>
                        <div className="mb-4">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          >
                            {formData.case_study_client_profile}
                          </ReactMarkdown>
                        </div>
                      </>
                    )}
                    {/* Removed Objective (Cel) preview */}
                    {formData.case_study_challenges && (
                      <>
                        <h3 className="font-bold text-gray-900 mt-4">
                          Wyzwania
                        </h3>
                        <div className="mb-4">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          >
                            {formData.case_study_challenges}
                          </ReactMarkdown>
                        </div>
                      </>
                    )}
                    {formData.case_study_strategy && (
                      <>
                        <h3 className="font-bold text-gray-900 mt-4">
                          Strategia i wdrożone działania
                        </h3>
                        <div className="mb-4">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          >
                            {formData.case_study_strategy}
                          </ReactMarkdown>
                        </div>
                      </>
                    )}
                    <div className="mb-4">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      >
                        {formData.case_study_introduction || ""}
                      </ReactMarkdown>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-4">
                      Cele projektu
                    </h3>
                    <div className="mb-4">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      >
                        {formData.case_study_goals || ""}
                      </ReactMarkdown>
                    </div>
                    {/* Removed Implementation (Realizacja) preview */}
                    <h3 className="font-bold text-gray-900 mt-4">Wyniki</h3>
                    <div className="mb-4">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      >
                        {formData.case_study_results || ""}
                      </ReactMarkdown>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-4">
                      Podsumowanie
                    </h3>
                    <div className="mb-4">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      >
                        {formData.case_study_summary || ""}
                      </ReactMarkdown>
                    </div>
                    {!!(formData.case_study_links || []).length && (
                      <div className="mt-4">
                        <h3 className="font-bold text-gray-900">Linki</h3>
                        <ul className="list-disc pl-5">
                          {(formData.case_study_links || []).map((l, i) => (
                            <li key={i}>
                              {l.url ? (
                                <a
                                  href={l.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-orange-600 hover:underline"
                                >
                                  {l.title || l.url}
                                </a>
                              ) : (
                                <span>{l.title}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {formData.case_study_cta && (
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200 text-center font-semibold text-orange-700">
                      {formData.case_study_cta}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {formData.case_study
                  ? "Case study będzie widoczne publicznie"
                  : "Case study zapisane jako nieopublikowane"}
              </span>
              {submitError && (
                <span className="text-sm text-red-600">{submitError}</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Zapisywanie...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Zapisz case study</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyForm;
