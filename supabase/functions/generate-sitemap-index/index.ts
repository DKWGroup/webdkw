import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    // Pobierz URL do sitemap.xml i sitemap-posts.xml
    const { data: { publicUrl: mainSitemapUrl } } = supabase.storage
      .from('files')
      .getPublicUrl('sitemap.xml')
    
    const { data: { publicUrl: blogSitemapUrl } } = supabase.storage
      .from('files')
      .getPublicUrl('sitemap-posts.xml')

    // Generuj XML indeksu map witryn
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    // Dodaj główną mapę witryny
    xml += '  <sitemap>\n'
    xml += `    <loc>${mainSitemapUrl}</loc>\n`
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`
    xml += '  </sitemap>\n'
    
    // Dodaj mapę witryny dla blogów
    xml += '  <sitemap>\n'
    xml += `    <loc>${blogSitemapUrl}</loc>\n`
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`
    xml += '  </sitemap>\n'
    
    xml += '</sitemapindex>'

    // Zapisz indeks map witryn do pliku w Storage
    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload('sitemap-index.xml', xml, {
        contentType: 'text/xml',
        cacheControl: '3600',
        upsert: true
      })
    
    if (uploadError) throw uploadError
    
    // Zwróć indeks map witryn
    return new Response(xml, { 
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml',
        'Cache-Control': 'public, max-age=3600' // Cache na 1 godzinę
      }
    })
  } catch (error) {
    console.error('Error generating sitemap index:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Wystąpił błąd podczas generowania indeksu map witryn',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})