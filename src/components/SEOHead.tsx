import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  categories?: string[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "WebDKW - Profesjonalne strony internetowe dla firm",
  description = "Tworzenie stron internetowych i sklepów online z gwarancją rezultatów. Zoptymalizowane pod SEO, Google Ads i realne cele biznesowe Twojej firmy.",
  keywords = "strony internetowe, tworzenie stron www, sklepy internetowe, pozycjonowanie SEO, Google Ads, marketing internetowy",
  image = "https://webdkw.net/images/webdkw-open-graph.png",
  url = "https://webdkw.net",
  type = "website",
  author = "Kamil Krukowski",
  publishedTime,
  modifiedTime,
  tags,
  categories,
}) => {
  const fullTitle = title.includes("WebDKW") ? title : `${title} | WebDKW`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Polish" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="WebDKW" />
      <meta property="og:locale" content="pl_PL" />
      {type === "article" && (
        <meta property="og:article:author" content={author} />
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content="@webdkw" />
      <meta name="twitter:creator" content="@webdkw" />

      {/* WhatsApp and other messaging apps */}
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/jpeg" />

      {/* Additional meta tags for better sharing */}
      <meta name="theme-color" content="#f97316" />
      <meta name="msapplication-TileColor" content="#f97316" />

      {/* Article specific meta tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" &&
        tags &&
        tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      {type === "article" &&
        categories &&
        categories.map((category) => (
          <meta key={category} property="article:section" content={category} />
        ))}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "WebDKW",
          description: "Profesjonalne strony internetowe dla firm",
          url: "https://webdkw.net",
          logo: "https://webdkw.net/images/webdkw-logo.svg",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+48-881-046-689",
            contactType: "customer service",
            email: "contact.dkwgroup@gmail.com",
          },
          address: {
            "@type": "PostalAddress",
            addressCountry: "PL",
            addressLocality: "Warszawa",
          },
          sameAs: [
            "https://www.facebook.com/webdkw",
            "https://www.linkedin.com/company/webdkw",
          ],
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
