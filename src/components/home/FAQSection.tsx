'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Is Eagle Trading Zone FX Book really free to start?',
    a: 'Yes! Our Free plan lets you log up to 15 trades per month with basic analytics at zero cost. No credit card required. Upgrade anytime when you need more.',
  },
  {
    q: 'How does the manual payment process work?',
    a: "After choosing a plan, you'll see our payment details (UPI, bank transfer, or USDT). Pay outside the app, then submit your transaction ID and a screenshot. Our team reviews and approves within a few hours.",
  },
  {
    q: 'Can I import my MetaTrader 4 or MT5 history?',
    a: 'Yes! Pro and Elite users can import their complete MT4/MT5 trade history as a CSV file. We have a smart column-mapping wizard, so no technical knowledge is needed.',
  },
  {
    q: 'Is my trading data private and secure?',
    a: 'Absolutely. We use Supabase with row-level security — your data is mathematically isolated from other users. All connections are encrypted. We never sell or share your data.',
  },
  {
    q: 'Does the AI report give trading signals or advice?',
    a: 'No. The AI Report analyses your past trades and gives statistical feedback — patterns, strengths, weaknesses. It is a journaling and analytics tool, not a financial advisor. All trading decisions are yours alone.',
  },
  {
    q: 'Can I cancel my plan?',
    a: 'Your plan runs until its expiry date. We do not automatically renew or charge you. Simply choose not to submit a new payment when your plan expires. Approved payments are non-refundable.',
  },
  {
    q: 'What is the Backtesting feature?',
    a: 'Elite users can replay historical candles symbol-by-symbol and place virtual trades with real SL/TP rules. It is a practice environment — not connected to any live broker.',
  },
  {
    q: 'How do I connect MT4/MT5 for auto-sync?',
    a: "Direct broker sync requires a paid third-party service. This feature is listed as 'Coming Soon' while we evaluate the best options. Currently, CSV import is the fastest way to get your history in.",
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 bg-void-900" id="faq">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-ember-400 text-sm font-semibold uppercase tracking-widest">Got questions?</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">Frequently Asked</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
              >
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <ChevronDown className={cn('w-5 h-5 text-ember-400 shrink-0 transition-transform duration-300', open === i && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
