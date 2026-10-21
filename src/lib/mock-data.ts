export interface Trade {
  id: string
  user_id: string
  symbol: string
  direction: 'buy' | 'sell'
  entry_price: number
  exit_price: number | null
  stop_loss: number | null
  take_profit: number | null
  lot_size: number
  pnl: number | null
  trade_date: string
  close_date: string | null
  strategy_tag: string | null
  notes: string | null
  emotion: 'Disciplined' | 'FOMO' | 'Revenge' | 'Confident' | 'Fearful' | 'Greedy' | 'Neutral' | null
  rating: number | null
  screenshot_url: string | null
  checklist: string[]
  is_open: boolean
  session: 'Asian' | 'London' | 'New York' | 'Overlap' | null
}

export interface Product {
  id: string
  type: 'Course' | 'Software'
  title: string
  description: string
  price: number
  access_link: string
  download_link: string
  thumbnail_url: string
  rating: number
  features: string[]
  badge?: string
  level?: string
  version?: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  product_id: string
  product_title: string
  product_type: 'Course' | 'Software'
  amount: number
  payment_status: 'Completed' | 'Pending' | 'Failed'
  payment_method: string
  date: string
  receipt_number: string
}

export interface CommunityQA {
  id: string // Post ID (e.g. POST-101)
  user_id: string // Asker
  user_name: string
  user_avatar?: string
  question_text: string
  category: string
  admin_reply_text: string | null
  admin_attachment_url: string | null // Admin Attachment/Image
  admin_name: string | null
  admin_avatar?: string
  status: 'Open' | 'Answered'
  created_at: string
  replied_at: string | null
}

export interface Plan {
  id: string
  name: string
  slug: 'free' | 'pro' | 'elite'
  price_monthly: number
  price_yearly: number
  monthly_trade_limit: number
  features: { name: string; included: boolean }[]
  is_active: boolean
  sort_order: number
}

export interface PaymentMethod {
  id: string
  type: 'upi' | 'bank' | 'crypto' | 'other'
  label: string
  details: Record<string, any>
  qr_url: string | null
  is_active: boolean
  sort_order: number
}

export interface PaymentRequest {
  id: string
  user_id: string
  user_email: string
  user_name: string
  plan_slug: 'pro' | 'elite'
  billing_period: 'monthly' | 'yearly'
  amount: number
  payment_method: string
  transaction_id: string
  payment_date: string
  note: string | null
  screenshot_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_note: string | null
  reviewed_at: string | null
  created_at: string
}

export interface FeatureFlag {
  id: string
  key: string
  label: string
  description: string
  is_enabled: boolean
  min_plan: 'free' | 'pro' | 'elite'
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_url: string
  author: string
  is_published: boolean
  published_at: string
  read_time?: string
  tags?: string[]
}

export interface CommunityMessage {
  id: string
  room_id: string
  user_id: string
  user_name: string
  user_avatar?: string
  user_plan: 'free' | 'pro' | 'elite'
  content: string
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  name?: string
  phone_number?: string
  avatar_url?: string
  role: 'user' | 'admin' | 'User' | 'Admin'
  verification_status?: 'Verified' | 'Unverified' | 'Pending'
  plan: 'free' | 'pro' | 'elite'
  plan_start: string | null
  plan_expiry: string | null
  is_banned: boolean
  monthly_trade_count: number
  preferred_currency: string
  created_at: string
}

