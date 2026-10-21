'use client'

import { useState } from 'react'
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
  const { loginAsDemo, verifyOTP } = useAuth()
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
  const [resendCooldown, setResendCooldown] = useState(45)

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

    // Simulate sending OTP verification code
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
      toast.success(`Verification OTP sent to ${form.email}!`)
    }, 700)
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

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = otpCode.join('')

    if (fullCode.length !== 6) {
      setOtpError('Please enter the complete 6-digit code.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      // Save created user in local session
      const newUser = {
        id: `user-${Date.now()}`,
        email: form.email,
        full_name: form.name,
        name: form.name,
        phone_number: form.phone,
        avatar_url: '/logo.png',
        role: 'user' as const,
        verification_status: 'Verified' as const,
        plan: 'free' as const,
        plan_start: new Date().toISOString(),
        plan_expiry: null,
        is_banned: false,
        monthly_trade_count: 0,
        preferred_currency: 'USD',
        created_at: new Date().toISOString(),
      }
      localStorage.setItem('eagle_demo_user', JSON.stringify(newUser))
      verifyOTP(fullCode)
      setLoading(false)
      router.push('/dashboard')
    }, 600)
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
              <div className="p-3 rounded-xl bg-ember-500/10 border border-ember-500/20 text-center">
                <KeyRound className="w-6 h-6 text-ember-400 mx-auto mb-1.5" />
                <div className="text-xs text-gray-300 font-medium">
                  We sent a 6-digit verification code to:
                </div>
                <div className="text-sm font-bold text-white mt-0.5">{form.email}</div>
                <div className="text-[11px] text-amber-glow/90 font-mono mt-1">
                  💡 Test Code: <span className="font-bold underline">749201</span> (or any 6 digits)
                </div>
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
                      className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl bg-void-900 border border-white/20 focus:border-ember-500 focus:ring-1 focus:ring-ember-500 text-white outline-none"
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-xs text-red-400 text-center mt-1">{otpError}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode(['7', '4', '9', '2', '0', '1'])
                    toast.success('Auto-filled test code: 749201')
                  }}
                  className="text-ember-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Auto-fill Test OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success('New verification code sent!')
                    setResendCooldown(45)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  Resend Code
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gap-2 bg-gradient-to-r from-ember-600 via-ember-500 to-amber-glow font-bold text-white shadow-lg shadow-ember-500/25"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {loading ? 'Verifying OTP...' : 'Verify OTP & Access Dashboard'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('form')}
                  className="w-full text-xs text-gray-400 hover:text-white"
                >
                  Change Email or Phone
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
