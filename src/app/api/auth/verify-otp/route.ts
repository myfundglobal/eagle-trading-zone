import { NextResponse } from 'next/server'
import { verifyOtpCode } from '@/lib/otp-store'

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      )
    }

    const verification = verifyOtpCode(email, code)

    if (!verification.isValid) {
      return NextResponse.json(
        { error: verification.error || 'Invalid verification code.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Email address verified successfully!',
    })
  } catch (err: any) {
    console.error('Verify OTP Error:', err)
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
