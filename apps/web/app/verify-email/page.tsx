import Link from 'next/link'

import { VerifyEmailForm } from '@/components/forms/VerifyEmailForm'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-2xl font-bold">Verify your email</h1>
          <p className="text-sm text-muted-foreground">
            Confirm your address or resend the verification email.
          </p>
        </div>
        <VerifyEmailForm token={params.token} />
        <p className="text-center text-sm text-muted-foreground">
          Return to{' '}
          <Link href="/login" className="text-primary hover:underline">
            sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
