import { API_ROUTES } from '@interviewos/config'
import type { UserLearningProfile } from '@interviewos/types'

import { ProfileForm } from '@/components/forms/ProfileForm'
import { serverApiClient } from '@/lib/server-api-client'

export default async function OnboardingPage() {
  const profile = await serverApiClient<UserLearningProfile | null>(
    API_ROUTES.users.learningProfile,
  ).catch(() => null)

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Set up your profile</h2>
        <p className="text-sm text-muted-foreground">Step 1 of 1: Profile</p>
      </div>
      <ProfileForm initialProfile={profile} mode="onboarding" />
    </div>
  )
}
