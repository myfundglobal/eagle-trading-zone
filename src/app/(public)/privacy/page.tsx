import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Eagle Trading Zone FX Book Privacy Policy.',
}

export default function PrivacyPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-gradient mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: October 2026</p>
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly: your name, email address, and trade data you enter into the platform. We also collect usage data and technical information such as IP address, browser type, and device information to improve our services.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>Your data is used solely to operate the Eagle Trading Zone FX Book platform, provide analytics, send account-related notifications, and improve our services. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Data Security</h2>
            <p>All data is stored securely using Supabase, which provides row-level security, encrypted connections (TLS), and industry-standard security practices. Payment screenshots are stored securely and accessed only by authorised administrators.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We do not use advertising or tracking cookies.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. Contact us at the address below to exercise these rights.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Contact</h2>
            <p>For privacy-related queries, contact us at: privacy@eagletradingzone.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
