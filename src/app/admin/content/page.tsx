'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Save, Plus, Edit2, CheckCircle2, MessageSquare } from 'lucide-react'
import { INITIAL_BLOG_POSTS, BlogPost } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

export default function AdminContentPage() {
  const [heroTitle, setHeroTitle] = useState('Master Your Edge. Journal, Analyze & Conquer Financial Markets.')
  const [heroSubhead, setHeroSubhead] = useState('The institutional-grade trading journal engineered for forex, gold, and crypto traders. Real-time statistical analytics, candle-by-candle replay backtesting, and AI emotional audits.')
  const [announcement, setAnnouncement] = useState('🚀 Phase 1 Live: MT4/MT5 CSV History Import & Candle Replay Simulator now available for Pro traders!')

  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS)
  const [newTitle, setNewTitle] = useState('')
  const [newExcerpt, setNewExcerpt] = useState('')
  const [newContent, setNewContent] = useState('')

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Homepage hero copy & announcement banner updated!')
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const post: BlogPost = {
      id: `blog-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: newExcerpt,
      content: newContent,
      cover_url: '/logo.png',
      author: 'Eagle Chief Editor',
      is_published: true,
      published_at: new Date().toISOString().split('T')[0],
    }
    setPosts([post, ...posts])
    setNewTitle('')
    setNewExcerpt('')
    setNewContent('')
    toast.success('New blog post published!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          Content Management & CMS
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Edit homepage headline copy, announcement alert bars, and publish market research blog articles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Homepage Hero & Announcement Copy */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-ember-400" />
            Homepage Copy & Banner
          </h2>

          <form onSubmit={handleSaveHero} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ann" className="text-xs">Top Announcement Alert Bar</Label>
              <Input
                id="ann"
                value={announcement}
                onChange={e => setAnnouncement(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="htitle" className="text-xs">Hero Main Headline</Label>
              <Textarea
                id="htitle"
                value={heroTitle}
                onChange={e => setHeroTitle(e.target.value)}
                className="text-xs h-20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hsub" className="text-xs">Hero Subtitle</Label>
              <Textarea
                id="hsub"
                value={heroSubhead}
                onChange={e => setHeroSubhead(e.target.value)}
                className="text-xs h-24"
              />
            </div>

            <Button type="submit" size="sm" className="font-bold glow-ember-sm gap-1.5 text-xs">
              <Save className="w-3.5 h-3.5" />
              Save Homepage Copy
            </Button>
          </form>
        </div>

        {/* Blog Post Publisher */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Publish New Blog Post
          </h2>

          <form onSubmit={handleCreatePost} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="btitle" className="text-xs">Article Title *</Label>
              <Input
                id="btitle"
                placeholder="e.g. 5 Habits of Highly Profitable Gold Traders"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                className="text-xs font-semibold"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="bexcerpt" className="text-xs">Short Excerpt / Meta Description</Label>
              <Input
                id="bexcerpt"
                placeholder="Brief 1-2 sentence preview"
                value={newExcerpt}
                onChange={e => setNewExcerpt(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="bcontent" className="text-xs">Article Markdown Content</Label>
              <Textarea
                id="bcontent"
                placeholder="Write your article in Markdown..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                className="text-xs h-32"
              />
            </div>

            <Button type="submit" size="sm" className="w-full font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Publish Article Live
            </Button>
          </form>
        </div>
      </div>

      {/* Published Posts Overview */}
      <div className="glass rounded-3xl p-6 border border-white/5 space-y-3">
        <h3 className="text-sm font-bold text-white">Live Blog Articles ({posts.length})</h3>
        <div className="divide-y divide-white/5">
          {posts.map(post => (
            <div key={post.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{post.title}</div>
                <div className="text-[10px] text-gray-500 font-mono">
                  Slug: /{post.slug} • Published {post.published_at}
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">
                Published
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