// Initial Products Marketplace
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-course-1',
    type: 'Course',
    title: 'Eagle Institutional Price Action & Smart Money Course',
    description: 'Master institutional order flow, bank liquidity pools, Fair Value Gaps (FVG), and high-RR setups on Gold and Forex.',
    price: 99,
    access_link: '/dashboard/purchases',
    download_link: 'https://cdn.eagletradingzone.com/materials/institutional-smc-course.pdf',
    thumbnail_url: '/logo.png',
    rating: 4.9,
    features: ['18 Hours Video Modules', 'Live Trade Breakdown Archive', 'Entry Checklist PDF', 'Private Q&A Access'],
    badge: 'Bestseller',
    level: 'Intermediate - Advanced',
    created_at: '2026-09-01T10:00:00Z',
  },
  {
    id: 'prod-software-1',
    type: 'Software',
    title: 'Eagle Trend Hunter MT5 Expert Advisor (EA)',
    description: 'Fully automated algorithmic execution bot designed for MetaTrader 5 with dynamic trailing stops, news filter, and daily risk circuit breaker.',
    price: 149,
    access_link: '/dashboard/purchases',
    download_link: 'https://cdn.eagletradingzone.com/software/EagleTrendHunter_v2.4.ex5',
    thumbnail_url: '/logo.png',
    rating: 4.8,
    features: ['MT5 .ex5 Executable Bot', 'Set Files for XAUUSD & EURUSD', 'Telegram Alert Webhook', 'Lifetime License Key'],
    badge: 'Top Algorithmic EA',
    version: 'v2.4 Pro',
    created_at: '2026-09-15T12:00:00Z',
  },
  {
    id: 'prod-course-2',
    type: 'Course',
    title: 'Forex & Gold Scalping Blueprint: London & NY Open',
    description: 'Learn the exact 15-minute and 1-minute execution models used to scalp high-momentum expansions during Frankfurt, London, and NY opens.',
    price: 79,
    access_link: '/dashboard/purchases',
    download_link: 'https://cdn.eagletradingzone.com/materials/london-ny-scalping-handbook.pdf',
    thumbnail_url: '/logo.png',
    rating: 4.9,
    features: ['12 High-Definition Video Lessons', 'Session Timing Heatmaps', 'Live Execution Replays', 'Risk Multiplier Templates'],
    badge: 'High Impact',
    level: 'All Levels',
    created_at: '2026-09-20T14:00:00Z',
  },
  {
    id: 'prod-software-2',
    type: 'Software',
    title: 'Eagle Liquidity & FVG Indicator Suite (MT5 / TradingView)',
    description: 'Real-time multi-timeframe indicator that automatically draws institutional liquidity zones, imbalance gaps, and premium/discount equilibrium.',
    price: 59,
    access_link: '/dashboard/purchases',
    download_link: 'https://cdn.eagletradingzone.com/software/Eagle_Liquidity_FVG_Suite.zip',
    thumbnail_url: '/logo.png',
    rating: 4.7,
    features: ['TradingView PineScript v5 Code', 'MT5 Custom Indicator File', 'Audio & Popup Alerts', 'Auto Session Boxes'],
    badge: 'Essential Tool',
    version: 'v3.1 Indicator',
    created_at: '2026-09-28T09:30:00Z',
  },
  {
    id: 'prod-course-3',
    type: 'Course',
    title: 'Prop Firm Evaluation Accelerator (Pass Phase 1 & 2)',
    description: 'A mathematical roadmap to safely pass prop firm challenges without breaching maximum daily drawdown or overall loss limits.',
    price: 129,
    access_link: '/dashboard/purchases',
    download_link: 'https://cdn.eagletradingzone.com/materials/prop-firm-accelerator-guide.pdf',
    thumbnail_url: '/logo.png',
    rating: 5.0,
    features: ['Strict Drawdown Math Model', 'Psychological Defense Drills', 'Evaluation Trade Templates', 'Live Mentor Audits'],
    badge: 'Prop Firm Certified',
    level: 'Advanced',
    created_at: '2026-10-02T16:00:00Z',
  },
  {
    id: 'prod-software-3',
    type: 'Software',
    title: 'Eagle Fast 1-Click Position Risk Calculator EA',
    description: 'Execute trades in 0.1 seconds with automatic lot sizing based on your chosen risk percentage (0.5%, 1%, 2%) and visual drag-and-drop Stop Loss.',
    price: 39,
    access_link: '/dashboard/purchases',
    download_link: 'https://cdn.eagletradingzone.com/software/Eagle_QuickRisk_Execution_EA.ex5',
    thumbnail_url: '/logo.png',
    rating: 4.9,
    features: ['Zero Math Required at Execution', 'Visual Chart Stop Lines', 'Partial TP Buttons', 'Spread Protection'],
    badge: 'Speed Execution',
    version: 'v1.8 Utility',
    created_at: '2026-10-08T11:00:00Z',
  },
]

