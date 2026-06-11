'use client'

import { API_ROUTES } from '@interviewos/config'
import type { UpsertUserLearningProfileInput, UserLearningProfile } from '@interviewos/types'
import { ProfileForm as ProfileFormUI } from '@interviewos/ui/organisms/ProfileForm'
import { useRouter } from 'next/navigation'

import { apiFetch, createApiError } from '@/lib/api-client'

type ProfileFormProps = {
  initialProfile: UserLearningProfile | null
  mode: 'onboarding' | 'settings'
  redirectTo?: string
}

export function ProfileForm({ initialProfile, mode, redirectTo }: ProfileFormProps) {
  const router = useRouter()

  async function handleSubmit(payload: UpsertUserLearningProfileInput) {
    const response = await apiFetch(API_ROUTES.users.learningProfile, {
      method: initialProfile ? 'PATCH' : 'POST',
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw await createApiError(response)
    router.push(redirectTo ?? (mode === 'onboarding' ? '/notebook' : '/settings'))
    router.refresh()
  }

  return <ProfileFormUI initialProfile={initialProfile} mode={mode} onSubmit={handleSubmit} />
}
