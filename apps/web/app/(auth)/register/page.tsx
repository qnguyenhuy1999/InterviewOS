import Link from 'next/link'

import { RegisterForm } from '@/components/forms/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-2xl font-bold">Create your InterviewOS account</h1>
          <p className="text-sm text-muted-foreground">Start preparing for your interviews</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
