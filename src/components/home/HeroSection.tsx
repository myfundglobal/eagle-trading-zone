'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  ShoppingBag,
  BookOpen,
  LineChart,
  Flame,
} from 'lucide-react'

// Ember particle component
function EmberParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: 0,
        background: `radial-gradient(circle, #FF6A00, #E5261A)`,
      }}
      animate={{
        y: [-20, -400 - Math.random() * 300],
        x: [0, (Math.random() - 0.5) * 100],
        opacity: [0, 0.8, 0],
        scale: [0.5, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay,
        ease: 'easeOut',
      }}
    />
  )
}

// Candlestick visual element
function CandlestickElement() {
  const candles = [
    { height: 50, wickTop: 15, wickBottom: 10, isGreen: true },
    { height: 35, wickTop: 8, wickBottom: 12, isGreen: false },
    { height: 75, wickTop: 20, wickBottom: 15, isGreen: true },
    { height: 40, wickTop: 12, wickBottom: 25, isGreen: false },
    { height: 95, wickTop: 18, wickBottom: 10, isGreen: true },
    { height: 60, wickTop: 15, wickBottom: 8, isGreen: true },
    { height: 30, wickTop: 10, wickBottom: 15, isGreen: false },
    { height: 85, wickTop: 22, wickBottom: 18, isGreen: true },
  ]

  return (
    <div className="relative p-4 rounded-2xl bg-void-900/80 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden max-w-sm w-full">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-3 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white font-mono">XAUUSD • Gold M15</span>
        </div>
        <span className="text-emerald-400 font-mono font-bold">$2,418.60 (+1.42%)</span>
      </div>

      {/* Candlesticks row */}
      <div className="h-32 flex items-end justify-between px-3 gap-2 relative">
        {/* FVG Imbalance Box */}
        <div className="absolute top-8 left-16 right-20 h-10 border border-dashed border-amber-glow/60 bg-amber-glow/10 rounded pointer-events-none flex items-center justify-end pr-2">
          <span className="text-[9px] font-mono text-amber-glow font-bold uppercase tracking-wider">
            FVG Liquidity Void
          </span>
        </div>

        {candles.map((c, i) => (
          <motion.div
            key={i}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '100%', opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center justify-end h-full flex-1"
          >
            {/* Top Wick */}
            <div
              className={`w-[1.5px] ${c.isGreen ? 'bg-emerald-400' : 'bg-red-500'}`}
              style={{ height: `${c.wickTop}px` }}
            />
            {/* Candle Body */}
            <motion.div
              animate={{
                scaleY: [1, 1.04, 0.98, 1],
              }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`w-full max-w-[14px] rounded-sm ${
                c.isGreen
                  ? 'bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-t from-red-600 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
              }`}
              style={{ height: `${c.height}px` }}
            />
            {/* Bottom Wick */}
            <div
              className={`w-[1.5px] ${c.isGreen ? 'bg-emerald-400' : 'bg-red-500'}`}
              style={{ height: `${c.wickBottom}px` }}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
        <span>Order Block Tap Confirmed</span>
        <span className="text-ember-400 font-bold">Smart Money Algorithm</span>
      </div>
    </div>
  )
}

export function HeroSection() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 4,
    x: Math.random() * 100,
    size: Math.random() * 6 + 2,
  }))

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-void-950">
      {/* Background glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full bg-ember-500/10 blur-[140px]" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-glow/10 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-red-600/10 blur-[100px]" />

        {/* Candlestick & Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(229,38,26,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(229,38,26,0.15) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Ember particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <EmberParticle key={p.id} delay={p.delay} x={p.x} size={p.size} />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: Content (7 cols) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ember-500/15 border border-ember-500/30 text-ember-400 text-xs sm:text-sm font-semibold mb-6 shadow-glow">
                <Flame className="w-4 h-4 text-amber-glow animate-pulse" />
                <span>Trading Platform • Digital Marketplace • Trade Journal</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                <span className="text-white">Master Markets With</span>{' '}
                <span className="text-gradient">Eagle Precision</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
                The unified ecosystem for elite forex, gold, and crypto traders. Log your executions in a professional journal, enroll in institutional courses, run high-performance MT5 algorithmic software, and get verified answers in our admin-moderated community.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/signup">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto gap-2 bg-gradient-to-r from-ember-600 via-ember-500 to-amber-glow text-white font-bold shadow-xl shadow-ember-500/30 hover:shadow-ember-500/50"
                  >
                    Start Free Journal Today
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#marketplace">
                  <Button
                    variant="glass"
                    size="xl"
                    className="w-full sm:w-auto gap-2 border-white/10 hover:border-ember-500/40 text-gray-200 hover:text-white"
                  >
                    <ShoppingBag className="w-5 h-5 text-ember-400" />
                    Browse Courses & EAs
                  </Button>
                </Link>
              </div>

              {/* Candlestick preview widget */}
              <div className="pt-2">
                <CandlestickElement />
              </div>
            </motion.div>
          </div>

          {/* Right: Eagle Logo with Glowing Radial Aura (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Outer pulsing glow rings */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-ember-500/25 blur-[90px]"
              />
              <motion.div
                animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.2, 0.45, 0.2] }}
                transition={{ duration: 4.5, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-amber-glow/20 blur-[70px]"
              />

              {/* Floating brand eagle */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px]">
                  <Image
                    src="/logo.png"
                    alt="Eagle Trading Zone Brand Logo"
                    fill
                    className="object-contain drop-shadow-[0_0_35px_rgba(229,38,26,0.6)]"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-void-950 to-transparent pointer-events-none" />
    </section>
  )
}
