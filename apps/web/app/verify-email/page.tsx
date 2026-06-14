import Link from 'next/link'
import AuthPage from '@interviewos/ui/pages/AuthPage'

import { VerifyEmailForm } from '@/app/_components/forms/VerifyEmailForm'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams

  return (
    <AuthPage
      eyebrow="Verify your email"
      title="Confirm your address so your account can keep moving."
      description="Use the verification token from your inbox or request a fresh email if the previous link expired."
      footer={
        <p className="text-sm text-muted-foreground">
          Return to{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            sign in
          </Link>
        </p>
      }
    >
      <VerifyEmailForm token={params.token} />
    </AuthPage>
  )
}
