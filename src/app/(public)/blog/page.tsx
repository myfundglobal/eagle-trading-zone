'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, ArrowRight, User } from 'lucide-react'
import { INITIAL_BLOG_POSTS } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

export default function BlogListingPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-void-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ember-500/10 border border-ember-500/30 text-ember-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Trading Education & Edge
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Eagle Trading Zone <span className="text-gradient">Insights</span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Quantitative research, emotional discipline breakdowns, and high-probability session strategies from professional prop traders.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_BLOG_POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-3xl overflow-hidden border border-white/5 hover:border-ember-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/9] bg-gradient-to-br from-void-900 via-ember-950/20 to-void-950 flex items-center justify-center p-6 border-b border-white/5">
                  <Image
                    src={post.cover_url || '/logo.png'}
                    alt={post.title}
                    width={80}
                    height={80}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-ember-500/10 blur-xl pointer-events-none" />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-ember-400" />
                      {post.published_at}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-white group-hover:text-ember-400 transition-colors leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-ember-400 hover:text-white justify-between px-0">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
