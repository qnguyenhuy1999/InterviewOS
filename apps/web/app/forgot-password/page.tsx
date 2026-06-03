import Link from 'next/link'

import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-2xl font-bold">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Request a single-use password reset link.
          </p>
        </div>
        <ForgotPasswordForm />
        <p className="text-center text-sm text-muted-foreground">
          Back to{' '}
          <Link href="/login" className="text-primary hover:underline">
            sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
