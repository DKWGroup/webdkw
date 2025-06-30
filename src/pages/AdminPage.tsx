import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  MoreVertical,
  ChevronDown,
  Bell,
  User
} from 'lucide-react'
import { supabase, BlogPost, ContactSubmission, Project } from '../lib/supabase'
import { authSecurity } from '../lib/auth'

const AdminPage = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  
  // Data states
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalContacts: 0,
    totalProjects: 0,
    recentContacts: 0
  })

  useEffect(() => {
    checkAuthentication()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, activeTab])

  const checkAuthentication = async () => {
    try {
      const authenticated = await authSecurity.isAuthenticated()
      if (!authenticated) {
        navigate('/admin/login')
        return
      }
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check error:', error)
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      // Fetch blog posts
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      setBlogPosts(postsData || [])

      // Fetch contacts
      const { data: contactsData } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
      setContacts(contactsData || [])

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      setProjects(projectsData || [])

      // Calculate stats
      const recentDate = new Date()
      recentDate.setDate(recentDate.getDate() - 7)
      const recentContacts = contactsData?.filter(
        contact => new Date(contact.created_at) > recentDate
      ).length || 0

      setStats({
        totalPosts: postsData?.length || 0,
        totalContacts: contactsData?.length || 0,
        totalProjects: projectsData?.length || 0,
        recentContacts
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await authSecurity.logout('manual')
      navigate('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'posts', label: 'Artykuły', icon: FileText },
    { id: 'projects', label: 'Projekty', icon: Settings },
    { id: 'contacts', label: 'Kontakty', icon: Users },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="admin-panel min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Otwórz menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Panel Admin</h1>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">WebDKW Admin</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Zamknij menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${activeTab === item.id 
                      ? 'bg-orange-100 text-orange-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Wyloguj</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeTab === 'dashboard' ? 'Dashboard' : menuItems.find(item => item.id === activeTab)?.label}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Zarządzaj zawartością swojej strony
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 lg:p-6">
            {activeTab === 'dashboard' && <DashboardContent stats={stats} />}
            {activeTab === 'posts' && <PostsContent posts={blogPosts} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
            {activeTab === 'projects' && <ProjectsContent projects={projects} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
            {activeTab === 'contacts' && <ContactsContent contacts={contacts} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Component
const DashboardContent = ({ stats }: { stats: any }) => (
  <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <StatCard title="Artykuły" value={stats.totalPosts} icon={FileText} color="blue" />
      <StatCard title="Projekty" value={stats.totalProjects} icon={Settings} color="green" />
      <StatCard title="Kontakty" value={stats.totalContacts} icon={Users} color="purple" />
      <StatCard title="Nowe (7 dni)" value={stats.recentContacts} icon={Bell} color="orange" />
    </div>

    {/* Quick Actions */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Szybkie akcje</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickActionCard title="Nowy artykuł" description="Dodaj nowy post na blog" icon={Plus} />
        <QuickActionCard title="Nowy projekt" description="Dodaj projekt do portfolio" icon={Upload} />
        <QuickActionCard title="Eksportuj dane" description="Pobierz raporty" icon={Download} />
      </div>
    </div>
  </div>
)

// Posts Content Component
const PostsContent = ({ posts, searchTerm, setSearchTerm }: any) => (
  <div className="space-y-6">
    {/* Search and Actions */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj artykułów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nowy artykuł</span>
          </button>
        </div>
      </div>
    </div>

    {/* Posts Table */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tytuł
              </th>
              <th className="hidden md:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="hidden lg:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data utworzenia
              </th>
              <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.slice(0, 10).map((post: BlogPost) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs lg:max-w-none">
                      {post.title}
                    </div>
                    <div className="text-sm text-gray-500 md:hidden">
                      {post.published ? 'Opublikowany' : 'Szkic'}
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    post.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.published ? 'Opublikowany' : 'Szkic'}
                  </span>
                </td>
                <td className="hidden lg:table-cell px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString('pl-PL')}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-orange-600 hover:text-orange-900 p-1">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 p-1">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

// Projects Content Component
const ProjectsContent = ({ projects, searchTerm, setSearchTerm }: any) => (
  <div className="space-y-6">
    {/* Search and Actions */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj projektów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nowy projekt</span>
          </button>
        </div>
      </div>
    </div>

    {/* Projects Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
      {projects.slice(0, 9).map((project: Project) => (
        <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="aspect-video bg-gray-200 relative">
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <button className="p-1 bg-white rounded-full shadow-sm">
                <MoreVertical className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{project.category}</p>
            <div className="flex items-center justify-between mt-4">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                project.featured 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {project.featured ? 'Wyróżniony' : 'Standardowy'}
              </span>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-900 p-1">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Contacts Content Component
const ContactsContent = ({ contacts, searchTerm, setSearchTerm }: any) => (
  <div className="space-y-6">
    {/* Search and Actions */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj kontaktów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Eksportuj</span>
          </button>
        </div>
      </div>
    </div>

    {/* Contacts Table */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kontakt
              </th>
              <th className="hidden md:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Firma
              </th>
              <th className="hidden lg:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.slice(0, 10).map((contact: ContactSubmission) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                    {contact.phone && (
                      <div className="text-sm text-gray-500 md:hidden">{contact.phone}</div>
                    )}
                  </div>
                </td>
                <td className="hidden md:table-cell px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {contact.company || '-'}
                </td>
                <td className="hidden lg:table-cell px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(contact.created_at).toLocaleDateString('pl-PL')}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-orange-600 hover:text-orange-900 p-1">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

// Utility Components
const StatCard = ({ title, value, icon: Icon, color }: any) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]} text-white`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

const QuickActionCard = ({ title, description, icon: Icon }: any) => (
  <button className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-orange-100 rounded-lg">
        <Icon className="h-5 w-5 text-orange-600" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  </button>
)

export default AdminPage