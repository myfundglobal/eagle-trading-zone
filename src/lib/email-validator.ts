/**
 * Disposable & Temporary Email Domain Detection
 * Eagle Trading Zone - Security Rule
 */

export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  '10minutemail.org',
  'tempmail.com',
  'temp-mail.org',
  'tempmail.net',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.biz',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'mailinator.com',
  'mailinator.net',
  'mailinator2.com',
  'throwawaymail.com',
  'yopmail.com',
  'yopmail.net',
  'yopmail.fr',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'dispostable.com',
  'sharklasers.com',
  'getairmail.com',
  'grr.la',
  'inboxkitten.com',
  'fakemailgenerator.com',
  'crazymailing.com',
  'generator.email',
  'mailnull.com',
  'mytemp.email',
  'tempail.com',
  'burnermail.io',
  'dropmail.me',
  'mohmal.com',
  'fakeinbox.com',
  'nada.ltd',
  'getnada.com',
  'crazymailing.com',
  'tempinbox.com',
  'trashmail.org',
  'jetable.org',
  'emailondeck.com',
  'maildrop.cc',
  'discard.email',
  'discardmail.com',
  'spambog.com',
  'mintemail.com',
  'minuteinbox.com',
  'zillamail.com',
])

export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false
  const domain = email.split('@')[1]?.toLowerCase().trim()
  if (!domain) return false

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return true
  }

  // Check subdomains (e.g. abc.mailinator.com)
  for (const blocked of DISPOSABLE_EMAIL_DOMAINS) {
    if (domain.endsWith('.' + blocked)) {
      return true
    }
  }

  return false
}

export function validateSignupEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email address is required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address format.' }
  }

  if (isDisposableEmail(email)) {
    return {
      isValid: false,
      error: 'Temporary and disposable email domains are strictly blocked. Please sign up with a permanent email provider (e.g. Gmail, Outlook, Yahoo, or custom domain).',
    }
  }

  return { isValid: true }
}
