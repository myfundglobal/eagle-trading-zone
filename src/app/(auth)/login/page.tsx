import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Eagle Trading Zone FX Book.',
}

export default function LoginPage() {
  return <LoginForm />
}
