'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { History, ShieldCheck, UserCheck, CreditCard, Flag, Layers } from 'lucide-react'
import { format } from 'date-fns'

interface LogEntry {
  id: string
  action: string
  details: string
  admin: string
  timestamp: string
  type: 'payment' | 'user' | 'plan' | 'flag'
}

const SAMPLE_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    action: 'Payment Approved & Plan Activated',
    details: 'Approved UPI payment request (TxID: UPI482910492812). Upgraded Vikram Sharma to Pro Plan for 30 days.',
    admin: 'Chief Administrator (admin@eagletradingzone.com)',
    timestamp: 'Today at 11:45 AM',
    type: 'payment',
  },
  {
    id: 'log-2',
    action: 'Plan Pricing Modified',
    details: 'Updated Pro Plan yearly pricing to $190/yr and Elite Plan monthly to $39/mo.',
    admin: 'Chief Administrator',
    timestamp: 'Yesterday at 03:20 PM',
    type: 'plan',
  },
  {
    id: 'log-3',
    action: 'Feature Flag Assigned',
    details: 'Re-assigned "Backtesting Replay Simulator" to required tier ELITE.',
    admin: 'Chief Administrator',
    timestamp: 'Oct 16, 2026, 06:10 PM',
    type: 'flag',
  },
  {
    id: 'log-4',
    action: 'User Account Banned',
    details: 'Banned account spammer_bot@toxic.com for automated message flooding in #forex-general.',
    admin: 'Chief Administrator',
    timestamp: 'Oct 15, 2026, 09:30 AM',
    type: 'user',
  },
]

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          Security & Administrative Audit Trail
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Immutable event log of every manual payment approval, plan adjustment, user ban, and security modification
        </p>
      </div>

      <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Recorded Events ({SAMPLE_LOGS.length})
        </div>

        <div className="space-y-3">
          {SAMPLE_LOGS.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-void-900 border border-white/5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-void-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                {log.type === 'payment' && <CreditCard className="w-4 h-4 text-emerald-400" />}
                {log.type === 'plan' && <Layers className="w-4 h-4 text-amber-glow" />}
                {log.type === 'flag' && <Flag className="w-4 h-4 text-blue-400" />}
                {log.type === 'user' && <UserCheck className="w-4 h-4 text-red-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{log.action}</h3>
                  <span className="text-[10px] text-gray-500 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  {log.details}
                </p>
                <div className="text-[10px] text-gray-500 font-mono mt-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-ember-400" />
                  <span>Executed by: {log.admin}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
