'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card } from '@/components/ui/card'

// EDITABLE: These testimonials can be updated from the Admin Panel > Content Manager
const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Full-time Forex Trader, Mumbai',
    avatar: '💼',
    rating: 5,
    text: 'Eagle FX Book completely transformed how I analyse my trades. I spotted that I was over-trading the London session and losing 60% of my London trades. Fixed it in 2 weeks. My win rate jumped from 48% to 67%.',
  },
  {
    name: 'Sarah K.',
    role: 'Gold & Crypto Trader, Dubai',
    avatar: '📊',
    rating: 5,
    text: 'The AI report blew my mind. It detected my revenge trading pattern immediately — something I never admitted to myself. The improvement plan it gave me actually works. Highly recommend Pro plan.',
  },
  {
    name: 'Raj Patel',
    role: 'Part-time Trader, Ahmedabad',
    avatar: '🚀',
    rating: 5,
    text: 'I was skeptical at first but the free plan already shows you so much. The MT4 CSV import saved me hours. The analytics are better than what most paid tools offer. Worth every rupee of the Pro plan.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-void-900" id="testimonials">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-ember-400 text-sm font-semibold uppercase tracking-widest">Trader stories</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">Real Results, Real Traders</h2>
          <p className="text-gray-400 text-sm mt-2 italic">
            * Testimonials are editable from Admin Panel → Content Manager
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-6 h-full hover:border-white/15 hover:shadow-ember-sm transition-all duration-300">
                <Quote className="w-6 h-6 text-ember-400/50 mb-4" />
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-ember-gradient flex items-center justify-center text-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
