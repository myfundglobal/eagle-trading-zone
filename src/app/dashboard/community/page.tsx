'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  PlusCircle,
  ShieldCheck,
  Lock,
  MessageSquare,
  Image as ImageIcon,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Sparkles,
  UserCheck,
  Eye,
  Paperclip,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCommunityQAStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { CommunityQA } from '@/lib/mock-data'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const SAMPLE_CHART_PRESETS = [
  {
    name: 'XAUUSD 15M FVG Tap Chart',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&auto=format&fit=crop',
  },
  {
    name: 'EURUSD Asian Liquidity Sweep',
    url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=900&auto=format&fit=crop',
  },
  {
    name: 'Institutional Order Block Entry',
    url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&auto=format&fit=crop',
  },
]

export default function CommunityQAPage() {
  const { posts, addQuestion, replyAsAdmin, deletePost } = useCommunityQAStore()
  const { user, isAdmin } = useAuth()

  // Modals & States
  const [askModalOpen, setAskModalOpen] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [category, setCategory] = useState('Price Action & Candlesticks')

  // Replying state (Admin only)
  const [replyingPostId, setReplyingPostId] = useState<string | null>(null)
  const [adminReplyText, setAdminReplyText] = useState('')
  const [adminAttachmentUrl, setAdminAttachmentUrl] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  // Chart lightbox modal
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Filter
  const [filter, setFilter] = useState<'ALL' | 'Answered' | 'Open'>('ALL')

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionText.trim()) {
      toast.error('Question text cannot be empty.')
      return
    }

    const res = addQuestion({
      question_text: questionText,
      category,
    })

    if (res.success) {
      setQuestionText('')
      setAskModalOpen(false)
    }
  }

  const handleAdminSubmitReply = (postId: string) => {
    if (!isAdmin && user?.role !== 'admin') {
      toast.error('Permission Denied: Only Eagle Trading Zone Admins can post replies!')
      return
    }

    if (!adminReplyText.trim()) {
      toast.error('Please enter the reply text.')
      return
    }

    const res = replyAsAdmin(postId, {
      reply_text: adminReplyText,
      attachment_url: adminAttachmentUrl,
    })

    if (res.success) {
      setReplyingPostId(null)
      setAdminReplyText('')
      setAdminAttachmentUrl('')
      setSelectedPreset(null)
    }
  }

  const filteredPosts = posts.filter(p => {
    if (filter === 'ALL') return true
    return p.status === filter
  })

  return (
    <div className="space-y-8">
      {/* Header & Role Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-ember-500/15 text-ember-400 border border-ember-500/30 uppercase tracking-wider">
              Admin-Controlled Community
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400 font-mono">Permission Enforced</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <HelpCircle className="w-7 h-7 text-ember-400" />
            Community Q&A Forum
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Any registered trader can submit questions. To protect community integrity, replies and chart attachments are strictly authored by Eagle Trading Zone verified administrators.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <div className="p-1.5 px-3 rounded-xl bg-amber-glow/10 border border-amber-glow/30 flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-glow">👑 Admin Moderation Mode</span>
            </div>
          )}

          <Button
            onClick={() => setAskModalOpen(true)}
            className="gap-2 bg-ember-gradient hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-ember-500/25"
          >
            <PlusCircle className="w-4 h-4" />
            Ask Question
          </Button>
        </div>
      </div>

      {/* Security Rule Notice Banner */}
      <div className="p-4 rounded-xl bg-void-900/80 border border-ember-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5 text-gray-300">
          <ShieldCheck className="w-5 h-5 text-ember-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong className="text-white">Admin-Only Moderation Protocol:</strong> Public answers are disabled to prevent retail misinformation. Only verified Admins can attach chart screenshots or publish replies.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {(['ALL', 'Answered', 'Open'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === tab
                  ? 'bg-ember-gradient text-white'
                  : 'bg-void-950 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {tab === 'ALL' ? `All (${posts.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Community Posts List */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-void-900/40 border border-white/5 text-gray-500">
            No questions found in this filter.
          </div>
        ) : (
          filteredPosts.map(post => {
            const isAnswered = post.status === 'Answered'
            const isCurrentlyReplying = replyingPostId === post.id

            return (
              <motion.div
                key={post.id}
                layout
                className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl ${
                  isAnswered
                    ? 'bg-void-900/70 border-white/10 hover:border-ember-500/40'
                    : 'bg-void-900/40 border-amber-glow/20'
                }`}
              >
                {/* Post Top Metadata Bar */}
                <div className="p-5 sm:p-6 pb-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-void-950 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300 overflow-hidden relative">
                      {post.user_avatar ? (
                        <Image src={post.user_avatar} alt={post.user_name} fill unoptimized className="object-cover" />
                      ) : (
                        post.user_name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{post.user_name}</span>
                        <span className="font-mono text-[10px] text-gray-500">({post.id})</span>
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Asked on {format(new Date(post.created_at), 'PPP p')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-gray-300 border border-white/10">
                      {post.category}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isAnswered
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-glow/10 text-amber-glow border-amber-glow/30'
                      }`}
                    >
                      {isAnswered ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Answered
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          Pending Admin Reply
                        </>
                      )}
                    </span>

                    {/* Admin Delete Action */}
                    {isAdmin && (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors"
                        title="Delete Post (Admin)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Question Body */}
                <div className="p-5 sm:p-6 text-sm text-gray-200 leading-relaxed font-sans">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-ember-400" />
                    Question:
                  </div>
                  <p className="whitespace-pre-line">{post.question_text}</p>
                </div>

                {/* OFFICIAL ADMIN ANSWER SECTION */}
                {isAnswered && post.admin_reply_text && (
                  <div className="m-4 sm:m-6 mt-0 p-5 rounded-2xl bg-void-950 border border-ember-500/30 relative overflow-hidden shadow-2xl">
                    {/* Glowing left accent border */}
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-ember-500 via-amber-glow to-ember-600" />

                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-ember-500/20 border border-ember-500/40 flex items-center justify-center overflow-hidden relative">
                          <Image src="/logo.png" alt="Admin" fill className="object-contain p-0.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{post.admin_name || 'Eagle Head Trader (Admin)'}</span>
                            <span className="px-1.5 py-0.2 rounded bg-ember-500/20 text-ember-400 text-[9px] font-bold tracking-wider uppercase border border-ember-500/40">
                              Admin Verified
                            </span>
                          </div>
                          {post.replied_at && (
                            <div className="text-[10px] text-gray-500">
                              Answered {format(new Date(post.replied_at), 'PPP p')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-[11px] font-semibold text-ember-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Official Technical Analysis
                      </div>
                    </div>

                    {/* Admin Reply Content */}
                    <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line mb-4 font-sans">
                      {post.admin_reply_text}
                    </div>

                    {/* Admin Attachment (Chart Screenshot) */}
                    {post.admin_attachment_url && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-glow" />
                          Instructor Chart Attachment & Breakdown:
                        </div>
                        <div
                          onClick={() => setLightboxImage(post.admin_attachment_url)}
                          className="relative h-56 sm:h-72 w-full rounded-xl overflow-hidden border border-white/10 group cursor-pointer bg-void-900"
                        >
                          <Image
                            src={post.admin_attachment_url}
                            alt="Admin Chart Analysis"
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-xs">
                            <Eye className="w-4 h-4" />
                            Click to View High-Res Chart
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* IF NOT ANSWERED */}
                {!isAnswered && (
                  <div className="p-4 sm:p-5 pt-0">
                    {isAdmin ? (
                      /* ADMIN CAN REPLY */
                      !isCurrentlyReplying ? (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                          <span className="text-amber-glow font-medium flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4" />
                            You are logged in as Admin. You have permission to post the official reply and attach charts.
                          </span>
                          <Button
                            size="sm"
                            onClick={() => {
                              setReplyingPostId(post.id)
                              setAdminReplyText('')
                              setAdminAttachmentUrl(SAMPLE_CHART_PRESETS[0].url)
                            }}
                            className="h-8 bg-ember-gradient font-bold text-xs text-white"
                          >
                            Reply as Admin
                          </Button>
                        </div>
                      ) : (
                        /* EXPANDED ADMIN REPLY FORM */
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-4 sm:p-5 rounded-2xl bg-void-950 border border-ember-500/40 space-y-4"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-white border-b border-white/10 pb-2">
                            <span className="flex items-center gap-2 text-ember-400">
                              <ShieldCheck className="w-4 h-4" />
                              Authoring Official Admin Response ({post.id})
                            </span>
                            <button
                              onClick={() => setReplyingPostId(null)}
                              className="text-gray-500 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs text-gray-300">
                              Official Admin Reply Text
                            </Label>
                            <Textarea
                              rows={4}
                              placeholder="Type institutional analysis, market structure recommendations, or EA setup advice..."
                              value={adminReplyText}
                              onChange={e => setAdminReplyText(e.target.value)}
                              className="bg-void-900 border-white/10 text-xs"
                            />
                          </div>

                          {/* Chart Attachment URL & Presets */}
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-300 flex items-center justify-between">
                              <span>Admin Chart Attachment / Image URL</span>
                              <span className="text-[10px] text-gray-500">PNG, JPG, or Screenshot Link</span>
                            </Label>
                            <Input
                              placeholder="https://... or select preset below"
                              value={adminAttachmentUrl}
                              onChange={e => setAdminAttachmentUrl(e.target.value)}
                              className="bg-void-900 border-white/10 text-xs"
                            />

                            {/* Preset Chart Quick Buttons */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] text-gray-500 font-semibold mr-1">Quick Charts:</span>
                              {SAMPLE_CHART_PRESETS.map(preset => (
                                <button
                                  key={preset.name}
                                  type="button"
                                  onClick={() => {
                                    setAdminAttachmentUrl(preset.url)
                                    setSelectedPreset(preset.name)
                                  }}
                                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 hover:bg-ember-500/20 text-gray-300 hover:text-ember-300 border border-white/5"
                                >
                                  {preset.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyingPostId(null)}
                              className="text-xs text-gray-400"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAdminSubmitReply(post.id)}
                              className="bg-ember-gradient font-bold text-xs text-white shadow-md shadow-ember-500/20 gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Publish Verified Admin Answer
                            </Button>
                          </div>
                        </motion.div>
                      )
                    ) : (
                      /* USER VIEW: REPLIES DISABLED */
                      <div className="p-3 rounded-xl bg-void-950 border border-white/5 flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-amber-glow/70" />
                          Replies are locked to Eagle Trading Zone Admins to guarantee expert accuracy.
                        </span>
                        <span className="text-[11px] text-amber-glow font-mono">
                          Review in progress...
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })
        )}
      </div>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {askModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-void-900 border border-white/10 p-6 sm:p-7 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-ember-400" />
                  <span className="text-sm font-bold text-white">Ask an Official Instructor</span>
                </div>
                <button
                  onClick={() => setAskModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-300 font-semibold">Topic Category</Label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-void-950 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-ember-500"
                  >
                    <option value="Price Action & Candlesticks">Price Action & Candlesticks</option>
                    <option value="Gold & Macro Strategy">Gold & Macro Strategy</option>
                    <option value="Software EA Settings">Software EA Settings</option>
                    <option value="Risk Management">Risk Management</option>
                    <option value="Course Curriculum Inquiry">Course Curriculum Inquiry</option>
                    <option value="Crypto & Market Structure">Crypto & Market Structure</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-300 font-semibold">Your Question</Label>
                  <Textarea
                    rows={5}
                    placeholder="Describe your technical question, market scenario, or software setup inquiry in detail..."
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                    required
                    className="bg-void-950 border-white/10 text-xs"
                  />
                </div>

                <div className="p-3 rounded-xl bg-ember-500/10 border border-ember-500/20 text-[11px] text-gray-400">
                  💡 Questions are publicly visible to the community, and an official Eagle Trading Zone Admin will reply with technical commentary and chart markup.
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAskModalOpen(false)}
                    className="text-xs border-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-ember-gradient font-bold text-white text-xs shadow-md shadow-ember-500/25"
                  >
                    Post Question
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chart Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh] w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full h-[80vh]">
                <Image src={lightboxImage} alt="Expanded Chart Analysis" fill unoptimized className="object-contain" />
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full border border-white/20"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
