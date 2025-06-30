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

    // Email content for company
    const companyEmailContent = `
      <h2>Nowe zapytanie z formularza kontaktowego</h2>
      <p><strong>Imię i nazwisko:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Firma:</strong> ${company}</p>` : ''}
      ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
      <p><strong>Typ zapytania:</strong> ${lead_magnet ? 'Lead Magnet' : 'Formularz kontaktowy'}</p>
      <p><strong>Wiadomość:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p><small>Wiadomość wysłana z formularza na stronie webdkw.net</small></p>
    `

    // Email content for customer confirmation
    const customerEmailContent = `
      <h2>Dziękujemy za kontakt!</h2>
      <p>Cześć ${name},</p>
      <p>Dziękujemy za wysłanie zapytania przez nasz formularz kontaktowy. Otrzymaliśmy Twoją wiadomość i odpowiemy w ciągu 24 godzin.</p>
      
      <h3>Twoja wiadomość:</h3>
      <p><strong>Imię i nazwisko:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Firma:</strong> ${company}</p>` : ''}
      ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
      <p><strong>Wiadomość:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p>W pilnych sprawach możesz skontaktować się z nami bezpośrednio:</p>
      <p>📧 Email: contact.dkwgroup@gmail.com</p>
      <p>📞 Telefon: +48 881 046 689</p>
      
      <p>Pozdrawiamy,<br>
      Zespół WebDKW</p>
      
      <hr>
      <p><small>Ta wiadomość została wysłana automatycznie. Prosimy nie odpowiadać na ten email.</small></p>
    `

    // Send email to company
    const companyEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WebDKW <noreply@webdkw.net>',
        to: ['contact.dkwgroup@gmail.com'],
        subject: `Nowe zapytanie od ${name} ${company ? `(${company})` : ''}`,
        html: companyEmailContent,
        reply_to: email,
      }),
    })

    // Send confirmation email to customer
    const customerEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WebDKW <noreply@webdkw.net>',
        to: [email],
        subject: 'Potwierdzenie otrzymania zapytania - WebDKW',
        html: customerEmailContent,
      }),
    })

    if (!companyEmailResponse.ok) {
      console.error('Failed to send company email:', await companyEmailResponse.text())
      throw new Error('Błąd wysyłania emaila do firmy')
    }

    if (!customerEmailResponse.ok) {
      console.error('Failed to send customer email:', await customerEmailResponse.text())
      // Don't throw error here - company email is more important
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Emails wysłane pomyślnie' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-contact-email function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Wystąpił błąd podczas wysyłania emaila',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})