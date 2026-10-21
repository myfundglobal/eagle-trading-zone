import { Resend } from 'resend'
import nodemailer from 'nodemailer'

export interface SendOtpOptions {
  to: string
  name?: string
  code: string
}

/**
 * Builds a luxury, high-conversion dark-theme HTML email matching the
 * Eagle Trading Zone neon red & black visual branding.
 */
export function buildVerificationEmailHtml(code: string, recipientName?: string): string {
  const displayName = recipientName?.trim() || 'Trader'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eagle Trading Zone - Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #070709;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #E2E8F0;
    }
    .wrapper {
      width: 100%;
      background-color: #070709;
      padding: 40px 10px;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #0E0E12;
      border: 1px solid rgba(255, 42, 42, 0.25);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 42, 42, 0.12);
    }
    .header {
      background: linear-gradient(180deg, rgba(255, 42, 42, 0.15) 0%, rgba(14, 14, 18, 0) 100%);
      padding: 35px 30px 20px 30px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .logo-badge {
      display: inline-block;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #FFFFFF;
      text-transform: uppercase;
      text-shadow: 0 0 15px rgba(255, 42, 42, 0.6);
    }
    .logo-badge span {
      color: #FF3B30;
    }
    .sub-brand {
      font-size: 11px;
      color: #94A3B8;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 5px;
      font-weight: 600;
    }
    .content {
      padding: 35px 30px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 14px;
    }
    .lead-text {
      font-size: 14px;
      line-height: 1.6;
      color: #CBD5E1;
      margin-bottom: 28px;
    }
    .otp-container {
      background: #070709;
      border: 1px solid rgba(255, 42, 42, 0.4);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin-bottom: 28px;
      box-shadow: inset 0 0 20px rgba(255, 42, 42, 0.08);
    }
    .otp-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #94A3B8;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 12px;
      color: #FF4D36;
      margin: 8px 0;
      text-shadow: 0 0 16px rgba(255, 77, 54, 0.5);
    }
    .otp-expiry {
      font-size: 12px;
      color: #F59E0B;
      margin-top: 8px;
      font-weight: 600;
    }
    .security-notice {
      background-color: rgba(255, 255, 255, 0.02);
      border-left: 3px solid #FF3B30;
      padding: 14px 16px;
      border-radius: 0 8px 8px 0;
      font-size: 12px;
      line-height: 1.5;
      color: #94A3B8;
      margin-bottom: 28px;
    }
    .security-notice strong {
      color: #F8FAFC;
    }
    .footer {
      background-color: #070709;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 11px;
      color: #64748B;
      line-height: 1.6;
    }
    .footer a {
      color: #FF3B30;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo-badge">🦅 EAGLE <span>TRADING ZONE</span></div>
        <div class="sub-brand">Institutional Market Intelligence & Journal</div>
      </div>

      <!-- Main Body -->
      <div class="content">
        <div class="greeting">Hello ${displayName},</div>
        <div class="lead-text">
          Thank you for choosing <strong>Eagle Trading Zone</strong>. To verify your email address and activate your trading journal, courses, and indicators workspace, please enter the one-time verification code below:
        </div>

        <!-- OTP Code Card -->
        <div class="otp-container">
          <div class="otp-label">Your One-Time Verification Code</div>
          <div class="otp-code">${code}</div>
          <div class="otp-expiry">⏳ Valid for 10 minutes only</div>
        </div>

        <!-- Security Warning -->
        <div class="security-notice">
          <strong>Security Protocol:</strong> Never share this 6-digit code with anyone. Eagle Trading Zone staff will never request your OTP, password, or private trading keys. If you did not initiate this request, please ignore this email or contact support.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div>© ${new Date().getFullYear()} Eagle Trading Zone. All rights reserved.</div>
        <div>Built for high-performance Forex, Crypto, and Index Traders.</div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Sends the verification email using either Resend API or SMTP (Gmail/Brevo/Custom).
 * If neither is configured, logs the code safely on server console without failing.
 */
export async function sendVerificationEmail({
  to,
  name,
  code,
}: SendOtpOptions): Promise<{ success: boolean; method: string; error?: string }> {
  const html = buildVerificationEmailHtml(code, name)
  const subject = `🦅 [${code}] Your Eagle Trading Zone Verification Code`
  const senderEmail = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'Eagle Trading Zone <noreply@eagletradingzone.com>'

  // 1. Try Resend API if API Key is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      // If user hasn't verified a custom domain on Resend, Resend requires onboarding@resend.dev
      const fromAddress = process.env.RESEND_FROM || 'Eagle Trading Zone <onboarding@resend.dev>'

      const result = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject,
        html,
      })

      if (result.error) {
        console.error('[Resend Error]', result.error)
        return {
          success: false,
          method: 'resend',
          error: result.error.message || 'Resend email delivery failed',
        }
      } else {
        console.log(`[Email Sent via Resend] To: ${to}, ID: ${result.data?.id}`)
        return { success: true, method: 'resend' }
      }
    } catch (err: any) {
      console.error('[Resend Exception]', err?.message || err)
      return {
        success: false,
        method: 'resend',
        error: err?.message || 'Failed connecting to Resend API',
      }
    }
  }

  // 2. Try SMTP (Gmail App Password, Brevo, AWS SES, or any SMTP)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const host = process.env.SMTP_HOST || 'smtp.gmail.com'
      const port = Number(process.env.SMTP_PORT) || 465
      const secure = port === 465

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Eagle Trading Zone" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      })

      console.log(`[Email Sent via SMTP] To: ${to}`)
      return { success: true, method: 'smtp' }
    } catch (err: any) {
      console.error('[SMTP Error]', err?.message || err)
      return {
        success: false,
        method: 'smtp',
        error: err?.message || 'SMTP delivery failed',
      }
    }
  }

  // 3. Fallback / Dev Mode
  console.log('----------------------------------------------------')
  console.log(`[EAGLE TRADING ZONE OTP] To: ${to} | Name: ${name || 'Trader'}`)
  console.log(`[EAGLE TRADING ZONE OTP] CODE: ${code}`)
  console.log('----------------------------------------------------')

  return {
    success: true,
    method: 'dev_mock',
    error: 'No email service credentials set (RESEND_API_KEY or SMTP_USER/SMTP_PASS). OTP generated and logged on server.',
  }
}
