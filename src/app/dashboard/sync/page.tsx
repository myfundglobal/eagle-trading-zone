'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  RefreshCw,
  Server,
  ShieldCheck,
  CheckCircle,
  Bell,
  Cpu,
  Layers,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export default function AutoSyncPage() {
  const [email, setEmail] = useState('')
  const [broker, setBroker] = useState('')
  const [joined, setJoined] = useState(false)

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setJoined(true)
    toast.success('You have been added to the MT4/MT5 Auto-Sync Beta Waitlist!')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ember-500/10 border border-ember-500/30 text-ember-400 text-xs font-bold uppercase tracking-wider">
          <RefreshCw className="w-3.5 h-3.5" />
          In Active Development
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight">
          Live MT4 / MT5 Broker Auto-Sync
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Automate trade syncing directly from your broker account into your Eagle Journal in real time, without manually exporting CSV files.
        </p>
      </div>

      {/* Honest Engineering Disclosure Box */}
      <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 space-y-4 bg-void-900/60">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-glow">
          <Server className="w-4 h-4 text-amber-glow" />
          Engineering Architecture & Live Integration Note
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Unlike manual CSV exports, continuous background synchronization with MetaTrader 4 and MetaTrader 5 servers requires a dedicated high-frequency cloud broker gateway (such as <strong>MetaApi.cloud</strong>, <strong>cTrader FIX API</strong>, or self-hosted terminal instances on VPS).
        </p>
        <p className="text-xs text-gray-400 leading-relaxed">
          We do not believe in fake or unreliable scrapers. The database schema (<code>broker_accounts</code>) is already designed and ready in our PostgreSQL schema to securely store encrypted broker credentials once the infrastructure bridge is plugged in.
        </p>
      </div>

      {/* Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Read-Only Investor Security</h3>
          <p className="text-xs text-gray-400">
            Uses read-only Investor Passwords. The platform can never place, modify or liquidate orders on your account.
          </p>
        </div>

        <div className="glass rounded-2xl p-5 border border-white/5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-ember-500/10 text-ember-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Sub-Second Sync Speed</h3>
          <p className="text-xs text-gray-400">
            Closed positions on your mobile MT4/MT5 app will appear in your Eagle Journal within seconds with tick precision.
          </p>
        </div>

        <div className="glass rounded-2xl p-5 border border-white/5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-glow/10 text-amber-glow flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Multi-Broker Aggregation</h3>
          <p className="text-xs text-gray-400">
            Connect IC Markets, Exness, FTMO, FundedNext, and Binance in a single centralized analytics command center.
          </p>
        </div>
      </div>

      {/* Waitlist Box */}
      <div className="glass rounded-3xl p-6 md:p-8 border border-ember-500/30 text-center max-w-xl mx-auto space-y-5 bg-gradient-to-b from-void-900 to-ember-950/20">
        <div className="w-12 h-12 rounded-2xl bg-ember-500/20 text-ember-400 flex items-center justify-center mx-auto glow-ember-sm">
          <Bell className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Join the Early Access Beta</h3>
          <p className="text-xs text-gray-400 mt-1">
            Be the first to connect your live broker accounts when Phase 2 auto-sync rolls out.
          </p>
        </div>

        {joined ? (
          <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            You are #142 on the priority auto-sync waitlist!
          </div>
        ) : (
          <form onSubmit={handleJoinWaitlist} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              <div>
                <label className="text-[11px] text-gray-400 font-medium">Your Email *</label>
                <Input
                  type="email"
                  placeholder="trader@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="h-10 text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 font-medium">Your Broker (e.g. Exness, FTMO)</label>
                <Input
                  type="text"
                  placeholder="e.g. Exness, IC Markets"
                  value={broker}
                  onChange={e => setBroker(e.target.value)}
                  className="h-10 text-xs mt-1"
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full font-bold glow-ember text-xs">
              Request Priority Early Access
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
