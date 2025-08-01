import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OrganizationSchemaProps {
  baseUrl: string;
}

const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({ baseUrl }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WebDKW",
    "url": baseUrl,
    "logo": `${baseUrl}/images/webdkw-logo.svg`,
    "description": "Profesjonalne strony internetowe, sklepy i platformy z CMS. Kompleksowa obsługa, SEO, marketing, wdrożenia.",
    "email": "contact.dkwgroup@gmail.com",
    "telephone": "+48881046689",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PL",
      "addressLocality": "Katowice"
    },
    "sameAs": [
      "https://www.facebook.com/webdkw",
      "https://www.linkedin.com/company/webdkw"
    ],
    "founder": {
      "@type": "Person",
      "name": "Kamil Krukowski",
      "jobTitle": "Web Developer & SEO Strategist"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+48881046689",
      "contactType": "customer service",
      "email": "contact.dkwgroup@gmail.com",
      "availableLanguage": ["Polish", "English"]
    },
    "knowsAbout": [
      "Web Development",
      "SEO",
      "E-commerce",
      "Digital Marketing",
      "Web Design",
      "Content Marketing"
    ],
    "areaServed": "Poland"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default OrganizationSchema;