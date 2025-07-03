import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  provider: string;
  price?: string;
  priceCurrency?: string;
  areaServed?: string;
  serviceType?: string;
}

const ServiceSchema: React.FC<ServiceSchemaProps> = ({ 
  name, 
  description, 
  url, 
  provider,
  price,
  priceCurrency = "PLN",
  areaServed = "Poland",
  serviceType
}) => {
  const schemaData: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": url,
    "provider": {
      "@type": "Organization",
      "name": provider
    },
    "areaServed": {
      "@type": "Country",
      "name": areaServed
    },
    "serviceType": serviceType
  };

  // Dodaj informacje o cenie, jeśli została podana
  if (price) {
    schemaData["offers"] = {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "availability": "https://schema.org/InStock"
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default ServiceSchema;