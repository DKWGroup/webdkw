import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface BlogPostTriggerProps {
  postId?: string;
}

/**
 * Komponent nasłuchujący zmian w postach blogowych i automatycznie aktualizujący mapę witryny
 */
const BlogPostTrigger: React.FC<BlogPostTriggerProps> = ({ postId }) => {
  useEffect(() => {
    // Funkcja do aktualizacji mapy witryny dla bloga
    const updateBlogSitemap = async () => {
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
          console.warn('Nie udało się zaktualizować mapy witryny dla bloga:', response.statusText);
          return;
        }

        console.log('Mapa witryny dla bloga została zaktualizowana');

        // Zaktualizuj również indeks map witryn
        const indexResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sitemap-index`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!indexResponse.ok) {
          console.warn('Nie udało się zaktualizować indeksu map witryn:', indexResponse.statusText);
          return;
        }

        console.log('Indeks map witryn został zaktualizowany');
      } catch (error) {
        console.error('Błąd podczas aktualizacji mapy witryny:', error);
      }
    };

    // Nasłuchuj zmian w tabeli blog_posts
    const subscription = supabase
      .channel('blog_posts_changes')
      .on('postgres_changes', {
        event: '*', // Nasłuchuj wszystkich zdarzeń (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'blog_posts',
        filter: postId ? `id=eq.${postId}` : undefined
      }, () => {
        // Aktualizuj mapę witryny po każdej zmianie
        updateBlogSitemap();
      })
      .subscribe();

    // Jeśli podano konkretny postId, aktualizuj mapę witryny od razu
    if (postId) {
      updateBlogSitemap();
    }

    // Czyszczenie subskrypcji przy odmontowaniu komponentu
    return () => {
      subscription.unsubscribe();
    };
  }, [postId]);

  // Komponent nie renderuje nic
  return null;
};

export default BlogPostTrigger;