// Initial Transactions (Payment history)
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-88410',
    user_id: 'demo-user-id',
    product_id: 'prod-course-1',
    product_title: 'Eagle Institutional Price Action & Smart Money Course',
    product_type: 'Course',
    amount: 99.0,
    payment_status: 'Completed',
    payment_method: 'Credit Card / Stripe',
    date: '2026-10-10T14:30:00Z',
    receipt_number: 'REC-2026-88410',
  },
  {
    id: 'TXN-88411',
    user_id: 'demo-user-id',
    product_id: 'prod-software-1',
    product_title: 'Eagle Trend Hunter MT5 Expert Advisor (EA)',
    product_type: 'Software',
    amount: 149.0,
    payment_status: 'Completed',
    payment_method: 'USDT Crypto (TRC20)',
    date: '2026-10-14T09:15:00Z',
    receipt_number: 'REC-2026-88411',
  },
  {
    id: 'TXN-88412',
    user_id: 'demo-user-id',
    product_id: 'prod-software-3',
    product_title: 'Eagle Fast 1-Click Position Risk Calculator EA',
    product_type: 'Software',
    amount: 39.0,
    payment_status: 'Completed',
    payment_method: 'UPI Instant',
    date: '2026-10-18T16:45:00Z',
    receipt_number: 'REC-2026-88412',
  },
]

// Initial Community Q&A Posts
// Strict rule: Any user can ask, ONLY Admin can post replies and upload attachments/images!
export const INITIAL_COMMUNITY_QA: CommunityQA[] = [
  {
    id: 'POST-101',
    user_id: 'user-002',
    user_name: 'Marcus Vance',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    question_text: 'How should I handle Gold (XAUUSD) when US CPI numbers come out higher than expected, but the DXY Dollar index dumps? Which one takes priority for entry?',
    category: 'Gold & Macro Strategy',
    admin_reply_text: 'Excellent question Marcus. In high-impact CPI releases, the initial 1 to 5 minute candle is dominated by algorithmic stop sweeps on both sides of the market. Never enter during the initial spike. Instead, wait for the 15-minute candle to close. Look for which side had its liquidity swept first (e.g., Asian high or previous day high). When the DXY and Gold diverge, Gold responds primarily to real bond yields and institutional safe-haven demand. See the attached chart breakdown showing the exact 15m mitigation block you should trade.',
    admin_attachment_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&auto=format&fit=crop',
    admin_name: 'Eagle Head Trader (Admin)',
    admin_avatar: '/logo.png',
    status: 'Answered',
    created_at: '2026-10-18T11:20:00Z',
    replied_at: '2026-10-18T12:05:00Z',
  },
  {
    id: 'POST-102',
    user_id: 'user-003',
    user_name: 'Elena Rostova',
    user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    question_text: 'In the Eagle Trend Hunter MT5 EA, what is the recommended trailing stop step for prop firm evaluation accounts to protect profits without getting stopped out early?',
    category: 'Software EA Settings',
    admin_reply_text: 'For prop firm evaluations (FTMO, FundedNext, MFF), capital preservation is king. We recommend setting `TrailingStopActivationPips = 35` and `TrailingStep = 15` on XAUUSD. Once the trade reaches 1:1.5 Risk-Reward, the EA automatically moves Stop Loss to Breakeven + 5 pips. Attached is the certified .set configuration file screenshot for 50k and 100k accounts.',
    admin_attachment_url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=900&auto=format&fit=crop',
    admin_name: 'Eagle Technical Lead (Admin)',
    admin_avatar: '/logo.png',
    status: 'Answered',
    created_at: '2026-10-19T14:40:00Z',
    replied_at: '2026-10-19T15:10:00Z',
  },
  {
    id: 'POST-103',
    user_id: 'demo-user-id',
    user_name: 'Eagle Trader',
    user_avatar: '/logo.png',
    question_text: 'What is the ideal risk per trade if I want to scale my trading journal equity curve smoothly without experiencing more than an 8% maximum cumulative drawdown?',
    category: 'Risk Management',
    admin_reply_text: 'Mathematically, if your maximum tolerated cumulative drawdown is 8%, your risk per trade MUST NOT exceed 0.5% to 0.75% of current equity. At 0.5% risk, you would need 16 consecutive losses to hit your drawdown limit, which has less than a 0.03% probability if your system possesses a positive statistical expectancy. Use our Position Size Calculator on your dashboard before every single order.',
    admin_attachment_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&auto=format&fit=crop',
    admin_name: 'Eagle Head Trader (Admin)',
    admin_avatar: '/logo.png',
    status: 'Answered',
    created_at: '2026-10-20T08:15:00Z',
    replied_at: '2026-10-20T09:30:00Z',
  },
  {
    id: 'POST-104',
    user_id: 'user-004',
    user_name: 'David Kim',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    question_text: 'Can I use the Smart Money Course concepts on Crypto assets like Bitcoin and Ethereum during the weekend when fiat forex markets are closed?',
    category: 'Crypto & Market Structure',
    admin_reply_text: null,
    admin_attachment_url: null,
    admin_name: null,
    status: 'Open',
    created_at: '2026-10-21T18:00:00Z',
    replied_at: null,
  },
  {
    id: 'POST-105',
    user_id: 'user-005',
    user_name: 'Aisha Al-Mansoor',
    user_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
    question_text: 'Is there a specific candlestick rejection pattern you prefer on the 4-Hour chart before entering a pullback into a Fair Value Gap?',
    category: 'Price Action & Candlesticks',
    admin_reply_text: null,
    admin_attachment_url: null,
    admin_name: null,
    status: 'Open',
    created_at: '2026-10-21T21:10:00Z',
    replied_at: null,
  },
]

