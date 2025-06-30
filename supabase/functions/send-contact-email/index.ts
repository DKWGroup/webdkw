import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  lead_magnet?: boolean
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, company, phone, message, lead_magnet }: ContactFormData = await req.json()

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Brakuje wymaganych pól' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // For now, we'll just log the email data and return success
    // In production, you would integrate with your preferred email service
    console.log('Email data received:', {
      name,
      email,
      company,
      phone,
      message,
      lead_magnet,
      timestamp: new Date().toISOString()
    })

    // Simulate email sending success
    const emailData = {
      to_company: {
        recipient: 'contact.dkwgroup@gmail.com',
        subject: `Nowe zapytanie od ${name} ${company ? `(${company})` : ''}`,
        content: `
          Nowe zapytanie z formularza kontaktowego:
          
          Imię i nazwisko: ${name}
          Email: ${email}
          ${company ? `Firma: ${company}` : ''}
          ${phone ? `Telefon: ${phone}` : ''}
          Typ zapytania: ${lead_magnet ? 'Lead Magnet - Checklist' : 'Formularz kontaktowy'}
          
          Wiadomość:
          ${message}
          
          Data: ${new Date().toLocaleString('pl-PL')}
        `
      },
      to_customer: {
        recipient: email,
        subject: 'Potwierdzenie otrzymania zapytania - WebDKW',
        content: `
          Cześć ${name},
          
          Dziękujemy za wysłanie zapytania przez nasz formularz kontaktowy. 
          Otrzymaliśmy Twoją wiadomość i odpowiemy w ciągu 24 godzin.
          
          ${lead_magnet ? `
          📋 Twoja checklist jest w drodze!
          Link do pobrania checklisty "15 kluczowych elementów skutecznej strony" 
          zostanie wysłany na Twój email w ciągu kilku minut.
          ` : ''}
          
          Podsumowanie Twojego zapytania:
          - Imię i nazwisko: ${name}
          - Email: ${email}
          ${company ? `- Firma: ${company}` : ''}
          ${phone ? `- Telefon: ${phone}` : ''}
          
          Wiadomość: ${message}
          
          Kontakt w pilnych sprawach:
          📧 Email: contact.dkwgroup@gmail.com
          📞 Telefon: +48 881 046 689
          
          Pozdrawiamy,
          Zespół WebDKW
        `
      }
    }

    // In a real implementation, you would send these emails using your preferred service
    // For now, we'll return success with the email data for debugging
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Formularz został wysłany pomyślnie',
        debug: process.env.NODE_ENV === 'development' ? emailData : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-contact-email function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Wystąpił błąd podczas przetwarzania formularza',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})