'use client'
import { motion } from 'framer-motion'
import { BookOpen, Lock } from 'lucide-react'

export function BlogPlaceholder() {
  return (
    <div className="min-h-screen pt-20 bg-void-950">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gradient mb-4">Trading Insights</h1>
          <p className="text-gray-400 text-lg">Expert articles, strategies and market analysis</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="h-48 bg-ember-gradient/10 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-ember-400/30" />
              </div>
              <div className="p-6">
                <div className="h-4 bg-void-700 rounded w-3/4 mb-3 animate-pulse" />
                <div className="h-3 bg-void-700 rounded w-full mb-2 animate-pulse" />
                <div className="h-3 bg-void-700 rounded w-5/6 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm italic">Blog posts are managed from Admin Panel → Content Manager</p>
        </div>
      </div>
    </div>
  )
}
