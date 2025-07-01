import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPost } from '../lib/supabase';

interface BlogSchemaProps {
  post: BlogPost;
  baseUrl: string;
}

const BlogSchema: React.FC<BlogSchemaProps> = ({ post, baseUrl }) => {
  // Oblicz szacowany czas czytania
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(post.content);
  
  // Przygotuj dane strukturalne w formacie JSON-LD
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "name": post.title,
    "description": post.meta_description || post.excerpt || '',
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`
    },
    "image": post.image_url ? [post.image_url] : [],
    "author": {
      "@type": "Person",
      "name": post.author || "Marcin Kowalski",
      "url": `${baseUrl}/o-nas`
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
    "keywords": post.tags ? post.tags.join(", ") : "",
    "timeRequired": `PT${readingTime}M`,
    "inLanguage": "pl-PL"
  };

  // Dodaj kategorie, jeśli istnieją
  if (post.categories && post.categories.length > 0) {
    schemaData["articleSection"] = post.categories.join(", ");
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default BlogSchema;