'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Send, CheckCircle2, Users, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

export default function AdminNotificationsPage() {
  const [targetAudience, setTargetAudience] = useState<'all' | 'free' | 'pro' | 'elite'>('all')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [sentList, setSentList] = useState([
    {
      id: 'n-1',
      title: 'Weekend Maintenance Complete',
      message: 'All database indexing and MT4 CSV parsers have been updated.',
      target: 'All Traders',
      date: 'Oct 14, 2026',
    },
    {
      id: 'n-2',
      title: 'New AI Revenge Trading Model Deployed',
      message: 'Pro & Elite members now have access to updated psychological audit metrics.',
      target: 'Pro & Elite',
      date: 'Oct 16, 2026',
    },
  ])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return

    const newItem = {
      id: `n-${Date.now()}`,
      title,
      message,
      target: targetAudience.toUpperCase(),
      date: 'Just now',
    }
    setSentList([newItem, ...sentList])
    setTitle('')
    setMessage('')
    toast.success(`Broadcast sent to ${targetAudience.toUpperCase()} users!`)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          Global Broadcast Notifications
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Push system-wide announcements or targeted alerts to specific membership tiers
        </p>
      </div>

      {/* Broadcast Form */}
      <div className="glass rounded-3xl p-6 md:p-8 border border-white/5 space-y-5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-ember-400" />
          Compose Broadcast Alert
        </h2>

        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Target Audience</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'All Registered Traders' },
                { id: 'free', label: 'Free Tier Only' },
                { id: 'pro', label: 'Pro Subscribers' },
                { id: 'elite', label: 'Elite VIP Only' },
              ].map((aud) => (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setTargetAudience(aud.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    targetAudience === aud.id
                      ? 'bg-void-800 border-ember-500 text-white font-bold'
                      : 'border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ntitle" className="text-xs">Notification Subject *</Label>
            <Input
              id="ntitle"
              placeholder="e.g. Major Platform Upgrade: Candle Backtesting live"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="text-xs font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nmsg" className="text-xs">Notification Message *</Label>
            <Textarea
              id="nmsg"
              placeholder="Write announcement details..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              className="text-xs h-24"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" className="font-bold glow-ember gap-2 text-xs">
              <Send className="w-3.5 h-3.5" />
              Broadcast Notification to Users
            </Button>
          </div>
        </form>
      </div>

      {/* History */}
      <div className="glass rounded-3xl p-6 border border-white/5 space-y-3">
        <h3 className="text-sm font-bold text-white">Broadcast History</h3>
        <div className="divide-y divide-white/5">
          {sentList.map((item) => (
            <div key={item.id} className="py-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.title}</span>
                <span className="text-[10px] text-gray-500 font-mono">{item.date}</span>
              </div>
              <p className="text-xs text-gray-300">{item.message}</p>
              <div className="text-[10px] text-ember-400 font-mono">Audience: {item.target}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
