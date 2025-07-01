import React from 'react';
import { Helmet } from 'react-helmet-async';

interface LocalBusinessSchemaProps {
  baseUrl: string;
}

const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({ baseUrl }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "WebDKW",
    "image": `${baseUrl}/images/webdkw-open-graph.png`,
    "url": baseUrl,
    "telephone": "+48881046689",
    "email": "contact.dkwgroup@gmail.com",
    "description": "Profesjonalne strony internetowe, sklepy i platformy z CMS. Kompleksowa obsługa, SEO, marketing, wdrożenia.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PL",
      "addressLocality": "Katowice"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "50.2598",
      "longitude": "19.0215"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "$$",
    "currenciesAccepted": "PLN",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "founder": {
      "@type": "Person",
      "name": "Kamil Krukowski"
    },
    "foundingDate": "2020",
    "sameAs": [
      "https://www.facebook.com/webdkw",
      "https://www.linkedin.com/company/webdkw"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Usługi WebDKW",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Tworzenie stron internetowych",
            "description": "Profesjonalne strony wizytówkowe i landing page'y zoptymalizowane pod konwersję"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sklepy internetowe",
            "description": "Kompleksowe sklepy e-commerce z systemami płatności i zarządzania zamówieniami"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Optymalizacja SEO",
            "description": "Kompleksowa optymalizacja SEO zwiększająca widoczność w wyszukiwarkach"
          }
        }
      ]
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

export default LocalBusinessSchema;