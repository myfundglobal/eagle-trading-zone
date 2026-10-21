import { Metadata } from 'next'
import { AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Risk Disclaimer',
  description: 'Important risk disclaimer for Eagle Trading Zone FX Book users.',
}

export default function RiskDisclaimerPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold text-white">Risk Disclaimer</h1>
        </div>
        
        <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-8">
          <p className="text-amber-300 font-semibold text-lg">
            ⚠️ Trading involves significant risk. This platform is a journaling and analytics tool, not financial advice.
          </p>
        </div>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>Forex, gold, cryptocurrency, and other financial instruments involve a high level of risk and may not be suitable for all investors. The possibility exists that you could sustain a loss of some or all of your initial investment.</p>
          
          <p>Eagle Trading Zone FX Book provides journaling, analytics, and performance-tracking tools. Nothing on this platform constitutes financial advice, investment advice, trading signals, or recommendations to buy or sell any financial instrument.</p>
          
          <p>Past performance, whether real or simulated, is not indicative of future results. The risk of loss in trading can be substantial. You should therefore carefully consider whether such trading is suitable for you in light of your financial condition.</p>
          
          <p>Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. You should also be aware of all the risks associated with trading and seek advice from an independent financial advisor if you have any doubts.</p>
          
          <p>Eagle Trading Zone and its operators are not registered financial advisors, brokers, or investment managers in any jurisdiction. By using this platform, you acknowledge and accept full responsibility for your own trading decisions.</p>
        </div>
      </div>
    </div>
  )
}
