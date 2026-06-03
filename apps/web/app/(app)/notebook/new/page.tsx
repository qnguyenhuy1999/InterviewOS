import type { UserLearningProfile } from '@interviewos/types'

import { NoteForm } from '@/components/forms/NoteForm'
import { apiClient } from '@/lib/api-client'

export default async function NewNotePage() {
  const profile = await apiClient<UserLearningProfile | null>('/users/me/profile').catch(() => null)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">New note</h2>
        <p className="text-sm text-muted-foreground">
          Capture a topic and rough notes. Your learning profile will be used automatically.
        </p>
      </div>
      <NoteForm profile={profile} />
    </div>
  )
}
