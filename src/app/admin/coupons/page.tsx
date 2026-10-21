'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, Gift, Plus, Trash2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

interface Coupon {
  id: string
  code: string
  discount: number
  uses: number
  maxUses: number
  active: boolean
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: 'c-1', code: 'EAGLE50', discount: 50, uses: 12, maxUses: 100, active: true },
    { id: 'c-2', code: 'PROPTRADER', discount: 25, uses: 45, maxUses: 200, active: true },
  ])

  // New coupon form
  const [newCode, setNewCode] = useState('')
  const [newDiscount, setNewDiscount] = useState('20')

  // Gift Pro form
  const [giftEmail, setGiftEmail] = useState('')
  const [giftDays, setGiftDays] = useState('30')

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode.trim()) return
    const created: Coupon = {
      id: `c-${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      discount: parseInt(newDiscount) || 20,
      uses: 0,
      maxUses: 100,
      active: true,
    }
    setCoupons([created, ...coupons])
    setNewCode('')
    toast.success(`Coupon code "${created.code}" created!`)
  }

  const handleGiftPro = (e: React.FormEvent) => {
    e.preventDefault()
    if (!giftEmail.trim()) return
    toast.success(`Granted Pro access for ${giftDays} days to ${giftEmail}!`)
    setGiftEmail('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          Coupons & Manual Plan Grants
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Generate discount codes for campaigns or manually grant complimentary Pro access to VIP users
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Coupon */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-ember-400" />
            Create Discount Coupon
          </h2>

          <form onSubmit={handleCreateCoupon} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="code" className="text-xs">Coupon Code</Label>
                <Input
                  id="code"
                  placeholder="e.g. VIP30"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  className="text-xs font-mono uppercase font-bold"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="disc" className="text-xs">Discount %</Label>
                <Input
                  id="disc"
                  type="number"
                  min="1"
                  max="100"
                  value={newDiscount}
                  onChange={e => setNewDiscount(e.target.value)}
                  className="text-xs font-mono"
                  required
                />
              </div>
            </div>
            <Button type="submit" size="sm" className="w-full font-bold glow-ember-sm text-xs">
              Create Coupon
            </Button>
          </form>

          {/* Active Coupons List */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Coupons</div>
            {coupons.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-void-900 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-ember-400 mr-2">{c.code}</span>
                  <span className="text-gray-400">({c.discount}% OFF)</span>
                </div>
                <div className="text-gray-500 font-mono text-[11px]">
                  {c.uses} / {c.maxUses} used
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gift Pro to User */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-glow" />
            Grant Free Pro / Elite Days
          </h2>
          <p className="text-xs text-gray-400">
            Complimentary direct subscription gift without payment verification (for giveaways or partner traders).
          </p>

          <form onSubmit={handleGiftPro} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="gemail" className="text-xs">Trader Account Email *</Label>
              <Input
                id="gemail"
                type="email"
                placeholder="trader@gmail.com"
                value={giftEmail}
                onChange={e => setGiftEmail(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="gdays" className="text-xs">Number of Days</Label>
              <select
                id="gdays"
                value={giftDays}
                onChange={e => setGiftDays(e.target.value)}
                className="w-full h-10 rounded-xl border border-white/10 bg-void-800 text-xs text-white px-3"
              >
                <option value="7">7 Days (Weekly Trial)</option>
                <option value="30">30 Days (1 Month)</option>
                <option value="90">90 Days (Quarterly)</option>
                <option value="365">365 Days (1 Year)</option>
              </select>
            </div>

            <Button type="submit" size="sm" className="w-full font-bold bg-amber-500 hover:bg-amber-400 text-black text-xs gap-1.5">
              <Gift className="w-3.5 h-3.5" />
              Grant Membership Access
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
