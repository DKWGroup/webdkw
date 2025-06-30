import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, Save, X, LogOut, Image, Bold, Italic, List, Heading1, Heading2, Heading3, Shield, AlertTriangle } from 'lucide-react'
import { supabase, BlogPost, Project } from '../lib/supabase'
import { authSecurity } from '../lib/auth'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import { HelmetProvider } from 'react-helmet-async'

const AdminPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'blog' | 'projects' | 'security'>('blog')
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [securityLogs, setSecurityLogs] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<BlogPost | Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false,
    author: 'Marcin Kowalski',
    image_url: '',
    tags: ''
  })

  const [projectForm, setProjectForm] = useState({
    title: '',
    slug: '',
    category: '',
    industry: '',
    description: '',
    image_url: '',
    technologies: [] as string[],
    results: [] as { metric: string; value: string }[],
    completion_date: '',
    project_url: '',
    featured: false,
    case_study: false,
    case_study_header: '',
    case_study_introduction: '',
    case_study_goals: '',
    case_study_implementation: '',
    case_study_results: '',
    case_study_summary: '',
    case_study_cta: ''
  })

  const projectCategories = [
    'Strona firmowa',
    'Landing page',
    'Strona wizytówka',
    'Platforma B2B',
    'System rezerwacji',
    'Platforma edukacyjna',
    'Platforma internetowa',
    'Sklep internetowy',
    'E-commerce',
    'Sklep B2B'
  ]

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await authSecurity.isAuthenticated()
        
        if (!isAuth) {
          navigate('/admin/login')
          return
        }

        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          navigate('/admin/login')
          return
        }

        setUser(user)
        await fetchData()
      } catch (error) {
        console.error('Error checking auth:', error)
        navigate('/admin/login')
      }
    }

    checkAuth()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await authSecurity.logout('manual')
      navigate('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [blogResponse, projectsResponse, securityResponse] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('security_logs').select('*').order('timestamp', { ascending: false }).limit(50)
      ])

      if (blogResponse.data) setBlogPosts(blogResponse.data)
      if (projectsResponse.data) setProjects(projectsResponse.data)
      if (securityResponse.data) setSecurityLogs(securityResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Błąd podczas ładowania danych')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const insertTextAtCursor = (textarea: HTMLTextAreaElement, text: string) => {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const value = textarea.value
    const newValue = value.substring(0, start) + text + value.substring(end)
    
    setBlogForm(prev => ({ ...prev, content: newValue }))
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const formatText = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    let formattedText = ''
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'pogrubiony tekst'}**`
        break
      case 'italic':
        formattedText = `*${selectedText || 'kursywa'}*`
        break
      case 'h1':
        formattedText = `# ${selectedText || 'Nagłówek 1'}`
        break
      case 'h2':
        formattedText = `## ${selectedText || 'Nagłówek 2'}`
        break
      case 'h3':
        formattedText = `### ${selectedText || 'Nagłówek 3'}`
        break
      case 'list':
        formattedText = `- ${selectedText || 'Element listy'}`
        break
      case 'image':
        const imageUrl = prompt('Wprowadź URL obrazka:')
        const imageCaption = prompt('Wprowadź podpis obrazka (opcjonalnie):')
        if (imageUrl) {
          formattedText = `![${imageCaption || 'Opis obrazka'}](${imageUrl})`
        }
        break
    }

    if (formattedText) {
      insertTextAtCursor(textarea, formattedText)
    }
  }

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const blogData = {
        ...blogForm,
        tags: blogForm.tags ? blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        slug: blogForm.slug || generateSlug(blogForm.title)
      }

      let result
      if (editingItem && 'content' in editingItem) {
        result = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', editingItem.id)
          .select()
      } else {
        result = await supabase
          .from('blog_posts')
          .insert([blogData])
          .select()
      }

      if (result.error) {
        throw result.error
      }

      alert('Post został zapisany pomyślnie!')
      resetForm()
      await fetchData()
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Błąd podczas zapisywania posta: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const projectData = {
        ...projectForm,
        slug: projectForm.slug || generateSlug(projectForm.title),
        results: projectForm.results
      }

      let result
      if (editingItem && 'category' in editingItem) {
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingItem.id)
          .select()
      } else {
        result = await supabase
          .from('projects')
          .insert([projectData])
          .select()
      }

      if (result.error) {
        throw result.error
      }

      alert('Projekt został zapisany pomyślnie!')
      resetForm()
      await fetchData()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Błąd podczas zapisywania projektu: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item: BlogPost | Project) => {
    setEditingItem(item)
    setIsEditing(true)
    
    if ('content' in item) {
      setBlogForm({
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || '',
        content: item.content,
        published: item.published,
        author: item.author,
        image_url: item.image_url || '',
        tags: item.tags?.join(', ') || ''
      })
    } else {
      setProjectForm({
        title: item.title,
        slug: item.slug,
        category: item.category,
        industry: item.industry,
        description: item.description,
        image_url: item.image_url,
        technologies: item.technologies || [],
        results: Array.isArray(item.results) ? item.results : [],
        completion_date: item.completion_date,
        project_url: item.project_url || '',
        featured: item.featured,
        case_study: item.case_study || false,
        case_study_header: item.case_study_header || '',
        case_study_introduction: item.case_study_introduction || '',
        case_study_goals: item.case_study_goals || '',
        case_study_implementation: item.case_study_implementation || '',
        case_study_results: item.case_study_results || '',
        case_study_summary: item.case_study_summary || '',
        case_study_cta: item.case_study_cta || ''
      })
    }
  }

  const handleDelete = async (id: string, type: 'blog' | 'project') => {
    if (!confirm('Czy na pewno chcesz usunąć ten element?')) return

    try {
      const table = type === 'blog' ? 'blog_posts' : 'projects'
      const { error } = await supabase.from(table).delete().eq('id', id)
      
      if (error) throw error
      
      alert('Element został usunięty')
      await fetchData()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Błąd podczas usuwania: ' + (error as Error).message)
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditingItem(null)
    setBlogForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      published: false,
      author: 'Marcin Kowalski',
      image_url: '',
      tags: ''
    })
    setProjectForm({
      title: '',
      slug: '',
      category: '',
      industry: '',
      description: '',
      image_url: '',
      technologies: [],
      results: [],
      completion_date: '',
      project_url: '',
      featured: false,
      case_study: false,
      case_study_header: '',
      case_study_introduction: '',
      case_study_goals: '',
      case_study_implementation: '',
      case_study_results: '',
      case_study_summary: '',
      case_study_cta: ''
    })
  }

  const addTechnology = () => {
    setProjectForm(prev => ({
      ...prev,
      technologies: [...prev.technologies, '']
    }))
  }

  const updateTechnology = (index: number, value: string) => {
    setProjectForm(prev => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => i === index ? value : tech)
    }))
  }

  const removeTechnology = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }))
  }

  const addResult = () => {
    setProjectForm(prev => ({
      ...prev,
      results: [...prev.results, { metric: '', value: '' }]
    }))
  }

  const updateResult = (index: number, field: 'metric' | 'value', value: string) => {
    setProjectForm(prev => ({
      ...prev,
      results: prev.results.map((result, i) => 
        i === index ? { ...result, [field]: value } : result
      )
    }))
  }

  const removeResult = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
    }))
  }

  const formatEventType = (eventType: string) => {
    const types: { [key: string]: string } = {
      'login_attempt': 'Próba logowania',
      'login_success': 'Udane logowanie',
      'login_failure': 'Nieudane logowanie',
      'logout': 'Wylogowanie',
      'session_timeout': 'Timeout sesji',
      'password_reset': 'Reset hasła'
    }
    return types[eventType] || eventType
  }

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'login_success':
        return 'text-green-600 bg-green-100'
      case 'login_failure':
        return 'text-red-600 bg-red-100'
      case 'logout':
        return 'text-blue-600 bg-blue-100'
      case 'session_timeout':
        return 'text-yellow-600 bg-yellow-100'
      case 'password_reset':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie panelu CMS...</p>
        </div>
      </div>
    )
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Panel CMS - Administracja"
          description="Panel administracyjny systemu zarządzania treścią"
          keywords=""
          url={`${window.location.origin}/admin`}
        />
        
        {/* Meta tagi bezpieczeństwa */}
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow" />
        
        <Header />
        
        <main className="pt-20">
          {/* Header section */}
          <section className="bg-white py-16 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Powrót na stronę główną</span>
                  </Link>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <Shield className="h-4 w-4" />
                    <span>Sesja zabezpieczona</span>
                  </div>
                  <span className="text-gray-600">Zalogowany jako: {user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Wyloguj</span>
                  </button>
                </div>
              </div>
              
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Panel CMS
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Bezpieczny system zarządzania treścią bloga i projektami portfolio
                </p>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <section className="py-8 bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`pb-4 border-b-2 font-semibold ${
                    activeTab === 'blog'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Blog Posts
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`pb-4 border-b-2 font-semibold ${
                    activeTab === 'projects'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Portfolio Projects
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`pb-4 border-b-2 font-semibold ${
                    activeTab === 'security'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Logi Bezpieczeństwa</span>
                  </div>
                </button>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {activeTab === 'security' ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Logi Bezpieczeństwa</h2>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data/Czas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Typ zdarzenia
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              IP Address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User Agent
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {securityLogs.map((log) => (
                            <tr key={log.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(log.timestamp).toLocaleString('pl-PL')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEventTypeColor(log.event_type)}`}>
                                  {formatEventType(log.event_type)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.ip_address}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.email || '-'}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                {log.user_agent}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Add new button */}
                  <div className="mb-8">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Dodaj {activeTab === 'blog' ? 'post' : 'projekt'}</span>
                    </button>
                  </div>

                  {/* Form */}
                  {isEditing && (
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {editingItem ? 'Edytuj' : 'Dodaj'} {activeTab === 'blog' ? 'post' : 'projekt'}
                        </h2>
                        <button
                          onClick={resetForm}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      {activeTab === 'blog' ? (
                        <form onSubmit={handleBlogSubmit} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                Tytuł *
                              </label>
                              <input
                                type="text"
                                required
                                value={blogForm.title}
                                onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                Slug
                              </label>
                              <input
                                type="text"
                                value={blogForm.slug}
                                onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                placeholder="Zostanie wygenerowany automatycznie"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                              Excerpt
                            </label>
                            <textarea
                              rows={3}
                              value={blogForm.excerpt}
                              onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                              Treść *
                            </label>
                            
                            {/* Formatting toolbar */}
                            <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-lg border">
                              <button
                                type="button"
                                onClick={() => formatText('bold')}
                                className="p-2 hover:bg-gray-200 rounded"
                                title="Pogrubienie"
                              >
                                <Bold className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => formatText('italic')}
                                className="p-2 hover:bg-gray-200 rounded"
                                title="Kursywa"
                              >
                                <Italic className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => formatText('h1')}
                                className="p-2 hover:bg-gray-200 rounded"
                                title="Nagłówek 1"
                              >
                                <Heading1 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => formatText('h2')}
                                className="p-2 hover:bg-gray-200 rounded"
                                title="Nagłówek 2"
                              >
                                <Heading2 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => formatText('h3')}
                                className="p-2 hover:bg-gray-200 rounded"
                                title="Nagłówek 3"
                              >
                                <Heading3 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => formatText('list')}
                                className="p-2 hover:bg-gray-200 rounded"
                                title="Lista"
                              >
                                <List className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => formatText('image')}
                                className="p-2 hover:bg-gray-200 rounded"
                                title="Dodaj obrazek"
                              >
                                <Image className="h-4 w-4" />
                              </button>
                            </div>

                            <textarea
                              id="content"
                              rows={15}
                              required
                              value={blogForm.content}
                              onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                              placeholder="Treść artykułu... Użyj przycisków powyżej do formatowania."
                            />
                            
                            <div className="mt-2 text-sm text-gray-500">
                              <p><strong>Formatowanie:</strong></p>
                              <p>**pogrubiony tekst** | *kursywa* | # Nagłówek 1 | ## Nagłówek 2 | ### Nagłówek 3</p>
                              <p>![Podpis obrazka](URL_obrazka) | - Element listy</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                URL obrazka
                              </label>
                              <input
                                type="url"
                                value={blogForm.image_url}
                                onChange={(e) => setBlogForm({...blogForm, image_url: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                Tagi (oddzielone przecinkami)
                              </label>
                              <input
                                type="text"
                                value={blogForm.tags}
                                onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={blogForm.published}
                                onChange={(e) => setBlogForm({...blogForm, published: e.target.checked})}
                                className="mr-2"
                              />
                              Opublikowany
                            </label>
                          </div>

                          <button
                            type="submit"
                            disabled={saving}
                            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                          >
                            <Save className="h-5 w-5" />
                            <span>{saving ? 'Zapisywanie...' : 'Zapisz post'}</span>
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleProjectSubmit} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                Tytuł *
                              </label>
                              <input
                                type="text"
                                required
                                value={projectForm.title}
                                onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                Kategoria *
                              </label>
                              <select
                                required
                                value={projectForm.category}
                                onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              >
                                <option value="">Wybierz kategorię</option>
                                {projectCategories.map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                Branża *
                              </label>
                              <input
                                type="text"
                                required
                                value={projectForm.industry}
                                onChange={(e) => setProjectForm({...projectForm, industry: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                Data ukończenia *
                              </label>
                              <input
                                type="text"
                                required
                                value={projectForm.completion_date}
                                onChange={(e) => setProjectForm({...projectForm, completion_date: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                placeholder="2024"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                              Opis *
                            </label>
                            <textarea
                              rows={4}
                              required
                              value={projectForm.description}
                              onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                URL obrazka *
                              </label>
                              <input
                                type="url"
                                required
                                value={projectForm.image_url}
                                onChange={(e) => setProjectForm({...projectForm, image_url: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-900 mb-2">
                                URL projektu
                              </label>
                              <input
                                type="url"
                                value={projectForm.project_url}
                                onChange={(e) => setProjectForm({...projectForm, project_url: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          </div>

                          {/* Technologies */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <label className="block text-sm font-bold text-gray-900">
                                Technologie *
                              </label>
                              <button
                                type="button"
                                onClick={addTechnology}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                              >
                                + Dodaj technologię
                              </button>
                            </div>
                            <div className="space-y-2">
                              {projectForm.technologies.map((tech, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={tech}
                                    onChange={(e) => updateTechnology(index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                                    placeholder="np. React, Node.js"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeTechnology(index)}
                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                  >
                                    Usuń
                                  </button>
                                </div>
                              ))}
                              {projectForm.technologies.length === 0 && (
                                <p className="text-gray-500 text-sm">Kliknij "Dodaj technologię" aby dodać pierwszą technologię</p>
                              )}
                            </div>
                          </div>

                          {/* Results */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <label className="block text-sm font-bold text-gray-900">
                                Rezultaty *
                              </label>
                              <button
                                type="button"
                                onClick={addResult}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                              >
                                + Dodaj rezultat
                              </button>
                            </div>
                            <div className="space-y-3">
                              {projectForm.results.map((result, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={result.metric}
                                    onChange={(e) => updateResult(index, 'metric', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                                    placeholder="np. Wzrost konwersji"
                                  />
                                  <input
                                    type="text"
                                    value={result.value}
                                    onChange={(e) => updateResult(index, 'value', e.target.value)}
                                    className="w-32 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                                    placeholder="np. +340%"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeResult(index)}
                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                  >
                                    Usuń
                                  </button>
                                </div>
                              ))}
                              {projectForm.results.length === 0 && (
                                <p className="text-gray-500 text-sm">Kliknij "Dodaj rezultat" aby dodać pierwszy rezultat</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={projectForm.featured}
                                onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                                className="mr-2"
                              />
                              Projekt wyróżniony
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={projectForm.case_study}
                                onChange={(e) => setProjectForm({...projectForm, case_study: e.target.checked})}
                                className="mr-2"
                              />
                              Case Study
                            </label>
                          </div>

                          {/* Case Study Fields */}
                          {projectForm.case_study && (
                            <div className="border-t pt-6 space-y-6">
                              <h3 className="text-lg font-bold text-gray-900">Pola Case Study</h3>
                              
                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                  Nagłówek Case Study
                                </label>
                                <input
                                  type="text"
                                  value={projectForm.case_study_header}
                                  onChange={(e) => setProjectForm({...projectForm, case_study_header: e.target.value})}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                  placeholder="Jeśli puste, użyty zostanie tytuł projektu"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                  Wprowadzenie
                                </label>
                                <textarea
                                  rows={4}
                                  value={projectForm.case_study_introduction}
                                  onChange={(e) => setProjectForm({...projectForm, case_study_introduction: e.target.value})}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                  placeholder="Wprowadzenie do case study..."
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                  Cele projektu
                                </label>
                                <textarea
                                  rows={4}
                                  value={projectForm.case_study_goals}
                                  onChange={(e) => setProjectForm({...projectForm, case_study_goals: e.target.value})}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                  placeholder="Jakie były cele projektu..."
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                  Realizacja projektu
                                </label>
                                <textarea
                                  rows={6}
                                  value={projectForm.case_study_implementation}
                                  onChange={(e) => setProjectForm({...projectForm, case_study_implementation: e.target.value})}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                  placeholder="Jak przebiegała realizacja projektu..."
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                  Szczegółowy opis wyników
                                </label>
                                <textarea
                                  rows={4}
                                  value={projectForm.case_study_results}
                                  onChange={(e) => setProjectForm({...projectForm, case_study_results: e.target.value})}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                  placeholder="Szczegółowy opis osiągniętych wyników..."
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                  Podsumowanie i wnioski
                                </label>
                                <textarea
                                  rows={4}
                                  value={projectForm.case_study_summary}
                                  onChange={(e) => setProjectForm({...projectForm, case_study_summary: e.target.value})}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                  placeholder="Podsumowanie projektu i wnioski..."
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                  CTA (Call to Action)
                                </label>
                                <input
                                  type="text"
                                  value={projectForm.case_study_cta}
                                  onChange={(e) => setProjectForm({...projectForm, case_study_cta: e.target.value})}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                  placeholder="Jeśli puste, użyty zostanie domyślny CTA"
                                />
                              </div>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={saving}
                            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                          >
                            <Save className="h-5 w-5" />
                            <span>{saving ? 'Zapisywanie...' : 'Zapisz projekt'}</span>
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* List */}
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tytuł
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeTab === 'blog' ? 'Status' : 'Kategoria'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Akcje
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {activeTab === 'blog' ? (
                            blogPosts.map((post) => (
                              <tr key={post.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                  <div className="text-sm text-gray-500">{post.excerpt}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {post.published ? 'Opublikowany' : 'Szkic'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(post.created_at).toLocaleDateString('pl-PL')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEdit(post)}
                                      className="text-orange-600 hover:text-orange-900"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(post.id, 'blog')}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            projects.map((project) => (
                              <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{project.title}</div>
                                  <div className="text-sm text-gray-500">{project.industry}</div>
                                  {project.case_study && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                      Case Study
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {project.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {project.completion_date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEdit(project)}
                                      className="text-orange-600 hover:text-orange-900"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(project.id, 'project')}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  )
}

export default AdminPage