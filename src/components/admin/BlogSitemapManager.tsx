import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BlogSitemapManagerProps {
  onGenerateComplete?: (url: string) => void;
}

const BlogSitemapManager: React.FC<BlogSitemapManagerProps> = ({ onGenerateComplete }) => {
  const [sitemapUrl, setSitemapUrl] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    checkExistingSitemap();
  }, []);

  const checkExistingSitemap = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Sprawdź, czy istnieje plik sitemap-posts.xml
      const { data, error } = await supabase.storage
        .from('files')
        .list('sitemaps', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'desc' }
        });
      
      if (error) throw error;
      
      // Filtruj tylko pliki blog-sitemap
      const blogSitemaps = data?.filter(file => file.name.startsWith('blog-sitemap_')) || [];
      
      if (blogSitemaps.length > 0) {
        // Pobierz URL do najnowszego pliku
        const { data: { publicUrl } } = supabase.storage
          .from('files')
          .getPublicUrl('sitemap-posts.xml');
        
        setSitemapUrl(publicUrl);
        
        // Ustaw datę ostatniej generacji na podstawie nazwy pliku lub metadanych
        const latestSitemap = blogSitemaps[0];
        const createdAt = latestSitemap.created_at || new Date().toISOString();
        setLastGenerated(new Date(createdAt).toLocaleString());
      }
    } catch (err) {
      console.error('Error checking existing blog sitemap:', err);
      setError('Nie udało się sprawdzić istniejącej mapy witryny dla bloga');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBlogSitemap = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Wywołaj funkcję Edge do wygenerowania mapy witryny dla bloga
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-blog-sitemap`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd generowania mapy witryny dla bloga: ${response.statusText}`);
      }

      // Pobierz URL do pliku
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl('sitemap-posts.xml');
      
      setSitemapUrl(publicUrl);
      setLastGenerated(new Date().toLocaleString());
      setSuccessMessage('Mapa witryny dla bloga została pomyślnie wygenerowana!');
      
      // Wygeneruj również indeks map witryn
      await generateSitemapIndex();
      
      // Callback po zakończeniu
      if (onGenerateComplete) {
        onGenerateComplete(publicUrl);
      }
      
      // Ukryj komunikat po 5 sekundach
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Error generating blog sitemap:', err);
      setError(err.message || 'Wystąpił nieznany błąd podczas generowania mapy witryny dla bloga');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSitemapIndex = async () => {
    try {
      // Wywołaj funkcję Edge do wygenerowania indeksu map witryn
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sitemap-index`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Ostrzeżenie: Nie udało się wygenerować indeksu map witryn: ${response.statusText}`);
      }
    } catch (err) {
      console.warn('Warning: Error generating sitemap index:', err);
      // Nie wyświetlaj błędu użytkownikowi, to tylko ostrzeżenie
    }
  };

  const submitToSearchEngines = async () => {
    if (!sitemapUrl) return;
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Wywołaj funkcję Edge do powiadomienia wyszukiwarek
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ping-search-engines`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sitemapUrl,
          engines: ['google', 'bing']
        })
      });
      
      if (!response.ok) {
        throw new Error('Błąd podczas powiadamiania wyszukiwarek');
      }
      
      setSuccessMessage('Wyszukiwarki zostały powiadomione o nowej mapie witryny dla bloga!');
      
      // Ukryj komunikat po 5 sekundach
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Error submitting to search engines:', err);
      setError('Nie udało się powiadomić wyszukiwarek');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Mapa witryny dla bloga</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Generowanie mapy witryny</h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Mapa witryny dla bloga zawiera wszystkie opublikowane posty i jest automatycznie aktualizowana.
          </p>
          
          <div className="mb-4">
            <button
              onClick={generateBlogSitemap}
              disabled={isGenerating}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generowanie...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Wygeneruj mapę witryny dla bloga</span>
                </>
              )}
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>Mapa witryny dla bloga zawiera:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Wszystkie opublikowane artykuły</li>
              <li>Daty ostatniej aktualizacji</li>
              <li>Priorytety i częstotliwość zmian</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Informacje o mapie witryny</h3>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {sitemapUrl ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status:</p>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Aktywna</span>
                    </div>
                  </div>
                  
                  {lastGenerated && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ostatnia aktualizacja:</p>
                      <p className="font-medium">{lastGenerated}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">URL mapy witryny dla bloga:</p>
                    <div className="flex items-center">
                      <a 
                        href={sitemapUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline text-sm mr-2 truncate"
                      >
                        {sitemapUrl}
                      </a>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={submitToSearchEngines}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>Powiadom wyszukiwarki</span>
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Powiadamia Google i Bing o aktualizacji mapy witryny dla bloga
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Nie znaleziono mapy witryny dla bloga</p>
                  <p className="text-sm text-gray-600">
                    Wygeneruj nową mapę witryny dla bloga, aby poprawić widoczność w wyszukiwarkach
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Wskazówki:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>Mapa witryny dla bloga jest dostępna pod adresem /sitemap-posts.xml</li>
              <li>Generuj nową mapę po dodaniu nowych artykułów</li>
              <li>Indeks map witryn jest automatycznie aktualizowany</li>
              <li>Powiadamiaj wyszukiwarki o aktualizacjach, aby przyspieszyć indeksowanie</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSitemapManager;