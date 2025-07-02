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
  download_url?: string
  download_title?: string
}

// Gmail SMTP configuration
const GMAIL_CONFIG = {
  hostname: 'smtp.gmail.com',
  port: 587,
  username: Deno.env.get('GMAIL_USERNAME'), // Your Gmail address
  password: Deno.env.get('GMAIL_APP_PASSWORD'), // Gmail app password
}

async function sendEmailViaGmail(to: string[], subject: string, htmlContent: string, replyTo?: string) {
  try {
    // Create email message in RFC 2822 format
    const boundary = `boundary_${Date.now()}`
    const fromEmail = GMAIL_CONFIG.username
    const toEmails = to.join(', ')
    
    let emailMessage = `From: WebDKW <${fromEmail}>\r\n`
    emailMessage += `To: ${toEmails}\r\n`
    if (replyTo) {
      emailMessage += `Reply-To: ${replyTo}\r\n`
    }
    emailMessage += `Subject: ${subject}\r\n`
    emailMessage += `MIME-Version: 1.0\r\n`
    emailMessage += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n`
    emailMessage += `\r\n`
    emailMessage += `--${boundary}\r\n`
    emailMessage += `Content-Type: text/html; charset=UTF-8\r\n`
    emailMessage += `Content-Transfer-Encoding: 7bit\r\n`
    emailMessage += `\r\n`
    emailMessage += htmlContent
    emailMessage += `\r\n--${boundary}--\r\n`

    // Connect to Gmail SMTP
    const conn = await Deno.connect({
      hostname: GMAIL_CONFIG.hostname,
      port: GMAIL_CONFIG.port,
    })

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    // Helper function to send command and read response
    async function sendCommand(command: string): Promise<string> {
      await conn.write(encoder.encode(command + '\r\n'))
      const buffer = new Uint8Array(1024)
      const bytesRead = await conn.read(buffer)
      return decoder.decode(buffer.subarray(0, bytesRead || 0))
    }

    // SMTP conversation
    let response = await sendCommand('')
    console.log('Initial response:', response)

    response = await sendCommand('EHLO localhost')
    console.log('EHLO response:', response)

    response = await sendCommand('STARTTLS')
    console.log('STARTTLS response:', response)

    // Upgrade to TLS connection
    const tlsConn = await Deno.startTls(conn, { hostname: GMAIL_CONFIG.hostname })

    // Helper function for TLS connection
    async function sendTlsCommand(command: string): Promise<string> {
      await tlsConn.write(encoder.encode(command + '\r\n'))
      const buffer = new Uint8Array(1024)
      const bytesRead = await tlsConn.read(buffer)
      return decoder.decode(buffer.subarray(0, bytesRead || 0))
    }

    response = await sendTlsCommand('EHLO localhost')
    console.log('TLS EHLO response:', response)

    response = await sendTlsCommand('AUTH LOGIN')
    console.log('AUTH LOGIN response:', response)

    // Send username (base64 encoded)
    const usernameB64 = btoa(GMAIL_CONFIG.username!)
    response = await sendTlsCommand(usernameB64)
    console.log('Username response:', response)

    // Send password (base64 encoded)
    const passwordB64 = btoa(GMAIL_CONFIG.password!)
    response = await sendTlsCommand(passwordB64)
    console.log('Password response:', response)

    // Send MAIL FROM
    response = await sendTlsCommand(`MAIL FROM:<${fromEmail}>`)
    console.log('MAIL FROM response:', response)

    // Send RCPT TO for each recipient
    for (const recipient of to) {
      response = await sendTlsCommand(`RCPT TO:<${recipient}>`)
      console.log(`RCPT TO ${recipient} response:`, response)
    }

    // Send DATA command
    response = await sendTlsCommand('DATA')
    console.log('DATA response:', response)

    // Send email content
    await tlsConn.write(encoder.encode(emailMessage + '\r\n.\r\n'))
    const buffer = new Uint8Array(1024)
    const bytesRead = await tlsConn.read(buffer)
    response = decoder.decode(buffer.subarray(0, bytesRead || 0))
    console.log('Email sent response:', response)

    // Send QUIT
    await sendTlsCommand('QUIT')

    tlsConn.close()

    return { success: true, response }
  } catch (error) {
    console.error('Gmail SMTP error:', error)
    throw error
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, company, phone, message, lead_magnet, download_url, download_title }: ContactFormData = await req.json()

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

    // Validate Gmail configuration
    if (!GMAIL_CONFIG.username || !GMAIL_CONFIG.password) {
      throw new Error('Gmail configuration missing')
    }

    // Email content for company
    const companyEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Nowe zapytanie z formularza kontaktowego</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            Nowe zapytanie z formularza kontaktowego
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Imię i nazwisko:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${company ? `<p><strong>Firma:</strong> ${company}</p>` : ''}
            ${phone ? `<p><strong>Telefon:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
            <p><strong>Typ zapytania:</strong> ${lead_magnet ? 'Lead Magnet - Pobranie materiału' : 'Formularz kontaktowy'}</p>
            ${download_title ? `<p><strong>Pobrany materiał:</strong> ${download_title}</p>` : ''}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #f97316; margin: 20px 0;">
            <h3 style="margin-top: 0;">Wiadomość:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            Wiadomość wysłana z formularza na stronie webdkw.net<br>
            Data: ${new Date().toLocaleString('pl-PL')}
          </p>
        </div>
      </body>
      </html>
    `

    // Email content for customer confirmation
    let customerEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Potwierdzenie otrzymania zapytania - WebDKW</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f97316;">WebDKW</h1>
            <h2 style="color: #333;">Dziękujemy za kontakt!</h2>
          </div>
          
          <p>Cześć ${name},</p>
          
          <p>Dziękujemy za wysłanie zapytania przez nasz formularz kontaktowy. Otrzymaliśmy Twoją wiadomość i <strong>odpowiemy w ciągu 24 godzin</strong>.</p>
    `

    // Add download section if it's a lead magnet with download URL
    if (lead_magnet && download_url && download_title) {
      customerEmailContent += `
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; margin-top: 0;">📋 Twój materiał do pobrania</h3>
          <p>Zgodnie z prośbą, przesyłamy link do pobrania materiału "${download_title}".</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${download_url}" style="display: inline-block; background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Pobierz materiał
            </a>
          </div>
          <p style="font-size: 12px; color: #666;">Link będzie aktywny przez 7 dni. Jeśli masz problemy z pobraniem, odpowiedz na tego maila.</p>
        </div>
      `
    } else if (lead_magnet) {
      customerEmailContent += `
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; margin-top: 0;">📋 Twój materiał jest w drodze!</h3>
          <p>Link do pobrania materiału zostanie wysłany na Twój email w ciągu kilku minut.</p>
        </div>
      `
    }

    customerEmailContent += `
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Podsumowanie Twojego zapytania:</h3>
            <p><strong>Imię i nazwisko:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Firma:</strong> ${company}</p>` : ''}
            ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
            <p><strong>Wiadomość:</strong></p>
            <p style="white-space: pre-wrap; background-color: #fff; padding: 15px; border-radius: 4px;">${message}</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0;">📞 Kontakt w pilnych sprawach:</h3>
            <p style="margin: 5px 0;"><strong>📧 Email:</strong> <a href="mailto:contact.dkwgroup@gmail.com">contact.dkwgroup@gmail.com</a></p>
            <p style="margin: 5px 0;"><strong>📞 Telefon:</strong> <a href="tel:+48881046689">+48 881 046 689</a></p>
          </div>
          
          <p>Pozdrawiamy,<br>
          <strong>Zespół WebDKW</strong></p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            Ta wiadomość została wysłana automatycznie z systemu WebDKW.<br>
            Prosimy nie odpowiadać na ten email - w sprawach kontaktowych użyj adresu contact.dkwgroup@gmail.com
          </p>
        </div>
      </body>
      </html>
    `

    // Send email to company
    console.log('Sending email to company...')
    await sendEmailViaGmail(
      ['contact.dkwgroup@gmail.com'],
      `Nowe zapytanie od ${name} ${company ? `(${company})` : ''}`,
      companyEmailContent,
      email
    )

    // Send confirmation email to customer
    console.log('Sending confirmation email to customer...')
    await sendEmailViaGmail(
      [email],
      lead_magnet && download_title 
        ? `Twój materiał do pobrania: ${download_title} - WebDKW` 
        : 'Potwierdzenie otrzymania zapytania - WebDKW',
      customerEmailContent
    )

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Emails wysłane pomyślnie przez Gmail' 
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