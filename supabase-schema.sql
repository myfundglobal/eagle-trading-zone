-- ==============================================================================
-- EAGLE TRADING ZONE — MASTER SUPABASE SQL SCHEMA & PERMISSION MATRIX
-- ==============================================================================
-- App Name: Eagle Trading Zone
-- Design: Dark theme with deep blacks and neon red/orange accents
-- Purpose: Trading platform, digital product marketplace (courses/software),
--          trading journal, and admin-controlled community Q&A.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE 1: USERS (User profiles, authentication details & verification status)
-- Fields: Name, Email, Phone Number, Password, Role (Admin/User), Verification Status
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  password_hash TEXT, -- Managed primarily by Supabase Auth (auth.users)
  role TEXT NOT NULL DEFAULT 'User' CHECK (role IN ('User', 'Admin', 'user', 'admin')),
  verification_status TEXT NOT NULL DEFAULT 'Unverified' CHECK (verification_status IN ('Unverified', 'Verified', 'Pending')),
  avatar_url TEXT DEFAULT '/logo.png',
  preferred_currency TEXT DEFAULT 'USD',
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'elite')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backward compatibility alias with profiles
CREATE OR REPLACE VIEW public.profiles AS SELECT * FROM public.users;

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_verification ON public.users(verification_status);

-- ==============================================================================
-- TABLE 2: PRODUCTS (Digital Product Marketplace: Courses & Software)
-- Fields: Type (Course/Software), Title, Description, Price, Access/Download Link
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('Course', 'Software')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  access_link TEXT NOT NULL DEFAULT '/dashboard/purchases',
  download_link TEXT NOT NULL,
  thumbnail_url TEXT DEFAULT '/logo.png',
  rating NUMERIC(3, 2) DEFAULT 4.9,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  badge TEXT,
  version TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_type ON public.products(type);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

-- ==============================================================================
-- TABLE 3: TRANSACTIONS (Order payments and past payment logs)
-- Fields: User ID, Product ID, Payment Status, and Date
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  payment_status TEXT NOT NULL DEFAULT 'Completed' CHECK (payment_status IN ('Completed', 'Pending', 'Failed')),
  amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'Credit Card',
  receipt_number TEXT UNIQUE NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_product ON public.transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(payment_status);

-- ==============================================================================
-- TABLE 4: TRADING JOURNAL (TradeFXBook style logging)
-- Fields: User ID, Asset/Pair, Entry Price, Exit Price, P&L, Notes, Chart Image URL
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.trading_journal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  asset_pair TEXT NOT NULL, -- e.g. EURUSD, XAUUSD, BTCUSD
  direction TEXT NOT NULL CHECK (direction IN ('Buy', 'Sell', 'buy', 'sell')),
  entry_price NUMERIC(16, 6) NOT NULL,
  exit_price NUMERIC(16, 6),
  stop_loss NUMERIC(16, 6),
  take_profit NUMERIC(16, 6),
  lot_size NUMERIC(10, 3) NOT NULL DEFAULT 1.0,
  pnl NUMERIC(14, 2) DEFAULT 0.00,
  notes TEXT,
  chart_image_url TEXT,
  strategy_tag TEXT,
  emotion TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  session TEXT CHECK (session IN ('Asian', 'London', 'New York', 'Overlap', NULL)),
  checklist JSONB DEFAULT '[]'::jsonb,
  is_open BOOLEAN NOT NULL DEFAULT FALSE,
  trade_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alias view for legacy trades references
CREATE OR REPLACE VIEW public.trades AS 
SELECT 
  id, user_id, asset_pair AS symbol, direction, entry_price, exit_price,
  stop_loss, take_profit, lot_size, pnl, trade_date, NULL::timestamptz AS close_date,
  strategy_tag, notes, emotion, rating, chart_image_url AS screenshot_url,
  checklist, is_open, session, created_at, updated_at
FROM public.trading_journal;

