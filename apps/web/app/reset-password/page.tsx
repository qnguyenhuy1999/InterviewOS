import Link from 'next/link'
import AuthPage from '@interviewos/ui/pages/AuthPage'

import { ResetPasswordForm } from '@/app/_components/forms/ResetPasswordForm'

function isValidResetToken(token: string | undefined): token is string {
  return typeof token === 'string' && /^[0-9a-f]{64}$/.test(token)
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  const token = isValidResetToken(params.token) ? params.token : undefined

  return (
    <AuthPage
      eyebrow="Choose a new password"
      title="Set a fresh password and reopen your interview workspace."
      description="Reset tokens are single-use, expire automatically, and should be used as soon as the email arrives."
      footer={
        <p className="text-sm text-muted-foreground">
          Need another link?{' '}
          <Link href="/forgot-password" className="font-medium text-primary hover:underline">
            Request a new reset email
          </Link>
        </p>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthPage>
  )
}
