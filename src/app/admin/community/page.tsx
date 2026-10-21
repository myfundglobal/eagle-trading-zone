'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Trash2, VolumeX, Shield, CheckCircle } from 'lucide-react'
import { INITIAL_MESSAGES, CommunityMessage } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function AdminCommunityPage() {
  const [messages, setMessages] = useState<CommunityMessage[]>(INITIAL_MESSAGES)

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id))
    toast.success('Message deleted by moderator.')
  }

  const handleMuteUser = (userName: string) => {
    toast.success(`User "${userName}" has been muted for 24 hours.`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          Community Chat Moderation
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Review live trader messages across all rooms, remove violating content and mute abusive accounts
        </p>
      </div>

      <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Recent Chat Activity ({messages.length} messages)
        </div>

        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="p-4 rounded-2xl bg-void-900 border border-white/5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{msg.user_name}</span>
                  <span className="text-[10px] font-mono text-gray-500 bg-void-800 px-1.5 py-0.2 rounded">
                    #{msg.room_id}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {format(new Date(msg.created_at), 'MMM dd, HH:mm')}
                  </span>
                </div>
                <p className="text-xs text-gray-300">{msg.content}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMuteUser(msg.user_name)}
                  className="h-8 text-xs text-amber-400 border-amber-500/30 gap-1"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  Mute
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="h-8 text-xs gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
