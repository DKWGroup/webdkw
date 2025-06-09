import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import LeadMagnetPage from './pages/LeadMagnetPage'
import ServicesPage from './pages/ServicesPage'
import WebsiteCreationPage from './pages/services/WebsiteCreationPage'
import PlatformDevelopmentPage from './pages/services/PlatformDevelopmentPage'
import EcommercePage from './pages/services/EcommercePage'
import SEOPage from './pages/services/SEOPage'
import MarketingPage from './pages/services/MarketingPage'
import PortfolioPage from './pages/PortfolioPage'
import ProcessPage from './pages/ProcessPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/lead-magnet" element={<LeadMagnetPage />} />
        <Route path="/uslugi" element={<ServicesPage />} />
        <Route path="/uslugi/tworzenie-stron" element={<WebsiteCreationPage />} />
        <Route path="/uslugi/platformy-internetowe" element={<PlatformDevelopmentPage />} />
        <Route path="/uslugi/sklepy-internetowe" element={<EcommercePage />} />
        <Route path="/uslugi/seo" element={<SEOPage />} />
        <Route path="/uslugi/marketing" element={<MarketingPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/proces-realizacji" element={<ProcessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App