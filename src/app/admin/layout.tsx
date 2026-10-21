'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Layers,
  Flag,
  QrCode,
  Tag,
  FileText,
  Shield,
  MessageSquare,
  LifeBuoy,
  Bell,
  Settings,
  History,
  ArrowLeft,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Lock,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { usePaymentRequestsStore } from '@/lib/store'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminNavItem {
  label: string
  href: string
  icon: any
  badge?: string | number
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, isAdmin, loginAsDemo, logout } = useAuth()
  const { requests } = usePaymentRequestsStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pendingPaymentsCount = requests.filter(r => r.status === 'pending').length

  const adminNav: AdminNavItem[] = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard, badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined },
    { label: 'Users Manager', href: '/admin/users', icon: Users },
    { label: 'Plans & Pricing', href: '/admin/plans', icon: Layers },
    { label: 'Feature Flags', href: '/admin/feature-flags', icon: Flag },
    { label: 'Payment Methods', href: '/admin/payment-methods', icon: QrCode },
    { label: 'Coupons & Gifts', href: '/admin/coupons', icon: Tag },
    { label: 'Content CMS', href: '/admin/content', icon: FileText },
    { label: 'Community Mod', href: '/admin/community', icon: MessageSquare },
    { label: 'Support Inbox', href: '/admin/support', icon: LifeBuoy },
    { label: 'Broadcasts', href: '/admin/notifications', icon: Bell },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
    { label: 'Audit Log', href: '/admin/audit-logs', icon: History },
  ]

  // Role Gate: If not admin, show permission gate with 1-click Demo Admin switch
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-void-950 flex items-center justify-center p-4">
        <div className="glass rounded-3xl p-8 max-w-md w-full border border-red-500/30 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center border border-red-500/30 glow-ember">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Access Restricted</h1>
            <p className="text-xs text-gray-400 mt-1">
              You must be logged in as an Administrator (<code>role = &apos;admin&apos;</code>) to view the Eagle Admin Command Center.
            </p>
          </div>
          <div className="pt-2 space-y-2">
            <Button
              onClick={() => loginAsDemo('admin', 'elite')}
              className="w-full font-bold glow-ember text-xs gap-2"
            >
              👑 Switch to Demo Admin (Instant Access)
            </Button>
            <Link href="/dashboard" className="block">
              <Button variant="ghost" className="w-full text-xs text-gray-400">
                Return to Trader Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void-950 text-foreground flex">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 bg-void-900/90 backdrop-blur-xl shrink-0 z-40 fixed inset-y-0 left-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative">
              <Image src="/logo.png" alt="Eagle Trading" width={34} height={34} />
              <div className="absolute inset-0 bg-ember-500/30 rounded-full blur-md" />
            </div>
            <div>
              <div className="text-xs font-black text-gradient uppercase tracking-wider">Eagle Admin</div>
              <div className="text-[10px] text-gray-500 font-mono">COMMAND CENTER</div>
            </div>
          </Link>
        </div>

        {/* Exit back to trader dashboard */}
        <div className="p-3 mx-3 mt-3 rounded-xl bg-void-800/80 border border-white/5">
          <Link
            href="/dashboard"
            className="flex items-center justify-between text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 text-ember-400" />
              Trader Dashboard
            </span>
            <span className="text-[10px] text-gray-500">USER VIEW</span>
          </Link>
        </div>

        {/* Admin Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                  active
                    ? 'bg-ember-gradient text-white shadow-lg glow-ember-sm font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4', active ? 'text-white' : 'text-gray-400')} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-white font-mono animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-void-950/40">
          <div className="text-xs">
            <div className="font-bold text-white text-[11px] truncate max-w-[120px]">{user?.full_name}</div>
            <div className="text-[10px] text-ember-400 font-mono">CHIEF ADMIN</div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-void-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-ember-500/20 text-ember-400 border border-ember-500/30 font-bold">
                ADMIN CONSOLE
              </span>
              <span className="hidden sm:inline text-xs text-gray-500">|</span>
              <span className="hidden sm:inline text-xs font-semibold text-white capitalize">
                {pathname === '/admin' ? 'Overview' : pathname.replace('/admin/', '').replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link href="/admin/payments">
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-amber-500/30 text-amber-400">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pending ({pendingPaymentsCount})</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="fixed inset-y-0 left-0 w-72 bg-void-900 border-r border-white/10 z-50 lg:hidden flex flex-col p-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Eagle Trading" width={30} height={30} />
                    <span className="font-bold text-xs text-gradient uppercase">Eagle Admin</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-3 space-y-1">
                  {adminNav.map((item) => {
                    const Icon = item.icon
                    const active = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold',
                          active ? 'bg-ember-gradient text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-white font-mono">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <Link href="/dashboard" className="text-xs text-ember-400 hover:underline">
                    &larr; Trader Dashboard
                  </Link>
                  <button onClick={logout} className="text-xs text-red-400 hover:underline">
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Admin Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
