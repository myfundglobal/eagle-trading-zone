'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  BarChart3,
  PlayCircle,
  BrainCircuit,
  Users,
  Share2,
  RefreshCw,
  CreditCard,
  User,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Zap,
  Lock,
  ShoppingBag,
  Calculator,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: any
  badge?: string
  featureKey?: string
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Trade Journal', href: '/dashboard/journal', icon: BookOpen },
  { label: 'My Purchases', href: '/dashboard/purchases', icon: ShoppingBag, badge: 'STORE' },
  { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { label: 'Community Q&A', href: '/dashboard/community', icon: Users },
  { label: 'Risk Calculator', href: '/dashboard/calculator', icon: Calculator, badge: 'FREE' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'CSV Import', href: '/dashboard/import', icon: Upload, badge: 'PRO', featureKey: 'csv_import' },
  { label: 'Backtesting', href: '/dashboard/backtesting', icon: PlayCircle, badge: 'ELITE', featureKey: 'backtesting' },
  { label: 'AI Reports', href: '/dashboard/ai-report', icon: BrainCircuit, badge: 'PRO', featureKey: 'ai_reports' },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout, isLocked, isAdmin } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const planBadgeColor = {
    free: 'border-gray-600 bg-gray-800 text-gray-300',
    pro: 'border-blue-500/40 bg-blue-500/20 text-blue-400',
    elite: 'border-amber-glow/40 bg-amber-glow/20 text-amber-glow glow-ember',
  }[user?.plan || 'free']

  return (
    <div className="min-h-screen bg-void-950 text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 bg-void-900/80 backdrop-blur-xl shrink-0 z-40 fixed inset-y-0 left-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Eagle Trading Zone"
                width={36}
                height={36}
                className="group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-ember-500/20 rounded-full blur-md" />
            </div>
            <div>
              <div className="text-sm font-bold text-gradient leading-tight">Eagle Trading</div>
              <div className="text-[10px] text-gray-400 font-semibold tracking-wider">FX BOOK</div>
            </div>
          </Link>
        </div>

        {/* Admin Portal Shortcut if Admin */}
        {isAdmin && (
          <div className="p-3 mx-3 mt-3 rounded-xl bg-ember-gradient/10 border border-ember-500/30">
            <Link
              href="/admin"
              className="flex items-center justify-between text-xs font-bold text-ember-400 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-ember-400" />
                Admin Portal
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ember-500/20 text-white font-mono">
                ADMIN
              </span>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            const locked = item.featureKey ? isLocked(item.featureKey) : false

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group',
                  active
                    ? 'bg-ember-gradient text-white shadow-lg glow-ember-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4', active ? 'text-white' : 'text-gray-400 group-hover:text-ember-400')} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider',
                      item.badge === 'ELITE'
                        ? 'bg-amber-glow/20 text-amber-glow border border-amber-glow/30'
                        : item.badge === 'PRO'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-void-700 text-gray-400'
                    )}
                  >
                    {locked && <Lock className="w-2.5 h-2.5 inline mr-0.5 -mt-0.5" />}
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Current Plan & User footer */}
        <div className="p-4 border-t border-white/5 space-y-3 bg-void-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 relative">
                <Image
                  src={user?.avatar_url || '/logo.png'}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div className="max-w-[110px] truncate">
                <div className="text-xs font-bold text-white truncate">{user?.full_name || 'Eagle Trader'}</div>
                <div className="text-[10px] text-gray-500 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded border', planBadgeColor)}>
              {user?.plan || 'Free'} Plan
            </span>
            {user?.plan === 'free' && (
              <Link href="/dashboard/subscription">
                <Button size="sm" variant="default" className="h-6 text-[10px] px-2 gap-1 font-bold">
                  <Zap className="w-3 h-3" />
                  Upgrade
                </Button>
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-void-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm font-bold text-white capitalize">
              {pathname === '/dashboard' ? 'Overview' : pathname.replace('/dashboard/', '').replace('-', ' ')}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Portal Pill (Only visible to verified Administrators) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border bg-amber-glow/15 border-amber-glow/40 text-amber-glow hover:bg-amber-glow/25"
                title="Open Administrator Portal"
              >
                <span>👑 Admin Portal</span>
              </Link>
            )}

            {/* Verification Status Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Verified
            </span>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Plan Badge */}
            <Link href="/dashboard/subscription">
              <span className={cn('hidden sm:inline-flex text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border cursor-pointer hover:opacity-80 transition-opacity', planBadgeColor)}>
                {user?.plan || 'Free'}
              </span>
            </Link>

            {/* Public Home link */}
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
                Website
              </Button>
            </Link>
          </div>
        </header>

        {/* Mobile Sidebar Modal */}
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
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 w-72 bg-void-900 border-r border-white/10 z-50 lg:hidden flex flex-col p-4"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Eagle Trading" width={32} height={32} />
                    <span className="font-bold text-sm text-gradient">Eagle FX Book</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setSidebarOpen(false)}
                    className="mt-3 p-2.5 rounded-xl bg-ember-500/20 border border-ember-500/30 text-xs font-bold text-ember-400 flex items-center justify-between"
                  >
                    <span>Admin Portal 👑</span>
                    <span className="text-[10px] bg-ember-500/30 px-1.5 py-0.5 rounded text-white">ADMIN</span>
                  </Link>
                )}

                <div className="flex-1 overflow-y-auto py-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const active = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold',
                          active
                            ? 'bg-ember-gradient text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-void-700 text-gray-400">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="text-xs text-gray-400">{user?.email}</div>
                  <button onClick={logout} className="text-xs text-red-400 hover:underline">
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>

        {/* Bottom Mobile Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-void-950/95 backdrop-blur-lg border-t border-white/10 z-30 flex items-center justify-around px-2">
          {[
            { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
            { label: 'Journal', href: '/dashboard/journal', icon: BookOpen },
            { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
            { label: 'AI', href: '/dashboard/ai-report', icon: BrainCircuit },
            { label: 'Plans', href: '/dashboard/subscription', icon: CreditCard },
          ].map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors',
                  active ? 'text-ember-400 font-bold' : 'text-gray-400 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
