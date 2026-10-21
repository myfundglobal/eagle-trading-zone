'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ArrowLeft, Calendar, User, Share2, BookOpen } from 'lucide-react'
import { INITIAL_BLOG_POSTS } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

export default function BlogPostReaderPage() {
  const params = useParams()
  const slug = params?.slug as string

  const post = INITIAL_BLOG_POSTS.find(p => p.slug === slug) || INITIAL_BLOG_POSTS[0]

  return (
    <div className="min-h-screen pt-24 pb-20 bg-void-950">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-gray-400 hover:text-white px-0">
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Button>
        </Link>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-1.5 text-ember-400">
              <Calendar className="w-3.5 h-3.5" />
              {post.published_at}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <User className="w-3.5 h-3.5" />
              {post.author}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {post.title}
          </h1>

          <p className="text-base text-gray-400 leading-relaxed italic border-l-2 border-ember-500 pl-4 py-1">
            {post.excerpt}
          </p>
        </div>

        {/* Cover Image banner */}
        <div className="relative aspect-[2/1] rounded-3xl overflow-hidden glass border border-white/10 flex items-center justify-center bg-gradient-to-br from-void-900 to-ember-950/20">
          <Image
            src={post.cover_url || '/logo.png'}
            alt={post.title}
            width={120}
            height={120}
            className="opacity-90"
          />
          <div className="absolute inset-0 bg-ember-500/10 blur-2xl pointer-events-none" />
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none text-gray-300 space-y-4 leading-relaxed text-sm sm:text-base">
          <div className="whitespace-pre-line leading-relaxed">
            {post.content}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="glass rounded-3xl p-8 border border-ember-500/30 text-center space-y-4 mt-12 bg-gradient-to-r from-void-900 via-ember-950/30 to-void-900">
          <h3 className="text-lg font-bold text-white">Start Journaling Your Trades Today</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Stop guessing why your account is leaking money. Let Eagle FX Book audit your executions, psychology, and risk.
          </p>
          <Link href="/signup">
            <Button size="lg" className="font-bold glow-ember">
              Create Free Trader Account
            </Button>
          </Link>
        </div>
      </article>
    </div>
  )
}