CREATE INDEX IF NOT EXISTS idx_journal_user ON public.trading_journal(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_pair ON public.trading_journal(asset_pair);
CREATE INDEX IF NOT EXISTS idx_journal_date ON public.trading_journal(trade_date DESC);

-- ==============================================================================
-- TABLE 5: COMMUNITY Q&A (Admin-Controlled Forum)
-- Fields: Post ID, User ID (Asker), Question Text, Admin Reply Text, Admin Attachment/Image
-- Strict Permission: Any user can submit a question, ONLY Admin can post replies & attachments!
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_qa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id TEXT UNIQUE NOT NULL, -- e.g. POST-101
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  question_text TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General Trading Q&A',
  admin_reply_text TEXT, -- Populated ONLY by Admin
  admin_attachment_url TEXT, -- Populated ONLY by Admin (Chart Image / File)
  admin_name TEXT,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Answered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  replied_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_community_qa_post_id ON public.community_qa(post_id);
CREATE INDEX IF NOT EXISTS idx_community_qa_user ON public.community_qa(user_id);
CREATE INDEX IF NOT EXISTS idx_community_qa_status ON public.community_qa(status);

-- ==============================================================================
-- TABLE 6: BLOGS (Market Insights, Educational Articles, Analysis)
-- Fields: Title, Content, and Publish Date
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL DEFAULT 'Eagle Trading Zone Research',
  cover_image TEXT DEFAULT '/logo.png',
  tags JSONB DEFAULT '[]'::jsonb,
  read_time TEXT DEFAULT '5 min read',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  publish_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_date ON public.blogs(publish_date DESC);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) & EXACT PERMISSION POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if currently authenticated user has Admin role
CREATE OR REPLACE FUNCTION public.is_eagle_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND (role = 'Admin' OR role = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- COMMUNITY Q&A PERMISSION RULES (CRITICAL USER REQUIREMENT):
-- Rule 1: ANY user (authenticated) can VIEW all questions & admin answers.
-- Rule 2: ANY logged-in user can SUBMIT a question (where admin fields are NULL).
-- Rule 3: ONLY Admin can UPDATE to supply admin_reply_text and admin_attachment_url!
-- Rule 4: ONLY Admin can DELETE community posts.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view community Q&A" ON public.community_qa;
CREATE POLICY "Public can view community Q&A"
  ON public.community_qa FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can submit questions only" ON public.community_qa;
CREATE POLICY "Users can submit questions only"
  ON public.community_qa FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND admin_reply_text IS NULL 
    AND admin_attachment_url IS NULL
    AND status = 'Open'
  );

DROP POLICY IF EXISTS "Admin ONLY can reply and attach files" ON public.community_qa;
CREATE POLICY "Admin ONLY can reply and attach files"
  ON public.community_qa FOR UPDATE
  USING (public.is_eagle_admin())
  WITH CHECK (public.is_eagle_admin());

DROP POLICY IF EXISTS "Admin ONLY can delete community posts" ON public.community_qa;
CREATE POLICY "Admin ONLY can delete community posts"
  ON public.community_qa FOR DELETE
  USING (public.is_eagle_admin());

-- -----------------------------------------------------------------------------
-- PRODUCTS PERMISSION RULES:
-- Public can view active products. Only Admin can create/update/delete.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (is_active = TRUE OR public.is_eagle_admin());

DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
CREATE POLICY "Admin can manage products"
  ON public.products FOR ALL
  USING (public.is_eagle_admin());

-- -----------------------------------------------------------------------------
-- TRANSACTIONS PERMISSION RULES:
-- Users can view their own transactions. Admins can view all transactions.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id OR public.is_eagle_admin());

DROP POLICY IF EXISTS "Users can insert transactions on checkout" ON public.transactions;
CREATE POLICY "Users can insert transactions on checkout"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- TRADING JOURNAL PERMISSION RULES:
-- Users can only see, create, edit, and delete their own trading journal logs.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own trading journal" ON public.trading_journal;
CREATE POLICY "Users manage own trading journal"
  ON public.trading_journal FOR ALL
  USING (auth.uid() = user_id OR public.is_eagle_admin());

-- -----------------------------------------------------------------------------
-- USERS PROFILE PERMISSION RULES:
-- Users can read and update their own details. Admins can view all.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR public.is_eagle_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- BLOGS PERMISSION RULES:
-- Public can read published blogs. Only Admins can create/edit.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can read published blogs" ON public.blogs;
CREATE POLICY "Anyone can read published blogs"
  ON public.blogs FOR SELECT
  USING (is_published = TRUE OR public.is_eagle_admin());

