import React from 'react';
import { Helmet } from 'react-helmet-async';

interface WebsiteSchemaProps {
  baseUrl: string;
}

const WebsiteSchema: React.FC<WebsiteSchemaProps> = ({ baseUrl }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "WebDKW",
    "url": baseUrl,
    "description": "Profesjonalne strony internetowe, sklepy i platformy z CMS. Kompleksowa obsługa, SEO, marketing, wdrożenia.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "WebDKW",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/webdkw-logo.svg`,
        "width": 600,
        "height": 60
      }
    },
    "inLanguage": "pl-PL",
    "copyrightYear": new Date().getFullYear(),
    "copyrightHolder": {
      "@type": "Organization",
      "name": "WebDKW"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default WebsiteSchema;