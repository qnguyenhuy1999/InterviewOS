import { API_ROUTES } from '@interviewos/config'
import type {
  ActiveAuthSession,
  AuthSessionResponse,
  UserLearningProfile,
} from '@interviewos/types'

import { ProfileForm } from '@/app/_components/forms/ProfileForm'
import { serverApiClient } from '@/lib/server-api-client'

import { SecuritySettings } from './_components/SecuritySettings'

export default async function SettingsPage() {
  const [profile, session, sessions] = await Promise.all([
    serverApiClient<UserLearningProfile | null>(API_ROUTES.users.learningProfile).catch(() => null),
    serverApiClient<AuthSessionResponse>(API_ROUTES.auth.me),
    serverApiClient<ActiveAuthSession[]>(API_ROUTES.auth.sessions).catch(() => []),
  ])

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
      <SecuritySettings currentUser={session.user} sessions={sessions} />
    </div>
  )
}
