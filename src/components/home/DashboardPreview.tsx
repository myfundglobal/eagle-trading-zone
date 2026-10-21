'use client'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const equityData = [
  { day: 'Mon', equity: 10000 },
  { day: 'Tue', equity: 10340 },
  { day: 'Wed', equity: 10180 },
  { day: 'Thu', equity: 10720 },
  { day: 'Fri', equity: 10650 },
  { day: 'Sat', equity: 11200 },
  { day: 'Sun', equity: 11480 },
]

const statCards = [
  { label: 'Total PnL', value: '+$1,480', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
  { label: 'Win Rate', value: '68.4%', icon: Target, color: 'text-ember-400', bg: 'bg-ember-400/10' },
  { label: 'Profit Factor', value: '2.14', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Max Drawdown', value: '-3.2%', icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-400/10' },
]

export function DashboardPreview() {
  return (
    <section className="py-24 bg-void-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-ember-400 text-sm font-semibold uppercase tracking-widest">Live dashboard</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">Your Command Centre</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about your trading performance — in one glance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-6 border border-white/10 shadow-glass max-w-5xl mx-auto"
        >
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statCards.map((card) => (
              <div key={card.label} className="glass-dark rounded-2xl p-4">
                <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-3`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <div className={`text-xl font-black ${card.color} mb-1`}>{card.value}</div>
                <div className="text-xs text-gray-500">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="glass-dark rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Equity Curve — This Week</h3>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+14.8%</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E5261A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E5261A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#1a1a1f', border: '1px solid rgba(229,38,26,0.3)', borderRadius: 12, color: '#fff' }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, 'Equity']}
                  />
                  <Area type="monotone" dataKey="equity" stroke="#E5261A" strokeWidth={2} fill="url(#equityGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
