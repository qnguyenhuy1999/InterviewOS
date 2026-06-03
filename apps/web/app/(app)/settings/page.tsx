import type { UserLearningProfile } from '@interviewos/types'

import { ProfileForm } from '@/components/forms/ProfileForm'
import { apiClient } from '@/lib/api-client'

export default async function SettingsPage() {
  const profile = await apiClient<UserLearningProfile | null>('/users/me/profile').catch(() => null)

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update the learning profile that powers note generation and practice defaults.
        </p>
      </div>
      <ProfileForm initialProfile={profile} mode="settings" />
    </div>
  )
}
