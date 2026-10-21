'use client'
import { motion } from 'framer-motion'
import { UserPlus, BookOpen, BarChart3, TrendingUp } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Your Free Account',
    description: 'Sign up in under 60 seconds with your email or Google account. No credit card required.',
  },
  {
    step: '02',
    icon: BookOpen,
    title: 'Log Your Trades',
    description: 'Add trades manually or import your MT4/MT5 history with one click. Include screenshots, notes and emotion tags.',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'See Your Analytics',
    description: 'Your dashboard instantly shows win rate, profit factor, equity curve, best/worst sessions and more.',
  },
  {
    step: '04',
    icon: TrendingUp,
    title: 'Improve Your Edge',
    description: 'Get AI-powered reports, identify recurring mistakes, and watch your performance improve week by week.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-void-900" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-ember-400 text-sm font-semibold uppercase tracking-widest">Simple process</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">How It Works</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">From signup to insights in minutes.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-1/8 right-1/8 h-px bg-gradient-to-r from-transparent via-ember-400/30 to-transparent" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="relative inline-flex mb-6">
                <div className="w-20 h-20 rounded-2xl bg-ember-gradient flex items-center justify-center shadow-ember-md">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-void-950 border border-white/10 text-xs font-bold text-ember-400 flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
