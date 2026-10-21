'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Filter,
  Shield,
  Ban,
  CheckCircle,
  Zap,
  RotateCcw,
  Crown,
  Calendar,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { UserProfile } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-1',
    email: 'trader@eagletradingzone.com',
    full_name: 'Eagle Trader',
    avatar_url: '/logo.png',
    role: 'user',
    plan: 'free',
    plan_start: new Date().toISOString(),
    plan_expiry: null,
    is_banned: false,
    monthly_trade_count: 6,
    preferred_currency: 'USD',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'user-2',
    email: 'vikram.forex@gmail.com',
    full_name: 'Vikram Sharma',
    avatar_url: '/logo.png',
    role: 'user',
    plan: 'pro',
    plan_start: new Date(Date.now() - 86400000 * 5).toISOString(),
    plan_expiry: new Date(Date.now() + 86400000 * 25).toISOString(),
    is_banned: false,
    monthly_trade_count: 48,
    preferred_currency: 'INR',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'user-3',
    email: 'sarah.scalper@tradefx.com',
    full_name: 'Sarah Jenkins',
    avatar_url: '/logo.png',
    role: 'user',
    plan: 'elite',
    plan_start: new Date(Date.now() - 86400000 * 10).toISOString(),
    plan_expiry: new Date(Date.now() + 86400000 * 355).toISOString(),
    is_banned: false,
    monthly_trade_count: 124,
    preferred_currency: 'USD',
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: 'user-4',
    email: 'spammer_bot@toxic.com',
    full_name: 'Fake Account',
    avatar_url: '/logo.png',
    role: 'user',
    plan: 'free',
    plan_start: null,
    plan_expiry: null,
    is_banned: true,
    monthly_trade_count: 0,
    preferred_currency: 'USD',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('ALL')
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)

  const filteredUsers = users.filter(u => {
    if (search) {
      const q = search.toLowerCase()
      if (!u.email.toLowerCase().includes(q) && !u.full_name.toLowerCase().includes(q)) return false
    }
    if (planFilter !== 'ALL' && u.plan !== planFilter) return false
    return true
  })

  // Change Plan
  const handleChangePlan = (userId: string, newPlan: 'free' | 'pro' | 'elite') => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? {
              ...u,
              plan: newPlan,
              plan_expiry: newPlan !== 'free' ? new Date(Date.now() + 30 * 86400000).toISOString() : null,
            }
          : u
      )
    )
    toast.success(`User plan updated to ${newPlan.toUpperCase()}`)
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, plan: newPlan } : null)
    }
  }

  // Extend Plan
  const handleExtendPlan = (userId: string, days: number) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const currentExp = u.plan_expiry ? new Date(u.plan_expiry).getTime() : Date.now()
          return {
            ...u,
            plan_expiry: new Date(currentExp + days * 86400000).toISOString(),
          }
        }
        return u
      })
    )
    toast.success(`Plan extended by +${days} days!`)
  }

  // Toggle Ban
  const handleToggleBan = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const banned = !u.is_banned
          toast.success(banned ? 'User banned from platform' : 'User unbanned')
          return { ...u, is_banned: banned }
        }
        return u
      })
    )
  }

  // Toggle Admin Role
  const handleToggleAdmin = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newRole = u.role === 'admin' ? 'user' : 'admin'
          toast.success(newRole === 'admin' ? 'User promoted to Administrator!' : 'Admin privileges revoked')
          return { ...u, role: newRole as 'user' | 'admin' }
        }
        return u
      })
    )
  }

  // Reset monthly trades
  const handleResetTrades = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, monthly_trade_count: 0 } : u))
    )
    toast.success('User monthly trade counter reset to 0')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            User & Subscription Manager
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Audit user accounts, manually modify subscription plans, ban abusive users and assign admin roles
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search email, name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={planFilter}
            onChange={e => setPlanFilter(e.target.value)}
            className="h-10 text-xs rounded-xl border border-white/10 bg-void-800 text-white px-3 w-full md:w-auto"
          >
            <option value="ALL">All Plans</option>
            <option value="free">Free Users</option>
            <option value="pro">Pro Subscribers</option>
            <option value="elite">Elite VIPs</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-void-900/60 text-gray-400">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Trades Logged</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 relative flex-shrink-0">
                        <Image src={u.avatar_url || '/logo.png'} alt={u.full_name} width={32} height={32} />
                      </div>
                      <div>
                        <div className="font-bold text-white">{u.full_name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {u.role === 'admin' ? (
                      <span className="text-[10px] font-bold text-ember-400 bg-ember-500/10 px-2 py-0.5 rounded border border-ember-500/30 flex items-center gap-1 w-max">
                        <Crown className="w-3 h-3" />
                        ADMIN
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[11px]">User</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      u.plan === 'elite'
                        ? 'bg-amber-glow/20 text-amber-glow border-amber-glow/40'
                        : u.plan === 'pro'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-void-700 text-gray-300'
                    }`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">
                    {u.plan_expiry ? format(new Date(u.plan_expiry), 'MMM dd, yyyy') : 'No expiry'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    {u.monthly_trade_count}
                  </td>
                  <td className="py-3.5 px-4">
                    {u.is_banned ? (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        Banned
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedUser(u)}
                      className="h-7 text-[11px] text-gray-300 hover:text-white"
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management Drawer/Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-3xl p-6 md:p-8 max-w-lg w-full border border-white/10 shadow-2xl space-y-6 relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <h2 className="text-base font-bold text-white">{selectedUser.full_name}</h2>
                  <p className="text-xs text-gray-400 font-mono">{selectedUser.email}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-1 text-gray-400 hover:text-white">
                  &times;
                </button>
              </div>

              {/* Action 1: Change Plan */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Change Membership Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['free', 'pro', 'elite'] as const).map(p => (
                    <Button
                      key={p}
                      size="sm"
                      variant={selectedUser.plan === p ? 'default' : 'outline'}
                      onClick={() => handleChangePlan(selectedUser.id, p)}
                      className="text-xs capitalize font-bold"
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Action 2: Extend Plan Duration */}
              {selectedUser.plan !== 'free' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Extend Subscription Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExtendPlan(selectedUser.id, 30)}
                      className="text-xs"
                    >
                      +30 Days
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExtendPlan(selectedUser.id, 90)}
                      className="text-xs"
                    >
                      +90 Days
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExtendPlan(selectedUser.id, 365)}
                      className="text-xs"
                    >
                      +1 Year
                    </Button>
                  </div>
                </div>
              )}

              {/* Action 3: Administrative Toggles */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Administrative Controls
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={selectedUser.role === 'admin' ? 'outline' : 'glass'}
                    onClick={() => handleToggleAdmin(selectedUser.id)}
                    className="text-xs gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-glow" />
                    {selectedUser.role === 'admin' ? 'Revoke Admin' : 'Make Administrator'}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResetTrades(selectedUser.id)}
                    className="text-xs gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Trade Count (0)
                  </Button>
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleToggleBan(selectedUser.id)}
                    className="w-full text-xs font-bold gap-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    {selectedUser.is_banned ? 'Unban User Account' : 'Ban User Account'}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-white/5">
                <Button size="sm" variant="ghost" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
