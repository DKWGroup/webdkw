import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js"
import { gzip } from "https://deno.land/x/compress@v0.4.5/mod.ts"

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
    const compress = url.searchParams.get('compress') === 'true'
    
    // Inicjalizacja klienta Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Przygotuj tablicę URL-i do mapy witryny
    const sitemapUrls: SitemapURL[] = []

    // 1. Dodaj strony statyczne
    const staticPages = [
      { path: '', priority: 1.0, changefreq: 'weekly' },
      { path: 'uslugi', priority: 0.9, changefreq: 'monthly' },
      { path: 'uslugi/tworzenie-stron', priority: 0.8, changefreq: 'monthly' },
      { path: 'uslugi/platformy-internetowe', priority: 0.8, changefreq: 'monthly' },
      { path: 'uslugi/sklepy-internetowe', priority: 0.8, changefreq: 'monthly' },
      { path: 'uslugi/seo', priority: 0.8, changefreq: 'monthly' },
      { path: 'uslugi/marketing', priority: 0.8, changefreq: 'monthly' },
      { path: 'portfolio', priority: 0.8, changefreq: 'monthly' },
      { path: 'case-studies', priority: 0.8, changefreq: 'monthly' },
      { path: 'blog', priority: 0.7, changefreq: 'weekly' },
      { path: 'proces-realizacji', priority: 0.7, changefreq: 'monthly' },
      { path: 'o-nas', priority: 0.6, changefreq: 'monthly' },
      { path: 'faq', priority: 0.6, changefreq: 'monthly' },
      { path: 'kontakt', priority: 0.7, changefreq: 'monthly' },
      { path: 'lead-magnet', priority: 0.5, changefreq: 'monthly' }
    ]

    staticPages.forEach(page => {
      sitemapUrls.push({
        loc: `${baseUrl}/${page.path}`,
        changefreq: page.changefreq as SitemapURL['changefreq'],
        priority: page.priority
      })
    })

    // 2. Pobierz i dodaj wszystkie opublikowane artykuły
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
        changefreq: 'monthly',
        priority: 0.7
      })
    })

    // 3. Pobierz i dodaj wszystkie projekty i case studies
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('slug, updated_at, created_at, case_study')
      .order('created_at', { ascending: false })

    if (projectsError) {
      throw projectsError
    }

    projects?.forEach(project => {
      // Dodaj stronę projektu w portfolio
      sitemapUrls.push({
        loc: `${baseUrl}/portfolio/${project.slug}`,
        lastmod: project.updated_at || project.created_at,
        changefreq: 'monthly',
        priority: 0.6
      })

      // Jeśli to case study, dodaj również tę stronę
      if (project.case_study) {
        sitemapUrls.push({
          loc: `${baseUrl}/case-studies/${project.slug}`,
          lastmod: project.updated_at || project.created_at,
          changefreq: 'monthly',
          priority: 0.7
        })
      }
    })

    // 4. Generuj XML mapy witryny
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

    // 5. Kompresuj, jeśli wymagane
    let responseBody: Uint8Array | string = xml
    let contentType = 'text/xml'
    let contentEncoding = ''

    if (compress) {
      responseBody = await gzip(new TextEncoder().encode(xml))
      contentEncoding = 'gzip'
    }

    // 6. Zwróć mapę witryny
    const headers = {
      ...corsHeaders,
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600' // Cache na 1 godzinę
    }

    if (contentEncoding) {
      headers['Content-Encoding'] = contentEncoding
    }

    return new Response(responseBody, { headers })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
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