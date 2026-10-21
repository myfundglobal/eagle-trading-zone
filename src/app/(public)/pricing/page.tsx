import { Metadata } from 'next'
import { PricingSection } from '@/components/home/PricingSection'
import { PricingFAQ } from '@/components/pricing/PricingFAQ'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for every trader. Start free, upgrade when you are ready.',
}

export default function PricingPage() {
  return (
    <div className="pt-20">
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">Simple Pricing</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Start free. Upgrade when you are ready to trade smarter.
        </p>
      </div>
      <PricingSection />
      <PricingFAQ />
    </div>
  )
}
