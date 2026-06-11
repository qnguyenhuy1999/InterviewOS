'use client'

import { API_ROUTES } from '@interviewos/config'
import { ResetPasswordForm as ResetPasswordFormUI } from '@interviewos/ui/organisms/ResetPasswordForm'
import { useRouter } from 'next/navigation'

import { apiFetch, createApiError } from '@/lib/api-client'

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter()

  async function handleSubmit(data: { token: string; password: string }) {
    const response = await apiFetch(API_ROUTES.auth.resetPassword, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.ok) throw await createApiError(response)
  }

  function handleSuccess() {
    setTimeout(() => {
      router.push('/login')
      router.refresh()
    }, 1500)
  }

  return <ResetPasswordFormUI token={token} onSubmit={handleSubmit} onSuccess={handleSuccess} />
}