// Initial Plans
export const INITIAL_PLANS: Plan[] = [
  {
    id: 'plan-free',
    name: 'Free',
    slug: 'free',
    price_monthly: 0,
    price_yearly: 0,
    monthly_trade_limit: 15,
    is_active: true,
    sort_order: 1,
    features: [
      { name: '15 Trades / Month', included: true },
      { name: 'Manual Trade Journal', included: true },
      { name: 'Basic Analytics (Win Rate, PnL)', included: true },
      { name: 'Position Size Calculator', included: true },
      { name: 'TradingView Economic Calendar', included: true },
      { name: 'Community Q&A Question Submissions', included: true },
      { name: 'Marketplace Access', included: true },
      { name: 'AI Trading Assistant (Basic)', included: true },
    ],
  },
  {
    id: 'plan-pro',
    name: 'Pro Trader',
    slug: 'pro',
    price_monthly: 19,
    price_yearly: 190,
    monthly_trade_limit: -1,
    is_active: true,
    sort_order: 2,
    features: [
      { name: 'Unlimited Trades Journaling', included: true },
      { name: 'Full Trade Journal with Screenshot Uploads', included: true },
      { name: 'Advanced Analytics & Expectancy Engine', included: true },
      { name: 'MT4/MT5 CSV History Import', included: true },
      { name: 'Position Size Calculator & Widgets', included: true },
      { name: 'Full Community Q&A with Admin Analysis', included: true },
      { name: 'AI Trading Assistant (Gemini Flash)', included: true },
      { name: 'Member Discounts on Courses & EAs', included: true },
    ],
  },
  {
    id: 'plan-elite',
    name: 'Elite Master',
    slug: 'elite',
    price_monthly: 39,
    price_yearly: 390,
    monthly_trade_limit: -1,
    is_active: true,
    sort_order: 3,
    features: [
      { name: 'Everything in Pro Included', included: true },
      { name: 'Candle-by-Candle Backtest Simulator', included: true },
      { name: 'Priority Admin Q&A Chart Reviews', included: true },
      { name: 'Deep AI Trader Psychological Profiling', included: true },
      { name: 'Full Access to All Indicator Suites', included: true },
      { name: 'VIP 24/7 Dedicated Support', included: true },
    ],
  },
]

