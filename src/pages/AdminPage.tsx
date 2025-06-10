import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react'
import { supabase, BlogPost, Project } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'blog' | 'projects'>('blog')
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<BlogPost | Project | null>(null)
  const [loading, setLoading] = useState(true)

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
    technologies: '',
    results: '',
    completion_date: '',
    project_url: '',
    featured: false
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [blogResponse, projectsResponse] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false })
      ])

      if (blogResponse.data) setBlogPosts(blogResponse.data)
      if (projectsResponse.data) setProjects(projectsResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const blogData = {
      ...blogForm,
      tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      slug: blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }

    try {
      if (editingItem && 'content' in editingItem) {
        const { error } = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', editingItem.id)
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([blogData])
      }

      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving blog post:', error)
    }
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const projectData = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
      results: JSON.parse(projectForm.results || '[]'),
      slug: projectForm.slug || projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }

    try {
      if (editingItem && 'category' in editingItem) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingItem.id)
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData])
      }

      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving project:', error)
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
        technologies: item.technologies.join(', '),
        results: JSON.stringify(item.results, null, 2),
        completion_date: item.completion_date,
        project_url: item.project_url || '',
        featured: item.featured
      })
    }
  }

  const handleDelete = async (id: string, type: 'blog' | 'project') => {
    if (!confirm('Czy na pewno chcesz usunąć ten element?')) return

    try {
      const table = type === 'blog' ? 'blog_posts' : 'projects'
      await supabase.from(table).delete().eq('id', id)
      fetchData()
    } catch (error) {
      console.error('Error deleting item:', error)
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
      technologies: '',
      results: '',
      completion_date: '',
      project_url: '',
      featured: false
    })
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
                Panel CMS
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Zarządzaj treścią bloga i projektami portfolio
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
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                      <textarea
                        rows={10}
                        required
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
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
                      className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-5 w-5" />
                      <span>Zapisz post</span>
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
                        <input
                          type="text"
                          required
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
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

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Technologie (oddzielone przecinkami) *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectForm.technologies}
                        onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="React, Node.js, PostgreSQL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Rezultaty (JSON format) *
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={projectForm.results}
                        onChange={(e) => setProjectForm({...projectForm, results: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                        placeholder='[{"metric": "Wzrost konwersji", "value": "+340%"}]'
                      />
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
                    </div>

                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-5 w-5" />
                      <span>Zapisz projekt</span>
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AdminPage