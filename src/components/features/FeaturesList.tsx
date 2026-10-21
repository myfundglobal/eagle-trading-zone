'use client'
import { motion } from 'framer-motion'
import { BookOpen, BarChart3, Brain, Swords, Upload, Users, Share2, Lock, Bell, Smartphone, Download, Globe } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Advanced Trade Journal',
    description: 'Log every trade with full detail: symbol, direction, entry/exit, SL/TP, lot size, PnL, strategy tags, emotion rating, notes, and screenshots. Use the pre-trade checklist to stay disciplined.',
    color: 'text-ember-400',
    bg: 'from-ember-500/10 to-ember-500/5',
  },
  {
    icon: BarChart3,
    title: 'Professional Analytics Suite',
    description: 'Full equity curve, drawdown chart, win rate, profit factor, expectancy, breakdown by session (London/NY/Asia), symbol, strategy tag, day of week, and time of day.',
    color: 'text-blue-400',
    bg: 'from-blue-500/10 to-blue-500/5',
  },
  {
    icon: Brain,
    title: 'AI Performance Report',
    description: 'Our AI analyses your full trade history and generates a personalised report with a grade (A-F), strengths, weaknesses, revenge-trading detection, over-trading flags, and a step-by-step improvement plan.',
    color: 'text-purple-400',
    bg: 'from-purple-500/10 to-purple-500/5',
    badge: 'Pro',
  },
  {
    icon: Swords,
    title: 'Backtesting Engine',
    description: 'Replay historical candles tick-by-tick or bar-by-bar. Place virtual trades with real SL/TP rules. Get a full backtesting report with win rate, profit factor, and equity curve.',
    color: 'text-amber-400',
    bg: 'from-amber-500/10 to-amber-500/5',
    badge: 'Elite',
  },
  {
    icon: Upload,
    title: 'CSV Import (MT4/MT5)',
    description: 'Import your complete MetaTrader trade history as a CSV. Our column-mapping wizard handles non-standard formats. Import thousands of trades in seconds.',
    color: 'text-green-400',
    bg: 'from-green-500/10 to-green-500/5',
    badge: 'Pro',
  },
  {
    icon: Users,
    title: 'Trader Community',
    description: 'Real-time chat rooms organised by trading style. Weekly and monthly leaderboards to see how you rank against other traders. Share wins, get feedback, stay accountable.',
    color: 'text-pink-400',
    bg: 'from-pink-500/10 to-pink-500/5',
    badge: 'Pro',
  },
  {
    icon: Share2,
    title: 'Performance Share Cards',
    description: 'Generate beautifully branded, downloadable PNG cards showing your weekly/monthly stats. Perfect for sharing on Instagram, Twitter or Telegram trading groups.',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/10 to-cyan-500/5',
  },
  {
    icon: Lock,
    title: 'Bank-Grade Security',
    description: 'Supabase Row-Level Security ensures your data is mathematically isolated. All connections are TLS-encrypted. Zero data sharing with third parties.',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-emerald-500/5',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'In-app notifications for payment approvals, plan updates, admin announcements, and community mentions.',
    color: 'text-yellow-400',
    bg: 'from-yellow-500/10 to-yellow-500/5',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First PWA',
    description: 'Install Eagle FX Book on your phone like a native app. Bottom navigation, swipeable interfaces, and full feature access on mobile.',
    color: 'text-indigo-400',
    bg: 'from-indigo-500/10 to-indigo-500/5',
  },
  {
    icon: Download,
    title: 'Calendar Heatmap',
    description: 'See your daily PnL as a calendar heatmap. Instantly spot your best and worst trading days, weeks and months.',
    color: 'text-orange-400',
    bg: 'from-orange-500/10 to-orange-500/5',
  },
  {
    icon: Globe,
    title: 'MT4/MT5 Auto-Sync (Coming Soon)',
    description: 'Direct broker connection for automatic trade import. Currently in development. CSV import is available now as the fastest alternative.',
    color: 'text-gray-400',
    bg: 'from-gray-500/10 to-gray-500/5',
    badge: 'Soon',
  },
]

export function FeaturesList() {
  return (
    <section className="py-24 bg-void-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${feature.bg} border border-white/8 transition-all duration-300`}
            >
              {feature.badge && (
                <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-void-800 text-gray-400 border border-white/10">
                  {feature.badge}
                </span>
              )}
              <div className="p-3 rounded-xl bg-void-900/80 inline-flex mb-4">
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
