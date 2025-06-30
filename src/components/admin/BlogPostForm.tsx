import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Eye, Calendar, Tag, AlertCircle, Image, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import { supabase, BlogPost } from '../../lib/supabase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormValidator } from './FormValidation';
import FileUpload from './FileUpload';
import MarkdownEditor from './MarkdownEditor';

interface BlogPostFormProps {
  post?: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: BlogPost) => void;
}

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  published: boolean;
  tags: string[];
  author: string;
  meta_description: string;
  slug: string;
  tldr_summary: string;
  tldr_takeaways: string[];
  faqs: Array<{ question: string; answer: string }>;
  ctas: Array<{ title: string; url: string; color: string }>;
  seo_score: number;
}

interface FormErrors {
  title?: string;
  content?: string;
  image_url?: string;
  meta_description?: string;
  slug?: string;
  tldr_summary?: string;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ post, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: false,
    tags: [],
    author: 'Marcin Kowalski',
    meta_description: '',
    slug: '',
    tldr_summary: '',
    tldr_takeaways: [''],
    faqs: [{ question: '', answer: '' }],
    ctas: [{ title: 'Dowiedz się więcej', url: '', color: 'orange' }],
    seo_score: 0
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [publishDate, setPublishDate] = useState<Date | null>(new Date());
  const [activeTab, setActiveTab] = useState('content');
  const [showTldrSection, setShowTldrSection] = useState(false);
  const [showFaqSection, setShowFaqSection] = useState(false);
  const [showCtaSection, setShowCtaSection] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Predefiniowane tagi
  const availableTags = [
    'Web Development', 'SEO', 'Marketing', 'Design', 'E-commerce', 
    'WordPress', 'React', 'JavaScript', 'CSS', 'HTML', 'Performance',
    'Accessibility', 'UX/UI', 'Mobile', 'Analytics'
  ];

