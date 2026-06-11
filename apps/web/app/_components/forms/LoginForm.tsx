'use client'

import { API_ROUTES } from '@interviewos/config'
import { LoginForm as LoginFormUI } from '@interviewos/ui/organisms/LoginForm'
import { useRouter } from 'next/navigation'

import { apiFetch, createApiError } from '@/lib/api-client'

export function LoginForm() {
  const router = useRouter()

  async function handleSubmit(data: { email: string; password: string }) {
    const response = await apiFetch(API_ROUTES.auth.login, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.ok) throw await createApiError(response)
    router.push('/dashboard')
    router.refresh()
  }

  return <LoginFormUI onSubmit={handleSubmit} forgotPasswordHref="/forgot-password" />
}
