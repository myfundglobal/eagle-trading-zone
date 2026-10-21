'use client'
import { motion } from 'framer-motion'
import { BookOpen, BarChart3, Brain, Swords, Users, Share2, Upload, Lock } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: BookOpen,
    title: 'Smart Trade Journal',
    description: 'Log every detail — entry, exit, SL/TP, emotions, strategy tags, screenshots and pre-trade checklist. Never lose a lesson again.',
    color: 'text-ember-400',
    bg: 'bg-ember-400/10',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Equity curves, drawdown charts, session breakdowns, win rates by symbol/strategy/time. See your real edge.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Brain,
    title: 'AI Performance Report',
    description: 'Get graded on your trading. Our AI detects revenge trading, over-trading, and gives a personalised improvement plan.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    pro: true,
  },
  {
    icon: Swords,
    title: 'Backtesting Engine',
    description: 'Replay historical candles, open/close virtual trades with real SL/TP rules, and see final backtest statistics.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    elite: true,
  },
  {
    icon: Upload,
    title: 'CSV Import (MT4/MT5)',
    description: 'Import your complete MetaTrader history with a smart column-mapping wizard. Zero manual re-entry.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    pro: true,
  },
  {
    icon: Users,
    title: 'Trader Community',
    description: 'Real-time chat rooms, weekly and monthly leaderboards. Compete, collaborate and grow with fellow traders.',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
    pro: true,
  },
  {
    icon: Share2,
    title: 'Performance Share Cards',
    description: 'Generate beautiful, downloadable PNG performance cards to share your results on social media.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    icon: Lock,
    title: 'Bank-Grade Security',
    description: 'Row-level security means only you can see your data. All connections are encrypted. Your trades are private.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-void-950" id="features">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-ember-400 text-sm font-semibold uppercase tracking-widest">Everything you need</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
            Built for Serious Traders
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every feature designed to give you the edge over the market — and yourself.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card className="p-6 h-full hover:border-white/15 hover:shadow-ember-sm transition-all duration-300">
                <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white">{feature.title}</h3>
                  {feature.elite && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 shrink-0">Elite</span>
                  )}
                  {feature.pro && !feature.elite && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-400 border border-blue-400/30 shrink-0">Pro</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