  // Predefiniowane kolory dla CTA
  const ctaColors = [
    { value: 'orange', label: 'Pomarańczowy', class: 'bg-orange-500' },
    { value: 'blue', label: 'Niebieski', class: 'bg-blue-500' },
    { value: 'green', label: 'Zielony', class: 'bg-green-500' },
    { value: 'red', label: 'Czerwony', class: 'bg-red-500' },
    { value: 'gray', label: 'Szary', class: 'bg-gray-500' }
  ];

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        image_url: post.image_url || '',
        published: post.published || false,
        tags: post.tags || [],
        author: post.author || 'Marcin Kowalski',
        meta_description: post.meta_description || '',
        slug: post.slug || '',
        tldr_summary: post.tldr_summary || '',
        tldr_takeaways: post.tldr_takeaways || [''],
        faqs: Array.isArray(post.faqs) && post.faqs.length > 0 
          ? post.faqs 
          : [{ question: '', answer: '' }],
        ctas: Array.isArray(post.ctas) && post.ctas.length > 0 
          ? post.ctas 
          : [{ title: 'Dowiedz się więcej', url: '', color: 'orange' }],
        seo_score: post.seo_score || 0
      });
      setPublishDate(post.created_at ? new Date(post.created_at) : new Date());
      setShowTldrSection(!!post.tldr_summary);
      setShowFaqSection(Array.isArray(post.faqs) && post.faqs.length > 0 && post.faqs[0].question !== '');
      setShowCtaSection(Array.isArray(post.ctas) && post.ctas.length > 0 && post.ctas[0].url !== '');
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        image_url: '',
        published: false,
        tags: [],
        author: 'Marcin Kowalski',
        meta_description: '',
        slug: '',
        tldr_summary: '',
        tldr_takeaways: [''],
        faqs: [{ question: '', answer: '' }],
        ctas: [{ title: 'Dowiedz się więcej', url: '', color: 'orange' }],
        seo_score: 0
      });
      setPublishDate(new Date());
      setShowTldrSection(false);
      setShowFaqSection(false);
      setShowCtaSection(false);
    }
    setErrors({});
    setShowPreview(false);
    setImageFile(null);
    setActiveTab('content');
  }, [post, isOpen]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !post) {
      const slug = FormValidator.generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, post]);

  // Auto-generate meta description from content
  useEffect(() => {
    if (formData.content && !formData.meta_description) {
      const metaDesc = FormValidator.generateMetaDescription(formData.content);
      setFormData(prev => ({ ...prev, meta_description: metaDesc }));
    }
  }, [formData.content]);

  // Auto-generate excerpt from content
  useEffect(() => {
    if (formData.content && !formData.excerpt) {
      const excerpt = FormValidator.generateExcerpt(formData.content);
      setFormData(prev => ({ ...prev, excerpt }));
    }
  }, [formData.content]);

  // Calculate SEO score
  useEffect(() => {
    let score = 0;
    
    // Title length (optimal: 50-60 chars)
    if (formData.title.length >= 40 && formData.title.length <= 70) score += 20;
    else if (formData.title.length >= 30 && formData.title.length <= 80) score += 10;
    
    // Meta description length (optimal: 140-160 chars)
    if (formData.meta_description.length >= 140 && formData.meta_description.length <= 160) score += 20;
    else if (formData.meta_description.length >= 120 && formData.meta_description.length <= 180) score += 10;
    
    // Content length (optimal: 1500+ words)
    const wordCount = formData.content.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 1500) score += 20;
    else if (wordCount >= 800) score += 10;
    else if (wordCount >= 300) score += 5;
    
    // Headings
    if (formData.content.match(/^## /gm)) score += 10;
    
    // Images
    if (formData.content.match(/!\[.*?\]\(.*?\)/g)) score += 10;
    
    // Links
    if (formData.content.match(/\[.*?\]\(.*?\)/g)) score += 10;
    
    // TL;DR section
    if (formData.tldr_summary) score += 5;
    
    // FAQ section
    if (formData.faqs.some(faq => faq.question && faq.answer)) score += 5;
    
    setFormData(prev => ({ ...prev, seo_score: score }));
  }, [formData.title, formData.meta_description, formData.content, formData.tldr_summary, formData.faqs]);

  const validateForm = (): boolean => {
    const validator = new FormValidator({
      title: FormValidator.commonRules.title,
      content: FormValidator.commonRules.content,
      slug: FormValidator.commonRules.slug,
      meta_description: FormValidator.commonRules.metaDescription,
      tldr_summary: {
        custom: (value: string) => {
          if (showTldrSection && (!value || value.length < 10)) {
            return 'TL;DR podsumowanie musi mieć minimum 10 znaków';
          }
          return null;
        }
      }
    });

    const newErrors = validator.validate(formData);
    
    // Image validation
    if (!formData.image_url && !imageFile) {
      newErrors.image_url = 'Miniatura jest wymagana';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (files: File[]) => {
    if (!files.length) return;
    const file = files[0]; // Take only the first file

    setImageFile(file);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // In real implementation, upload to storage service
      // For now, create a local URL
      const imageUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      setUploadProgress(100);
      
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      setErrors(prev => ({ ...prev, image_url: 'Błąd podczas przesyłania pliku' }));
      setUploadProgress(0);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addTakeaway = () => {
    setFormData(prev => ({
      ...prev,
      tldr_takeaways: [...prev.tldr_takeaways, '']
    }));
  };

  const updateTakeaway = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tldr_takeaways: prev.tldr_takeaways.map((item, i) => i === index ? value : item)
    }));
  };

  const removeTakeaway = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tldr_takeaways: prev.tldr_takeaways.filter((_, i) => i !== index)
    }));
  };

  const addFaq = () => {
    if (formData.faqs.length < 5) {
      setFormData(prev => ({
        ...prev,
        faqs: [...prev.faqs, { question: '', answer: '' }]
      }));
    }
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => i === index ? { ...faq, [field]: value } : faq)
    }));
  };

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const addCta = () => {
    setFormData(prev => ({
      ...prev,
      ctas: [...prev.ctas, { title: 'Kliknij tutaj', url: '', color: 'orange' }]
    }));
  };

  const updateCta = (index: number, field: 'title' | 'url' | 'color', value: string) => {
    setFormData(prev => ({
      ...prev,
      ctas: prev.ctas.map((cta, i) => i === index ? { ...cta, [field]: value } : cta)
    }));
  };

  const removeCta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ctas: prev.ctas.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const postData = {
        ...formData,
        excerpt: formData.excerpt || FormValidator.generateExcerpt(formData.content),
        meta_description: formData.meta_description || FormValidator.generateMetaDescription(formData.content),
        created_at: publishDate?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tldr_takeaways: formData.tldr_takeaways.filter(item => item.trim() !== ''),
        faqs: showFaqSection ? formData.faqs.filter(faq => faq.question && faq.answer) : [],
        ctas: showCtaSection ? formData.ctas.filter(cta => cta.url) : []
      };

      if (post) {
        // Update existing post
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id)
          .select()
          .single();

        if (error) throw error;
        onSave(data);
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        onSave(data);
      }

      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      setErrors({ title: 'Błąd podczas zapisywania artykułu' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate table of contents from markdown
  const generateToc = (markdown: string) => {
    const headings: { level: number; text: string; id: string }[] = [];
    const lines = markdown.split('\n');
    
    lines.forEach(line => {
      if (line.startsWith('## ')) {
        const text = line.replace(/^## /, '');
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        headings.push({ level: 2, text, id });
      } else if (line.startsWith('### ')) {
        const text = line.replace(/^### /, '');
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        headings.push({ level: 3, text, id });
      } else if (line.startsWith('#### ')) {
        const text = line.replace(/^#### /, '');
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        headings.push({ level: 4, text, id });
      }
    });
    
    return headings;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {post ? 'Edytuj artykuł' : 'Nowy artykuł'}
            </h2>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                <span className="text-sm text-gray-600">SEO Score:</span>
                <span className={`text-sm font-bold ${
                  formData.seo_score >= 70 ? 'text-green-600' : 
                  formData.seo_score >= 40 ? 'text-orange-600' : 
                  'text-red-600'
                }`}>
                  {formData.seo_score}/100
                </span>
              </div>
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

          {/* Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'content' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Treść
            </button>
            <button
              onClick={() => setActiveTab('tldr')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'tldr' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              TL;DR
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'faq' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('cta')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'cta' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              CTA
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'seo' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              SEO
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'settings' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ustawienia
            </button>
          </div>

          {/* Content */}
          <div className="flex h-[calc(90vh-200px)]">
            {/* Form */}
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} overflow-y-auto`}>
              <form onSubmit={handleSubmit} className="p-6">
                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Tytuł artykułu *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Wprowadź tytuł artykułu..."
                        maxLength={100}
                      />
                      <div className="flex justify-between mt-1">
                        {errors.title && (
                          <span className="text-red-500 text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.title}
                          </span>
                        )}
                        <span className="text-gray-500 text-sm ml-auto">
                          {formData.title.length}/100
                        </span>
                      </div>
                    </div>

                    {/* URL Slug */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        URL Slug *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          /blog/
                        </span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                            errors.slug ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="url-slug"
                        />
                      </div>
                      {errors.slug && (
                        <span className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.slug}
                        </span>
                      )}
                    </div>

                    {/* Content Editor */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Treść artykułu *
                      </label>
                      <div ref={editorRef} className={errors.content ? 'border border-red-500 rounded-lg' : ''}>
                        <MarkdownEditor
                          initialValue={formData.content}
                          onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                          height="400px"
                          placeholder="Napisz treść artykułu..."
                          autoFocus
                        />
                      </div>
                      {errors.content && (
                        <span className="text-red-500 text-sm flex items-center mt-1">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.content}
                        </span>
                      )}
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Miniatura artykułu *
                      </label>
                      <div className="space-y-4">
                        {formData.image_url && (
                          <div className="relative">
                            <img
                              src={formData.image_url}
                              alt="Miniatura"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        
                        {!formData.image_url && (
                          <FileUpload
                            accept="image/*"
                            multiple={false}
                            maxSize={2 * 1024 * 1024} // 2MB
                            onFilesSelected={handleImageUpload}
                            onError={(error) => setErrors(prev => ({ ...prev, image_url: error }))}
                            preview={true}
                          />
                        )}

                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}

                        {errors.image_url && (
                          <span className="text-red-500 text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.image_url}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TL;DR Tab */}
                {activeTab === 'tldr' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="show_tldr"
                        checked={showTldrSection}
                        onChange={(e) => setShowTldrSection(e.target.checked)}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="show_tldr" className="text-sm font-medium text-gray-700">
                        Dodaj sekcję TL;DR (Too Long; Didn't Read)
                      </label>
                    </div>

                    {showTldrSection && (
                      <>
                        {/* TL;DR Summary */}
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">
                            Podsumowanie TL;DR *
                          </label>
                          <textarea
                            value={formData.tldr_summary}
                            onChange={(e) => setFormData(prev => ({ ...prev, tldr_summary: e.target.value }))}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
                              errors.tldr_summary ? 'border-red-500' : 'border-gray-300'
                            }`}
                            rows={3}
                            placeholder="Krótkie podsumowanie artykułu w 1-2 zdaniach..."
                          />
                          {errors.tldr_summary && (
                            <span className="text-red-500 text-sm flex items-center mt-1">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {errors.tldr_summary}
                            </span>
                          )}
                        </div>

                        {/* TL;DR Takeaways */}
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">
                            Kluczowe wnioski
                          </label>
                          <div className="space-y-3">
                            {formData.tldr_takeaways.map((takeaway, index) => (
                              <div key={index} className="flex space-x-2">
                                <input
                                  type="text"
                                  value={takeaway}
                                  onChange={(e) => updateTakeaway(index, e.target.value)}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                  placeholder={`Wniosek ${index + 1}`}
                                />
                                {formData.tldr_takeaways.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeTakeaway(index)}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            
                            {formData.tldr_takeaways.length < 5 && (
                              <button
                                type="button"
                                onClick={addTakeaway}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <span>Dodaj wniosek</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="show_faq"
                        checked={showFaqSection}
                        onChange={(e) => setShowFaqSection(e.target.checked)}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="show_faq" className="text-sm font-medium text-gray-700">
                        Dodaj sekcję FAQ (maksymalnie 5 pytań)
                      </label>
                    </div>

                    {showFaqSection && (
                      <div className="space-y-6">
                        {formData.faqs.map((faq, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-bold text-gray-900">Pytanie {index + 1}</h3>
                              {formData.faqs.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeFaq(index)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            
                            <div>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Pytanie"
                              />
                            </div>
                            
                            <div>
                              <textarea
                                value={faq.answer}
                                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                rows={3}
                                placeholder="Odpowiedź"
                              />
                            </div>
                          </div>
                        ))}
                        
                        {formData.faqs.length < 5 && (
                          <button
                            type="button"
                            onClick={addFaq}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <span>Dodaj pytanie</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* CTA Tab */}
                {activeTab === 'cta' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="show_cta"
                        checked={showCtaSection}
                        onChange={(e) => setShowCtaSection(e.target.checked)}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="show_cta" className="text-sm font-medium text-gray-700">
                        Dodaj przyciski CTA (Call-to-Action)
                      </label>
                    </div>

                    {showCtaSection && (
                      <div className="space-y-6">
                        {formData.ctas.map((cta, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-bold text-gray-900">Przycisk CTA {index + 1}</h3>
                              {formData.ctas.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeCta(index)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Tekst przycisku
                                </label>
                                <input
                                  type="text"
                                  value={cta.title}
                                  onChange={(e) => updateCta(index, 'title', e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                  placeholder="np. Dowiedz się więcej"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  URL
                                </label>
                                <input
                                  type="url"
                                  value={cta.url}
                                  onChange={(e) => updateCta(index, 'url', e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                  placeholder="https://example.com"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Kolor
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {ctaColors.map(color => (
                                  <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => updateCta(index, 'color', color.value)}
                                    className={`w-8 h-8 rounded-full ${color.class} ${
                                      cta.color === color.value ? 'ring-2 ring-offset-2 ring-gray-500' : ''
                                    }`}
                                    title={color.label}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <div className="pt-2">
                              <div className="p-2 bg-white rounded border border-gray-200">
                                <div className="text-xs text-gray-500 mb-2">Podgląd:</div>
                                <div className="flex justify-center">
                                  <button
                                    type="button"
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                      cta.color === 'orange' ? 'bg-orange-500 text-white' :
                                      cta.color === 'blue' ? 'bg-blue-500 text-white' :
                                      cta.color === 'green' ? 'bg-green-500 text-white' :
                                      cta.color === 'red' ? 'bg-red-500 text-white' :
                                      'bg-gray-500 text-white'
                                    }`}
                                  >
                                    {cta.title || 'Przycisk CTA'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {formData.ctas.length < 3 && (
                          <button
                            type="button"
                            onClick={addCta}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <span>Dodaj przycisk CTA</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    {/* SEO Score */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        SEO Score
                      </label>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Ocena SEO:</span>
                          <span className={`text-sm font-bold ${
                            formData.seo_score >= 70 ? 'text-green-600' : 
                            formData.seo_score >= 40 ? 'text-orange-600' : 
                            'text-red-600'
                          }`}>
                            {formData.seo_score}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              formData.seo_score >= 70 ? 'bg-green-500' : 
                              formData.seo_score >= 40 ? 'bg-orange-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${formData.seo_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Description */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Meta opis (SEO)
                      </label>
                      <textarea
                        value={formData.meta_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
                          errors.meta_description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        rows={3}
                        placeholder="Opis artykułu dla wyszukiwarek..."
                        maxLength={160}
                      />
                      <div className="flex justify-between mt-1">
                        {errors.meta_description && (
                          <span className="text-red-500 text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.meta_description}
                          </span>
                        )}
                        <span className={`text-sm ${
                          formData.meta_description.length >= 120 && formData.meta_description.length <= 160
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}>
                          {formData.meta_description.length}/160
                        </span>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Excerpt (krótki opis)
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                        rows={3}
                        placeholder="Krótki opis artykułu (jeśli pusty, zostanie wygenerowany automatycznie)"
                        maxLength={300}
                      />
                      <span className="text-gray-500 text-sm">
                        {formData.excerpt.length}/300
                      </span>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Tagi (słowa kluczowe)
                      </label>
                      <div className="space-y-3">
                        {/* Selected tags */}
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="ml-2 text-orange-500 hover:text-orange-700"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Add new tag */}
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag(tagInput);
                              }
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Dodaj tag..."
                          />
                          <button
                            type="button"
                            onClick={() => addTag(tagInput)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Tag className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Suggested tags */}
                        <div className="flex flex-wrap gap-2">
                          {availableTags
                            .filter(tag => !formData.tags.includes(tag))
                            .slice(0, 8)
                            .map((tag, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => addTag(tag)}
                                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* SEO Tips */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                        <HelpCircle className="h-4 w-4 mr-1" />
                        Wskazówki SEO
                      </h3>
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li className="flex items-start">
                          <span className={`h-4 w-4 mr-1 mt-0.5 ${
                            formData.title.length >= 40 && formData.title.length <= 70 ? 'text-green-500' : 'text-gray-400'
                          }`}>
                            {formData.title.length >= 40 && formData.title.length <= 70 ? <CheckCircle size={16} /> : '•'}
                          </span>
                          Tytuł: 40-70 znaków (obecnie: {formData.title.length})
                        </li>
                        <li className="flex items-start">
                          <span className={`h-4 w-4 mr-1 mt-0.5 ${
                            formData.meta_description.length >= 120 && formData.meta_description.length <= 160 ? 'text-green-500' : 'text-gray-400'
                          }`}>
                            {formData.meta_description.length >= 120 && formData.meta_description.length <= 160 ? <CheckCircle size={16} /> : '•'}
                          </span>
                          Meta opis: 120-160 znaków (obecnie: {formData.meta_description.length})
                        </li>
                        <li className="flex items-start">
                          <span className={`h-4 w-4 mr-1 mt-0.5 ${
                            formData.content.split(/\s+/).filter(Boolean).length >= 300 ? 'text-green-500' : 'text-gray-400'
                          }`}>
                            {formData.content.split(/\s+/).filter(Boolean).length >= 300 ? <CheckCircle size={16} /> : '•'}
                          </span>
                          Długość treści: min. 300 słów (obecnie: {formData.content.split(/\s+/).filter(Boolean).length})
                        </li>
                        <li className="flex items-start">
                          <span className={`h-4 w-4 mr-1 mt-0.5 ${
                            formData.content.match(/^## /gm) ? 'text-green-500' : 'text-gray-400'
                          }`}>
                            {formData.content.match(/^## /gm) ? <CheckCircle size={16} /> : '•'}
                          </span>
                          Nagłówki: użyj H2 i H3 do strukturyzacji treści
                        </li>
                        <li className="flex items-start">
                          <span className={`h-4 w-4 mr-1 mt-0.5 ${
                            formData.content.match(/!\[.*?\]\(.*?\)/g) ? 'text-green-500' : 'text-gray-400'
                          }`}>
                            {formData.content.match(/!\[.*?\]\(.*?\)/g) ? <CheckCircle size={16} /> : '•'}
                          </span>
                          Obrazy: dodaj przynajmniej jeden obraz z alt tekstem
                        </li>
                        <li className="flex items-start">
                          <span className={`h-4 w-4 mr-1 mt-0.5 ${
                            formData.content.match(/\[.*?\]\(.*?\)/g) ? 'text-green-500' : 'text-gray-400'
                          }`}>
                            {formData.content.match(/\[.*?\]\(.*?\)/g) ? <CheckCircle size={16} /> : '•'}
                          </span>
                          Linki: dodaj wewnętrzne i zewnętrzne linki
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    {/* Author */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Autor
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* Publish Date */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Data publikacji
                      </label>
                      <div className="relative">
                        <DatePicker
                          selected={publishDate}
                          onChange={(date) => setPublishDate(date)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                          dropdownMode="select"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Status publikacji
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="published"
                            checked={!formData.published}
                            onChange={() => setFormData(prev => ({ ...prev, published: false }))}
                            className="mr-2"
                          />
                          <span className="text-gray-700">Szkic</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="published"
                            checked={formData.published}
                            onChange={() => setFormData(prev => ({ ...prev, published: true }))}
                            className="mr-2"
                          />
                          <span className="text-gray-700">Opublikowany</span>
                        </label>
                      </div>
                    </div>

                    {/* Table of Contents */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Spis treści
                      </label>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          Spis treści jest generowany automatycznie z nagłówków H2, H3 i H4 w treści artykułu.
                        </p>
                        
                        {generateToc(formData.content).length > 0 ? (
                          <div className="border border-gray-200 rounded bg-white p-3">
                            <h3 className="font-bold text-gray-900 mb-2">Podgląd spisu treści:</h3>
                            <ul className="space-y-1">
                              {generateToc(formData.content).map((heading, index) => (
                                <li 
                                  key={index} 
                                  className={`text-blue-600 hover:underline ${
                                    heading.level === 3 ? 'ml-4' : 
                                    heading.level === 4 ? 'ml-8' : ''
                                  }`}
                                >
                                  {heading.text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="text-center py-3 text-gray-500">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Brak nagłówków w treści artykułu</p>
                            <p className="text-xs mt-1">Dodaj nagłówki H2, H3 i H4 aby wygenerować spis treści</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="w-1/2 border-l border-gray-200 overflow-y-auto p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Podgląd artykułu</h3>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Miniatura"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || 'Tytuł artykułu'}</h1>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <span className="mr-4">{new Date(publishDate || new Date()).toLocaleDateString('pl-PL')}</span>
                    <span>{formData.author}</span>
                  </div>
                  
                  {showTldrSection && formData.tldr_summary && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
                      <h2 className="text-lg font-bold text-gray-900 mb-2">TL;DR</h2>
                      <p className="text-gray-700 mb-3">{formData.tldr_summary}</p>
                      
                      {formData.tldr_takeaways.filter(t => t.trim()).length > 0 && (
                        <ul className="space-y-1 list-disc list-inside">
                          {formData.tldr_takeaways
                            .filter(takeaway => takeaway.trim())
                            .map((takeaway, index) => (
                              <li key={index} className="text-gray-700">{takeaway}</li>
                            ))}
                        </ul>
                      )}
                    </div>
                  )}
                  
                  {/* Table of Contents */}
                  {generateToc(formData.content).length >= 2 && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                      <h2 className="text-lg font-bold text-gray-900 mb-2">Spis treści</h2>
                      <ul className="space-y-1">
                        {generateToc(formData.content).map((heading, index) => (
                          <li 
                            key={index} 
                            className={`text-blue-600 hover:underline ${
                              heading.level === 3 ? 'ml-4' : 
                              heading.level === 4 ? 'ml-8' : ''
                            }`}
                          >
                            {heading.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="prose max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={tomorrow}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                        p({ node, children, ...props }: any) {
                          const child = children?.[0];
                          
                          if (typeof child === 'string' && child.startsWith('[CTA:') && child.endsWith(']')) {
                            try {
                              const ctaContent = child.slice(5, -1);
                              const params = new Map();
                              
                              ctaContent.split(',').forEach(param => {
                                const [key, value] = param.split('=');
                                if (key && value) {
                                  params.set(key.trim(), value.trim());
                                }
                              });
                              
                              const title = params.get('title') || 'Click Here';
                              const url = params.get('url') || '#';
                              const color = params.get('color') || 'orange';
                              
                              const colorClasses: Record<string, string> = {
                                orange: 'bg-orange-500 hover:bg-orange-600 text-white',
                                blue: 'bg-blue-500 hover:bg-blue-600 text-white',
                                green: 'bg-green-500 hover:bg-green-600 text-white',
                                red: 'bg-red-500 hover:bg-red-600 text-white',
                                gray: 'bg-gray-500 hover:bg-gray-600 text-white',
                              };
                              
                              const buttonClass = colorClasses[color] || colorClasses.orange;
                              
                              return (
                                <div className="my-6 text-center">
                                  <a 
                                    href={url}
                                    className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${buttonClass}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {title}
                                  </a>
                                </div>
                              );
                            } catch (error) {
                              console.error('Error parsing CTA:', error);
                              return <p {...props}>{children}</p>;
                            }
                          }
                          
                          return <p {...props}>{children}</p>;
                        }
                      }}
                    >
                      {formData.content || 'Treść artykułu...'}
                    </ReactMarkdown>
                  </div>
                  
                  {/* FAQ Section */}
                  {showFaqSection && formData.faqs.some(faq => faq.question && faq.answer) && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Często zadawane pytania</h2>
                      <div className="space-y-4">
                        {formData.faqs
                          .filter(faq => faq.question && faq.answer)
                          .map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 px-4 py-3 font-medium text-gray-900">
                                {faq.question}
                              </div>
                              <div className="px-4 py-3 text-gray-700">
                                {faq.answer}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {/* CTA Buttons */}
                  {showCtaSection && formData.ctas.some(cta => cta.url) && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <div className="flex flex-wrap gap-4 justify-center">
                        {formData.ctas
                          .filter(cta => cta.url)
                          .map((cta, index) => (
                            <button
                              key={index}
                              type="button"
                              className={`px-6 py-3 rounded-lg font-semibold ${
                                cta.color === 'orange' ? 'bg-orange-500 text-white' :
                                cta.color === 'blue' ? 'bg-blue-500 text-white' :
                                cta.color === 'green' ? 'bg-green-500 text-white' :
                                cta.color === 'red' ? 'bg-red-500 text-white' :
                                'bg-gray-500 text-white'
                              }`}
                            >
                              {cta.title}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
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
                {formData.published ? 'Artykuł zostanie opublikowany' : 'Artykuł zostanie zapisany jako szkic'}
              </span>
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
                    <span>{post ? 'Zaktualizuj' : 'Zapisz'} artykuł</span>
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

export default BlogPostForm;