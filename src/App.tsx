import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CookieBanner from "./components/CookieBanner";
import CookiePreferences from "./components/CookiePreferences";
import { CookieConsentProvider } from "./context/CookieConsentContext";
import AEOManifestoPage from "./pages/AEOManifestoPage";
import AboutPage from "./pages/AboutPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import CaseStudyPage from "./pages/CaseStudyPage";
import ChorzowWebsitesPage from "./pages/ChorzowWebsitesPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import GliwiceWebsitesPage from "./pages/GliwiceWebsitesPage";
import HomePage from "./pages/HomePage";
import KatowiceWebsitesPage from "./pages/KatowiceWebsitesPage";
import LeadMagnetPage from "./pages/LeadMagnetPage";
import NotFoundPage from "./pages/NotFoundPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import PortfolioPage from "./pages/PortfolioPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ProcessPage from "./pages/ProcessPage";
import ServicesPage from "./pages/ServicesPage";
import SilesianLandingPage from "./pages/SilesianLandingPage";
import EcommercePage from "./pages/services/EcommercePage";
import MarketingPage from "./pages/services/MarketingPage";
import PlatformDevelopmentPage from "./pages/services/PlatformDevelopmentPage";
import SEOPage from "./pages/services/SEOPage";
import WebsiteCreationPage from "./pages/services/WebsiteCreationPage";

function App() {
  return (
    <CookieConsentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/lead-magnet" element={<LeadMagnetPage />} />
          <Route path="/uslugi" element={<ServicesPage />} />
          <Route
            path="/uslugi/tworzenie-stron"
            element={<WebsiteCreationPage />}
          />
          <Route
            path="/uslugi/platformy-internetowe"
            element={<PlatformDevelopmentPage />}
          />
          <Route
            path="/uslugi/sklepy-internetowe"
            element={<EcommercePage />}
          />
          <Route path="/uslugi/seo" element={<SEOPage />} />
          <Route path="/uslugi/marketing" element={<MarketingPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
          <Route
            path="/strony-internetowe-seo-slask"
            element={<SilesianLandingPage />}
          />
          <Route
            path="/katowice-tworzenie-stron"
            element={<KatowiceWebsitesPage />}
          />
          <Route
            path="/chorzow-tworzenie-stron"
            element={<ChorzowWebsitesPage />}
          />
          <Route
            path="/gliwice-tworzenie-stron"
            element={<GliwiceWebsitesPage />}
          />
          <Route path="/proces-realizacji" element={<ProcessPage />} />
          <Route path="/o-nas" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/kontakt" element={<ContactPage />} />
          <Route path="/polityka-prywatnosci" element={<PrivacyPolicyPage />} />
          <Route
            path="/uslugi/pozycjonowanie-ai"
            element={<AEOManifestoPage />}
          />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/reset-password" element={<PasswordResetPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <CookieBanner />
        <CookiePreferences />
      </Router>
    </CookieConsentProvider>
  );
}

export default App;
