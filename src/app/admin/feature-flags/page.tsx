'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Flag, Sparkles, Check, X, Shield, Lock } from 'lucide-react'
import { useFeatureFlagsStore } from '@/lib/store'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'

export default function AdminFeatureFlagsPage() {
  const { flags, toggleFlag, updateFlagMinPlan } = useFeatureFlagsStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Dynamic Feature Flags & Access Control
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Turn features on/off instantly or re-assign required membership tier (e.g., move Backtesting from Elite to Pro)
          </p>
        </div>
      </div>

      {/* Flags List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className="glass rounded-2xl p-5 border border-white/5 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{flag.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold ${flag.is_enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {flag.is_enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                  <Switch
                    checked={flag.is_enabled}
                    onCheckedChange={(checked) => toggleFlag(flag.key, checked)}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {flag.description}
              </p>
              <div className="text-[10px] font-mono text-gray-500 mt-1">
                Key: <code>{flag.key}</code>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">Minimum Required Tier:</span>
              <select
                value={flag.min_plan}
                onChange={(e) => updateFlagMinPlan(flag.key, e.target.value as any)}
                className="h-8 text-xs rounded-lg border border-white/10 bg-void-800 text-white px-2.5 font-bold uppercase"
              >
                <option value="free">Free (All Users)</option>
                <option value="pro">Pro Plan</option>
                <option value="elite">Elite VIP</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
