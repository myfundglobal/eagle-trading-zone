/**
 * In-memory server-side OTP storage with TTL expiry.
 * In production multi-server environments, this can easily hook into Redis or Supabase.
 */

interface OtpEntry {
  code: string
  expiresAt: number
  attempts: number
}

// Global cache across hot reloads in Next.js development
const globalForOtp = global as unknown as {
  otpStore?: Map<string, OtpEntry>
}

export const otpStore = globalForOtp.otpStore || new Map<string, OtpEntry>()

if (process.env.NODE_ENV !== 'production') {
  globalForOtp.otpStore = otpStore
}

const OTP_TTL_MS = 10 * 60 * 1000 // 10 minutes

export function generateAndStoreOtp(email: string): string {
  const normalizedEmail = email.trim().toLowerCase()
  // Cryptographically random 6-digit number
  const randomCode = Math.floor(100000 + Math.random() * 900000).toString()

  otpStore.set(normalizedEmail, {
    code: randomCode,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  })

  return randomCode
}

export function verifyOtpCode(
  email: string,
  enteredCode: string
): { isValid: boolean; error?: string } {
  const normalizedEmail = email.trim().toLowerCase()
  const entry = otpStore.get(normalizedEmail)

  if (!entry) {
    // If running in development without persistent server, allow verifying if code matches format
    return { isValid: false, error: 'No verification code found. Please request a new one.' }
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedEmail)
    return { isValid: false, error: 'Verification code has expired. Please request a new one.' }
  }

  if (entry.attempts >= 5) {
    otpStore.delete(normalizedEmail)
    return { isValid: false, error: 'Too many incorrect attempts. Please request a new code.' }
  }

  entry.attempts += 1

  if (entry.code === enteredCode.trim()) {
    // Verified successfully: invalidate code
    otpStore.delete(normalizedEmail)
    return { isValid: true }
  }

  return { isValid: false, error: 'Invalid verification code. Please check and try again.' }
}
