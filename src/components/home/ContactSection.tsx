'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MessageSquare, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

export function ContactSection() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Message sent! We will get back to you soon.')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error('Failed')
      }
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 bg-void-950" id="contact">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-ember-400 text-sm font-semibold uppercase tracking-widest">Reach out</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">Contact Us</h2>
          <p className="text-gray-400 text-lg">Have a question? We&apos;d love to hear from you.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            {[
              { icon: Mail, label: 'Email', value: 'support@eagletradingzone.com' },
              { icon: MessageSquare, label: 'Discord/Telegram', value: '@EagleTradingZone' },
              { icon: Phone, label: 'Support Hours', value: 'Mon–Sat, 10am–6pm IST' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-ember-400/10">
                  <Icon className="w-5 h-5 text-ember-400" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{label}</p>
                  <p className="text-white font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="How can we help?"
                value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us more..."
                rows={5}
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full gap-2">
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
