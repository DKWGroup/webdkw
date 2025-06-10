import React from 'react'
import { Code, Mail, Phone, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Code className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold">WebExpert</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Projektuję strony i sklepy internetowe, które są fundamentem skutecznego 
              marketingu – zoptymalizowane pod SEO, kampanie reklamowe i realne cele biznesowe.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <a href="mailto:marcin@webexpert.pl" className="text-gray-300 hover:text-orange-500 transition-colors">
                  marcin@webexpert.pl
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <a href="tel:+48123456789" className="text-gray-300 hover:text-orange-500 transition-colors">
                  +48 123 456 789
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-bold mb-4">Nawigacja</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/uslugi" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Usługi
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/proces-realizacji" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Proces realizacji
                </Link>
              </li>
              <li>
                <Link to="/o-nas" className="text-gray-300 hover:text-orange-500 transition-colors">
                  O nas
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-orange-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Zasoby</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://calendly.com/webexpert/konsultacja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-orange-500 transition-colors flex items-center space-x-1"
                >
                  <span>Umów konsultację</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>
                <Link to="/lead-magnet" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Darmowa Checklista
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Panel CMS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} WebExpert. Wszystkie prawa zastrzeżone.
              </p>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>Wspierane przez</span>
                <div className="flex items-center space-x-1">
                  <img src="/images/dkwgroup-logo.png" alt="DKWGroup Logo" className="h-8 w-auto" />
                </div>
              </div>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Polityka prywatności
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Regulamin
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer