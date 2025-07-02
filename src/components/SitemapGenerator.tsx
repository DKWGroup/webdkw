import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SitemapGeneratorProps {
  baseUrl?: string;
  onGenerateComplete?: (url: string) => void;
}

const SitemapGenerator: React.FC<SitemapGeneratorProps> = ({ 
  baseUrl = 'https://webdkw.net',
  onGenerateComplete 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sitemapUrl, setSitemapUrl] = useState<string | null>(null);

  const generateSitemap = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Wywołaj funkcję Edge do wygenerowania mapy witryny
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sitemap?baseUrl=${encodeURIComponent(baseUrl)}&compress=false`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd generowania mapy witryny: ${response.statusText}`);
      }

      // Pobierz XML mapy witryny
      const sitemapXml = await response.text();
      
      // Zapisz mapę witryny do pliku w Storage
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `sitemap_${timestamp}.xml`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('files')
        .upload(`sitemaps/${filename}`, sitemapXml, {
          contentType: 'text/xml',
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Pobierz publiczny URL do pliku
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(`sitemaps/${filename}`);
      
      // Zapisz również jako sitemap.xml (nadpisując istniejący)
      await supabase.storage
        .from('files')
        .upload('sitemap.xml', sitemapXml, {
          contentType: 'text/xml',
          cacheControl: '3600',
          upsert: true
        });
      
      const { data: { publicUrl: mainSitemapUrl } } = supabase.storage
        .from('files')
        .getPublicUrl('sitemap.xml');
      
      // Zapisz informację o ostatnim wygenerowaniu
      setLastGenerated(new Date().toLocaleString());
      setSitemapUrl(mainSitemapUrl);
      
      // Callback po zakończeniu
      if (onGenerateComplete) {
        onGenerateComplete(mainSitemapUrl);
      }
      
    } catch (err) {
      console.error('Error generating sitemap:', err);
      setError(err.message || 'Wystąpił nieznany błąd podczas generowania mapy witryny');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Generator mapy witryny</h3>
      
      <div className="mb-4">
        <button
          onClick={generateSitemap}
          disabled={isGenerating}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generowanie...' : 'Wygeneruj mapę witryny'}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          <p className="font-semibold">Błąd:</p>
          <p>{error}</p>
        </div>
      )}
      
      {lastGenerated && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Ostatnio wygenerowano: <span className="font-semibold">{lastGenerated}</span>
          </p>
        </div>
      )}
      
      {sitemapUrl && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Link do mapy witryny:</p>
          <div className="flex items-center">
            <a 
              href={sitemapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline break-all"
            >
              {sitemapUrl}
            </a>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Mapa witryny zawiera:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Wszystkie opublikowane artykuły</li>
          <li>Strony statyczne</li>
          <li>Projekty i case studies</li>
        </ul>
      </div>
    </div>
  );
};

export default SitemapGenerator;