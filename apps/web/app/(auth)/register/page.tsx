import AuthPage from '@interviewos/ui/pages/AuthPage'
import Link from 'next/link'

import { RegisterForm } from '@/app/_components/forms/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthPage
      eyebrow="Create account"
      title="Start a focused interview practice system from day one."
      description="Create your workspace to capture resume context, identify weak concepts, and turn every session into a tighter next step."
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthPage>
  )
}
