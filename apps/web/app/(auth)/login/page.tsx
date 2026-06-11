import Link from 'next/link'

import { LoginForm } from '@/app/_components/forms/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your InterviewOS account</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
