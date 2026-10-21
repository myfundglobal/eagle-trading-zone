'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Layers,
  Save,
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react'
import { usePlansStore } from '@/lib/store'
import { Plan } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

export default function AdminPlansPage() {
  const { plans, updatePlan } = usePlansStore()
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPlan) return
    updatePlan(editingPlan.id, {
      name: editingPlan.name,
      price_monthly: editingPlan.price_monthly,
      price_yearly: editingPlan.price_yearly,
      monthly_trade_limit: editingPlan.monthly_trade_limit,
      features: editingPlan.features,
    })
    setEditingPlan(null)
  }

  const handleToggleFeature = (featIdx: number) => {
    if (!editingPlan) return
    const updatedFeatures = [...editingPlan.features]
    updatedFeatures[featIdx].included = !updatedFeatures[featIdx].included
    setEditingPlan({ ...editingPlan, features: updatedFeatures })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Plans & Pricing Architecture
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Modify monthly and yearly subscription fees, trade limits, and included features without touching code
          </p>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`rounded-3xl p-6 glass border relative flex flex-col justify-between ${
              p.slug === 'elite'
                ? 'border-amber-glow/40 glow-ember-sm'
                : p.slug === 'pro'
                ? 'border-ember-500/40'
                : 'border-white/5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white uppercase">{p.name}</h2>
                <span className="text-[10px] font-mono text-gray-400 bg-void-800 px-2 py-0.5 rounded">
                  {p.monthly_trade_limit === -1 ? 'Unlimited' : `${p.monthly_trade_limit} Trades/mo`}
                </span>
              </div>

              <div className="space-y-1 mb-6">
                <div className="text-2xl font-black font-mono text-white">
                  ${p.price_monthly} <span className="text-xs text-gray-500 font-normal">/month</span>
                </div>
                <div className="text-xs font-mono text-gray-400">
                  ${p.price_yearly} <span className="text-gray-500 font-normal">/year</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Feature Entitlements:
                </div>
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${f.included ? 'text-emerald-400' : 'text-gray-600'}`} />
                    <span className={f.included ? 'text-gray-200' : 'text-gray-500 line-through'}>
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5">
              <Button
                onClick={() => setEditingPlan(JSON.parse(JSON.stringify(p)))}
                size="sm"
                className="w-full text-xs font-bold glow-ember-sm"
              >
                Edit Plan & Pricing
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-6 md:p-8 max-w-lg w-full border border-white/10 shadow-2xl space-y-5 my-8"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-ember-400" />
                Edit {editingPlan.name} Tier
              </h2>
              <button onClick={() => setEditingPlan(null)} className="p-1 text-gray-400 hover:text-white">
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="m_price" className="text-xs">Monthly Price ($)</Label>
                  <Input
                    id="m_price"
                    type="number"
                    value={editingPlan.price_monthly}
                    onChange={e => setEditingPlan({ ...editingPlan, price_monthly: parseFloat(e.target.value) || 0 })}
                    className="text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="y_price" className="text-xs">Yearly Price ($)</Label>
                  <Input
                    id="y_price"
                    type="number"
                    value={editingPlan.price_yearly}
                    onChange={e => setEditingPlan({ ...editingPlan, price_yearly: parseFloat(e.target.value) || 0 })}
                    className="text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="limit" className="text-xs">Monthly Trade Limit (-1 for unlimited)</Label>
                <Input
                  id="limit"
                  type="number"
                  value={editingPlan.monthly_trade_limit}
                  onChange={e => setEditingPlan({ ...editingPlan, monthly_trade_limit: parseInt(e.target.value) || 0 })}
                  className="text-xs font-mono"
                />
              </div>

              {/* Feature checkboxes */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Feature Entitlements Toggles:
                </Label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-2 rounded-xl bg-void-900 border border-white/5">
                  {editingPlan.features.map((feat, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feat.included}
                        onChange={() => handleToggleFeature(idx)}
                        className="rounded border-white/20 bg-void-800 text-ember-500 focus:ring-ember-500"
                      />
                      <span>{feat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingPlan(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-bold glow-ember-sm gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  Save Plan Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
