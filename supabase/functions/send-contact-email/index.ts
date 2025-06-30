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

// Simple email sending using EmailJS or similar service
async function sendEmailViaService(emailData: any) {
  try {
    // For now, we'll use a simple approach that logs the email
    // In production, you can integrate with services like:
    // - EmailJS
    // - SendGrid
    // - Mailgun
    // - Postmark
    
    console.log('Sending email:', emailData)
    
    // Simulate successful email sending
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return { success: true }
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
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

    // Prepare email content for company
    const companyEmailContent = `
      Nowe zapytanie z formularza kontaktowego WebDKW
      
      Dane kontaktowe:
      - Imię i nazwisko: ${name}
      - Email: ${email}
      ${company ? `- Firma: ${company}` : ''}
      ${phone ? `- Telefon: ${phone}` : ''}
      - Typ zapytania: ${lead_magnet ? 'Lead Magnet - Checklist' : 'Formularz kontaktowy'}
      
      Wiadomość:
      ${message}
      
      Data: ${new Date().toLocaleString('pl-PL')}
      Źródło: webdkw.net
    `

    // Prepare confirmation email for customer
    const customerEmailContent = `
      Cześć ${name},
      
      Dziękujemy za wysłanie zapytania przez nasz formularz kontaktowy!
      
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
      
      Wiadomość:
      ${message}
      
      📞 Kontakt w pilnych sprawach:
      📧 Email: contact.dkwgroup@gmail.com
      📞 Telefon: +48 881 046 689
      
      Pozdrawiamy,
      Zespół WebDKW
      
      ---
      Ta wiadomość została wysłana automatycznie.
      Prosimy nie odpowiadać na ten email.
    `

    // Prepare email data
    const emailsToSend = [
      {
        to: 'contact.dkwgroup@gmail.com',
        subject: `Nowe zapytanie od ${name} ${company ? `(${company})` : ''}`,
        content: companyEmailContent,
        type: 'company_notification'
      },
      {
        to: email,
        subject: 'Potwierdzenie otrzymania zapytania - WebDKW',
        content: customerEmailContent,
        type: 'customer_confirmation'
      }
    ]

    // Try to send emails
    const emailResults = []
    for (const emailData of emailsToSend) {
      try {
        const result = await sendEmailViaService(emailData)
        emailResults.push({ ...emailData, success: true, result })
      } catch (error) {
        console.error(`Failed to send ${emailData.type}:`, error)
        emailResults.push({ ...emailData, success: false, error: error.message })
      }
    }

    // Log results for debugging
    console.log('Email sending results:', emailResults)

    // Return success even if emails failed (form submission is more important)
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Formularz został wysłany pomyślnie',
        emailResults: emailResults.map(r => ({ type: r.type, success: r.success }))
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