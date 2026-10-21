'use client'

import { useState, useEffect } from 'react'
import {
  Trade,
  Plan,
  PaymentMethod,
  PaymentRequest,
  FeatureFlag,
  BlogPost,
  CommunityMessage,
  Product,
  Transaction,
  CommunityQA,
  INITIAL_TRADES,
  INITIAL_PLANS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_FEATURE_FLAGS,
  INITIAL_BLOG_POSTS,
  INITIAL_MESSAGES,
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
  INITIAL_COMMUNITY_QA,
} from './mock-data'
import { useAuth } from './auth-context'
import toast from 'react-hot-toast'

// Helper for local storage persistence
function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function setStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function useTradesStore() {
  const { user, isAdmin } = useAuth()
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    setTrades(getStorage('eagle_trades', INITIAL_TRADES))
  }, [])

  const addTrade = (tradeData: Omit<Trade, 'id' | 'user_id' | 'created_at'>): { success: boolean; error?: string } => {
    const currentTrades = getStorage('eagle_trades', INITIAL_TRADES)
    
    // Check monthly limit for Free users
    if (user && user.plan === 'free' && !isAdmin) {
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()
      const monthTrades = currentTrades.filter(t => {
        const d = new Date(t.trade_date)
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear
      })
      if (monthTrades.length >= 15) {
        toast.error('Monthly trade limit (15) reached! Upgrade to Pro for unlimited journaling.')
        return { success: false, error: 'LIMIT_REACHED' }
      }
    }

    const newTrade: Trade = {
      ...tradeData,
      id: `trade-${Date.now()}`,
      user_id: user?.id || 'demo-user-id',
    }

    const updated = [newTrade, ...currentTrades]
    setTrades(updated)
    setStorage('eagle_trades', updated)
    toast.success('Trade logged successfully!')
    return { success: true }
  }

  const updateTrade = (id: string, updates: Partial<Trade>) => {
    const updated = trades.map(t => (t.id === id ? { ...t, ...updates } : t))
    setTrades(updated)
    setStorage('eagle_trades', updated)
    toast.success('Trade updated')
  }

  const deleteTrade = (id: string) => {
    const updated = trades.filter(t => t.id !== id)
    setTrades(updated)
    setStorage('eagle_trades', updated)
    toast.success('Trade deleted')
  }

  const bulkImportTrades = (newTrades: Omit<Trade, 'id' | 'user_id'>[]) => {
    const prepared: Trade[] = newTrades.map((t, idx) => ({
      ...t,
      id: `imported-${Date.now()}-${idx}`,
      user_id: user?.id || 'demo-user-id',
    }))
    const updated = [...prepared, ...trades]
    setTrades(updated)
    setStorage('eagle_trades', updated)
    toast.success(`Imported ${newTrades.length} trades successfully!`)
  }

  return { trades, addTrade, updateTrade, deleteTrade, bulkImportTrades }
}

// -----------------------------------------------------------------------------
// PRODUCTS MARKETPLACE & DIGITAL PURCHASES STORE
// -----------------------------------------------------------------------------
export function useProductsStore() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    setProducts(getStorage('eagle_products', INITIAL_PRODUCTS))
  }, [])

  const purchaseProduct = (product: Product, paymentMethod: string = 'Card / Instant') => {
    const userPurchases = getStorage<string[]>('eagle_purchased_product_ids', ['prod-course-1', 'prod-software-1', 'prod-software-3'])
    if (userPurchases.includes(product.id)) {
      toast('You already own this product! Access it in My Purchases.', { icon: '📦' })
      return { success: true, alreadyOwned: true }
    }

    // 1. Record new purchase
    const updatedPurchases = [...userPurchases, product.id]
    setStorage('eagle_purchased_product_ids', updatedPurchases)

    // 2. Log transaction in transaction history
    const currentTxns = getStorage<Transaction[]>('eagle_transactions', INITIAL_TRANSACTIONS)
    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      user_id: user?.id || 'demo-user-id',
      product_id: product.id,
      product_title: product.title,
      product_type: product.type,
      amount: product.price,
      payment_status: 'Completed',
      payment_method: paymentMethod,
      date: new Date().toISOString(),
      receipt_number: `REC-${Date.now().toString().slice(-6)}`,
    }
    const updatedTxns = [newTxn, ...currentTxns]
    setStorage('eagle_transactions', updatedTxns)

    toast.success(`Enrolled in "${product.title}"! Added to My Purchases.`)
    return { success: true }
  }

  return { products, purchaseProduct }
}

export function useTransactionsStore() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    setTransactions(getStorage('eagle_transactions', INITIAL_TRANSACTIONS))
  }, [])

  const refreshTransactions = () => {
    setTransactions(getStorage('eagle_transactions', INITIAL_TRANSACTIONS))
  }

  return { transactions, refreshTransactions }
}

