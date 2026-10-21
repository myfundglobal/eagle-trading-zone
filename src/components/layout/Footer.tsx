import Link from 'next/link'
import Image from 'next/image'
import { Twitter, Youtube, Instagram, MessageCircle } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Risk Disclaimer', href: '/risk-disclaimer' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-void-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Eagle Trading Zone" width={48} height={48} />
              <div>
                <span className="text-lg font-bold text-gradient">Eagle Trading Zone</span>
                <span className="block text-xs text-gray-500">FX Book</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Professional trading journal and analytics platform for forex, gold and crypto traders. Track, analyse, and improve.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Twitter, Youtube, Instagram, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-void-800 text-gray-500 hover:text-ember-400 hover:bg-ember-400/10 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-ember-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Eagle Trading Zone. All rights reserved.
          </p>
          <p className="text-xs text-gray-700 text-center max-w-lg">
            ⚠️ Trading involves risk. Eagle Trading Zone FX Book is a journaling and analytics tool, not financial advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
