import React, { useState } from 'react'
import { Menu, X, Code, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const location = useLocation()

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const services = [
    { name: 'Tworzenie stron', path: '/uslugi/tworzenie-stron' },
    { name: 'Platformy internetowe', path: '/uslugi/platformy-internetowe' },
    { name: 'Sklepy internetowe', path: '/uslugi/sklepy-internetowe' },
    { name: 'Optymalizacja SEO', path: '/uslugi/seo' },
    { name: 'Marketing i reklamy', path: '/uslugi/marketing' }
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-gray-900">WebExpert</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <Link
                to="/uslugi"
                className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <span>Usługi</span>
                <ChevronDown className="h-4 w-4" />
              </Link>
              
              {/* Dropdown menu */}
              <div 
                className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 transition-all duration-200 ${
                  isServicesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                {services.map((service, index) => (
                  <Link
                    key={index}
                    to={service.path}
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <Link
              to="/portfolio"
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              Portfolio
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/o-nas"
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              O nas
            </Link>
            <Link
              to="/faq"
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/kontakt"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Kontakt
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/uslugi"
                className="text-left text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Usługi
              </Link>
              <Link
                to="/portfolio"
                className="text-left text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                to="/blog"
                className="text-left text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/o-nas"
                className="text-left text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                O nas
              </Link>
              <Link
                to="/faq"
                className="text-left text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/kontakt"
                className="text-left bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header