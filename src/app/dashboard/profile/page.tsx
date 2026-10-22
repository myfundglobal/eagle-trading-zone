'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CreditCard,
  Save,
  Moon,
  Sun,
  Lock,
  Globe,
  DollarSign,
  Award,
  KeyRound,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateProfile, isAdmin } = useAuth()
  const { theme, setTheme } = useTheme()

  const [fullName, setFullName] = useState(user?.full_name || user?.name || 'Eagle Trader')
  const [phone, setPhone] = useState(user?.phone_number || '+1 (555) 382-9014')
  const [email, setEmail] = useState(user?.email || 'trader@eagletradingzone.com')
  const [currency, setCurrency] = useState(user?.preferred_currency || 'USD')
  const [tradingStyle, setTradingStyle] = useState('Day Trader & Scalper')

  // Password update
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword && newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    updateProfile({
      full_name: fullName,
      name: fullName,
      phone_number: phone,
      preferred_currency: currency,
    })

    if (newPassword) {
      toast.success('Password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <User className="w-7 h-7 text-ember-400" />
          Profile & Account Settings
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage your personal details, phone number, security credentials, and platform role
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Verification Status */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-5 text-center flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-ember-500/40 glow-ember-sm bg-void-950">
            <Image
              src={user?.avatar_url || '/logo.png'}
              alt="Avatar"
              fill
              className="object-contain p-2"
            />
          </div>

          <div>
            <h2 className="text-base font-bold text-white">{fullName}</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{email}</p>
          </div>

          {/* Verification Status Badge */}
          <div className="w-full p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verification Status: VERIFIED</span>
          </div>

          {/* Account Details Box */}
          <div className="w-full pt-2 border-t border-white/5 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-gray-400">
              <span>Account Role:</span>
              <span
                className={`font-bold uppercase font-mono px-2 py-0.5 rounded ${
                  isAdmin
                    ? 'bg-amber-glow/20 text-amber-glow border border-amber-glow/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {isAdmin ? 'Administrator 👑' : 'Trader'}
              </span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Current Plan:</span>
              <span
                className={`font-bold uppercase ${
                  user?.plan === 'elite'
                    ? 'text-amber-glow font-mono'
                    : user?.plan === 'pro'
                    ? 'text-blue-400 font-mono'
                    : 'text-gray-300'
                }`}
              >
                {user?.plan || 'Free'}
              </span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Phone Verified:</span>
              <span className="font-mono text-gray-200">{phone}</span>
            </div>
          </div>

          {/* Admin Portal Shortcut if genuine Admin */}
          {isAdmin && (
            <div className="w-full pt-2">
              <Link href="/admin" className="w-full block">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold border-amber-glow/40 text-amber-glow hover:bg-amber-glow/10"
                >
                  <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
                  Open Admin Portal 👑
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-2 glass rounded-3xl p-6 md:p-8 border border-white/5 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="text-sm font-bold text-white border-b border-white/5 pb-2 flex items-center justify-between">
              <span>User Information (Data Model: Users)</span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullname" className="text-xs text-gray-300 font-semibold">
                Full Name
              </Label>
              <Input
                id="fullname"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="text-xs bg-void-900 border-white/10 text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-gray-300 font-semibold">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    value={email}
                    disabled
                    className="text-xs bg-void-950 text-gray-400 cursor-not-allowed font-mono border-white/10"
                  />
                  <Mail className="w-3.5 h-3.5 text-gray-600 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs text-gray-300 font-semibold">
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="text-xs bg-void-900 border-white/10 text-white font-mono"
                    required
                  />
                  <Phone className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Currency */}
              <div className="space-y-1.5">
                <Label htmlFor="currency" className="text-xs text-gray-300 font-semibold">
                  Preferred Currency
                </Label>
                <select
                  id="currency"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/10 bg-void-900 text-xs text-white px-3"
                >
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                </select>
              </div>

              {/* Trading Style */}
              <div className="space-y-1.5">
                <Label htmlFor="style" className="text-xs text-gray-300 font-semibold">
                  Primary Trading Style
                </Label>
                <select
                  id="style"
                  value={tradingStyle}
                  onChange={e => setTradingStyle(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/10 bg-void-900 text-xs text-white px-3"
                >
                  <option value="Scalper">Scalper (1m - 5m)</option>
                  <option value="Day Trader">Day Trader (15m - 1H)</option>
                  <option value="Swing Trader">Swing Trader (4H - Daily)</option>
                  <option value="Position Trader">Position Trader</option>
                </select>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-ember-400" />
                Change Password
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  type="password"
                  placeholder="New password (optional)"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="bg-void-900 border-white/10 text-xs"
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="bg-void-900 border-white/10 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <Button
                type="submit"
                className="gap-2 font-bold bg-ember-gradient text-white text-xs shadow-md shadow-ember-500/20"
              >
                <Save className="w-4 h-4" />
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
