'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  Cpu,
  Star,
  CheckCircle2,
  ArrowRight,
  Download,
  BookOpen,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProductsStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Product } from '@/lib/mock-data'
import toast from 'react-hot-toast'

export function ProductsMarketplaceSection() {
  const { products, purchaseProduct } = useProductsStore()
  const { user } = useAuth()
  const [filter, setFilter] = useState<'All' | 'Course' | 'Software'>('All')
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('Credit Card / Stripe')
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredProducts = products.filter(p => {
    if (filter === 'All') return true
    return p.type === filter
  })

  const handleCheckout = () => {
    if (!checkoutProduct) return
    setIsProcessing(true)

    setTimeout(() => {
      purchaseProduct(checkoutProduct, paymentMethod)
      setIsProcessing(false)
      setCheckoutProduct(null)
    }, 700)
  }

  return (
    <section id="marketplace" className="py-24 relative bg-void-950 overflow-hidden border-t border-white/5">
      {/* Background ambient neon glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-ember-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ember-500/10 border border-ember-500/20 text-ember-400 text-xs font-semibold mb-4">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Digital Product Marketplace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Institutional Courses &{' '}
            <span className="text-gradient">Automated Software</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Elevate your trading edge with our battle-tested smart money video courses and algorithmic MT5 expert advisors built by veteran prop traders.
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {(['All', 'Course', 'Software'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  filter === tab
                    ? 'bg-ember-gradient text-white shadow-lg shadow-ember-500/20'
                    : 'bg-void-900/80 text-gray-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {tab === 'All' ? '⚡ All Products' : tab === 'Course' ? '🎓 Trading Courses' : '⚙️ Software & EAs'}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => {
            const isCourse = product.type === 'Course'

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative flex flex-col rounded-2xl bg-void-900/60 border border-white/10 hover:border-ember-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-ember-500/10 overflow-hidden"
              >
                {/* Neon top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ember-500 via-amber-glow to-ember-600 opacity-60 group-hover:opacity-100 transition-opacity" />

                {/* Card Header & Badge */}
                <div className="p-6 pb-4 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isCourse
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-ember-500/15 text-ember-400 border border-ember-500/30'
                      }`}
                    >
                      {isCourse ? <GraduationCap className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />}
                      {product.type}
                    </span>

                    {product.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-glow/20 text-amber-glow border border-amber-glow/30">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-ember-300 transition-colors leading-snug mb-2">
                    {product.title}
                  </h3>

                  <p className="text-gray-400 text-xs leading-relaxed mb-5 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Rating & Review */}
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold text-white">{product.rating}</span>
                    </div>
                    <span>•</span>
                    <span className="text-[11px] text-gray-500">
                      {isCourse ? product.level || 'All Levels' : product.version || 'Instant Download'}
                    </span>
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    {product.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-ember-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Price & Buy Action */}
                <div className="p-6 pt-4 border-t border-white/10 bg-void-950/40 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                      One-Time Access
                    </div>
                    <div className="text-2xl font-black text-white flex items-baseline gap-1">
                      <span>${product.price}</span>
                      <span className="text-xs text-gray-500 font-normal">USD</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setCheckoutProduct(product)}
                    className="gap-2 bg-ember-gradient hover:opacity-95 text-white font-bold text-xs shadow-md shadow-ember-500/20"
                  >
                    {isCourse ? <BookOpen className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                    {isCourse ? 'Enroll Now' : 'Get Software'}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-void-900 via-ember-950/30 to-void-900 border border-ember-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ember-500/20 border border-ember-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-ember-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Instant Automated Delivery & Lifetime Updates</div>
              <div className="text-xs text-gray-400">All purchases appear immediately under your private dashboard tab with 1-click download access.</div>
            </div>
          </div>
          <Link href="/signup">
            <Button variant="outline" size="sm" className="shrink-0 text-xs border-ember-500/40 text-ember-400 hover:bg-ember-500/10">
              Open Free Account First
            </Button>
          </Link>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-void-900 border border-white/10 p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-ember-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Instant Checkout
                </span>
                <button
                  onClick={() => setCheckoutProduct(null)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{checkoutProduct.title}</h3>
                <div className="text-xs text-gray-400 mt-1">{checkoutProduct.type} License • Lifetime Access</div>
              </div>

              <div className="p-4 rounded-xl bg-void-950 border border-white/10 mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-300">Total Price:</span>
                <span className="text-xl font-black text-white">${checkoutProduct.price}.00 USD</span>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 mb-6">
                <label className="text-xs font-semibold text-gray-300 block">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Credit Card / Stripe', 'USDT Crypto (TRC20)', 'UPI Instant', 'Bank Wire'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                        paymentMethod === m
                          ? 'border-ember-500 bg-ember-500/10 text-white'
                          : 'border-white/10 bg-void-950/60 text-gray-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCheckoutProduct(null)}
                  className="flex-1 text-xs border-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="flex-1 bg-ember-gradient font-bold text-white text-xs shadow-lg shadow-ember-500/20"
                >
                  {isProcessing ? 'Processing Order...' : `Confirm & Pay $${checkoutProduct.price}`}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