export function usePurchasesStore() {
  const { products } = useProductsStore()
  const [purchasedIds, setPurchasedIds] = useState<string[]>([])

  useEffect(() => {
    setPurchasedIds(getStorage('eagle_purchased_product_ids', ['prod-course-1', 'prod-software-1', 'prod-software-3']))
  }, [])

  const purchasedProducts = products.filter(p => purchasedIds.includes(p.id))

  const hasPurchased = (productId: string) => purchasedIds.includes(productId)

  return { purchasedProducts, purchasedIds, hasPurchased }
}

// -----------------------------------------------------------------------------
// COMMUNITY Q&A FORUM STORE (ADMIN-ONLY REPLY LOGIC)
// -----------------------------------------------------------------------------
export function useCommunityQAStore() {
  const { user, isAdmin } = useAuth()
  const [posts, setPosts] = useState<CommunityQA[]>([])

  useEffect(() => {
    setPosts(getStorage('eagle_community_qa', INITIAL_COMMUNITY_QA))
  }, [])

  // Any logged-in user can submit a question
  const addQuestion = (data: { question_text: string; category?: string }) => {
    if (!data.question_text || !data.question_text.trim()) {
      toast.error('Please enter your question text.')
      return { success: false }
    }

    const currentPosts = getStorage('eagle_community_qa', INITIAL_COMMUNITY_QA)
    const newPost: CommunityQA = {
      id: `POST-${Math.floor(100 + Math.random() * 900)}`,
      user_id: user?.id || 'demo-user-id',
      user_name: user?.full_name || user?.name || 'Eagle Trader',
      user_avatar: user?.avatar_url || '/logo.png',
      question_text: data.question_text.trim(),
      category: data.category || 'General Trading Q&A',
      admin_reply_text: null,
      admin_attachment_url: null,
      admin_name: null,
      status: 'Open',
      created_at: new Date().toISOString(),
      replied_at: null,
    }

    const updated = [newPost, ...currentPosts]
    setPosts(updated)
    setStorage('eagle_community_qa', updated)
    toast.success('Question posted! Our official Admins will review and reply.')
    return { success: true, post: newPost }
  }

  // STRICT PERMISSION: ONLY ADMIN CAN REPLY AND ATTACH FILES/CHARTS
  const replyAsAdmin = (
    postId: string,
    data: { reply_text: string; attachment_url?: string }
  ): { success: boolean; error?: string } => {
    if (!isAdmin && user?.role !== 'admin') {
      toast.error('Permission Denied: Only Eagle Trading Zone Administrators can post replies and chart attachments!')
      return { success: false, error: 'ADMIN_ONLY' }
    }

    if (!data.reply_text || !data.reply_text.trim()) {
      toast.error('Reply text cannot be empty.')
      return { success: false, error: 'EMPTY_REPLY' }
    }

    const currentPosts = getStorage<CommunityQA[]>('eagle_community_qa', INITIAL_COMMUNITY_QA)
    const updated = currentPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          admin_reply_text: data.reply_text.trim(),
          admin_attachment_url: data.attachment_url?.trim() || null,
          admin_name: user?.full_name || 'Eagle Head Trader (Admin)',
          admin_avatar: '/logo.png',
          status: 'Answered' as const,
          replied_at: new Date().toISOString(),
        }
      }
      return p
    })

    setPosts(updated)
    setStorage('eagle_community_qa', updated)
    toast.success('Official Admin Answer and Attachment published!')
    return { success: true }
  }

  const deletePost = (postId: string) => {
    if (!isAdmin && user?.role !== 'admin') {
      toast.error('Only Admins can remove community posts.')
      return
    }
    const currentPosts = getStorage<CommunityQA[]>('eagle_community_qa', INITIAL_COMMUNITY_QA)
    const updated = currentPosts.filter(p => p.id !== postId)
    setPosts(updated)
    setStorage('eagle_community_qa', updated)
    toast.success('Post removed by Admin.')
  }

  return { posts, addQuestion, replyAsAdmin, deletePost }
}

