-- ==============================================================================
-- EAGLE TRADING ZONE FX BOOK — COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- ==============================================================================
-- KAISE CHALAYE (HOW TO RUN):
-- 1. Supabase Dashboard (https://supabase.com/dashboard) open karo
-- 2. Apna project select karo
-- 3. Left sidebar me "SQL Editor" par click karo
-- 4. "New query" button dabao
-- 5. Ye poora script copy karke wahan paste karo aur "Run" (ya Ctrl+Enter) dabao
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES TABLE (User profiles linked to Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'elite')),
  plan_start TIMESTAMPTZ,
  plan_expiry TIMESTAMPTZ,
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  monthly_trade_count INT NOT NULL DEFAULT 0,
  monthly_reset_date DATE DEFAULT CURRENT_DATE,
  preferred_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ==============================================================================
-- 3. AUTOMATIC USER CREATION TRIGGER
-- Naya user signup karega to automatically profile ban jayegi with plan = 'free'
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, plan, plan_start)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '/logo.png'),
    'user',
    'free',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at timestamp helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_profiles_updated ON public.profiles;
CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- 4. TRADES TABLE (Trading Journal with RLS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('buy', 'sell')),
  entry_price NUMERIC(16, 6) NOT NULL,
  exit_price NUMERIC(16, 6),
  stop_loss NUMERIC(16, 6),
  take_profit NUMERIC(16, 6),
  lot_size NUMERIC(10, 3) NOT NULL,
  pnl NUMERIC(14, 2),
  trade_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  close_date TIMESTAMPTZ,
  strategy_tag TEXT,
  notes TEXT,
  emotion TEXT CHECK (emotion IN ('Disciplined', 'FOMO', 'Revenge', 'Confident', 'Fearful', 'Greedy', 'Neutral', NULL)),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  screenshot_url TEXT,
  checklist JSONB DEFAULT '[]'::jsonb,
  is_open BOOLEAN NOT NULL DEFAULT FALSE,
  session TEXT CHECK (session IN ('Asian', 'London', 'New York', 'Overlap', NULL)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trades_user_id ON public.trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_trade_date ON public.trades(trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON public.trades(symbol);

DROP TRIGGER IF EXISTS tr_trades_updated ON public.trades;
CREATE TRIGGER tr_trades_updated BEFORE UPDATE ON public.trades FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- 5. PLANS & PRICING TABLE (Admin Managed)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE CHECK (slug IN ('free', 'pro', 'elite')),
  price_monthly NUMERIC(10, 2) NOT NULL DEFAULT 0,
  price_yearly NUMERIC(10, 2) NOT NULL DEFAULT 0,
  monthly_trade_limit INT NOT NULL DEFAULT 15,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. PAYMENT METHODS TABLE (UPI, Bank, USDT Crypto QR)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('upi', 'bank', 'crypto', 'other')),
  label TEXT NOT NULL,
  details JSONB NOT NULL,
  qr_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. PAYMENT REQUESTS TABLE (Manual Screenshot Approval)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  plan_slug TEXT NOT NULL CHECK (plan_slug IN ('pro', 'elite')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_requests_user ON public.payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON public.payment_requests(status);

-- ==============================================================================
-- 8. FEATURE FLAGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  min_plan TEXT NOT NULL DEFAULT 'free' CHECK (min_plan IN ('free', 'pro', 'elite')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 9. COMMUNITY MESSAGES TABLE (Realtime Chat)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  room TEXT NOT NULL DEFAULT 'general' CHECK (room IN ('general', 'forex-gold', 'crypto', 'setups')),
  message TEXT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_messages_room ON public.community_messages(room, created_at DESC);

-- ==============================================================================
-- 10. NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'payment', 'announcement')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. AUDIT LOGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- Security: Har user sirf apna data dekh sakta hai
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper to check if logged in user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles are viewable by owner or admin" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner or admin" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Trades Policies (Strictly user-isolated)
DROP POLICY IF EXISTS "Users can view own trades" ON public.trades;
CREATE POLICY "Users can view own trades" ON public.trades
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own trades" ON public.trades;
CREATE POLICY "Users can insert own trades" ON public.trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own trades" ON public.trades;
CREATE POLICY "Users can update own trades" ON public.trades
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own trades" ON public.trades;
CREATE POLICY "Users can delete own trades" ON public.trades
  FOR DELETE USING (auth.uid() = user_id);

-- Plans & Payment Methods Policies (Public read, admin write)
DROP POLICY IF EXISTS "Plans are viewable by everyone" ON public.plans;
CREATE POLICY "Plans are viewable by everyone" ON public.plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage plans" ON public.plans;
CREATE POLICY "Admins can manage plans" ON public.plans FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Payment methods are viewable by authenticated users" ON public.payment_methods;
CREATE POLICY "Payment methods are viewable by authenticated users" ON public.payment_methods
  FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage payment methods" ON public.payment_methods;
CREATE POLICY "Admins can manage payment methods" ON public.payment_methods FOR ALL USING (public.is_admin());

-- Payment Requests Policies
DROP POLICY IF EXISTS "Users can view own payment requests" ON public.payment_requests;
CREATE POLICY "Users can view own payment requests" ON public.payment_requests FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payment requests" ON public.payment_requests;
CREATE POLICY "Users can insert own payment requests" ON public.payment_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage payment requests" ON public.payment_requests;
CREATE POLICY "Admins can manage payment requests" ON public.payment_requests FOR ALL USING (public.is_admin());

-- Community Messages Policies
DROP POLICY IF EXISTS "Active community messages viewable by logged in users" ON public.community_messages;
CREATE POLICY "Active community messages viewable by logged in users" ON public.community_messages
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_deleted = false);

DROP POLICY IF EXISTS "Users can post community messages" ON public.community_messages;
CREATE POLICY "Users can post community messages" ON public.community_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can delete messages" ON public.community_messages;
CREATE POLICY "Admins can delete messages" ON public.community_messages FOR ALL USING (public.is_admin());

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark notifications as read" ON public.notifications;
CREATE POLICY "Users can mark notifications as read" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
CREATE POLICY "Admins can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Feature Flags Policies
DROP POLICY IF EXISTS "Feature flags are viewable by everyone" ON public.feature_flags;
CREATE POLICY "Feature flags are viewable by everyone" ON public.feature_flags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage feature flags" ON public.feature_flags;
CREATE POLICY "Admins can manage feature flags" ON public.feature_flags FOR ALL USING (public.is_admin());

-- Audit Logs Policies
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 13. STORAGE BUCKETS (Screenshots ke liye)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('payment-proofs', 'payment-proofs', true),
  ('trade-screenshots', 'trade-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
DROP POLICY IF EXISTS "Public View Payment Proofs" ON storage.objects;
CREATE POLICY "Public View Payment Proofs" ON storage.objects FOR SELECT USING (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Authenticated Upload Payment Proofs" ON storage.objects;
CREATE POLICY "Authenticated Upload Payment Proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public View Trade Screenshots" ON storage.objects;
CREATE POLICY "Public View Trade Screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'trade-screenshots');

DROP POLICY IF EXISTS "Authenticated Upload Trade Screenshots" ON storage.objects;
CREATE POLICY "Authenticated Upload Trade Screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'trade-screenshots' AND auth.role() = 'authenticated');

-- ==============================================================================
-- 14. DEFAULT SEED DATA (Plans, Payment Methods, Feature Flags)
-- ==============================================================================
INSERT INTO public.plans (name, slug, price_monthly, price_yearly, monthly_trade_limit, features, is_active, sort_order)
VALUES 
(
  'Free',
  'free',
  0,
  0,
  15,
  '[
    {"name": "15 Trades Per Month", "included": true},
    {"name": "Manual Trade Logging", "included": true},
    {"name": "Basic Win/Loss Analytics", "included": true},
    {"name": "Equity Curve & Calendar Heatmap", "included": true},
    {"name": "MT4/MT5 CSV Import", "included": false},
    {"name": "AI Revenge Trading Audit", "included": false},
    {"name": "Candle Backtesting Simulator", "included": false},
    {"name": "Live Community Chat", "included": false}
  ]'::jsonb,
  true,
  1
),
(
  'Pro',
  'pro',
  19.00,
  190.00,
  -1,
  '[
    {"name": "Unlimited Trades Per Month", "included": true},
    {"name": "Manual Trade Logging", "included": true},
    {"name": "Full Analytics & Drawdown Metrics", "included": true},
    {"name": "MT4/MT5 CSV History Import", "included": true},
    {"name": "AI Performance & Revenge Audit", "included": true},
    {"name": "PNG Performance Share Cards", "included": true},
    {"name": "Live Community Chat & Leaderboard", "included": true},
    {"name": "Candle Backtesting Simulator", "included": false}
  ]'::jsonb,
  true,
  2
),
(
  'Elite',
  'elite',
  39.00,
  390.00,
  -1,
  '[
    {"name": "Everything in Pro Included", "included": true},
    {"name": "Candle-by-Candle Backtesting Simulator", "included": true},
    {"name": "Virtual Trade Execution with SL/TP", "included": true},
    {"name": "Deep AI Psychological Profiling", "included": true},
    {"name": "Early Access to MT4/MT5 Auto-Sync", "included": true},
    {"name": "VIP Eagle Trader Badge", "included": true},
    {"name": "Priority Support", "included": true}
  ]'::jsonb,
  true,
  3
)
ON CONFLICT (slug) DO UPDATE SET 
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features;

