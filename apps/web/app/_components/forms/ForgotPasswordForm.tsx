'use client'

import { API_ROUTES } from '@interviewos/config'
import { ForgotPasswordForm as ForgotPasswordFormUI } from '@interviewos/ui/organisms/ForgotPasswordForm'

import { apiFetch } from '@/lib/api-client'

export function ForgotPasswordForm() {
  async function handleSubmit(data: { email: string }) {
    const response = await apiFetch(API_ROUTES.auth.forgotPassword, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(await response.text())
  }

  return <ForgotPasswordFormUI onSubmit={handleSubmit} />
}
