'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Phone,
  KeyRound,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { validateSignupEmail } from '@/lib/email-validator'
import toast from 'react-hot-toast'

export function SignupForm() {
  const { loginUser } = useAuth()
  const router = useRouter()

  // Form fields
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  // Step state: 'form' | 'otp'
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(60)
  const [devCodeNotice, setDevCodeNotice] = useState<string | null>(null)

  // Resend cooldown timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === 'otp' && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [step, resendCooldown])

  // Validate on blur or change
  const handleEmailChange = (val: string) => {
    setForm(p => ({ ...p, email: val }))
    if (emailError) setEmailError(null)
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError(null)

    // 1. Validate Email Domain
    const emailCheck = validateSignupEmail(form.email)
    if (!emailCheck.isValid) {
      setEmailError(emailCheck.error || 'Invalid email address')
      toast.error(emailCheck.error || 'Temporary disposable email domains are blocked!')
      return
    }

    // 2. Validate Phone
    if (!form.phone || form.phone.trim().length < 8) {
      toast.error('Please enter a valid phone number (at least 8 digits)')
      return
    }

    // 3. Validate Password
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), name: form.name.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to send verification email.')
        setLoading(false)
        return
      }

      if (data.devCode) {
        setDevCodeNotice(data.devCode)
      } else {
        setDevCodeNotice(null)
      }

      setStep('otp')
      setResendCooldown(60)
      toast.success(
        data.devCode
          ? `Code generated for ${form.email}. See note below.`
          : `Verification code sent to ${form.email}! Please check your inbox.`
      )
    } catch (err) {
      toast.error('Failed to send verification code. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0 || loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), name: form.name.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        if (data.devCode) {
          setDevCodeNotice(data.devCode)
        } else {
          setDevCodeNotice(null)
        }
        toast.success(
          data.devCode
            ? `New code generated for ${form.email}`
            : `New verification code sent to ${form.email}!`
        )
        setResendCooldown(60)
        setOtpCode(['', '', '', '', '', ''])
        setOtpError(null)
      } else {
        toast.error(data.error || 'Failed to resend code.')
      }
    } catch {
      toast.error('Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1)
    }
    const updated = [...otpCode]
    updated[index] = val
    setOtpCode(updated)

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = otpCode.join('')

    if (fullCode.length !== 6) {
      setOtpError('Please enter the complete 6-digit code.')
      return
    }

    setLoading(true)
    setOtpError(null)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), code: fullCode }),
      })

      const data = await res.json()

      if (!res.ok) {
        setOtpError(data.error || 'Invalid verification code.')
        toast.error(data.error || 'Invalid verification code.')
        setLoading(false)
        return
      }

      // Successfully verified: log user into application
      loginUser(
        {
          email: form.email.trim(),
          name: form.name.trim(),
          full_name: form.name.trim(),
          phone_number: form.phone.trim(),
          role: form.email.toLowerCase().includes('admin') ? 'admin' : 'user',
          plan: 'free',
        },
        false
      )

      toast.success('Email verified successfully! Welcome to Eagle Trading Zone.')
      router.push('/dashboard')
    } catch (err) {
      toast.error('Network error during verification. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex justify-center mb-3 group">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Eagle Trading Zone"
              width={64}
              height={64}
              className="drop-shadow-glow group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-ember-500/20 rounded-full blur-lg" />
          </div>
        </Link>
        <h1 className="text-2xl font-black text-white tracking-tight">
          {step === 'form' ? 'Create Eagle Account' : 'Verify Your Email'}
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          {step === 'form'
            ? 'Join elite forex, gold & crypto traders on Eagle Trading Zone'
            : `Enter the 6-digit OTP code sent to ${form.email}`}
        </p>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-7 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glowing border accents */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ember-500 to-transparent" />

        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.form
              key="signup-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSignupSubmit}
              className="space-y-4"
            >
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-gray-300">
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="e.g. Alex Morgan"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                    className="bg-void-900/60 border-white/10 focus:border-ember-500 text-sm"
                  />
                </div>
              </div>

              {/* Email with disposable blocking feedback */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-300">
                    Email Address
                  </Label>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-ember-400" />
                    Disposable emails blocked
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="trader@gmail.com"
                    value={form.email}
                    onChange={e => handleEmailChange(e.target.value)}
                    required
                    className={`bg-void-900/60 text-sm ${
                      emailError
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/10 focus:border-ember-500'
                    }`}
                  />
                  <Mail className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {emailError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-1.5 text-xs text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-500/20"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{emailError}</span>
                  </motion.div>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-gray-300">
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    required
                    className="bg-void-900/60 border-white/10 focus:border-ember-500 text-sm"
                  />
                  <Phone className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    required
                    className="bg-void-900/60 border-white/10 focus:border-ember-500 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-xs font-semibold text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  required
                  className="bg-void-900/60 border-white/10 focus:border-ember-500 text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 bg-gradient-to-r from-ember-600 via-ember-500 to-amber-glow font-bold text-white shadow-lg shadow-ember-500/25 hover:shadow-ember-500/40"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? 'Validating & Generating OTP...' : 'Continue to Email Verification'}
              </Button>
            </motion.form>
          ) : (
            /* STEP 2: OTP VERIFICATION */
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-5"
            >
              <div className="p-4 rounded-xl bg-ember-500/10 border border-ember-500/25 text-center">
                <KeyRound className="w-7 h-7 text-ember-400 mx-auto mb-2 drop-shadow-glow" />
                <div className="text-xs text-gray-300 font-medium">
                  We sent a 6-digit verification code to:
                </div>
                <div className="text-sm font-bold text-white mt-1 tracking-wide">{form.email}</div>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                  Please check your inbox (and spam/junk folder) for the verification code from <span className="text-ember-400 font-semibold">Eagle Trading Zone</span>.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-300 block text-center">
                  Enter 6-Digit OTP Code
                </Label>
                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Backspace' && !digit && idx > 0) {
                          document.getElementById(`otp-${idx - 1}`)?.focus()
                        }
                      }}
                      className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl bg-void-900 border border-white/20 focus:border-ember-500 focus:ring-1 focus:ring-ember-500 text-white outline-none transition-colors"
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-xs text-red-400 text-center mt-1">{otpError}</p>
                )}

                {devCodeNotice && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
                    <p className="text-[11px] text-amber-300 font-medium leading-relaxed">
                      💡 <strong>Vercel Setup Notice:</strong> <code>RESEND_API_KEY</code> abhi Vercel mein add nahi hua hai. Real email inbox mein aane ke liye Vercel Settings mein key add karke Redeploy karein.
                    </p>
                    <p className="text-xs text-white font-mono font-bold">
                      Testing Code: <span className="underline text-amber-400">{devCodeNotice}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Change Email or Phone
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleResendCode}
                  className="text-ember-400 hover:text-ember-300 disabled:text-gray-600 font-semibold transition-colors"
                >
                  {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gap-2 bg-gradient-to-r from-ember-600 via-ember-500 to-amber-glow font-bold text-white shadow-lg shadow-ember-500/25 hover:shadow-ember-500/40"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {loading ? 'Verifying OTP...' : 'Verify OTP & Access Dashboard'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>



        <p className="text-center text-xs text-gray-500 mt-4">
          Already verified?{' '}
          <Link href="/login" className="text-ember-400 hover:text-ember-300 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
