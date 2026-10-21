'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, ShieldAlert, Key, Globe, Mail, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('Eagle Trading Zone FX Book')
  const [tagline, setTagline] = useState('Master Your Edge. Journal, Analyze & Conquer Financial Markets.')
  const [supportEmail, setSupportEmail] = useState('support@eagletradingzone.com')
  const [telegram, setTelegram] = useState('https://t.me/eagletradingzone')
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // One-time admin setup helper
  const [adminEmail, setAdminEmail] = useState('')
  const [copiedQuery, setCopiedQuery] = useState(false)

  const sqlQuery = `UPDATE public.profiles SET role = 'admin' WHERE email = '${adminEmail || 'your-email@example.com'}';`

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlQuery)
    setCopiedQuery(true)
    toast.success('SQL query copied to clipboard!')
    setTimeout(() => setCopiedQuery(false), 2500)
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Site settings and branding updated!')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          Global Site Settings & Admin Security
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Configure site name, SEO metadata, community links, maintenance mode, and admin setup
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Settings Form */}
        <div className="glass rounded-3xl p-6 md:p-8 border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-ember-400" />
            General Branding & SEO
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="sname" className="text-xs">Platform Name</Label>
              <Input
                id="sname"
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className="text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="tag" className="text-xs">Site Tagline / Meta Description</Label>
              <Input
                id="tag"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="semail" className="text-xs">Support Email Address</Label>
              <Input
                id="semail"
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="tg" className="text-xs">Official Telegram Community URL</Label>
              <Input
                id="tg"
                value={telegram}
                onChange={e => setTelegram(e.target.value)}
                className="text-xs font-mono"
              />
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-void-900 border border-white/5">
                <div className="text-xs">
                  <div className="font-bold text-white">Maintenance Mode</div>
                  <div className="text-[10px] text-gray-500">Temporarily redirect non-admins to a maintenance screen</div>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
            </div>

            <div className="pt-3">
              <Button type="submit" size="sm" className="w-full font-bold glow-ember-sm text-xs gap-1.5">
                <Save className="w-3.5 h-3.5" />
                Save Site Settings
              </Button>
            </div>
          </form>
        </div>

        {/* First Admin Creation Guide & Tool */}
        <div className="glass rounded-3xl p-6 md:p-8 border border-ember-500/30 space-y-4 bg-gradient-to-b from-void-900 to-ember-950/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-ember-500/20 text-ember-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">One-Time Admin Setup</h2>
              <p className="text-[10px] text-gray-400">Promote your registered email to permanent administrator</p>
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            To create your official production admin account in Supabase without hardcoding credentials:
          </p>

          <ol className="text-xs text-gray-400 space-y-2 list-decimal list-inside bg-void-950/60 p-3.5 rounded-xl border border-white/5 font-mono">
            <li>Sign up on the site using your real email.</li>
            <li>Open your Supabase project dashboard.</li>
            <li>Click <strong>SQL Editor</strong> &rarr; <strong>New query</strong>.</li>
            <li>Paste and run the SQL query generated below:</li>
          </ol>

          <div className="space-y-2">
            <Label htmlFor="myemail" className="text-xs">Enter Your Registered Email:</Label>
            <Input
              id="myemail"
              type="email"
              placeholder="e.g. founder@eagletradingzone.com"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              className="text-xs font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-void-950 border border-white/10 font-mono text-[11px] text-amber-glow break-all select-all">
            {sqlQuery}
          </div>

          <Button
            type="button"
            onClick={handleCopySql}
            size="sm"
            variant="outline"
            className="w-full text-xs font-bold gap-1.5 border-ember-500/40 text-ember-400 hover:text-white"
          >
            {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Key className="w-3.5 h-3.5" />}
            {copiedQuery ? 'Copied to Clipboard!' : 'Copy 1-Command Admin SQL Query'}
          </Button>
        </div>
      </div>
    </div>
  )
}
