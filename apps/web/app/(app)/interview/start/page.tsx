import { API_ROUTES } from '@interviewos/config'
import type { CompanyMode, NotebookNoteListItem } from '@interviewos/types'

import { StartInterviewForm } from '@/app/_components/forms/StartInterviewForm'
import { APP_ROUTES } from '@/lib/app-routes'
import { requireLearningProfile } from '@/lib/learning-profile-guard'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams
  const profile = await requireLearningProfile({
    reason: 'Complete onboarding before starting an interview session.',
    next: mode === 'quick' ? `${APP_ROUTES.interviewStart}?mode=quick` : APP_ROUTES.interviewStart,
  })

  const state = await loadRouteData(
    async () => {
      const [notes, companyModes] = await Promise.all([
        serverApiClient<NotebookNoteListItem[]>(API_ROUTES.notes.list),
        serverApiClient<CompanyMode[]>(API_ROUTES.companyModes.list),
      ])

      return { notes, companyModes }
    },
    { fallbackMessage: 'Unable to load the interview setup form.' },
  )

  if (state.kind === 'error') {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        <p className="font-medium">Failed to load interview setup</p>
        <p className="mt-2">{state.message}</p>
        <a href={APP_ROUTES.interview} className="mt-4 inline-block underline">
          Back to interview sessions
        </a>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <StartInterviewForm
        profile={profile}
        notes={state.kind === 'ready' ? state.data.notes : []}
        companyModes={state.kind === 'ready' ? state.data.companyModes : []}
        defaultMode={mode === 'quick' ? 'MULTI_TURN' : 'STANDARD'}
      />
    </div>
  )
}
