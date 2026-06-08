import 'server-only'

import { API_ROUTES } from '@interviewos/config'
import type { UserLearningProfile } from '@interviewos/types'
import { redirect } from 'next/navigation'

import { APP_ROUTES } from './app-routes'
import { serverApiClient } from './server-api-client'

type RequireLearningProfileOptions = {
  reason: string
  next?: string
}

export async function getOptionalLearningProfile() {
  return serverApiClient<UserLearningProfile | null>(API_ROUTES.users.learningProfile).catch(
    () => null,
  )
}

export async function requireLearningProfile({
  reason,
  next,
}: RequireLearningProfileOptions) {
  const profile = await getOptionalLearningProfile()

  if (profile) {
    return profile
  }

  const params = new URLSearchParams({ reason })
  if (next) {
    params.set('next', next)
  }

  redirect(`${APP_ROUTES.onboarding}?${params.toString()}`)
}
