'use client'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export function FeaturesHero() {
  return (
    <section className="relative py-24 bg-void-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,38,26,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ember-500/10 border border-ember-500/20 text-ember-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Platform Features</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Tools Built for <span className="text-gradient">Edge</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every feature in Eagle Trading Zone FX Book exists for one purpose — to help you find your edge, refine it, and execute it consistently.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
