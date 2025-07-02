import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Pobierz parametry z URL
    const url = new URL(req.url)
    const baseUrl = url.searchParams.get('baseUrl') || 'https://webdkw.net'
    
    // Inicjalizacja klienta Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Przygotuj tablicę URL-i do mapy witryny
    const sitemapUrls: SitemapURL[] = []

    // Pobierz i dodaj wszystkie opublikowane artykuły
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (blogError) {
      throw blogError
    }

    blogPosts?.forEach(post => {
      sitemapUrls.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.updated_at || post.created_at,
        changefreq: 'weekly',
        priority: 0.7
      })
    })

    // Generuj XML mapy witryny
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    sitemapUrls.forEach(url => {
      xml += '  <url>\n'
      xml += `    <loc>${url.loc}</loc>\n`
      if (url.lastmod) {
        // Format lastmod as YYYY-MM-DD
        const lastmod = new Date(url.lastmod)
        xml += `    <lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>\n`
      }
      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`
      }
      if (url.priority !== undefined) {
        xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`
      }
      xml += '  </url>\n'
    })

    xml += '</urlset>'

    // Zapisz mapę witryny do pliku w Storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `blog-sitemap_${timestamp}.xml`
    
    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(`sitemaps/${filename}`, xml, {
        contentType: 'text/xml',
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) throw uploadError
    
    // Zapisz również jako sitemap-posts.xml (nadpisując istniejący)
    await supabase.storage
      .from('files')
      .upload('sitemap-posts.xml', xml, {
        contentType: 'text/xml',
        cacheControl: '3600',
        upsert: true
      })
    
    const { data: { publicUrl: mainSitemapUrl } } = supabase.storage
      .from('files')
      .getPublicUrl('sitemap-posts.xml')

    // Zwróć mapę witryny
    return new Response(xml, { 
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, max-age=3600' // Cache na 1 godzinę
      }
    })
  } catch (error) {
    console.error('Error generating blog sitemap:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Wystąpił błąd podczas generowania mapy witryny',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})