'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from './supabase/client'
import { INITIAL_PLANS, INITIAL_FEATURE_FLAGS, UserProfile } from './mock-data'
import { validateSignupEmail } from './email-validator'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  loginUser: (userData: Partial<UserProfile> & { email: string }, showToast?: boolean) => void
  loginAsDemo: (role?: 'user' | 'admin', plan?: 'free' | 'pro' | 'elite') => void
  logout: () => Promise<void>
  updatePlan: (newPlan: 'free' | 'pro' | 'elite', period?: 'monthly' | 'yearly') => void
  updateProfile: (updates: Partial<UserProfile>) => void
  verifyOTP: (code: string) => boolean
  toggleRole: () => void
  isLocked: (featureKey: string) => boolean
  isAdmin: boolean
  pendingVerificationEmail: string | null
  setPendingVerificationEmail: (email: string | null) => void
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'demo-user-id',
  email: 'trader@eagletradingzone.com',
  full_name: 'Eagle Trader',
  name: 'Eagle Trader',
  phone_number: '+1 (555) 382-9014',
  avatar_url: '/logo.png',
  role: 'user',
  verification_status: 'Verified',
  plan: 'free',
  plan_start: new Date().toISOString(),
  plan_expiry: null,
  is_banned: false,
  monthly_trade_count: 6,
  preferred_currency: 'USD',
  created_at: new Date().toISOString(),
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginUser: () => {},
  loginAsDemo: () => {},
  logout: async () => {},
  updatePlan: () => {},
  updateProfile: () => {},
  verifyOTP: () => false,
  toggleRole: () => {},
  isLocked: () => false,
  isAdmin: false,
  pendingVerificationEmail: null,
  setPendingVerificationEmail: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check localStorage for demo session first
    try {
      const stored = localStorage.getItem('eagle_demo_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Ensure phone & verification status exist
        parsed.phone_number = parsed.phone_number || '+1 (555) 382-9014'
        parsed.verification_status = parsed.verification_status || 'Verified'
        setUser(parsed)
        setLoading(false)
        return
      }
    } catch (e) {
      // LocalStorage access safe
    }

    // Try Supabase auth if configured
    try {
      const supabase = createClient()

      const fetchProfile = async (sessionUser: any) => {
        if (!sessionUser) {
          setUser(null)
          setLoading(false)
          return
        }

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionUser.id)
            .single()

          if (profile) {
            const p = profile as any
            const u: UserProfile = {
              id: p.id,
              email: p.email || sessionUser.email,
              full_name: p.full_name || sessionUser.user_metadata?.full_name || 'Eagle Trader',
              name: p.full_name || sessionUser.user_metadata?.full_name || 'Eagle Trader',
              phone_number: p.phone_number || sessionUser.user_metadata?.phone_number || '+1 (555) 382-9014',
              avatar_url: p.avatar_url || sessionUser.user_metadata?.avatar_url || '/logo.png',
              role: (p.role === 'admin' ? 'admin' : 'user'),
              verification_status: p.verification_status || (sessionUser.email_confirmed_at ? 'Verified' : 'Unverified'),
              plan: p.plan || 'free',
              plan_start: p.plan_start || new Date().toISOString(),
              plan_expiry: p.plan_expiry,
              is_banned: p.is_banned || false,
              monthly_trade_count: p.monthly_trade_count || 0,
              preferred_currency: p.preferred_currency || 'USD',
              created_at: p.created_at || new Date().toISOString(),
            }
            setUser(u)
          } else {
            const defaultProfile: UserProfile = {
              id: sessionUser.id,
              email: sessionUser.email,
              full_name: sessionUser.user_metadata?.full_name || 'Eagle Trader',
              name: sessionUser.user_metadata?.full_name || 'Eagle Trader',
              phone_number: sessionUser.user_metadata?.phone_number || '+1 (555) 382-9014',
              avatar_url: '/logo.png',
              role: 'user',
              verification_status: sessionUser.email_confirmed_at ? 'Verified' : 'Unverified',
              plan: 'free',
              plan_start: new Date().toISOString(),
              plan_expiry: null,
              is_banned: false,
              monthly_trade_count: 0,
              preferred_currency: 'USD',
              created_at: new Date().toISOString(),
            }
            setUser(defaultProfile)
          }
        } catch (err) {
          setUser(DEFAULT_DEMO_USER)
        }
        setLoading(false)
      }

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchProfile(session.user)
        } else {
          // If no supabase session and no localStorage, set default demo user
          setUser(DEFAULT_DEMO_USER)
          setLoading(false)
        }
      }).catch(() => {
        setUser(DEFAULT_DEMO_USER)
        setLoading(false)
      })

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchProfile(session.user)
        } else {
          const stored = localStorage.getItem('eagle_demo_user')
          if (stored) {
            setUser(JSON.parse(stored))
          } else {
            setUser(null)
          }
          setLoading(false)
        }
      })

      return () => {
        authListener?.subscription?.unsubscribe()
      }
    } catch (e) {
      setUser(DEFAULT_DEMO_USER)
      setLoading(false)
    }
  }, [])

  const loginUser = (
    userData: Partial<UserProfile> & { email: string },
    showToast = true
  ) => {
    const existing = typeof window !== 'undefined' ? localStorage.getItem('eagle_users') : null
    let usersList: any[] = []
    try {
      if (existing) usersList = JSON.parse(existing)
    } catch {}

    const found = usersList.find((u: any) => u.email?.toLowerCase() === userData.email?.toLowerCase())
    const role = userData.role || found?.role || (userData.email.toLowerCase().includes('admin') ? 'admin' : 'user')
    const fullName = userData.name || userData.full_name || found?.full_name || found?.name || userData.email.split('@')[0]

    const fullUser: UserProfile = {
      ...DEFAULT_DEMO_USER,
      ...found,
      ...userData,
      id: userData.id || found?.id || `user-${Date.now()}`,
      email: userData.email,
      full_name: fullName,
      name: fullName,
      phone_number: userData.phone_number || found?.phone_number || '+91 9876543210',
      role,
      verification_status: 'Verified',
      plan: userData.plan || found?.plan || (role === 'admin' ? 'elite' : 'pro'),
      plan_start: found?.plan_start || new Date().toISOString(),
      plan_expiry: found?.plan_expiry || new Date(Date.now() + 30 * 86400000).toISOString(),
    }

    setUser(fullUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('eagle_demo_user', JSON.stringify(fullUser))
      const idx = usersList.findIndex((u: any) => u.email?.toLowerCase() === fullUser.email.toLowerCase())
      if (idx >= 0) {
        usersList[idx] = { ...usersList[idx], ...fullUser }
      } else {
        usersList.push(fullUser)
      }
      localStorage.setItem('eagle_users', JSON.stringify(usersList))
    }

    if (showToast) {
      toast.success(`Welcome back, ${fullName}!`)
    }

    if (role === 'admin') {
      router.push('/dashboard/community')
    } else {
      router.push('/dashboard')
    }
  }

  const loginAsDemo = (role: 'user' | 'admin' = 'user', plan: 'free' | 'pro' | 'elite' = 'free') => {
    const demoUser: UserProfile = {
      ...DEFAULT_DEMO_USER,
      id: role === 'admin' ? 'demo-admin-id' : 'demo-user-id',
      email: role === 'admin' ? 'admin@eagletradingzone.com' : 'trader@eagletradingzone.com',
      full_name: role === 'admin' ? 'Eagle Chief Admin' : 'Eagle Pro Trader',
      name: role === 'admin' ? 'Eagle Chief Admin' : 'Eagle Pro Trader',
      phone_number: '+1 (555) 789-2041',
      role,
      verification_status: 'Verified',
      plan: role === 'admin' ? 'elite' : plan,
      plan_start: new Date().toISOString(),
      plan_expiry: plan !== 'free' || role === 'admin' ? new Date(Date.now() + 30 * 86400000).toISOString() : null,
    }
    setUser(demoUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('eagle_demo_user', JSON.stringify(demoUser))
    }
    toast.success(role === 'admin' ? 'Signed in as Eagle Admin 👑' : 'Signed in successfully')
    if (role === 'admin') {
      router.push('/dashboard/community')
    } else {
      router.push('/dashboard')
    }
  }

  const logout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (e) {}
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('eagle_demo_user')
    }
    toast.success('Signed out successfully')
    router.push('/login')
  }

  const updatePlan = (newPlan: 'free' | 'pro' | 'elite', period: 'monthly' | 'yearly' = 'monthly') => {
    if (!user) return
    const days = period === 'yearly' ? 365 : 30
    const updated: UserProfile = {
      ...user,
      plan: newPlan,
      plan_start: new Date().toISOString(),
      plan_expiry: new Date(Date.now() + days * 86400000).toISOString(),
    }
    setUser(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('eagle_demo_user', JSON.stringify(updated))
    }
    toast.success(`Plan updated to ${newPlan.toUpperCase()}!`)
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return
    const updated: UserProfile = {
      ...user,
      ...updates,
      full_name: updates.name || updates.full_name || user.full_name,
      name: updates.name || updates.full_name || user.name,
    }
    setUser(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('eagle_demo_user', JSON.stringify(updated))
    }
    toast.success('Profile details updated!')
  }

  const verifyOTP = (code: string): boolean => {
    // Accepts standard demo code 749201 or any valid 6-digit code for testing
    if (!code || code.trim().length !== 6) {
      toast.error('Please enter a valid 6-digit verification code.')
      return false
    }

    if (user) {
      const verified = { ...user, verification_status: 'Verified' as const }
      setUser(verified)
      if (typeof window !== 'undefined') {
        localStorage.setItem('eagle_demo_user', JSON.stringify(verified))
      }
    }
    setPendingVerificationEmail(null)
    toast.success('Email successfully verified! Access granted.')
    return true
  }

  // Quick toggle between Admin and User for evaluation
  const toggleRole = () => {
    if (!user) return
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    const updated: UserProfile = {
      ...user,
      role: newRole,
      full_name: newRole === 'admin' ? 'Eagle Chief Admin' : 'Eagle Pro Trader',
      name: newRole === 'admin' ? 'Eagle Chief Admin' : 'Eagle Pro Trader',
    }
    setUser(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('eagle_demo_user', JSON.stringify(updated))
    }
    toast.success(`Switched role to: ${newRole.toUpperCase()} mode!`)
  }

  const isLocked = (featureKey: string): boolean => {
    if (!user) return true
    if (user.role === 'admin') return false

    let flags = INITIAL_FEATURE_FLAGS
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eagle_feature_flags')
      if (stored) {
        try { flags = JSON.parse(stored) } catch(e) {}
      }
    }

    const flag = flags.find(f => f.key === featureKey)
    if (!flag || !flag.is_enabled) return true

    const planWeights: Record<string, number> = { free: 1, pro: 2, elite: 3 }
    const userWeight = planWeights[user.plan] || 1
    const reqWeight = planWeights[flag.min_plan] || 1

    return userWeight < reqWeight
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        loginAsDemo,
        logout,
        updatePlan,
        updateProfile,
        verifyOTP,
        toggleRole,
        isLocked,
        isAdmin: user?.role === 'admin' || user?.role === 'Admin',
        pendingVerificationEmail,
        setPendingVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
