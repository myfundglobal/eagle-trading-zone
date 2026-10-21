'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Newspaper,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  BookOpen,
  User,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { INITIAL_BLOG_POSTS, BlogPost } from '@/lib/mock-data'

export function MarketBlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  return (
    <section id="blog" className="py-24 relative bg-void-900/60 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ember-500/10 border border-ember-500/20 text-ember-400 text-xs font-semibold mb-4">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Eagle Intelligence Dispatch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Latest Market <span className="text-gradient">Blog & Analysis</span>
            </h2>
            <p className="text-gray-400 text-base max-w-xl mt-3">
              Institutional insights, macroeconomic breakdowns, and psychological edge to keep you ahead of central bank liquidity.
            </p>
          </div>

          <Link href="/blog">
            <Button variant="outline" className="border-white/10 text-white hover:border-ember-500/40 gap-2 text-xs">
              View All Dispatches
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {INITIAL_BLOG_POSTS.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              onClick={() => setSelectedPost(post)}
              className="cursor-pointer group flex flex-col rounded-2xl bg-void-950 border border-white/10 hover:border-ember-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-ember-500/10 overflow-hidden"
            >
              {/* Cover Image with neon overlay */}
              <div className="relative h-48 w-full overflow-hidden bg-void-900">
                <Image
                  src={post.cover_url}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/40 to-transparent" />
                
                {/* Tag pill */}
                <div className="absolute top-4 left-4 flex gap-1.5">
                  {(post.tags || ['Market Analysis']).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-ember-500/80 text-white backdrop-blur-md shadow-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-ember-400" />
                      {post.published_at}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-ember-400" />
                      {post.read_time || '5 min read'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-ember-300 transition-colors leading-snug mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-ember-500/20 border border-ember-500/30 flex items-center justify-center text-[10px] font-bold text-ember-400">
                      ET
                    </div>
                    <span className="text-gray-400 text-[11px]">{post.author}</span>
                  </div>

                  <span className="text-ember-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read More
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-void-900 border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xs text-ember-400 font-bold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  Eagle Market Dispatch
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-400 hover:text-white text-base px-2 py-1 rounded-lg hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              <h2 className="text-2xl font-black text-white leading-tight mb-3">
                {selectedPost.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 pb-4 border-b border-white/5">
                <span>By {selectedPost.author}</span>
                <span>•</span>
                <span>{selectedPost.published_at}</span>
                <span>•</span>
                <span>{selectedPost.read_time || '5 min read'}</span>
              </div>

              <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {selectedPost.content}
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
                <Button
                  onClick={() => setSelectedPost(null)}
                  className="bg-ember-gradient text-white text-xs font-bold"
                >
                  Close Article
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
