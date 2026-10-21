import { NextResponse } from 'next/server'
import { generateAndStoreOtp } from '@/lib/otp-store'
import { sendVerificationEmail } from '@/lib/email-service'
import { validateSignupEmail } from '@/lib/email-validator'

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 })
    }

    // Validate email domain to block temporary/disposable services
    const emailCheck = validateSignupEmail(email)
    if (!emailCheck.isValid) {
      return NextResponse.json(
        { error: emailCheck.error || 'Temporary disposable email addresses are not permitted.' },
        { status: 400 }
      )
    }

    // Generate random 6-digit OTP code
    const otpCode = generateAndStoreOtp(email)

    // Send professional HTML email
    const emailResult = await sendVerificationEmail({
      to: email,
      name,
      code: otpCode,
    })

    if (!emailResult.success) {
      return NextResponse.json(
        {
          error: emailResult.error || 'Failed to send verification email.',
          method: emailResult.method,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}`,
      method: emailResult.method,
      // In dev mode (before user adds RESEND_API_KEY in Vercel), provide the generated code
      ...(emailResult.method === 'dev_mock' ? { devCode: otpCode } : {}),
    })
  } catch (err: any) {
    console.error('Send OTP Error:', err)
    return NextResponse.json(
      { error: 'Failed to send verification code. Please try again.' },
      { status: 500 }
    )
  }
}
