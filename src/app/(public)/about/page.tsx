import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Eagle Trading Zone FX Book and our mission to help traders succeed.',
}

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Image src="/logo.png" alt="Eagle Trading Zone" width={120} height={120} className="animate-glow-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6">About Eagle Trading Zone</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Eagle Trading Zone FX Book was built by traders, for traders. We know the struggles of maintaining a consistent trading journal — scattered spreadsheets, no real insights, no accountability.
          </p>
        </div>

        <div className="grid gap-8">
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-2xl">🦅</span> Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed">
              To give every forex, gold and crypto trader a professional-grade analytics platform that turns raw trade data into actionable insights — so you trade smarter, not harder.
            </p>
          </div>

          <div className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-2xl">🔥</span> Why Eagle?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The eagle sees from above — with clarity and precision. Our platform gives you that same eagle-eye view of your trading performance. Spot your patterns, eliminate your mistakes, and soar higher.
            </p>
          </div>

          <div className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-2xl">🛡️</span> Our Commitment
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Your data is yours. We use bank-grade security (Supabase), we never sell your data, and we never give financial advice. This is a journaling and analytics tool — the trading decisions are always yours.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center p-8 gradient-border rounded-2xl">
          <p className="text-gray-400 text-sm">
            Eagle Trading Zone FX Book is a journaling and analytics tool. It does not provide financial advice, investment recommendations, or trading signals. Trading involves significant risk.
          </p>
        </div>
      </div>
    </div>
  )
}
