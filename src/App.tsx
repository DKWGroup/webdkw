import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import LeadMagnetPage from './pages/LeadMagnetPage'
import ServicesPage from './pages/ServicesPage'
import WebsiteCreationPage from './pages/services/WebsiteCreationPage'
import PlatformDevelopmentPage from './pages/services/PlatformDevelopmentPage'
import EcommercePage from './pages/services/EcommercePage'
import SEOPage from './pages/services/SEOPage'
import MarketingPage from './pages/services/MarketingPage'
import PortfolioPage from './pages/PortfolioPage'
import CaseStudiesPage from './pages/CaseStudiesPage'
import CaseStudyPage from './pages/CaseStudyPage'
import SilesianLandingPage from './pages/SilesianLandingPage'
import ProcessPage from './pages/ProcessPage'
import AboutPage from './pages/AboutPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminPage from './pages/AdminPage'
import PasswordResetPage from './pages/PasswordResetPage'
import AEOManifestoPage from './pages/AEOManifestoPage'
import NotFoundPage from './pages/NotFoundPage'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/lead-magnet" element={<LeadMagnetPage />} />
        <Route path="/uslugi" element={<ServicesPage />} />
        <Route path="/uslugi/tworzenie-stron" element={<WebsiteCreationPage />} />
        <Route path="/uslugi/platformy-internetowe" element={<PlatformDevelopmentPage />} />
        <Route path="/uslugi/sklepy-internetowe" element={<EcommercePage />} />
        <Route path="/uslugi/seo" element={<SEOPage />} />
        <Route path="/uslugi/marketing" element={<MarketingPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
        <Route path="/strony-internetowe-seo-slask" element={<SilesianLandingPage />} />
        <Route path="/proces-realizacji" element={<ProcessPage />} />
        <Route path="/o-nas" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
        <Route path="/polityka-prywatnosci" element={<PrivacyPolicyPage />} />
        <Route path="/uslugi/pozycjonowanie-ai" element={<AEOManifestoPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/reset-password" element={<PasswordResetPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App