// Initial Payment Methods
export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-upi',
    type: 'upi',
    label: 'UPI (India Instant - GooglePay, PhonePe, Paytm)',
    details: {
      upi_id: 'eagletrading@okaxis',
      payee_name: 'Eagle Trading Zone FX Book',
      instructions: 'Open your UPI app (GPay/PhonePe/Paytm), send exact INR equivalent, and enter the 12-digit UTR/Reference ID below.',
    },
    qr_url: '/logo.png',
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'pm-crypto',
    type: 'crypto',
    label: 'USDT (Tether Crypto - TRC20 / ERC20)',
    details: {
      trc20_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      erc20_address: '0x71C8360f3E233301E0cfb902181512f4Ecbfe9a3',
      instructions: 'Transfer exact USD amount in USDT. Copy the Transaction Hash / TxID and paste it into the form.',
    },
    qr_url: '/logo.png',
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'pm-bank',
    type: 'bank',
    label: 'International Bank Wire / IMPS / NEFT',
    details: {
      bank_name: 'Federal Bank International Ltd',
      account_name: 'Eagle Trading Zone Technologies Pvt Ltd',
      account_number: '12340056789012',
      ifsc_code: 'FDRL0001234',
      swift_code: 'FDRLINBB',
      instructions: 'Transfer via Wire/IMPS. Include your account email in transaction remarks.',
    },
    qr_url: null,
    is_active: true,
    sort_order: 3,
  },
]

// Feature Flags
export const INITIAL_FEATURE_FLAGS: FeatureFlag[] = [
  { id: 'ff-1', key: 'csv_import', label: 'CSV Trade Import', description: 'Bulk import trades from MT4/MT5 exports', is_enabled: true, min_plan: 'pro' },
  { id: 'ff-2', key: 'ai_reports', label: 'AI Performance Reports', description: 'Analyze trader journal with AI & detect revenge trading', is_enabled: true, min_plan: 'pro' },
  { id: 'ff-3', key: 'backtesting', label: 'Candle Replay Backtesting', description: 'Candle-by-candle market simulator with virtual executions', is_enabled: true, min_plan: 'elite' },
  { id: 'ff-4', key: 'community_chat', label: 'Community Q&A Forum', description: 'Interactive trader questions with verified Admin-only replies', is_enabled: true, min_plan: 'free' },
  { id: 'ff-5', key: 'share_cards', label: 'Performance Share Cards', description: 'Generate high-res PNG cards for social media', is_enabled: true, min_plan: 'free' },
  { id: 'ff-6', key: 'mt4_sync', label: 'MT4/MT5 Auto-Sync (Beta Waitlist)', description: 'Direct broker bridge connection', is_enabled: true, min_plan: 'free' },
]

