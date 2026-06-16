import AuthPage from '@interviewos/ui/pages/AuthPage'
import Link from 'next/link'

import { LoginForm } from '@/app/_components/forms/LoginForm'

export default function LoginPage() {
  return (
    <AuthPage
      eyebrow="Welcome back"
      title="Re-enter your prep loop without losing context."
      description="Sign in to continue the interview sessions, review work, and notebook progress already tied to your account."
      footer={
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthPage>
  )
}