-- Payment Methods
INSERT INTO public.payment_methods (type, label, details, is_active, sort_order)
VALUES
(
  'upi',
  'UPI Payment (Instant QR & ID)',
  '{
    "upi_id": "eagletrading@okaxis",
    "payee_name": "Eagle Trading Zone FX",
    "note": "Pay via GooglePay, PhonePe, Paytm or BHIM. Mention account email in remarks."
  }'::jsonb,
  true,
  1
),
(
  'crypto',
  'USDT (Tether) Crypto Wallet',
  '{
    "network_trc20": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    "network_erc20": "0x71C8360f3E233301E0cfb902181512f4Ecbfe9a3",
    "accepted_coins": "USDT (TRC20, ERC20, BEP20)",
    "note": "Send exact USD equivalent. Provide Transaction Hash (TxID) in the form."
  }'::jsonb,
  true,
  2
),
(
  'bank',
  'Direct Bank Wire / NEFT / IMPS',
  '{
    "bank_name": "Federal Bank Ltd",
    "account_name": "Eagle Trading Zone Technologies",
    "account_number": "12340056789012",
    "ifsc_code": "FDRL0001234",
    "swift_code": "FDRLINBB",
    "note": "Include your user email in the transfer description."
  }'::jsonb,
  true,
  3
);

-- Feature Flags
INSERT INTO public.feature_flags (key, label, description, is_enabled, min_plan)
VALUES
('csv_import', 'CSV Trade Import', 'Allow users to bulk import MT4/MT5 history files', true, 'pro'),
('ai_reports', 'AI Performance Audit', 'AI analysis of journaled trades with psychology grade', true, 'pro'),
('backtesting', 'Candle Replay Backtesting', 'Interactive chart simulator with virtual execution', true, 'elite'),
('community_chat', 'Community Chat Rooms', 'Realtime chat rooms for traders', true, 'pro'),
('share_cards', 'Performance Share Cards', 'Downloadable PNG performance graphics', true, 'free'),
('mt4_sync_preview', 'MT4/MT5 Auto Sync (Coming Soon)', 'Broker connection preview and waitlist', true, 'free')
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- 👑 APNE ACCOUNT KO ADMIN BANANE KE LIYE (ONE-TIME STEP):
-- ==============================================================================
-- Jab aap website par pehli baar signup kar lein, toh niche wali query me apna email
-- daal kar run kar dena:
--
-- UPDATE public.profiles 
-- SET role = 'admin', plan = 'elite' 
-- WHERE email = 'apna-email@gmail.com';
-- ==============================================================================
