'use client'

import { API_ROUTES } from '@interviewos/config'
import type { ActiveAuthSession, AuthenticatedUser } from '@interviewos/types'
import { SecuritySettings as SecuritySettingsUI } from '@interviewos/ui/organisms/SecuritySettings'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'

export function SecuritySettings({
  currentUser,
  sessions,
}: {
  currentUser: AuthenticatedUser
  sessions: ActiveAuthSession[]
}) {
  const router = useRouter()

  async function handleResendVerification(email: string) {
    const response = await apiFetch(API_ROUTES.auth.resendEmailVerification, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  async function handleLogoutAll() {
    const response = await apiFetch(API_ROUTES.auth.logoutAll, { method: 'POST' })
    if (!response.ok) throw new Error(await response.text())
    window.location.href = '/login'
  }

  async function handleRevokeSession(sessionId: string) {
    const response = await apiFetch(API_ROUTES.auth.sessionById(sessionId), { method: 'DELETE' })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  return (
    <SecuritySettingsUI
      currentUser={currentUser}
      sessions={sessions}
      onResendVerification={handleResendVerification}
      onLogoutAll={handleLogoutAll}
      onRevokeSession={handleRevokeSession}
    />
  )
}
