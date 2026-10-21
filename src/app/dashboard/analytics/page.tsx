'use client'

import React, { useMemo } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  PieChart as PieIcon,
  BarChart2,
  HelpCircle,
} from 'lucide-react'
import { useTradesStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

const COLORS = ['#E5261A', '#FF6A00', '#FFB020', '#10B981', '#3B82F6', '#8B5CF6']

export default function AnalyticsPage() {
  const { trades } = useTradesStore()

  // Deep performance metrics
  const metrics = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        winCount: 0,
        lossCount: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        rrRatio: 0,
        expectancy: 0,
        maxDrawdown: 0,
        longWinRate: 0,
        shortWinRate: 0,
      }
    }

    const wins = trades.filter(t => (t.pnl || 0) > 0)
    const losses = trades.filter(t => (t.pnl || 0) < 0)

    const totalWinVal = wins.reduce((acc, t) => acc + (t.pnl || 0), 0)
    const totalLossVal = Math.abs(losses.reduce((acc, t) => acc + (t.pnl || 0), 0))

    const avgWin = wins.length > 0 ? totalWinVal / wins.length : 0
    const avgLoss = losses.length > 0 ? totalLossVal / losses.length : 0
    const rrRatio = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? 99 : 0

    const winProb = trades.length > 0 ? wins.length / trades.length : 0
    const lossProb = trades.length > 0 ? losses.length / trades.length : 0
    // Expectancy formula: (Win% * AvgWin) - (Loss% * AvgLoss)
    const expectancy = (winProb * avgWin) - (lossProb * avgLoss)

    // Long vs Short
    const longs = trades.filter(t => t.direction === 'buy')
    const shorts = trades.filter(t => t.direction === 'sell')
    const longWins = longs.filter(t => (t.pnl || 0) > 0)
    const shortWins = shorts.filter(t => (t.pnl || 0) > 0)

    const longWinRate = longs.length > 0 ? (longWins.length / longs.length) * 100 : 0
    const shortWinRate = shorts.length > 0 ? (shortWins.length / shorts.length) * 100 : 0

    // Drawdown Calculation
    let peak = 10000
    let balance = 10000
    let maxDd = 0
    const sorted = [...trades].sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())

    sorted.forEach(t => {
      balance += t.pnl || 0
      if (balance > peak) peak = balance
      const dd = ((peak - balance) / peak) * 100
      if (dd > maxDd) maxDd = dd
    })

    return {
      winCount: wins.length,
      lossCount: losses.length,
      winRate: Number((winProb * 100).toFixed(1)),
      avgWin: Number(avgWin.toFixed(2)),
      avgLoss: Number(avgLoss.toFixed(2)),
      rrRatio: Number(rrRatio.toFixed(2)),
      expectancy: Number(expectancy.toFixed(2)),
      maxDrawdown: Number(maxDd.toFixed(2)),
      longWinRate: Number(longWinRate.toFixed(1)),
      shortWinRate: Number(shortWinRate.toFixed(1)),
    }
  }, [trades])

  // Equity Curve Data
  const equityData = useMemo(() => {
    let bal = 10000
    let peak = 10000
    const sorted = [...trades].sort((a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime())

    return sorted.map((t, idx) => {
      bal += t.pnl || 0
      if (bal > peak) peak = bal
      const drawdown = -Math.max(0, ((peak - bal) / peak) * 100)
      return {
        trade: `#${idx + 1}`,
        date: format(new Date(t.trade_date), 'MMM dd'),
        equity: bal,
        drawdown: Number(drawdown.toFixed(2)),
      }
    })
  }, [trades])

  // Performance by Symbol
  const symbolData = useMemo(() => {
    const map: Record<string, { symbol: string; pnl: number; count: number }> = {}
    trades.forEach(t => {
      if (!map[t.symbol]) map[t.symbol] = { symbol: t.symbol, pnl: 0, count: 0 }
      map[t.symbol].pnl += t.pnl || 0
      map[t.symbol].count += 1
    })
    return Object.values(map).sort((a, b) => b.pnl - a.pnl)
  }, [trades])

  // Performance by Session
  const sessionData = useMemo(() => {
    const map: Record<string, number> = { London: 0, 'New York': 0, Asian: 0, Overlap: 0 }
    trades.forEach(t => {
      const s = t.session || 'London'
      if (map[s] !== undefined) map[s] += t.pnl || 0
      else map['London'] += t.pnl || 0
    })
    return Object.keys(map).map(k => ({ session: k, pnl: map[k] }))
  }, [trades])

  // Performance by Day of Week
  const dayOfWeekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const map: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 }
    trades.forEach(t => {
      const d = format(new Date(t.trade_date), 'EEE')
      if (map[d] !== undefined) map[d] += t.pnl || 0
    })
    return Object.keys(map).map(day => ({ day, pnl: map[day] }))
  }, [trades])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Statistical Trading Analytics</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Quantify your edge, mathematical expectancy, drawdown depth and session probability
        </p>
      </div>

      {/* Expectancy & Mathematical Edge Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Expectancy */}
        <Card className="glass border-white/5">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Trade Expectancy</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className={`text-xl font-mono font-black ${metrics.expectancy >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {metrics.expectancy >= 0 ? '+' : ''}${metrics.expectancy.toFixed(2)}
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Expected return per executed trade</p>
          </CardContent>
        </Card>

        {/* Avg Win vs Avg Loss */}
        <Card className="glass border-white/5">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Avg Win / Loss</span>
              <TrendingUp className="w-4 h-4 text-ember-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-sm font-mono font-bold text-emerald-400">
              Avg Win: +${metrics.avgWin}
            </div>
            <div className="text-sm font-mono font-bold text-red-400 mt-0.5">
              Avg Loss: -${metrics.avgLoss}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              Realized R:R Ratio: <strong className="text-white">{metrics.rrRatio}:1</strong>
            </div>
          </CardContent>
        </Card>

        {/* Max Historical Drawdown */}
        <Card className="glass border-white/5">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Max Drawdown</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-xl font-mono font-black text-red-400">
              -{metrics.maxDrawdown}%
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Peak-to-valley account decline</p>
          </CardContent>
        </Card>

        {/* Long vs Short Win Rate */}
        <Card className="glass border-white/5">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Long vs Short Edge</span>
              <BarChart2 className="w-4 h-4 text-amber-glow" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">BUY Win Rate:</span>
              <span className="font-mono font-bold text-emerald-400">{metrics.longWinRate}%</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-gray-400">SELL Win Rate:</span>
              <span className="font-mono font-bold text-ember-400">{metrics.shortWinRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts: Equity & Drawdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Curve */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
          <h2 className="text-sm font-bold text-white">Cumulative Account Balance ($)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111114', borderColor: '#444', borderRadius: '10px' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Balance']}
                />
                <Area type="monotone" dataKey="equity" stroke="#E5261A" strokeWidth={2} fill="#E5261A" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drawdown Curve */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
          <h2 className="text-sm font-bold text-white">Historical Drawdown (%)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666" fontSize={11} domain={['auto', 0]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111114', borderColor: '#444', borderRadius: '10px' }}
                  formatter={(val: any) => [`${val}%`, 'Drawdown']}
                />
                <Area type="monotone" dataKey="drawdown" stroke="#EF4444" strokeWidth={2} fill="#EF4444" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Breakdowns: Symbol, Session, Day of Week */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PnL by Symbol */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
          <h2 className="text-sm font-bold text-white">Net PnL by Pair / Asset</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symbolData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="symbol" stroke="#666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111114', borderColor: '#444' }} />
                <Bar dataKey="pnl" fill="#FF6A00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PnL by Session */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
          <h2 className="text-sm font-bold text-white">Performance by Session</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="session" stroke="#666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111114', borderColor: '#444' }} />
                <Bar dataKey="pnl" fill="#FFB020" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PnL by Day of Week */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
          <h2 className="text-sm font-bold text-white">Performance by Weekday</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="day" stroke="#666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111114', borderColor: '#444' }} />
                <Bar dataKey="pnl" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
