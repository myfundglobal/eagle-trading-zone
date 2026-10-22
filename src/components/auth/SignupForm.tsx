'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Phone,
  User,
  ArrowRight,
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

  // Validate on change
  const handleEmailChange = (val: string) => {
    setForm(p => ({ ...p, email: val }))
    if (emailError) setEmailError(null)
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError(null)

    // 1. Validate Email Domain (block disposable domains)
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

    // Direct Instant Account Creation without OTP
    setTimeout(() => {
      loginUser(
        {
          email: form.email.trim(),
          name: form.name.trim(),
          full_name: form.name.trim(),
          phone_number: form.phone.trim(),
          role: form.email.toLowerCase().includes('admin') ? 'admin' : 'user',
          plan: 'free',
          verification_status: 'Verified',
        },
        false
      )

      toast.success('Account created successfully! Welcome to Eagle Trading Zone.')
      setLoading(false)
      if (typeof window !== 'undefined') {
        window.location.href = form.email.toLowerCase().includes('admin')
          ? '/admin'
          : '/dashboard'
      }
    }, 400)
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
        <h1 className="text-2xl font-black text-white tracking-tight">Create Eagle Account</h1>
        <p className="text-gray-400 text-xs mt-1">
          Join elite forex, gold & crypto traders on Eagle Trading Zone
        </p>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-7 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ember-500 to-transparent" />

        <form onSubmit={handleSignupSubmit} className="space-y-4">
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

          {/* Email Address */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="text-xs font-semibold text-gray-300">
                Email Address
              </Label>
              <span className="text-[10px] text-ember-400/80 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3 text-ember-400" />
                Disposable emails blocked
              </span>
            </div>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="trader@eagletradingzone.com"
                value={form.email}
                onChange={e => handleEmailChange(e.target.value)}
                required
                className={`bg-void-900/60 border-white/10 focus:border-ember-500 text-sm ${
                  emailError ? 'border-red-500/60 pr-10' : ''
                }`}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
            {emailError && (
              <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3 h-3" />
                {emailError}
              </p>
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
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                required
                className="bg-void-900/60 border-white/10 focus:border-ember-500 text-sm"
              />
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
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
            {loading ? 'Creating Eagle Account...' : 'Create Eagle Account'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-ember-400 hover:text-ember-300 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
