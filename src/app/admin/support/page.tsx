'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LifeBuoy, Mail, CheckCircle2, Reply, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

interface Ticket {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
  status: 'open' | 'replied'
  reply?: string
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 't-1',
      name: 'Rajesh Kumar',
      email: 'rajesh.trader@gmail.com',
      subject: 'Query regarding UPI activation time',
      message: 'Hello team, I transferred Rs 1,600 via GPay and submitted UTR 482910492812. How long does approval take?',
      date: 'Today at 10:30 AM',
      status: 'open',
    },
    {
      id: 't-2',
      name: 'Alexandre Dubois',
      email: 'alex.fx@protonmail.com',
      subject: 'Can I export MT5 tick data?',
      message: 'Does the CSV importer accept tick-by-tick exports or only 1-minute candle bars?',
      date: 'Yesterday at 04:15 PM',
      status: 'replied',
      reply: 'Hi Alexandre, our MT5 CSV parser works seamlessly with closed trade history reports. Tick data backtesting will be released in Phase 2!',
    },
  ])

  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const handleSendReply = (ticketId: string) => {
    if (!replyText.trim()) return
    setTickets(prev =>
      prev.map(t =>
        t.id === ticketId ? { ...t, status: 'replied', reply: replyText } : t
      )
    )
    toast.success('Reply sent to customer email!')
    setReplyingId(null)
    setReplyText('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          Support Inbox & Customer Inquiries
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          View and respond to inquiries submitted through the public Contact page
        </p>
      </div>

      <div className="space-y-4">
        {tickets.map((t) => (
          <div key={t.id} className="glass rounded-3xl p-6 border border-white/5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">{t.subject}</h2>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    t.status === 'open'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  From: <strong>{t.name}</strong> ({t.email}) • {t.date}
                </div>
              </div>

              {t.status === 'open' && (
                <Button
                  size="sm"
                  onClick={() => setReplyingId(replyingId === t.id ? null : t.id)}
                  className="gap-1.5 text-xs font-bold glow-ember-sm"
                >
                  <Reply className="w-3.5 h-3.5" />
                  Reply
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-void-900/60 p-3.5 rounded-xl border border-white/5">
              {t.message}
            </p>

            {t.reply && (
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Administrator Reply:
                </div>
                <p className="text-gray-300">{t.reply}</p>
              </div>
            )}

            {replyingId === t.id && (
              <div className="pt-2 space-y-3">
                <Textarea
                  placeholder={`Write your response to ${t.email}...`}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="text-xs h-24"
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setReplyingId(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleSendReply(t.id)} className="gap-1.5 font-bold glow-ember-sm">
                    <Send className="w-3.5 h-3.5" />
                    Send Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
