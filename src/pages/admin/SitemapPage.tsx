import React from 'react';
import SitemapManager from '../../components/admin/SitemapManager';

const SitemapPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Zarządzanie mapami witryny (sitemap.xml)</h2>
        <p className="text-gray-600 mb-6">
          Mapy witryny pomagają wyszukiwarkom indeksować Twoją stronę. Generuj nowe mapy po dodaniu nowych treści.
        </p>
        
        <SitemapManager />
      </div>
    </div>
  );
};

export default SitemapPage;