// Sample Initial Trades for Demo (TradeFXBook style)
export const INITIAL_TRADES: Trade[] = [
  {
    id: 'trade-1',
    user_id: 'demo-user-id',
    symbol: 'XAUUSD',
    direction: 'buy',
    entry_price: 2382.40,
    exit_price: 2404.60,
    stop_loss: 2374.00,
    take_profit: 2405.00,
    lot_size: 1.0,
    pnl: 2220.00,
    trade_date: new Date(Date.now() - 6 * 86400000).toISOString(),
    close_date: new Date(Date.now() - 6 * 86400000 + 7200000).toISOString(),
    strategy_tag: 'Fair Value Gap',
    notes: 'Clean 15m order block tap during London session open. Target previous weekly high.',
    emotion: 'Disciplined',
    rating: 5,
    screenshot_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&auto=format&fit=crop',
    checklist: ['H4 Market Structure Bullish', '15m FVG Sweep', 'Risk <= 1%'],
    is_open: false,
    session: 'London',
  },
  {
    id: 'trade-2',
    user_id: 'demo-user-id',
    symbol: 'EURUSD',
    direction: 'sell',
    entry_price: 1.0890,
    exit_price: 1.0845,
    stop_loss: 1.0915,
    take_profit: 1.0840,
    lot_size: 2.0,
    pnl: 900.00,
    trade_date: new Date(Date.now() - 5 * 86400000).toISOString(),
    close_date: new Date(Date.now() - 5 * 86400000 + 10800000).toISOString(),
    strategy_tag: 'Liquidity Sweep',
    notes: 'Asian high swept cleanly at 08:30 NY time. Bearish displacement followed.',
    emotion: 'Disciplined',
    rating: 4,
    screenshot_url: null,
    checklist: ['Liquidity grab confirmed', 'Risk-reward >= 1:2'],
    is_open: false,
    session: 'New York',
  },
  {
    id: 'trade-3',
    user_id: 'demo-user-id',
    symbol: 'BTCUSD',
    direction: 'buy',
    entry_price: 64200.00,
    exit_price: 63650.00,
    stop_loss: 63600.00,
    take_profit: 66000.00,
    lot_size: 0.5,
    pnl: -275.00,
    trade_date: new Date(Date.now() - 4 * 86400000).toISOString(),
    close_date: new Date(Date.now() - 4 * 86400000 + 3600000).toISOString(),
    strategy_tag: 'Breakout',
    notes: 'Tried to catch sudden breakout without waiting for candle close. False breakout caught me.',
    emotion: 'FOMO',
    rating: 2,
    screenshot_url: null,
    checklist: ['Breakout confirmation', 'Volume surge'],
    is_open: false,
    session: 'Asian',
  },
  {
    id: 'trade-4',
    user_id: 'demo-user-id',
    symbol: 'GBPUSD',
    direction: 'buy',
    entry_price: 1.2710,
    exit_price: 1.2785,
    stop_loss: 1.2685,
    take_profit: 1.2790,
    lot_size: 1.5,
    pnl: 1125.00,
    trade_date: new Date(Date.now() - 3 * 86400000).toISOString(),
    close_date: new Date(Date.now() - 3 * 86400000 + 14400000).toISOString(),
    strategy_tag: 'Trend Continuation',
    notes: 'Pulled back to 50 EMA on 1H chart with bullish engulfing pin bar.',
    emotion: 'Confident',
    rating: 5,
    screenshot_url: null,
    checklist: ['EMA Alignment', 'Engulfing Trigger', 'SL at swing low'],
    is_open: false,
    session: 'London',
  },
  {
    id: 'trade-5',
    user_id: 'demo-user-id',
    symbol: 'XAUUSD',
    direction: 'sell',
    entry_price: 2415.00,
    exit_price: 2422.00,
    stop_loss: 2422.00,
    take_profit: 2390.00,
    lot_size: 1.2,
    pnl: -840.00,
    trade_date: new Date(Date.now() - 2 * 86400000).toISOString(),
    close_date: new Date(Date.now() - 2 * 86400000 + 2400000).toISOString(),
    strategy_tag: 'Counter-Trend',
    notes: 'Tried to pick a top against strong momentum CPI news. Bad execution.',
    emotion: 'Revenge',
    rating: 1,
    screenshot_url: null,
    checklist: ['News avoided? (Violated!)'],
    is_open: false,
    session: 'New York',
  },
  {
    id: 'trade-6',
    user_id: 'demo-user-id',
    symbol: 'USDJPY',
    direction: 'buy',
    entry_price: 155.20,
    exit_price: 156.40,
    stop_loss: 154.80,
    take_profit: 156.50,
    lot_size: 1.5,
    pnl: 1150.00,
    trade_date: new Date(Date.now() - 1 * 86400000).toISOString(),
    close_date: new Date(Date.now() - 1 * 86400000 + 18000000).toISOString(),
    strategy_tag: 'Support Bounce',
    notes: 'Clean bounce off major daily horizontal support with Bank of Japan interest rate tailwind.',
    emotion: 'Disciplined',
    rating: 4,
    screenshot_url: null,
    checklist: ['Daily Level', 'Risk 1%', 'Take Profit set'],
    is_open: false,
    session: 'Asian',
  },
]

