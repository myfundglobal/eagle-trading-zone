import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Eagle Trading Zone FX Book Terms of Service.',
}

export default function TermsPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-gradient mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: October 2026</p>
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Eagle Trading Zone FX Book, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
            <p>Eagle Trading Zone FX Book is a trading journal, analytics and educational platform. It is NOT a financial advisory service, brokerage, or signal provider. All information on this platform is for journaling and educational purposes only.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to use this platform. You agree not to misuse the platform or attempt to access other users' data.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Payments and Subscriptions</h2>
            <p>Payments are processed manually. Once a payment is approved by an administrator, it is non-refundable unless otherwise agreed in writing. Plan features are subject to change with reasonable notice.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Intellectual Property</h2>
            <p>All content, design, and code on this platform are the property of Eagle Trading Zone. You may not reproduce, distribute, or create derivative works without explicit written permission.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p>Eagle Trading Zone FX Book is not liable for any financial losses arising from trading decisions. The platform provides analytics tools only — all trading decisions are made solely by the user.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
