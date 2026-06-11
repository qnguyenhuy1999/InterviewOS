'use client'

import { API_ROUTES } from '@interviewos/config'
import { VerifyEmailForm as VerifyEmailFormUI } from '@interviewos/ui/organisms/VerifyEmailForm'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'

export function VerifyEmailForm({ token }: { token?: string }) {
  const router = useRouter()

  async function handleVerify(data: { token: string }) {
    const response = await apiFetch(API_ROUTES.auth.confirmEmailVerification, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  async function handleResend(data: { email: string }) {
    const response = await apiFetch(API_ROUTES.auth.resendEmailVerification, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(await response.text())
  }

  return <VerifyEmailFormUI token={token} onVerify={handleVerify} onResend={handleResend} />
}
