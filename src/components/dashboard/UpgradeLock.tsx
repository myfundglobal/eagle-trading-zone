'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Lock, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UpgradeLockProps {
  title: string
  description: string
  requiredPlan: 'pro' | 'elite'
  benefits: string[]
}

export function UpgradeLock({
  title,
  description,
  requiredPlan,
  benefits,
}: UpgradeLockProps) {
  const isElite = requiredPlan === 'elite'

  return (
    <div className="relative min-h-[550px] rounded-3xl overflow-hidden glass border border-white/10 flex items-center justify-center p-6 md:p-12 text-center">
      {/* Background glowing effects */}
      <div className="absolute inset-0 bg-void-950/80 backdrop-blur-md" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-ember-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-glow/15 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-xl mx-auto space-y-6"
      >
        {/* Eagle Logo with Glowing Lock */}
        <div className="relative inline-flex items-center justify-center">
          <div className="relative w-20 h-20 rounded-2xl glass flex items-center justify-center border border-ember-500/30 glow-ember">
            <Image
              src="/logo.png"
              alt="Eagle Trading Zone"
              width={52}
              height={52}
              className="opacity-90"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-ember-gradient flex items-center justify-center text-white shadow-lg">
              <Lock className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Title & Badge */}
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
            isElite 
              ? 'bg-amber-glow/20 text-amber-glow border border-amber-glow/30' 
              : 'bg-ember-500/20 text-ember-400 border border-ember-500/30'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            {requiredPlan.toUpperCase()} TIER REQUIRED
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Unlock {title}
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            {description}
          </p>
        </div>

        {/* Feature List */}
        <div className="glass-dark rounded-2xl p-4 md:p-5 text-left border border-white/5 space-y-2.5">
          <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            What you get with {isElite ? 'Elite Master' : 'Pro Trader'}:
          </div>
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-3 h-3" />
              </div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Upgrade CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/dashboard/subscription" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-sm font-bold glow-ember">
              <Zap className="w-4 h-4" />
              Upgrade to {isElite ? 'Elite' : 'Pro'} Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/pricing" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto text-sm text-gray-400 hover:text-white">
              Compare All Plans
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
