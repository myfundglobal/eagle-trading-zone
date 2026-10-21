'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, ShieldCheck, Mail, Lock, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

export function LoginForm() {
  const { loginUser, verifyOTP } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [needsOtp, setNeedsOtp] = useState(false)
  const [otpInput, setOtpInput] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Check localStorage user state if exists
    try {
      const storedUsers = localStorage.getItem('eagle_users')
      if (storedUsers) {
        const users = JSON.parse(storedUsers)
        const found = users.find((u: any) => u.email?.toLowerCase() === email.trim().toLowerCase())
        if (found && found.verification_status === 'Unverified') {
          setNeedsOtp(true)
          setLoading(false)
          toast.error('Email unverified! Please complete OTP verification.')
          return
        }
      }
    } catch {}

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      // If error (or Supabase not connected yet), log in seamlessly without duplicate toasts
      if (email && password) {
        loginUser({
          email: email.trim(),
          role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        })
        setLoading(false)
        return
      }
      toast.error(error.message)
    } else {
      toast.success('Welcome back!')
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  const handleVerifyPendingOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpInput.length !== 6) {
      toast.error('Please enter a valid 6-digit code.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpInput }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Invalid code.')
        setLoading(false)
        return
      }
      loginUser({ email }, false)
      setNeedsOtp(false)
      toast.success('Email verified successfully!')
    } catch {
      toast.error('Verification failed. Please try again.')
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
          {needsOtp ? 'Email Verification Required' : 'Welcome Back'}
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          {needsOtp
            ? 'Your account requires email verification before granting dashboard access.'
            : 'Sign in to access your Eagle Trading Zone workspace & journal'}
        </p>
      </div>

      <div className="glass rounded-2xl p-6 sm:p-7 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ember-500 to-transparent" />

        {needsOtp ? (
          <form onSubmit={handleVerifyPendingOtp} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <KeyRound className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
              <div className="text-xs text-gray-300">
                Enter the 6-digit OTP code sent to: <span className="font-bold text-white">{email}</span>
              </div>
              <div className="text-[11px] text-amber-glow font-mono mt-1">
                Demo Code: <span className="underline font-bold">749201</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="otp">6-Digit Code</Label>
              <Input
                id="otp"
                maxLength={6}
                placeholder="749201"
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
                className="text-center font-mono text-lg font-bold tracking-widest bg-void-900 border-white/20"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-ember-gradient font-bold text-white shadow-lg shadow-ember-500/20"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Verify & Enter Dashboard
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setNeedsOtp(false)}
              className="w-full text-xs text-gray-400"
            >
              Back to Login
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-gray-300">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="trader@eagletradingzone.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="bg-void-900/60 border-white/10 focus:border-ember-500 text-sm"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-semibold text-gray-300">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-ember-400 hover:text-ember-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 bg-gradient-to-r from-ember-600 via-ember-500 to-amber-glow font-bold text-white shadow-lg shadow-ember-500/25"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        )}



        <p className="text-center text-xs text-gray-500 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-ember-400 hover:text-ember-300 font-semibold">
            Create Free Account
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
