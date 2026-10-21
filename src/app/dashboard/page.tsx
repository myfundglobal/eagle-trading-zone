'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar as CalendarIcon,
  PlusCircle,
  Upload,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTradesStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import { PositionSizeCalculator } from '@/components/dashboard/PositionSizeCalculator'
import { TradingViewEconomicCalendar } from '@/components/dashboard/TradingViewEconomicCalendar'

export default function DashboardOverviewPage() {
  const { trades } = useTradesStore()
  const { user } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  // Calculate high-level stats
  const stats = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        profitFactor: 0,
        netPnl: 0,
        todayPnl: 0,
        bestTrade: 0,
        worstTrade: 0,
      }
    }

    const wins = trades.filter(t => (t.pnl || 0) > 0)
    const losses = trades.filter(t => (t.pnl || 0) < 0)
    const totalWinsVal = wins.reduce((acc, t) => acc + (t.pnl || 0), 0)
    const totalLossVal = Math.abs(losses.reduce((acc, t) => acc + (t.pnl || 0), 0))

    const winRate = ((wins.length / trades.length) * 100).toFixed(1)
    const profitFactor = totalLossVal === 0 ? totalWinsVal.toFixed(2) : (totalWinsVal / totalLossVal).toFixed(2)
    const netPnl = trades.reduce((acc, t) => acc + (t.pnl || 0), 0)

    const todayStr = new Date().toISOString().split('T')[0]
    const todayTrades = trades.filter(t => t.trade_date.startsWith(todayStr))
    const todayPnl = todayTrades.reduce((acc, t) => acc + (t.pnl || 0), 0)

    const pnls = trades.map(t => t.pnl || 0)
    const bestTrade = Math.max(...pnls, 0)
    const worstTrade = Math.min(...pnls, 0)

    return {
      totalTrades: trades.length,
      winRate: Number(winRate),
      profitFactor: Number(profitFactor),
      netPnl,
      todayPnl,
      bestTrade,
      worstTrade,
    }
  }, [trades])

  // Equity Curve Data
  const equityCurveData = useMemo(() => {
    if (!trades || trades.length === 0) return []
    // Sort chronological
    const sorted = [...trades].sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())
    let runningBalance = 10000 // initial starting balance demo
    return sorted.map((t, idx) => {
      runningBalance += t.pnl || 0
      return {
        trade: `#${idx + 1}`,
        date: format(new Date(t.trade_date), 'MMM dd'),
        equity: runningBalance,
        pnl: t.pnl || 0,
      }
    })
  }, [trades])

  // Calendar Heatmap Days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(selectedMonth)
    const end = endOfMonth(selectedMonth)
    const days = eachDayOfInterval({ start, end })

    return days.map(day => {
      const dayTrades = trades.filter(t => isSameDay(new Date(t.trade_date), day))
      const dayPnl = dayTrades.reduce((acc, t) => acc + (t.pnl || 0), 0)
      return {
        date: day,
        tradesCount: dayTrades.length,
        pnl: dayPnl,
      }
    })
  }, [selectedMonth, trades])

  const freeLimit = 15
  const tradesThisMonth = trades.length
  const limitProgress = Math.min(100, (tradesThisMonth / freeLimit) * 100)

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Trader'}
            <span className="text-sm px-2 py-0.5 rounded-full bg-ember-500/10 text-ember-400 border border-ember-500/30">
              Live Edge
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time performance analytics, journal summary & execution audit
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link href="/dashboard/journal" className="flex-1 sm:flex-initial">
            <Button size="sm" className="w-full gap-1.5 font-bold glow-ember-sm text-xs">
              <PlusCircle className="w-4 h-4" />
              Log Trade
            </Button>
          </Link>
          <Link href="/dashboard/import">
            <Button size="sm" variant="glass" className="gap-1.5 text-xs text-gray-300">
              <Upload className="w-3.5 h-3.5" />
              Import CSV
            </Button>
          </Link>
        </div>
      </div>

      {/* Free Plan Limit Notice (if user is Free) */}
      {user?.plan === 'free' && (
        <div className="p-4 rounded-2xl glass border border-ember-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-gradient-to-r from-void-900 to-ember-950/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Free Plan Usage:</span>
              <span className="text-xs text-ember-400 font-mono font-bold">
                {tradesThisMonth} / {freeLimit} trades logged this month
              </span>
            </div>
            <div className="w-64">
              <Progress value={limitProgress} className="h-1.5 bg-void-700" />
            </div>
          </div>
          <Link href="/dashboard/subscription">
            <Button size="sm" className="h-8 gap-1.5 text-xs font-bold bg-ember-gradient text-white">
              <Zap className="w-3.5 h-3.5" />
              Upgrade to Unlimited (Pro)
            </Button>
          </Link>
        </div>
      )}

      {/* Core KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Net PnL */}
        <Card className="glass border-white/5 relative overflow-hidden">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Total Net PnL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className={`text-xl sm:text-2xl font-black font-mono flex items-center gap-1 ${
              stats.netPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {stats.netPnl >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              ${stats.netPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Today:</span>
              <span className={stats.todayPnl >= 0 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                {stats.todayPnl >= 0 ? '+' : ''}${stats.todayPnl.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Win Rate */}
        <Card className="glass border-white/5">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Win Rate</span>
              <Target className="w-3.5 h-3.5 text-ember-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {stats.winRate}%
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Logged:</span>
              <span className="text-gray-300 font-semibold">{stats.totalTrades} Trades</span>
            </div>
          </CardContent>
        </Card>

        {/* Profit Factor */}
        <Card className="glass border-white/5">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Profit Factor</span>
              <Award className="w-3.5 h-3.5 text-amber-glow" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {stats.profitFactor}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>Target:</span>
              <span className="text-emerald-400 font-semibold">&gt; 1.80</span>
            </div>
          </CardContent>
        </Card>

        {/* Best / Worst Ratio */}
        <Card className="glass border-white/5">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Best / Worst</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-base sm:text-lg font-black text-emerald-400 font-mono truncate">
              +${stats.bestTrade.toFixed(0)}
            </div>
            <div className="text-[11px] text-red-400 font-mono font-bold mt-1">
              -${Math.abs(stats.worstTrade).toFixed(0)} max loss
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equity Curve & Calendar Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Curve (2 Cols) */}
        <div className="lg:col-span-2 glass rounded-2xl p-5 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Equity Curve Simulation
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  +$10,000 Starting
                </span>
              </h2>
              <p className="text-xs text-gray-500">Cumulative portfolio growth based on journaled closed trades</p>
            </div>
            <Link href="/dashboard/analytics">
              <Button variant="ghost" size="sm" className="text-xs text-ember-400 hover:text-ember-300">
                Deep Analytics &rarr;
              </Button>
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityCurveData}>
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E5261A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E5261A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111114',
                    border: '1px solid rgba(229,38,26,0.4)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Portfolio Balance']}
                />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke="#E5261A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#equityGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calendar Heatmap (1 Col) */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-ember-400" />
              Daily PnL Calendar
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              {format(selectedMonth, 'MMM yyyy')}
            </span>
          </div>

          {/* Mini Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center pt-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-[10px] font-bold text-gray-500 py-1">
                {d}
              </div>
            ))}

            {calendarDays.map((item, idx) => {
              const hasTrades = item.tradesCount > 0
              const isProfit = item.pnl > 0
              const isLoss = item.pnl < 0

              let bgClass = 'bg-void-800/60 text-gray-500'
              if (hasTrades) {
                if (isProfit) bgClass = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                else if (isLoss) bgClass = 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold'
                else bgClass = 'bg-void-700 text-gray-300'
              }

              return (
                <div
                  key={idx}
                  title={`${format(item.date, 'MMM dd')}: ${
                    hasTrades ? (item.pnl >= 0 ? `+$${item.pnl}` : `-$${Math.abs(item.pnl)}`) : 'No trades'
                  }`}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center p-1 text-[10px] transition-transform hover:scale-110 cursor-pointer ${bgClass}`}
                >
                  <span>{format(item.date, 'd')}</span>
                  {hasTrades && (
                    <span className="text-[8px] opacity-80 leading-tight">
                      {item.pnl > 0 ? `+${item.pnl.toFixed(0)}` : item.pnl.toFixed(0)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-500/60" /> Win
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-red-500/40 border border-red-500/60" /> Loss
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-void-800" /> Flat
            </span>
          </div>
        </div>
      </div>

      {/* Recent Trades Table */}
      <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Journal Entries</h2>
            <p className="text-xs text-gray-500">Last recorded trades and performance outcomes</p>
          </div>
          <Link href="/dashboard/journal">
            <Button variant="ghost" size="sm" className="text-xs text-ember-400 hover:text-ember-300">
              View All Journal &rarr;
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-gray-400">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Symbol</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Lots</th>
                <th className="py-2.5 px-3">Entry / Exit</th>
                <th className="py-2.5 px-3">Tag</th>
                <th className="py-2.5 px-3">Emotion</th>
                <th className="py-2.5 px-3 text-right">PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {trades.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 text-gray-400">{format(new Date(t.trade_date), 'MMM dd, HH:mm')}</td>
                  <td className="py-3 px-3 font-bold text-white">{t.symbol}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.direction === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {t.direction}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">{t.lot_size}</td>
                  <td className="py-3 px-3 font-mono text-gray-300">
                    {t.entry_price} &rarr; {t.exit_price || '-'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-void-700 text-gray-300">
                      {t.strategy_tag || 'Standard'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] ${
                      t.emotion === 'Disciplined' ? 'text-emerald-400' : t.emotion === 'Revenge' ? 'text-red-400 font-bold' : 'text-amber-400'
                    }`}>
                      {t.emotion || 'Neutral'}
                    </span>
                  </td>
                  <td className={`py-3 px-3 text-right font-mono font-bold ${
                    (t.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {(t.pnl || 0) >= 0 ? '+' : ''}${t.pnl?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Value-Add Embedded Widgets */}
      <div className="space-y-6 pt-2">
        <PositionSizeCalculator />
        <TradingViewEconomicCalendar />
      </div>
    </div>
  )
}
