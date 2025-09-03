import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, Lock } from 'lucide-react';
import { AdminSetup } from '../components/admin/AdminSetup';
import { supabase } from '../integrations/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { HelmetProvider } from 'react-helmet-async';

const AdminSetupPage: React.FC = () => {
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      // Check if any admin users exist
      const { data: adminRoles, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (error) {
        console.error('Error checking admin roles:', error);
        setHasAdmins(false);
      } else {
        setHasAdmins(adminRoles && adminRoles.length > 0);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setHasAdmins(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </HelmetProvider>
    );
  }

  if (hasAdmins) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-gray-50">
          <SEOHead 
            title="Konfiguracja Administratora - Nie wymagana"
            description="System administratora już został skonfigurowany"
            keywords=""
            url={`${window.location.origin}/admin/setup`}
          />
          
          <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
          
          <Header />
          
          <main className="pt-20">
            <section className="py-20">
              <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      System już skonfigurowany
                    </h1>
                    
                    <p className="text-gray-600 mb-8">
                      Administrator został już skonfigurowany w systemie. Ta strona nie jest już potrzebna.
                    </p>
                    
                    <div className="space-y-4">
                      <Link
                        to="/admin/login"
                        className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300"
                      >
                        <Lock className="h-5 w-5" />
                        <span>Przejdź do logowania</span>
                      </Link>
                      
                      <div className="pt-4">
                        <Link
                          to="/"
                          className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
                        >
                          <ArrowLeft className="h-5 w-5" />
                          <span>Powrót na stronę główną</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          
          <Footer />
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Konfiguracja Administratora - Pierwsza instalacja"
          description="Konfiguracja pierwszego administratora systemu"
          keywords=""
          url={`${window.location.origin}/admin/setup`}
        />
        
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        
        <Header />
        
        <main className="pt-20">
          <section className="py-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-4 mb-8">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Powrót na stronę główną</span>
                </Link>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">
                      Pierwsza konfiguracja systemu
                    </h3>
                    <p className="text-yellow-700 mt-1">
                      Nie wykryto żadnych administratorów. Skonfiguruj pierwszego administratora, aby zabezpieczyć system.
                    </p>
                  </div>
                </div>
              </div>

              <AdminSetup />

              <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-3">
                  Ważne instrukcje bezpieczeństwa:
                </h3>
                <ul className="text-red-700 space-y-2 text-sm">
                  <li>1. Najpierw utwórz konto użytkownika przez formularz rejestracji</li>
                  <li>2. Następnie użyj tego narzędzia, aby nadać temu użytkownikowi uprawnienia administratora</li>
                  <li>3. Po skonfigurowaniu pierwszego administratora, ta strona zostanie automatycznie wyłączona</li>
                  <li>4. Usuń tę stronę z produkcji po zakończeniu konfiguracji</li>
                </ul>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default AdminSetupPage;