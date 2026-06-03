import Link from 'next/link'

import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-2xl font-bold">Choose a new password</h1>
          <p className="text-sm text-muted-foreground">
            Reset tokens are single-use and expire automatically.
          </p>
        </div>
        <ResetPasswordForm token={params.token} />
        <p className="text-center text-sm text-muted-foreground">
          Need another link?{' '}
          <Link href="/forgot-password" className="text-primary hover:underline">
            Request a new reset email
          </Link>
        </p>
      </div>
    </div>
  )
}
