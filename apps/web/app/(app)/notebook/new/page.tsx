import type { UserLearningProfile } from '@interviewos/types'

import { NoteForm } from '@/components/forms/NoteForm'
import { serverApiClient } from '@/lib/server-api-client'

export default async function NewNotebookPage() {
  const profile = await serverApiClient<UserLearningProfile | null>('/users/me/profile').catch(
    () => null,
  )

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Create a note</h2>
        <p className="text-sm text-muted-foreground">
          Start from rough notes and decide whether this note should inherit or override your
          onboarding defaults.
        </p>
      </div>
      <NoteForm profile={profile} />
    </div>
  )
}
