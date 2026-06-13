'use client'

import { API_ROUTES } from '@interviewos/config'
import { RegisterForm as RegisterFormUI } from '@interviewos/ui/organisms/RegisterForm'
import type { RegisterInput } from '@interviewos/validators'
import { useRouter } from 'next/navigation'

import { apiFetch, createApiError } from '@/lib/api-client'

export function RegisterForm() {
  const router = useRouter()

  async function handleSubmit(values: RegisterInput) {
    const response = await apiFetch(API_ROUTES.auth.register, {
      method: 'POST',
      body: JSON.stringify(values),
    })
    if (!response.ok) throw await createApiError(response)
    router.push('/onboarding')
  }

  return <RegisterFormUI onSubmit={handleSubmit} />
}
