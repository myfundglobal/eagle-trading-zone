'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Zap } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Marketplace', href: '/#marketplace' },
  { label: 'Trade Journal', href: '/dashboard/journal' },
  { label: 'Community Q&A', href: '/dashboard/community' },
  { label: 'Blog & News', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const { user, isAdmin, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-void-950/90 backdrop-blur-md border-b border-white/5 shadow-lg' : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Eagle Trading Zone"
                width={40}
                height={40}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-full bg-ember-500/20 blur-md group-hover:bg-ember-500/40 transition-all duration-300" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-gradient">Eagle Trading Zone</span>
              <span className="block text-xs text-gray-500 -mt-1">FX Book</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  pathname === link.href
                    ? 'text-ember-400 bg-ember-400/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="default" size="sm" className="h-8 text-xs font-bold bg-ember-gradient text-white">
                        Admin 👑
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-white/20 text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout} className="h-8 text-xs text-gray-400 hover:text-white">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="gap-1">
                      <Zap className="w-4 h-4" />
                      Start Free
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 py-4"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      pathname === link.href
                        ? 'text-ember-400 bg-ember-400/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-2 mt-2">
                  <Link href="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/signup" className="flex-1" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Start Free</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
