import { API_ROUTES } from '@interviewos/config'
import type { UserLearningProfile } from '@interviewos/types'
import NotebookComposerPage from '@interviewos/ui/pages/NotebookComposerPage'

import { NoteForm } from '@/app/_components/forms/NoteForm'
import { serverApiClient } from '@/lib/server-api-client'

export default async function NewNotebookPage() {
  const profile = await serverApiClient<UserLearningProfile | null>(
    API_ROUTES.users.learningProfile,
  ).catch(() => null)

  return (
    <NotebookComposerPage
      profileStateLabel={profile ? 'Using onboarding defaults' : 'No onboarding defaults found'}
    >
      <NoteForm profile={profile} />
    </NotebookComposerPage>
  )
}
