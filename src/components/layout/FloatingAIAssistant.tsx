'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Minimize2,
  Maximize2,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  text: string
  time: string
}

const QUICK_SUGGESTIONS = [
  'How to calculate position size?',
  'Explain Fair Value Gaps (FVG)',
  'How to log a trade in Journal?',
  'Where are my purchased courses?',
  'What is the 1% risk rule?',
]

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: 'Greetings, trader! I am your Eagle Trading Zone AI Assistant powered by Gemini. Ask me about trading basics, lot sizing, risk rules, or navigating your journal and courses.',
      time: 'Just now',
    },
  ])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text || loading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      const data = await res.json()
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'I am ready to help you trade with precision.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages(prev => [...prev, aiReply])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'I am always available to guide your trading. For position sizing, use the calculator tool on your dashboard.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-3.5 rounded-full bg-void-950 border border-ember-500/40 shadow-2xl shadow-ember-500/30 flex items-center justify-center cursor-pointer overflow-hidden"
          aria-label="Open AI Trading Assistant"
        >
          {/* Pulsing neon radial flare */}
          <div className="absolute inset-0 bg-ember-gradient opacity-20 group-hover:opacity-40 transition-opacity blur-md" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-void-950 animate-pulse z-10" />

          <div className="relative z-10 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Eagle AI"
              width={32}
              height={32}
              className="object-contain drop-shadow-[0_0_8px_rgba(229,38,26,0.8)]"
            />
          </div>
        </motion.button>
      </div>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] rounded-2xl bg-void-950 border border-ember-500/30 shadow-2xl shadow-black/80 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-void-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full bg-ember-500/20 border border-ember-500/40 flex items-center justify-center overflow-hidden">
                  <Image src="/logo.png" alt="Eagle AI" fill className="object-contain p-0.5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-1.5">
                    <span>Eagle AI Mentor</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-glow/20 text-amber-glow border border-amber-glow/30">
                      Gemini
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online & Ready
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: 'reset-msg',
                        sender: 'ai',
                        text: 'Chat history cleared. How can I assist your trading today?',
                        time: 'Just now',
                      },
                    ])
                  }
                  className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-ember-500/20 border border-ember-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-ember-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-ember-gradient text-white rounded-br-xs font-medium'
                        : 'bg-void-900 border border-white/10 text-gray-200 rounded-bl-xs shadow-md whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-void-800 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 items-center text-gray-400 text-xs italic">
                  <div className="w-6 h-6 rounded-full bg-ember-500/20 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-ember-400 animate-spin" />
                  </div>
                  <span>Eagle AI is analyzing market logic...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-3 py-2 bg-void-900/40 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug)}
                  className="px-2.5 py-1 rounded-full text-[10px] bg-void-900 border border-white/10 text-gray-400 hover:text-ember-300 hover:border-ember-500/40 whitespace-nowrap transition-colors shrink-0"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={e => {
                e.preventDefault()
                handleSend()
              }}
              className="p-3 bg-void-900 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about lot size, FVG, journal, or courses..."
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 bg-void-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-ember-500"
              />
              <Button
                type="submit"
                size="sm"
                disabled={loading || !input.trim()}
                className="h-8 w-8 p-0 bg-ember-gradient text-white rounded-xl shadow-md shadow-ember-500/20 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
