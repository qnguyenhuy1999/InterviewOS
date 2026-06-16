import AuthPage from '@interviewos/ui/pages/AuthPage'
import Link from 'next/link'

import { ForgotPasswordForm } from '@/app/_components/forms/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <AuthPage
      eyebrow="Password reset"
      title="Get back in quickly with a single-use recovery link."
      description="Request a secure reset email and return to your dashboards, notes, and review queue without starting over."
      footer={
        <p className="text-sm text-muted-foreground">
          Back to{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthPage>
  )
}
