'use client'

import React, { useRef, useState, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Download,
  Share2,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
} from 'lucide-react'
import html2canvas from 'html2canvas'
import { useTradesStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export default function ShareCardsPage() {
  const { trades } = useTradesStore()
  const { user } = useAuth()
  const cardRef = useRef<HTMLDivElement>(null)

  const [traderName, setTraderName] = useState(user?.full_name || 'Eagle Trader')
  const [downloading, setDownloading] = useState(false)

  // Compute stats
  const stats = useMemo(() => {
    const wins = trades.filter(t => (t.pnl || 0) > 0)
    const losses = trades.filter(t => (t.pnl || 0) < 0)
    const totalWin = wins.reduce((acc, t) => acc + (t.pnl || 0), 0)
    const totalLoss = Math.abs(losses.reduce((acc, t) => acc + (t.pnl || 0), 0))

    const winRate = trades.length > 0 ? ((wins.length / trades.length) * 100).toFixed(1) : '0.0'
    const profitFactor = totalLoss === 0 ? totalWin.toFixed(2) : (totalWin / totalLoss).toFixed(2)
    const netPnl = trades.reduce((acc, t) => acc + (t.pnl || 0), 0)

    return {
      winRate,
      profitFactor,
      netPnl,
      totalTrades: trades.length,
      topPair: 'XAUUSD',
    }
  }, [trades])

  const handleDownloadCard = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // High resolution for social media
        backgroundColor: '#0a0a0c',
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = `eagle_trading_card_${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('Performance Card downloaded!')
    } catch (e: any) {
      toast.error('Failed to generate image')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Social Share Cards
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
              Free Feature
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Export high-resolution verified performance cards to share on X, Instagram or Telegram
          </p>
        </div>

        <Button
          onClick={handleDownloadCard}
          disabled={downloading}
          size="lg"
          className="w-full sm:w-auto gap-2 font-bold bg-ember-gradient text-white shadow-xl glow-ember"
        >
          <Download className="w-4 h-4" />
          {downloading ? 'Rendering Image...' : 'Download PNG Card'}
        </Button>
      </div>

      {/* Customizer */}
      <div className="glass rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="text-xs font-semibold text-gray-300">Trader Handle / Display Name:</label>
          <Input
            value={traderName}
            onChange={e => setTraderName(e.target.value)}
            className="mt-1 h-9 text-xs"
            placeholder="e.g. Eagle Trader"
          />
        </div>
      </div>

      {/* The Printable Performance Card */}
      <div className="flex justify-center p-2">
        <div
          ref={cardRef}
          className="w-full max-w-lg aspect-[1.4/1] rounded-3xl p-7 relative overflow-hidden bg-gradient-to-br from-[#121216] via-[#0a0a0c] to-[#1c0c0b] border-2 border-ember-500/40 shadow-2xl flex flex-col justify-between"
        >
          {/* Background ember glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-ember-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-amber-glow/15 blur-3xl pointer-events-none" />

          {/* Top Row: Brand & Verification */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center glow-ember-sm">
                <Image src="/logo.png" alt="Eagle Trading" width={38} height={38} />
              </div>
              <div>
                <div className="text-sm font-black text-gradient uppercase tracking-wider">
                  Eagle Trading Zone
                </div>
                <div className="text-[10px] text-gray-400 font-semibold tracking-widest">
                  VERIFIED JOURNAL METRICS
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              VERIFIED
            </div>
          </div>

          {/* Middle: Trader Name & Huge Net PnL */}
          <div className="my-auto py-2 relative z-10">
            <div className="text-xs text-gray-400 font-medium">Performance Record for:</div>
            <div className="text-lg font-bold text-white mb-2">{traderName}</div>

            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Net Realized Profit</div>
            <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
              stats.netPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {stats.netPnl >= 0 ? '+' : ''}${stats.netPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Bottom Grid: 3 Key Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 relative z-10">
            <div className="p-2 rounded-xl bg-void-900/60 border border-white/5 text-center">
              <div className="text-[9px] text-gray-400 font-semibold uppercase">Win Rate</div>
              <div className="text-base font-black text-white font-mono mt-0.5">{stats.winRate}%</div>
            </div>
            <div className="p-2 rounded-xl bg-void-900/60 border border-white/5 text-center">
              <div className="text-[9px] text-gray-400 font-semibold uppercase">Profit Factor</div>
              <div className="text-base font-black text-amber-glow font-mono mt-0.5">{stats.profitFactor}</div>
            </div>
            <div className="p-2 rounded-xl bg-void-900/60 border border-white/5 text-center">
              <div className="text-[9px] text-gray-400 font-semibold uppercase">Closed Trades</div>
              <div className="text-base font-black text-white font-mono mt-0.5">{stats.totalTrades}</div>
            </div>
          </div>

          {/* Watermark Footer */}
          <div className="text-[9px] text-gray-500 text-center font-mono mt-2 pt-1 border-t border-white/5 flex items-center justify-between">
            <span>eagletradingzone.com/fxbook</span>
            <span>Disciplined Risk Execution</span>
          </div>
        </div>
      </div>
    </div>
  )
}