// -----------------------------------------------------------------------------
// PAYMENT REQUESTS & PLANS STORES
// -----------------------------------------------------------------------------
export function usePaymentRequestsStore() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<PaymentRequest[]>([])

  useEffect(() => {
    const initial: PaymentRequest[] = [
      {
        id: 'pr-demo-1',
        user_id: 'demo-trader-2',
        user_email: 'vikram.forex@gmail.com',
        user_name: 'Vikram Sharma',
        plan_slug: 'pro',
        billing_period: 'monthly',
        amount: 19,
        payment_method: 'UPI (eagletrading@okaxis)',
        transaction_id: 'UPI482910492812',
        payment_date: new Date(Date.now() - 3600000 * 4).toISOString().split('T')[0],
        note: 'Sent via PhonePe for Pro monthly plan',
        screenshot_url: '/logo.png',
        status: 'pending',
        admin_note: null,
        reviewed_at: null,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ]
    setRequests(getStorage('eagle_payment_requests', initial))
  }, [])

  const submitPaymentRequest = (data: {
    plan_slug: 'pro' | 'elite'
    billing_period: 'monthly' | 'yearly'
    amount: number
    payment_method: string
    transaction_id: string
    payment_date: string
    note?: string
    screenshot_url?: string
  }): { success: boolean; error?: string } => {
    const current = getStorage<PaymentRequest[]>('eagle_payment_requests', requests)
    
    if (current.some(r => r.transaction_id.toLowerCase() === data.transaction_id.toLowerCase())) {
      toast.error('This Transaction ID has already been submitted!')
      return { success: false, error: 'DUPLICATE_TX_ID' }
    }

    const newReq: PaymentRequest = {
      id: `pr-${Date.now()}`,
      user_id: user?.id || 'demo-user-id',
      user_email: user?.email || 'trader@eagletradingzone.com',
      user_name: user?.full_name || 'Eagle Trader',
      plan_slug: data.plan_slug,
      billing_period: data.billing_period,
      amount: data.amount,
      payment_method: data.payment_method,
      transaction_id: data.transaction_id,
      payment_date: data.payment_date,
      note: data.note || null,
      screenshot_url: data.screenshot_url || '/logo.png',
      status: 'pending',
      admin_note: null,
      reviewed_at: null,
      created_at: new Date().toISOString(),
    }

    const updated = [newReq, ...current]
    setRequests(updated)
    setStorage('eagle_payment_requests', updated)
    toast.success('Payment submitted! Admin will verify and activate your plan.')
    return { success: true }
  }

  const approveRequest = (id: string, adminNote?: string) => {
    const current = getStorage<PaymentRequest[]>('eagle_payment_requests', requests)
    const target = current.find(r => r.id === id)
    if (!target) return

    const updated = current.map(r =>
      r.id === id
        ? {
            ...r,
            status: 'approved' as const,
            admin_note: adminNote || 'Payment verified. Plan activated.',
            reviewed_at: new Date().toISOString(),
          }
        : r
    )
    setRequests(updated)
    setStorage('eagle_payment_requests', updated)

    const storedUser = getStorage<any>('eagle_demo_user', null)
    if (storedUser && (storedUser.id === target.user_id || storedUser.email === target.user_email)) {
      const days = target.billing_period === 'yearly' ? 365 : 30
      storedUser.plan = target.plan_slug
      storedUser.plan_start = new Date().toISOString()
      storedUser.plan_expiry = new Date(Date.now() + days * 86400000).toISOString()
      setStorage('eagle_demo_user', storedUser)
    }

    toast.success('Payment approved! User plan upgraded.')
  }

  const rejectRequest = (id: string, reason: string) => {
    const current = getStorage<PaymentRequest[]>('eagle_payment_requests', requests)
    const updated = current.map(r =>
      r.id === id
        ? {
            ...r,
            status: 'rejected' as const,
            admin_note: reason || 'Invalid transaction ID or payment not received.',
            reviewed_at: new Date().toISOString(),
          }
        : r
    )
    setRequests(updated)
    setStorage('eagle_payment_requests', updated)
    toast.success('Payment request rejected with note.')
  }

  return { requests, submitPaymentRequest, approveRequest, rejectRequest }
}

export function usePlansStore() {
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    setPlans(getStorage('eagle_plans', INITIAL_PLANS))
  }, [])

  const updatePlan = (id: string, updates: Partial<Plan>) => {
    const updated = plans.map(p => (p.id === id ? { ...p, ...updates } : p))
    setPlans(updated)
    setStorage('eagle_plans', updated)
    toast.success('Plan details updated!')
  }

  return { plans, updatePlan }
}

export function usePaymentMethodsStore() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])

  useEffect(() => {
    setMethods(getStorage('eagle_payment_methods', INITIAL_PAYMENT_METHODS))
  }, [])

  const updateMethod = (id: string, updates: Partial<PaymentMethod>) => {
    const updated = methods.map(m => (m.id === id ? { ...m, ...updates } : m))
    setMethods(updated)
    setStorage('eagle_payment_methods', updated)
    toast.success('Payment method updated!')
  }

  const addMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newM: PaymentMethod = { ...method, id: `pm-${Date.now()}` }
    const updated = [...methods, newM]
    setMethods(updated)
    setStorage('eagle_payment_methods', updated)
    toast.success('Payment method added!')
  }

  return { methods, updateMethod, addMethod }
}

export function useFeatureFlagsStore() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])

  useEffect(() => {
    setFlags(getStorage('eagle_feature_flags', INITIAL_FEATURE_FLAGS))
  }, [])

  const toggleFlag = (key: string, is_enabled: boolean) => {
    const updated = flags.map(f => (f.key === key ? { ...f, is_enabled } : f))
    setFlags(updated)
    setStorage('eagle_feature_flags', updated)
    toast.success(`Feature "${key}" ${is_enabled ? 'enabled' : 'disabled'}`)
  }

  const updateFlagMinPlan = (key: string, min_plan: 'free' | 'pro' | 'elite') => {
    const updated = flags.map(f => (f.key === key ? { ...f, min_plan } : f))
    setFlags(updated)
    setStorage('eagle_feature_flags', updated)
    toast.success(`Feature "${key}" requirement updated to ${min_plan.toUpperCase()}`)
  }

  return { flags, toggleFlag, updateFlagMinPlan }
}
