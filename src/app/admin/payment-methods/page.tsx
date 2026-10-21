'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  QrCode,
  Plus,
  Save,
  Trash2,
  Edit2,
  Check,
  X,
  CreditCard,
} from 'lucide-react'
import { usePaymentMethodsStore } from '@/lib/store'
import { PaymentMethod } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'

export default function AdminPaymentMethodsPage() {
  const { methods, updateMethod, addMethod } = usePaymentMethodsStore()
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMethod) return
    updateMethod(editingMethod.id, {
      label: editingMethod.label,
      type: editingMethod.type,
      details: editingMethod.details,
      qr_url: editingMethod.qr_url,
      is_active: editingMethod.is_active,
    })
    setEditingMethod(null)
  }

  const handleToggleActive = (m: PaymentMethod) => {
    updateMethod(m.id, { is_active: !m.is_active })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Payment Methods & QR Setup
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure manual payment channels (UPI, Bank Wire, Crypto USDT) that appear to traders on the Upgrade page
          </p>
        </div>
      </div>

      {/* Methods List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {methods.map((m) => (
          <div
            key={m.id}
            className={`rounded-3xl p-6 glass border relative flex flex-col justify-between ${
              m.is_active ? 'border-white/10' : 'border-white/5 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-void-800 text-ember-400 font-bold">
                  {m.type}
                </span>
                <Switch
                  checked={m.is_active}
                  onCheckedChange={() => handleToggleActive(m)}
                />
              </div>

              <h2 className="text-base font-bold text-white mb-2">{m.label}</h2>

              {m.qr_url && (
                <div className="flex justify-center py-2">
                  <div className="relative w-28 h-28 rounded-xl bg-white p-2 border border-white/20">
                    <Image src={m.qr_url} alt="QR" fill className="object-contain p-1" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-gray-400 border-t border-white/5 pt-3 mt-3">
                {Object.entries(m.details).map(([k, val]) => (
                  <div key={k} className="truncate">
                    <span className="text-gray-500 uppercase text-[10px] font-mono mr-1">{k}:</span>
                    <span className="text-gray-200 font-mono">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5">
              <Button
                onClick={() => setEditingMethod(JSON.parse(JSON.stringify(m)))}
                size="sm"
                variant="outline"
                className="w-full text-xs font-bold"
              >
                Edit Method Details & QR
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-6 md:p-8 max-w-lg w-full border border-white/10 shadow-2xl space-y-5 my-8"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-ember-400" />
                Edit {editingMethod.label}
              </h2>
              <button onClick={() => setEditingMethod(null)} className="p-1 text-gray-400 hover:text-white">
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="m_label" className="text-xs">Display Title</Label>
                <Input
                  id="m_label"
                  value={editingMethod.label}
                  onChange={e => setEditingMethod({ ...editingMethod, label: e.target.value })}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qr_url" className="text-xs">QR Code Image Path / URL</Label>
                <Input
                  id="qr_url"
                  value={editingMethod.qr_url || ''}
                  onChange={e => setEditingMethod({ ...editingMethod, qr_url: e.target.value })}
                  className="text-xs font-mono"
                  placeholder="/logo.png or https://..."
                />
              </div>

              {/* Dynamic Key-value inputs for details */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Payment Account Fields:
                </Label>
                {Object.keys(editingMethod.details).map((key) => (
                  <div key={key} className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-mono">{key.replace('_', ' ')}</span>
                    <Input
                      value={editingMethod.details[key]}
                      onChange={e => {
                        const updated = { ...editingMethod.details, [key]: e.target.value }
                        setEditingMethod({ ...editingMethod, details: updated })
                      }}
                      className="text-xs font-mono"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingMethod(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="font-bold glow-ember-sm gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  Save Payment Method
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