// Blog Posts
export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Psychology of Risk: Why 90% of Forex Traders Blow Accounts in Year 1',
    slug: 'psychology-of-risk-forex-failure',
    excerpt: 'Trading is not merely math and indicators; it is an emotional arena. Discover the 3 fatal psychological traps and how journaling cures them.',
    cover_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop',
    author: 'Chief Market Analyst',
    published_at: '2026-10-15',
    read_time: '6 min read',
    tags: ['Psychology', 'Risk Management', 'Discipline'],
    is_published: true,
    content: `
# The Psychology of Risk: Why 90% of Forex Traders Fail

When most beginners open their first trading account, they believe success boils down to finding a "secret indicator" or a 90% win-rate strategy. 

Yet professional prop traders know the uncomfortable truth: **Edge is only 20% of trading; risk management and emotional discipline are the other 80%.**

### 1. The Trap of Revenge Trading
A loss hurts the ego. An unjournaled trader instantly jumps back in with double the lot size to "win back" the money. This single mistake accounts for over 70% of blown accounts in retail trading.

### 2. Sizing Without Math
If your stop loss is 30 pips on EUR/USD and 120 pips on Gold (XAU/USD), using 1.0 lot on both means you are risking 4x more dollars on Gold! Professional traders calculate lot size based on fixed dollar risk (e.g., 1% of equity), not arbitrary numbers.

### 3. The Power of the Trade Journal
What gets measured gets mastered. By logging:
- Your pre-trade checklist
- Your emotional state (Disciplined, FOMO, Revenge)
- Session timing
- Screenshot of entry and exit

You transform from a chaotic gambler into an elite systematic executor.
    `,
  },
  {
    id: 'blog-2',
    title: 'Mastering Gold (XAUUSD): High-Probability London & NY Session Setups',
    slug: 'mastering-gold-xauusd-setups',
    excerpt: 'Gold is the king of volatility. Learn how to capitalize on the London Open expansion and NY morning liquidity sweeps.',
    cover_url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop',
    author: 'Eagle Senior Strategist',
    published_at: '2026-10-12',
    read_time: '8 min read',
    tags: ['Gold', 'XAUUSD', 'Session Trading'],
    is_published: true,
    content: `
# Mastering Gold (XAUUSD): High-Probability Session Strategies

Gold moves faster than almost any fiat currency pair. A single 1-hour candle can traverse 250+ pips. 

### Why Session Timing is Everything
Gold typically consolidates during the Asian session, establishing a defined high and low range. When Frankfurt and London open (07:00–09:00 GMT), algorithms frequently trigger a "Judas Swing" — a fake breakout of the Asian range to grab stops before reversing into the true directional trend.

### The 3 Rules for Trading Gold Safely:
1. **Never trade during high-impact US CPI or NFP without wide stops or waiting for the 15-minute post-news candle close.**
2. **Take partial profits at key swing points.** Do not let a +$1,500 trade round-trip into a loss.
3. **Audit your average Gold hold time in Eagle FX Book analytics.** Most retail traders stay in losing Gold trades too long and cut winners too quickly.
    `,
  },
  {
    id: 'blog-3',
    title: 'Automated MT5 Expert Advisors vs Manual Discretionary Trading: The Hybrid Approach',
    slug: 'automated-eas-vs-manual-trading',
    excerpt: 'Can automated trading bots replace human intuition? Explore how modern algorithmic traders combine code and market structure.',
    cover_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop',
    author: 'Algo Systems Lead',
    published_at: '2026-10-08',
    read_time: '7 min read',
    tags: ['Algorithms', 'MT5', 'Automation'],
    is_published: true,
    content: `
# Automated MT5 Expert Advisors vs Discretionary Trading

The debate between pure manual chart reading and automated algorithmic trading has raged for decades.

In 2026, the most successful prop traders use a **Hybrid Execution Model**:
1. Human trader sets the daily macro bias based on economic events and session highs/lows.
2. The Expert Advisor (EA) handles millisecond execution, automated lot sizing, and multi-stage trailing stops.

This eliminates emotional hesitation at entry and ensures rules are never violated.
    `,
  },
]

// Community Chat Initial Messages
export const INITIAL_MESSAGES: CommunityMessage[] = [
  {
    id: 'msg-1',
    room_id: 'forex-general',
    user_id: 'user-vip-1',
    user_name: 'AlphaFalcon',
    user_plan: 'elite',
    content: 'EURUSD rejected 1.0890 cleanly. Watching for a retest before London close.',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg-2',
    room_id: 'forex-general',
    user_id: 'user-vip-2',
    user_name: 'PipsHunter_99',
    user_plan: 'pro',
    content: 'Solid call! Took 45 pips on that drop. Journaled in Eagle FX with screenshot.',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'msg-3',
    room_id: 'gold-scalping',
    user_id: 'user-vip-3',
    user_name: 'GoldSniper',
    user_plan: 'elite',
    content: 'XAUUSD holding 2400 psychological support. If NY 4-hour closes above 2405, targeting 2420 next.',
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
]
