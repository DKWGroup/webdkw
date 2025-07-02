import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BlogPost {
  slug: string
  updated_at: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch published blog posts
    const { data: posts, error: fetchError } = await supabaseClient
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)
      .order('updated_at', { ascending: false })

    if (fetchError) {
      throw new Error(`Failed to fetch blog posts: ${fetchError.message}`)
    }

    // Generate sitemap XML
    const baseUrl = 'https://webdkw.com'
    const blogPosts = posts as BlogPost[]
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogPosts.map(post => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

    // Upload to Supabase Storage with application/xml MIME type
    const { error: uploadError } = await supabaseClient.storage
      .from('files')
      .upload('sitemap-blog.xml', sitemapXml, {
        contentType: 'application/xml',
        upsert: true
      })

    if (uploadError) {
      throw new Error(`Failed to upload sitemap: ${uploadError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Blog sitemap generated successfully',
        postsCount: blogPosts.length 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error generating blog sitemap:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Wystąpił błąd podczas generowania mapy witryny',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})