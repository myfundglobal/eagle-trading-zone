import { Metadata } from 'next'
import { FeaturesHero } from '@/components/features/FeaturesHero'
import { FeaturesList } from '@/components/features/FeaturesList'

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore all the powerful features of Eagle Trading Zone FX Book — journal, analytics, AI reports, backtesting and more.',
}

export default function FeaturesPage() {
  return (
    <div className="pt-20">
      <FeaturesHero />
      <FeaturesList />
    </div>
  )
}
