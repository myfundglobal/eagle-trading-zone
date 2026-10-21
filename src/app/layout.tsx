import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth-context'
import { FloatingAIAssistant } from '@/components/layout/FloatingAIAssistant'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Eagle Trading Zone FX Book | Professional Forex Trading Journal',
    template: '%s | Eagle Trading Zone FX Book',
  },
  description: 'The most powerful forex, gold & crypto trading journal. Track trades, analyse performance, backtest strategies and get AI-powered insights.',
  keywords: ['forex journal', 'trading journal', 'forex analytics', 'trade tracker', 'MT4 journal', 'MT5 journal', 'gold trading', 'crypto trading'],
  authors: [{ name: 'Eagle Trading Zone' }],
  creator: 'Eagle Trading Zone',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Eagle Trading Zone FX Book',
    title: 'Eagle Trading Zone FX Book | Professional Forex Trading Journal',
    description: 'Track, analyse and improve your trading with professional-grade tools.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eagle Trading Zone FX Book',
    description: 'Professional Forex Trading Journal & Analytics',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#E5261A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <FloatingAIAssistant />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a1a1f',
                  color: '#F0F0F5',
                  border: '1px solid rgba(229,38,26,0.3)',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
