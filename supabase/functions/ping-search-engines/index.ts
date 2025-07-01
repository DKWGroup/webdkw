import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface PingRequest {
  sitemapUrl: string;
  engines: string[]; // 'google', 'bing', etc.
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sitemapUrl, engines }: PingRequest = await req.json()

    // Validate required fields
    if (!sitemapUrl) {
      return new Response(
        JSON.stringify({ error: 'Brakuje URL mapy witryny' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Przygotuj URL-e do powiadomienia wyszukiwarek
    const pingUrls = {
      google: `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      bing: `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    }

    const results = {}
    const selectedEngines = engines && engines.length > 0 ? engines : Object.keys(pingUrls)

    // Powiadom wybrane wyszukiwarki
    for (const engine of selectedEngines) {
      if (pingUrls[engine]) {
        try {
          const response = await fetch(pingUrls[engine], {
            method: 'GET',
            headers: {
              'User-Agent': 'WebDKW Sitemap Notifier'
            }
          })
          
          results[engine] = {
            success: response.ok,
            status: response.status,
            statusText: response.statusText
          }
        } catch (error) {
          results[engine] = {
            success: false,
            error: error.message
          }
        }
      }
    }

    // Zapisz log powiadomienia
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      sitemapUrl,
      engines: selectedEngines,
      results
    }

    // W prawdziwej implementacji można zapisać log do bazy danych
    console.log('Sitemap ping log:', logEntry)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Wyszukiwarki zostały powiadomione',
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in ping-search-engines function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Wystąpił błąd podczas powiadamiania wyszukiwarek',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})