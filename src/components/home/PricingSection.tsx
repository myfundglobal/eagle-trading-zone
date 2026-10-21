'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, X, Zap, Crown, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// NOTE: Live pricing data is stored in the database and editable from Admin Panel.
// This is a static display version for the public page.
const plans = [
  {
    name: 'Free',
    icon: Star,
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Perfect for getting started',
    badge: null,
    features: [
      { text: '15 trades per month', included: true },
      { text: 'Basic trade journal', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Performance dashboard', included: true },
      { text: 'CSV import (MT4/MT5)', included: false },
      { text: 'AI performance report', included: false },
      { text: 'Full analytics suite', included: false },
      { text: 'Community access', included: false },
      { text: 'Backtesting engine', included: false },
    ],
    cta: 'Start Free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    icon: Zap,
    priceMonthly: 999,
    priceYearly: 9990,
    description: 'For consistent, growing traders',
    badge: 'Most Popular',
    features: [
      { text: 'Unlimited trades', included: true },
      { text: 'Full trade journal', included: true },
      { text: 'Full analytics suite', included: true },
      { text: 'Performance dashboard', included: true },
      { text: 'CSV import (MT4/MT5)', included: true },
      { text: 'AI performance report', included: true },
      { text: 'Community access', included: true },
      { text: 'Share cards (PNG)', included: true },
      { text: 'Backtesting engine', included: false },
    ],
    cta: 'Upgrade to Pro',
    href: '/signup',
    highlight: true,
  },
  {
    name: 'Elite',
    icon: Crown,
    priceMonthly: 1999,
    priceYearly: 19990,
    description: 'For professional & prop traders',
    badge: 'Best Value',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Backtesting engine', included: true },
      { text: 'Candle-by-candle replay', included: true },
      { text: 'Priority support', included: true },
      { text: 'Early feature access', included: true },
      { text: 'Custom strategy tags', included: true },
      { text: 'Advanced AI insights', included: true },
      { text: 'Export to Excel/PDF', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
    cta: 'Go Elite',
    href: '/signup',
    highlight: false,
  },
]

export function PricingSection() {
  const [yearly, setYearly] = useState(false)

  return (
    <section className="py-24 bg-void-950" id="pricing">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-ember-400 text-sm font-semibold uppercase tracking-widest">Simple pricing</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">Pick Your Plan</h2>
          <p className="text-gray-400 text-lg">No hidden fees. No surprises. Manual payment, instant approval.</p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={cn('text-sm', !yearly ? 'text-white' : 'text-gray-500')}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              className={cn(
                'relative w-14 h-7 rounded-full transition-colors duration-300',
                yearly ? 'bg-ember-gradient' : 'bg-void-700'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300',
                  yearly ? 'translate-x-7' : 'translate-x-0'
                )}
              />
            </button>
            <span className={cn('text-sm', yearly ? 'text-white' : 'text-gray-500')}>
              Yearly
              <span className="ml-2 text-xs text-green-400 font-semibold">(Save ~17%)</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn('relative rounded-3xl p-8', plan.highlight ? 'gradient-border shadow-ember-md scale-105' : 'glass border border-white/8')}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-ember-gradient rounded-full text-white text-xs font-bold shadow-ember-sm">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={cn('p-2 rounded-xl', plan.highlight ? 'bg-white/20' : 'bg-ember-400/10')}>
                  <plan.icon className={cn('w-5 h-5', plan.highlight ? 'text-white' : 'text-ember-400')} />
                </div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  {plan.priceMonthly === 0 ? (
                    <span className="text-4xl font-black text-white">Free</span>
                  ) : (
                    <>
                      <span className="text-sm text-gray-400">&#8377;</span>
                      <span className="text-4xl font-black text-white">
                        {yearly ? Math.floor((plan.priceYearly / 12)).toLocaleString() : plan.priceMonthly.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm">/mo</span>
                    </>
                  )}
                </div>
                {plan.priceMonthly > 0 && yearly && (
                  <p className="text-green-400 text-xs mt-1">&#8377;{plan.priceYearly.toLocaleString()} billed yearly</p>
                )}
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
              </div>

              <Link href={plan.href}>
                <Button
                  variant={plan.highlight ? 'default' : 'outline'}
                  className="w-full mb-6"
                >
                  {plan.cta}
                </Button>
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-600 shrink-0" />
                    )}
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs mt-10">
          Prices shown in Indian Rupees (₹). Payments are manual — see your dashboard for payment instructions after signup.
        </p>
      </div>
    </section>
  )
}
