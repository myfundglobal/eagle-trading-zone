export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          plan: 'free' | 'pro' | 'elite'
          plan_start: string | null
          plan_expiry: string | null
          is_banned: boolean
          monthly_trade_count: number
          monthly_reset_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          plan?: 'free' | 'pro' | 'elite'
          plan_start?: string | null
          plan_expiry?: string | null
          is_banned?: boolean
          monthly_trade_count?: number
          monthly_reset_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      trades: {
        Row: {
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
          emotion: string | null
          rating: number | null
          screenshot_url: string | null
          checklist: Json | null
          is_open: boolean
          session: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['trades']['Row']> & {
          user_id: string
          symbol: string
          direction: 'buy' | 'sell'
          entry_price: number
          lot_size: number
          trade_date: string
        }
        Update: Partial<Database['public']['Tables']['trades']['Insert']>
      }
      plans: {
        Row: {
          id: string
          name: string
          slug: 'free' | 'pro' | 'elite'
          price_monthly: number
          price_yearly: number
          monthly_trade_limit: number
          features: Json
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['plans']['Row']> & {
          name: string
          slug: 'free' | 'pro' | 'elite'
        }
        Update: Partial<Database['public']['Tables']['plans']['Insert']>
      }
      payment_methods: {
        Row: {
          id: string
          type: 'upi' | 'bank' | 'crypto' | 'other'
          label: string
          details: Json
          qr_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['payment_methods']['Row']> & {
          type: 'upi' | 'bank' | 'crypto' | 'other'
          label: string
          details: Json
        }
        Update: Partial<Database['public']['Tables']['payment_methods']['Insert']>
      }
      payment_requests: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          billing_period: 'monthly' | 'yearly'
          amount: number
          payment_method: string
          transaction_id: string
          payment_date: string
          note: string | null
          screenshot_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          admin_note: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['payment_requests']['Row']> & {
          user_id: string
          plan_id: string
          billing_period: 'monthly' | 'yearly'
          amount: number
          payment_method: string
          transaction_id: string
          payment_date: string
        }
        Update: Partial<Database['public']['Tables']['payment_requests']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          is_read: boolean
          link: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['notifications']['Row']> & {
          user_id: string
          title: string
          message: string
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          cover_url: string | null
          author_id: string | null
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['blog_posts']['Row']> & {
          title: string
          slug: string
          content: string
        }
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
      }
      audit_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          target_type: string | null
          target_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['audit_logs']['Row']> & {
          admin_id: string
          action: string
        }
        Update: never
      }
      community_messages: {
        Row: {
          id: string
          room_id: string
          user_id: string
          content: string
          is_deleted: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['community_messages']['Row']> & {
          room_id: string
          user_id: string
          content: string
        }
        Update: Partial<Database['public']['Tables']['community_messages']['Insert']>
      }
      support_tickets: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          status: 'open' | 'replied' | 'closed'
          admin_reply: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['support_tickets']['Row']> & {
          name: string
          email: string
          subject: string
          message: string
        }
        Update: Partial<Database['public']['Tables']['support_tickets']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
