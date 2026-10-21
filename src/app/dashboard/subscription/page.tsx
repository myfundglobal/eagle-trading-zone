'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Upload,
  QrCode,
  ShieldCheck,
  Zap,
  Sparkles,
  Calendar,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { usePaymentRequestsStore, usePaymentMethodsStore, usePlansStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { format, differenceInDays } from 'date-fns'
import toast from 'react-hot-toast'

export default function SubscriptionPage() {
  const { user } = useAuth()
  const { requests, submitPaymentRequest } = usePaymentRequestsStore()
  const { methods } = usePaymentMethodsStore()
  const { plans } = usePlansStore()

  // Billing cycle toggle
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  // Payment flow modal
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<'pro' | 'elite' | null>(null)
  const [selectedMethodId, setSelectedMethodId] = useState<string>('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Payment proof form
  const [form, setForm] = useState({
    transaction_id: '',
    payment_date: new Date().toISOString().split('T')[0],
    amount: '',
    note: '',
    screenshot_url: '',
  })

  // Selected plan object
  const targetPlan = plans.find(p => p.slug === selectedPlanSlug)
  const planPrice = targetPlan
    ? billingPeriod === 'yearly' ? targetPlan.price_yearly : targetPlan.price_monthly
    : 0

  // Calculate days remaining
  const daysRemaining = user?.plan_expiry
    ? Math.max(0, differenceInDays(new Date(user.plan_expiry), new Date()))
    : null

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Open upgrade modal
  const handleStartUpgrade = (slug: 'pro' | 'elite') => {
    setSelectedPlanSlug(slug)
    const defaultM = methods.find(m => m.is_active)
    if (defaultM) setSelectedMethodId(defaultM.id)
    const plan = plans.find(p => p.slug === slug)
    const price = plan ? (billingPeriod === 'yearly' ? plan.price_yearly : plan.price_monthly) : 0
    setForm(prev => ({
      ...prev,
      amount: price.toString(),
      transaction_id: '',
      note: '',
    }))
  }

  // Submit payment request
  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.transaction_id.trim()) {
      toast.error('Please enter the Transaction / UTR ID')
      return
    }

    const methodObj = methods.find(m => m.id === selectedMethodId)
    const methodName = methodObj?.label || 'Manual Transfer'

    const res = submitPaymentRequest({
      plan_slug: selectedPlanSlug!,
      billing_period: billingPeriod,
      amount: parseFloat(form.amount) || planPrice,
      payment_method: methodName,
      transaction_id: form.transaction_id.trim(),
      payment_date: form.payment_date,
      note: form.note,
      screenshot_url: form.screenshot_url || '/logo.png',
    })

    if (res.success) {
      setSelectedPlanSlug(null)
    }
  }

  // User's own payment requests
  const userRequests = requests.filter(
    r => r.user_id === user?.id || r.user_email === user?.email
  )

  const activeMethod = methods.find(m => m.id === selectedMethodId)

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          Subscription & Billing
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-void-800 text-gray-300 border border-white/10 uppercase font-mono">
            Direct Verification
          </span>
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage your membership tier, submit manual payment proofs, and review verification status
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-void-900 via-void-950 to-void-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Current Active Plan</div>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span className="capitalize">{user?.plan || 'Free'} Membership</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                user?.plan === 'elite'
                  ? 'bg-amber-glow/20 text-amber-glow border border-amber-glow/40'
                  : user?.plan === 'pro'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  : 'bg-void-700 text-gray-300'
              }`}>
                Active
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {user?.plan === 'free'
                ? 'Standard 15 trades/mo limit. Upgrade anytime to unlock unlimited journal, backtesting & AI.'
                : `Expires on: ${user?.plan_expiry ? format(new Date(user.plan_expiry), 'MMMM dd, yyyy') : 'Never'} (${daysRemaining} days remaining)`}
            </p>
          </div>

          {user?.plan === 'free' && (
            <Button
              onClick={() => handleStartUpgrade('pro')}
              size="lg"
              className="gap-2 font-bold bg-ember-gradient text-white shadow-xl glow-ember"
            >
              <Zap className="w-4 h-4" />
              Upgrade to Pro Plan
            </Button>
          )}
        </div>
      </div>

      {/* Plans & Pricing Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Upgrade Your Trading Edge</h2>
            <p className="text-xs text-gray-400">Choose the ideal plan for your trading goals</p>
          </div>

          {/* Monthly / Yearly Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-void-900 border border-white/10 text-xs font-bold">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                billingPeriod === 'monthly' ? 'bg-ember-gradient text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                billingPeriod === 'yearly' ? 'bg-ember-gradient text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {plans.map((p) => {
            const isCurrent = user?.plan === p.slug
            const price = billingPeriod === 'yearly' ? p.price_yearly : p.price_monthly

            return (
              <div
                key={p.id}
                className={`rounded-3xl p-6 glass border relative flex flex-col justify-between transition-all ${
                  p.slug === 'elite'
                    ? 'border-amber-glow/40 glow-ember-sm'
                    : p.slug === 'pro'
                    ? 'border-ember-500/40'
                    : 'border-white/5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white">{p.name}</h3>
                    {p.slug === 'elite' && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-glow/20 text-amber-glow border border-amber-glow/40">
                        MOST POPULAR
                      </span>
                    )}
                  </div>

                  <div className="mt-4 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white font-mono">${price}</span>
                      <span className="text-xs text-gray-400">/{billingPeriod === 'yearly' ? 'year' : 'mo'}</span>
                    </div>
                    {billingPeriod === 'yearly' && price > 0 && (
                      <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                        Billed annually (${(price / 12).toFixed(1)}/mo)
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5 border-t border-white/5 pt-4">
                    {p.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${f.included ? 'text-emerald-400' : 'text-gray-600'}`} />
                        <span className={f.included ? 'text-gray-200' : 'text-gray-500 line-through'}>
                          {f.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5">
                  {isCurrent ? (
                    <Button variant="outline" disabled className="w-full text-xs font-bold text-gray-400">
                      Current Plan
                    </Button>
                  ) : p.slug === 'free' ? (
                    <Button variant="ghost" disabled className="w-full text-xs">
                      Default Tier
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleStartUpgrade(p.slug as 'pro' | 'elite')}
                      className={`w-full font-bold text-xs gap-1.5 ${
                        p.slug === 'elite' ? 'bg-ember-gradient text-white shadow-lg glow-ember-sm' : ''
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Select {p.name}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* User's Payment Requests History */}
      <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-ember-400" />
          My Payment History & Request Status
        </h2>

        {userRequests.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500">
            No previous payment requests recorded. Upgrade above to submit your first proof.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-gray-400">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Plan Requested</th>
                  <th className="py-2.5 px-3">Billing</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Transaction / UTR ID</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-gray-400">{req.payment_date}</td>
                    <td className="py-3 px-3 font-bold text-white uppercase">{req.plan_slug}</td>
                    <td className="py-3 px-3 capitalize text-gray-400">{req.billing_period}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">${req.amount}</td>
                    <td className="py-3 px-3 text-gray-300 max-w-[150px] truncate" title={req.payment_method}>
                      {req.payment_method}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-400 select-all">{req.transaction_id}</td>
                    <td className="py-3 px-3 text-right">
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {req.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved & Active
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <div className="flex flex-col items-end">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                          {req.admin_note && (
                            <span className="text-[10px] text-red-400 mt-1 max-w-[160px] truncate" title={req.admin_note}>
                              {req.admin_note}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Payment Submission Modal */}
      <AnimatePresence>
        {selectedPlanSlug && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-white/10 my-8 shadow-2xl relative space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-ember-400" />
                    Complete Upgrade to {selectedPlanSlug.toUpperCase()}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Billed {billingPeriod}: <strong className="text-white">${planPrice}</strong> USD equivalent
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPlanSlug(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              {/* Step 1: Pick Payment Method */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Step 1: Choose Payment Method
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {methods.filter(m => m.is_active).map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMethodId(m.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedMethodId === m.id
                          ? 'bg-void-800 border-ember-500 text-white font-bold'
                          : 'glass border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs truncate">{m.label.split('(')[0]}</div>
                      <div className="text-[10px] text-gray-500 capitalize">{m.type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Show Selected Method Details with Copy Buttons */}
              {activeMethod && (
                <div className="p-4 rounded-2xl bg-void-900 border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>{activeMethod.label}</span>
                    <span className="text-[10px] text-ember-400 font-mono">Scan or Copy</span>
                  </div>

                  {/* QR Image if available */}
                  {activeMethod.qr_url && (
                    <div className="flex justify-center py-2">
                      <div className="relative w-36 h-36 rounded-xl bg-white p-2 border border-white/20 shadow-lg">
                        <Image
                          src={activeMethod.qr_url}
                          alt="Payment QR"
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                  )}

                  {/* Dynamic details listing */}
                  <div className="space-y-2 text-xs">
                    {Object.entries(activeMethod.details).map(([k, val]) => {
                      if (typeof val !== 'string') return null
                      const isCopyable = k.includes('id') || k.includes('address') || k.includes('number') || k.includes('code')
                      return (
                        <div key={k} className="flex items-center justify-between p-2 rounded-lg bg-void-800/80">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-mono mr-2">{k.replace('_', ' ')}:</span>
                            <span className="text-white font-mono font-semibold">{val}</span>
                          </div>
                          {isCopyable && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(val, k)}
                              className="h-7 px-2 text-[10px] gap-1 text-gray-300 hover:text-white"
                            >
                              {copiedKey === k ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              {copiedKey === k ? 'Copied' : 'Copy'}
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Submission Form */}
              <form onSubmit={handleSubmitProof} className="space-y-4 pt-2">
                <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Step 2: Submit Payment Details & Transaction ID
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="txid" className="text-xs">Transaction ID / UTR / Hash *</Label>
                    <Input
                      id="txid"
                      placeholder="e.g. 12-digit UTR or Crypto TxID"
                      value={form.transaction_id}
                      onChange={e => setForm(p => ({ ...p, transaction_id: e.target.value }))}
                      required
                      className="text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="amt" className="text-xs">Amount Paid ($ / INR) *</Label>
                    <Input
                      id="amt"
                      placeholder={`e.g. ${planPrice}`}
                      value={form.amount}
                      onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                      required
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="pdate" className="text-xs">Payment Date *</Label>
                    <Input
                      id="pdate"
                      type="date"
                      value={form.payment_date}
                      onChange={e => setForm(p => ({ ...p, payment_date: e.target.value }))}
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="proof_url" className="text-xs">Screenshot / Receipt Image URL</Label>
                    <Input
                      id="proof_url"
                      placeholder="Paste image URL (optional)"
                      value={form.screenshot_url}
                      onChange={e => setForm(p => ({ ...p, screenshot_url: e.target.value }))}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="note" className="text-xs">Remarks / Sender Name</Label>
                  <Input
                    id="note"
                    placeholder="e.g. Paid from John Doe GPay account"
                    value={form.note}
                    onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                    className="text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPlanSlug(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="lg" className="font-bold glow-ember">
                    Submit Verification Request
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
