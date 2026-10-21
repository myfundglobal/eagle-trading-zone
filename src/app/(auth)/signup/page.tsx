import { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your free Eagle Trading Zone FX Book account.',
}

export default function SignupPage() {
  return <SignupForm />
}
