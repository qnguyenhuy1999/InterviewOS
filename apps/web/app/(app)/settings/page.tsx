import type { UserLearningProfile } from '@interviewos/types'

import { ProfileForm } from '@/components/forms/ProfileForm'
import { serverApiClient } from '@/lib/server-api-client'

export default async function SettingsPage() {
  const profile = await serverApiClient<UserLearningProfile | null>('/users/me/profile').catch(
    () => null,
  )

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Update your defaults</h2>
        <p className="text-sm text-muted-foreground">
          These settings seed notebook generation and interview sessions unless you override them
          per note or session.
        </p>
      </div>
      <ProfileForm initialProfile={profile} mode="settings" />
    </div>
  )
}
