import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  // const location = useLocation()

  // const scrollToSection = (sectionId: string) => {
  //   if (location.pathname !== '/') {
  //     window.location.href = `/#${sectionId}`
  //     return
  //   }
  //   const element = document.getElementById(sectionId)
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth' })
  //   }
  //   setIsMenuOpen(false)
  // }

  const services = [
    { name: 'Pozycjonowanie AEO/GEO', path: '/uslugi/pozycjonowanie-ai', featured: true },
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
            <img src="/images/webdkw-logo.svg" alt="WebDKW Logo" className="h-6 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
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
                className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 transition-all duration-200 z-50 ${
                  isServicesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                {services.map((service, index) => (
                  <Link
                    key={index}
                    to={service.path}
                    className={`block px-4 py-2 transition-colors ${
                      service.featured 
                        ? 'bg-gradient-to-r from-primary-50 to-orange-50 text-primary-600 font-semibold border-b border-primary-100 hover:from-primary-100 hover:to-orange-100' 
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'
                    }`}
                  >
                    {service.name}
                    {service.featured && <span className="ml-2 text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">NOWOŚĆ</span>}
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
              to="/case-studies"
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              Case Studies
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/proces-realizacji"
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              Proces realizacji
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
            className="lg:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <div className="space-y-2">
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Usługi</span>
                {services.map((service, index) => (
                  <Link
                    key={index}
                    to={service.path}
                    className={`text-left transition-all duration-200 transform hover:translate-x-2 pl-4 ${
                      service.featured 
                        ? 'text-primary-600 font-semibold' 
                        : 'text-gray-700 hover:text-orange-500'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {service.name}
                    {service.featured && <span className="ml-2 text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">NOWOŚĆ</span>}
                  </Link>
                ))}
              </div>
              <Link
                to="/portfolio"
                className="text-left text-gray-700 hover:text-orange-500 transition-all duration-200 transform hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                to="/case-studies"
                className="text-left text-gray-700 hover:text-orange-500 transition-all duration-200 transform hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Case Studies
              </Link>
              <Link
                to="/blog"
                className="text-left text-gray-700 hover:text-orange-500 transition-all duration-200 transform hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/proces-realizacji"
                className="text-left text-gray-700 hover:text-orange-500 transition-all duration-200 transform hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Proces realizacji
              </Link>
              <Link
                to="/o-nas"
                className="text-left text-gray-700 hover:text-orange-500 transition-all duration-200 transform hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                O nas
              </Link>
              <Link
                to="/faq"
                className="text-left text-gray-700 hover:text-orange-500 transition-all duration-200 transform hover:translate-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/kontakt"
                className="text-left bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 w-fit transform hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header