'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-24 bg-void-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-ember-gradient opacity-5" />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(229,38,26,0.1) 0%, transparent 70%)',
      }} />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-8">
            <Image src="/logo.png" alt="Eagle" width={80} height={80} className="animate-glow-pulse" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Ready to Trade Like an Eagle?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of traders who have already improved their performance with Eagle Trading Zone FX Book. Start free, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="xl" className="gap-2 shadow-ember-lg">
                Start Free Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="glass" size="xl">View Pricing</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
