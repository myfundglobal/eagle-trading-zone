'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex justify-center mb-4">
          <Image src="/logo.png" alt="Eagle Trading Zone" width={56} height={56} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Reset Password</h1>
        <p className="text-gray-500 text-sm mt-1">We&apos;ll send you a reset link</p>
      </div>

      <div className="glass rounded-2xl p-6">
        {done ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-white font-medium mb-2">Reset link sent!</p>
            <p className="text-gray-400 text-sm">Check your email and click the link to reset your password.</p>
            <Link href="/login" className="block mt-6">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="trader@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full gap-2">
              <Mail className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <Link href="/login">
              <Button variant="ghost" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Button>
            </Link>
          </form>
        )}
      </div>
    </motion.div>
  )
}
