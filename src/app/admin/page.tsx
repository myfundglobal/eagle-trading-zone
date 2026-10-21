'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Flag,
  ArrowRight,
  ShieldAlert,
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
import { usePaymentRequestsStore, usePlansStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SIGNUP_DATA = [
  { day: 'Mon', signups: 14, revenue: 190 },
  { day: 'Tue', signups: 22, revenue: 380 },
  { day: 'Wed', signups: 19, revenue: 260 },
  { day: 'Thu', signups: 31, revenue: 570 },
  { day: 'Fri', signups: 28, revenue: 450 },
  { day: 'Sat', signups: 38, revenue: 760 },
  { day: 'Sun', signups: 45, revenue: 950 },
]

export default function AdminOverviewPage() {
  const { requests } = usePaymentRequestsStore()
  const { plans } = usePlansStore()

  const pendingCount = requests.filter(r => r.status === 'pending').length
  const approvedCount = requests.filter(r => r.status === 'approved').length

  const totalRevenue = useMemo(() => {
    return requests
      .filter(r => r.status === 'approved')
      .reduce((acc, r) => acc + (r.amount || 0), 1840) // including baseline demo revenue
  }, [requests])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Administrator Command Center
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-ember-500/20 text-ember-400 border border-ember-500/30 font-bold uppercase">
              Root Level
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Monitor subscriptions, verify manual payments, configure feature flags and manage traders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/payments">
            <Button size="sm" className="gap-1.5 font-bold glow-ember-sm text-xs">
              <CreditCard className="w-3.5 h-3.5" />
              Review Pending ({pendingCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Pending Payments Alert Notification */}
      {pendingCount > 0 && (
        <div className="p-4 rounded-2xl glass border border-amber-500/40 bg-gradient-to-r from-void-900 to-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 animate-pulse">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {pendingCount} Manual Payment {pendingCount === 1 ? 'Proof' : 'Proofs'} Awaiting Review
              </div>
              <p className="text-[11px] text-gray-400">
                Traders have submitted transaction receipts outside the website. Please verify their screenshot and UTR.
              </p>
            </div>
          </div>
          <Link href="/admin/payments">
            <Button size="sm" variant="default" className="text-xs font-bold gap-1 bg-amber-500 text-black hover:bg-amber-400">
              Review Now &rarr;
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="glass border-white/5">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Total Traders</span>
              <Users className="w-4 h-4 text-blue-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-black text-white font-mono">1,428</div>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">+45 registered this week</p>
          </CardContent>
        </Card>

        {/* Active Subscribers */}
        <Card className="glass border-white/5">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Pro / Elite Active</span>
              <Sparkles className="w-4 h-4 text-amber-glow" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-black text-white font-mono">312</div>
            <p className="text-[10px] text-gray-500 mt-1">21.8% conversion from Free</p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="glass border-white/5">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Verified Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Manual payment receipts approved</p>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="glass border-white/5">
          <CardHeader className="p-4 pb-1">
            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Pending Review</span>
              <CreditCard className="w-4 h-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-black text-amber-400 font-mono">{pendingCount}</div>
            <p className="text-[10px] text-gray-500 mt-1">Ready for 1-click activation</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart: User Signups & Revenue Momentum */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Daily Growth & Revenue Velocity</h2>
            <p className="text-xs text-gray-500">New trader registrations over the last 7 days</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">+18.4% vs last week</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SIGNUP_DATA}>
              <defs>
                <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E5261A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#E5261A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="day" stroke="#666" fontSize={11} tickLine={false} />
              <YAxis stroke="#666" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111114', borderColor: '#444', borderRadius: '10px' }}
                formatter={(val: any) => [`${val} Signups`, 'Volume']}
              />
              <Area type="monotone" dataKey="signups" stroke="#E5261A" strokeWidth={2.5} fill="url(#signupGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Admin Task Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/users" className="glass p-4 rounded-2xl border border-white/5 hover:border-ember-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-ember-400 transition-colors">Users & Bans</div>
                <div className="text-[10px] text-gray-500">Edit plans & reset trade counts</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
          </div>
        </Link>

        <Link href="/admin/plans" className="glass p-4 rounded-2xl border border-white/5 hover:border-ember-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-glow/10 text-amber-glow flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-ember-400 transition-colors">Plans & Pricing</div>
                <div className="text-[10px] text-gray-500">Edit Free/Pro/Elite prices in DB</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
          </div>
        </Link>

        <Link href="/admin/feature-flags" className="glass p-4 rounded-2xl border border-white/5 hover:border-ember-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-ember-400 transition-colors">Feature Flags</div>
                <div className="text-[10px] text-gray-500">Toggle live features without code</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
          </div>
        </Link>
      </div>
    </div>
  )
}
