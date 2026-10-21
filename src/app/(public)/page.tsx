import { HeroSection } from '@/components/home/HeroSection'
import { StatsSection } from '@/components/home/StatsSection'
import { ProductsMarketplaceSection } from '@/components/home/ProductsMarketplaceSection'
import { FeaturesSection } from '@/components/home/FeaturesSection'
import { DashboardPreview } from '@/components/home/DashboardPreview'
import { MarketBlogSection } from '@/components/home/MarketBlogSection'
import { PricingSection } from '@/components/home/PricingSection'
import { FAQSection } from '@/components/home/FAQSection'
import { CTASection } from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProductsMarketplaceSection />
      <FeaturesSection />
      <DashboardPreview />
      <MarketBlogSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
