'use client'

import { API_ROUTES } from '@interviewos/config'
import type { CompanyMode, NotebookNoteListItem, UserLearningProfile } from '@interviewos/types'
import { StartInterviewForm as StartInterviewFormUI } from '@interviewos/ui/organisms/StartInterviewForm'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'
import { APP_ROUTES } from '@/lib/app-routes'

type StartInterviewMode = 'STANDARD' | 'MULTI_TURN' | 'COMPANY'

export function StartInterviewForm({
  companyModes,
  defaultMode,
  notes,
  profile,
}: {
  companyModes: CompanyMode[]
  defaultMode: StartInterviewMode
  notes: NotebookNoteListItem[]
  profile: UserLearningProfile
}) {
  const router = useRouter()

  async function handleSubmit(
    payload: Parameters<React.ComponentProps<typeof StartInterviewFormUI>['onSubmit']>[0],
  ) {
    const response = await apiFetch(API_ROUTES.sessions.multiTurn, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(await response.text())
    const session = (await response.json()) as { id: string }
    router.push(APP_ROUTES.interviewSession(session.id))
    router.refresh()
  }

  return (
    <StartInterviewFormUI
      companyModes={companyModes}
      defaultMode={defaultMode}
      notes={notes}
      profile={profile}
      backHref={APP_ROUTES.interview}
      onSubmit={handleSubmit}
    />
  )
}
