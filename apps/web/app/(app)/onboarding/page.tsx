import { API_ROUTES } from '@interviewos/config'
import type { UserLearningProfile } from '@interviewos/types'
import OnboardingPage from '@interviewos/ui/pages/OnboardingPage'
import { redirect } from 'next/navigation'

import { ProfileForm } from '@/app/_components/forms/ProfileForm'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; next?: string }>
}) {
  const params = await searchParams
  const profile = await serverApiClient<UserLearningProfile | null>(
    API_ROUTES.users.learningProfile,
  ).catch(() => null)

  if (profile) {
    redirect('/settings')
  }

  return (
    <OnboardingPage reason={params.reason}>
      <ProfileForm initialProfile={null} mode="onboarding" redirectTo={params.next} />
    </OnboardingPage>
  )
}
