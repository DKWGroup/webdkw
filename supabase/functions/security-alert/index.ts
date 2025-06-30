import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SecurityAlert {
  type: 'blocked_ip' | 'suspicious_activity' | 'multiple_failures'
  ip_address: string
  timestamp: string
  details: string
  user_agent?: string
  email?: string
}

// Gmail SMTP configuration
const GMAIL_CONFIG = {
  hostname: 'smtp.gmail.com',
  port: 587,
  username: Deno.env.get('GMAIL_USERNAME'),
  password: Deno.env.get('GMAIL_APP_PASSWORD'),
}

async function sendSecurityAlert(alert: SecurityAlert) {
  try {
    const subject = `🚨 Alert Bezpieczeństwa - ${alert.type.toUpperCase()}`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Alert Bezpieczeństwa</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">🚨 Alert Bezpieczeństwa</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">${alert.type.replace('_', ' ').toUpperCase()}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #dc2626; margin-top: 0;">Szczegóły zdarzenia:</h2>
            <p><strong>Typ:</strong> ${alert.type}</p>
            <p><strong>Adres IP:</strong> ${alert.ip_address}</p>
            <p><strong>Data/Czas:</strong> ${new Date(alert.timestamp).toLocaleString('pl-PL')}</p>
            ${alert.email ? `<p><strong>Email:</strong> ${alert.email}</p>` : ''}
            ${alert.user_agent ? `<p><strong>User Agent:</strong> ${alert.user_agent}</p>` : ''}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc2626;">Opis zdarzenia:</h3>
            <p>${alert.details}</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #92400e;">Zalecane działania:</h3>
            <ul style="color: #92400e;">
              <li>Sprawdź logi bezpieczeństwa w panelu administracyjnym</li>
              <li>Zweryfikuj czy to prawdziwa próba włamania</li>
              <li>Rozważ zablokowanie IP na poziomie serwera</li>
              <li>Monitoruj dalszą aktywność z tego adresu</li>
            </ul>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            Alert wygenerowany automatycznie przez system bezpieczeństwa WebDKW<br>
            Data: ${new Date().toLocaleString('pl-PL')}
          </p>
        </div>
      </body>
      </html>
    `

    // Create email message in RFC 2822 format
    const boundary = `boundary_${Date.now()}`
    const fromEmail = GMAIL_CONFIG.username
    const toEmail = 'contact.dkwgroup@gmail.com' // Admin email
    
    let emailMessage = `From: WebDKW Security <${fromEmail}>\r\n`
    emailMessage += `To: ${toEmail}\r\n`
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
    await sendCommand('')
    await sendCommand('EHLO localhost')
    await sendCommand('STARTTLS')

    // Upgrade to TLS connection
    const tlsConn = await Deno.startTls(conn, { hostname: GMAIL_CONFIG.hostname })

    // Helper function for TLS connection
    async function sendTlsCommand(command: string): Promise<string> {
      await tlsConn.write(encoder.encode(command + '\r\n'))
      const buffer = new Uint8Array(1024)
      const bytesRead = await tlsConn.read(buffer)
      return decoder.decode(buffer.subarray(0, bytesRead || 0))
    }

    await sendTlsCommand('EHLO localhost')
    await sendTlsCommand('AUTH LOGIN')

    // Send credentials
    const usernameB64 = btoa(GMAIL_CONFIG.username!)
    await sendTlsCommand(usernameB64)

    const passwordB64 = btoa(GMAIL_CONFIG.password!)
    await sendTlsCommand(passwordB64)

    // Send email
    await sendTlsCommand(`MAIL FROM:<${fromEmail}>`)
    await sendTlsCommand(`RCPT TO:<${toEmail}>`)
    await sendTlsCommand('DATA')

    // Send email content
    await tlsConn.write(encoder.encode(emailMessage + '\r\n.\r\n'))
    const buffer = new Uint8Array(1024)
    await tlsConn.read(buffer)

    await sendTlsCommand('QUIT')
    tlsConn.close()

    return { success: true }
  } catch (error) {
    console.error('Security alert email error:', error)
    throw error
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const alert: SecurityAlert = await req.json()

    // Validate required fields
    if (!alert.type || !alert.ip_address || !alert.timestamp || !alert.details) {
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

    // Send security alert email
    await sendSecurityAlert(alert)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Alert bezpieczeństwa wysłany pomyślnie' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in security-alert function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Wystąpił błąd podczas wysyłania alertu',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})