DROP POLICY IF EXISTS "Admins can manage blogs" ON public.blogs;
CREATE POLICY "Admins can manage blogs"
  ON public.blogs FOR ALL
  USING (public.is_eagle_admin());

-- ==============================================================================
-- 8. SAMPLE INITIAL SEED DATA
-- ==============================================================================
INSERT INTO public.products (type, title, description, price, access_link, download_link, thumbnail_url, rating, features, badge)
VALUES
  ('Course', 'Eagle Institutional Price Action & Smart Money Course', 'Master institutional order flow, bank liquidity pools, Fair Value Gaps (FVG), and high-RR setups.', 99.00, '/dashboard/purchases', 'https://cdn.eagletradingzone.com/institutional-smc-course.pdf', '/logo.png', 4.9, '["18 Hours Video Modules", "Live Trade Breakdown Archive", "Entry Checklist PDF", "Private Q&A Access"]'::jsonb, 'Bestseller'),
  ('Software', 'Eagle Trend Hunter MT5 Expert Advisor (EA)', 'Fully automated algorithmic execution bot designed for MetaTrader 5 with dynamic trailing stops and news filters.', 149.00, '/dashboard/purchases', 'https://cdn.eagletradingzone.com/EagleTrendHunter_v2.4.ex5', '/logo.png', 4.8, '["MT5 .ex5 Executable Bot", "Set Files for XAUUSD & EURUSD", "Telegram Alert Webhook", "Lifetime License Key"]'::jsonb, 'Top Algorithmic EA'),
  ('Course', 'Forex & Gold Scalping Blueprint: London & NY Open', 'Learn the exact 15-minute and 1-minute execution models used to scalp high-momentum expansions.', 79.00, '/dashboard/purchases', 'https://cdn.eagletradingzone.com/london-ny-scalping-handbook.pdf', '/logo.png', 4.9, '["12 Video Lessons", "Session Timing Heatmaps", "Live Execution Replays"]'::jsonb, 'High Impact'),
  ('Software', 'Eagle Liquidity & FVG Indicator Suite (MT5 / TradingView)', 'Real-time multi-timeframe indicator drawing institutional liquidity zones, imbalance gaps, and premium/discount.', 59.00, '/dashboard/purchases', 'https://cdn.eagletradingzone.com/Eagle_Liquidity_FVG_Suite.zip', '/logo.png', 4.7, '["TradingView PineScript v5", "MT5 Custom Indicator File", "Audio & Popup Alerts"]'::jsonb, 'Essential Tool')
ON CONFLICT DO NOTHING;

INSERT INTO public.blogs (title, slug, content, excerpt, author, cover_image, tags, read_time, is_published, publish_date)
VALUES
  (
    'The Psychology of Risk: Why 90% of Forex Traders Blow Accounts in Year 1',
    'psychology-of-risk-forex-failure',
    'Edge is only 20% of trading; risk management and emotional discipline are the other 80%. Never risk more than 1% of your account on any single trade.',
    'Trading is not merely math and indicators; it is an emotional arena. Discover the 3 fatal psychological traps and how journaling cures them.',
    'Chief Market Analyst',
    '/logo.png',
    '["Psychology", "Risk Management"]'::jsonb,
    '6 min read',
    TRUE,
    NOW() - INTERVAL '6 days'
  ),
  (
    'Mastering Gold (XAUUSD): High-Probability London & NY Session Setups',
    'mastering-gold-xauusd-setups',
    'Gold moves faster than almost any fiat currency pair. Learn how to capitalize on the London Open expansion and NY morning liquidity sweeps.',
    'Gold is the king of volatility. Learn how to capitalize on the London Open expansion and NY morning liquidity sweeps.',
    'Eagle Senior Strategist',
    '/logo.png',
    '["Gold", "XAUUSD", "Session Trading"]'::jsonb,
    '8 min read',
    TRUE,
    NOW() - INTERVAL '3 days'
  )
ON CONFLICT DO NOTHING;
