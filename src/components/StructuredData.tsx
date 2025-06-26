import React from 'react'
import { Helmet } from 'react-helmet-async'

interface StructuredDataProps {
  type: 'website' | 'article' | 'service' | 'breadcrumb' | 'faq'
  data: any
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "WebDKW",
          "url": "https://webdkw.net",
          "description": "Profesjonalne strony internetowe dla firm",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://webdkw.net/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      
      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "image": data.image,
          "author": {
            "@type": "Person",
            "name": data.author || "Marcin Kowalski"
          },
          "publisher": {
            "@type": "Organization",
            "name": "WebDKW",
            "logo": {
              "@type": "ImageObject",
              "url": "https://webdkw.net/images/webdkw-logo.svg"
            }
          },
          "datePublished": data.publishedTime,
          "dateModified": data.modifiedTime || data.publishedTime,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          }
        }
      
      case 'service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data.name,
          "description": data.description,
          "provider": {
            "@type": "Organization",
            "name": "WebDKW",
            "url": "https://webdkw.net"
          },
          "areaServed": {
            "@type": "Country",
            "name": "Poland"
          },
          "serviceType": data.serviceType,
          "offers": data.offers ? {
            "@type": "Offer",
            "price": data.offers.price,
            "priceCurrency": "PLN",
            "availability": "https://schema.org/InStock"
          } : undefined
        }
      
      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        }
      
      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }
      
      default:
        return null
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData) return null

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}

export default StructuredData