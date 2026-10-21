'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Download,
  PlayCircle,
  ExternalLink,
  BookOpen,
  Cpu,
  CheckCircle2,
  Key,
  Copy,
  FileText,
  ShieldCheck,
  Video,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePurchasesStore, useProductsStore } from '@/lib/store'
import { Product } from '@/lib/mock-data'
import toast from 'react-hot-toast'

export default function MyPurchasesPage() {
  const { purchasedProducts } = usePurchasesStore()
  const { products, purchaseProduct } = useProductsStore()
  const [activeCourse, setActiveCourse] = useState<Product | null>(null)
  const [activeSoftware, setActiveSoftware] = useState<Product | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    toast.success('License key copied to clipboard!')
    setTimeout(() => setCopiedKey(null), 2500)
  }

  const handleDownload = (product: Product) => {
    toast.success(`Downloading "${product.title}" installation package...`, {
      icon: '⬇️',
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-ember-400" />
            My Purchases & Digital Library
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Access your purchased trading courses, video modules, and download your licensed MT5 Expert Advisors (EAs).
          </p>
        </div>

        <Link href="/#marketplace">
          <Button variant="outline" size="sm" className="border-white/10 hover:border-ember-500/40 text-xs">
            Browse Full Marketplace
          </Button>
        </Link>
      </div>

      {/* Purchases Grid */}
      {purchasedProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-void-900/40 border border-white/5">
          <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Digital Products Purchased Yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
            Enroll in institutional smart money courses or download automated MT5 algorithmic bots from the Eagle marketplace.
          </p>
          <Link href="/#marketplace">
            <Button className="bg-ember-gradient font-bold text-xs text-white">
              Explore Available Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedProducts.map((product) => {
            const isCourse = product.type === 'Course'
            const licenseKey = `ETZ-${product.id.slice(0, 8).toUpperCase()}-2026-ACTIVE`

            return (
              <div
                key={product.id}
                className="relative flex flex-col rounded-2xl bg-void-900/70 border border-white/10 overflow-hidden shadow-xl hover:border-ember-500/40 transition-all duration-300"
              >
                {/* Glow accent bar */}
                <div className={`h-1.5 w-full ${isCourse ? 'bg-blue-500' : 'bg-gradient-to-r from-ember-500 to-amber-glow'}`} />

                <div className="p-6 flex-1 flex flex-col">
                  {/* Badge & Type */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isCourse
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : 'bg-ember-500/15 text-ember-400 border border-ember-500/30'
                      }`}
                    >
                      {isCourse ? <BookOpen className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
                      {product.type}
                    </span>

                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Active License
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {product.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">
                    {product.description}
                  </p>

                  {/* License Key Box for Software */}
                  {!isCourse && (
                    <div className="p-2.5 rounded-xl bg-void-950 border border-white/10 mb-4">
                      <div className="text-[10px] text-gray-500 uppercase font-semibold flex items-center justify-between">
                        <span>MT5 License Key</span>
                        <button
                          onClick={() => handleCopyKey(licenseKey)}
                          className="text-ember-400 hover:text-white flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedKey === licenseKey ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <div className="font-mono text-xs font-bold text-gray-200 mt-1 select-all">
                        {licenseKey}
                      </div>
                    </div>
                  )}

                  {/* Course Modules preview for Course */}
                  {isCourse && (
                    <div className="space-y-1.5 mb-4 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <Video className="w-3.5 h-3.5 text-blue-400" />
                        <span>18 Video Modules • 1080p HD</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>PDF Workbooks & Checklists included</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
                    {isCourse ? (
                      <Button
                        onClick={() => setActiveCourse(product)}
                        className="w-full gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Access Course & Watch
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          handleDownload(product)
                          setActiveSoftware(product)
                        }}
                        className="w-full gap-2 bg-ember-gradient hover:opacity-95 text-white font-bold text-xs shadow-md shadow-ember-500/20"
                      >
                        <Download className="w-4 h-4" />
                        Download Software (.ex5)
                      </Button>
                    )}

                    <a
                      href={product.download_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-[11px] text-gray-400 hover:text-ember-400 transition-colors py-1"
                    >
                      Direct Download Mirror
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Course Portal Modal */}
      <AnimatePresence>
        {activeCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl rounded-2xl bg-void-900 border border-white/10 p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-bold text-white">Course Player Portal</span>
                </div>
                <button
                  onClick={() => setActiveCourse(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <h2 className="text-xl font-bold text-white mb-2">{activeCourse.title}</h2>
              <p className="text-xs text-gray-400 mb-6">{activeCourse.description}</p>

              {/* Simulated Video Player */}
              <div className="aspect-video w-full rounded-xl bg-void-950 border border-white/10 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden mb-6 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-void-950 to-transparent opacity-80" />
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-blue-400" />
                </div>
                <div className="relative z-10 mt-3 text-sm font-bold text-white">
                  Lesson 1: Institutional Liquidity Pools & Market Maker Algorithms
                </div>
                <span className="relative z-10 text-[11px] text-gray-400">Duration: 42 mins • 1080p 60fps</span>
              </div>

              {/* Module List */}
              <div className="space-y-2 mb-6">
                <div className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Curriculum Modules:
                </div>
                {[
                  { title: 'Module 1: Market Structure & Swing High/Low Breakouts', time: '38 min', done: true },
                  { title: 'Module 2: Identifying Fair Value Gaps (FVG) and Imbalances', time: '45 min', done: true },
                  { title: 'Module 3: London & New York Session Open Timing', time: '52 min', done: false },
                  { title: 'Module 4: Institutional Risk Management & 1:3 R:R Sizing', time: '36 min', done: false },
                  { title: 'Module 5: Live Execution Replays & Trade Journal Audits', time: '64 min', done: false },
                ].map((mod, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-void-950 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <span className="text-gray-200 font-medium">{mod.title}</span>
                    </div>
                    <span className="text-gray-500 font-mono">{mod.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <Button
                  onClick={() => setActiveCourse(null)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Close Course Portal
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
