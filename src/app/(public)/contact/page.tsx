import { Metadata } from 'next'
import { ContactSection } from '@/components/home/ContactSection'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Eagle Trading Zone FX Book team.',
}

export default function ContactPage() {
  return (
    <div className="pt-20">
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">Get in Touch</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Have questions? We would love to hear from you.
        </p>
      </div>
      <ContactSection />
    </div>
  )
}
