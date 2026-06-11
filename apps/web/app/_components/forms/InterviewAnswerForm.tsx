'use client'

import { API_ROUTES } from '@interviewos/config'
import type { InterviewSession, UserLearningProfile } from '@interviewos/types'
import { InterviewAnswerForm as InterviewAnswerFormUI } from '@interviewos/ui/organisms/InterviewAnswerForm'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'

type SessionProps = Pick<
  InterviewSession,
  | 'id'
  | 'overrideRole'
  | 'overrideLevel'
  | 'overrideStack'
  | 'overrideGoals'
  | 'overrideEnglishLevel'
  | 'preferredOutputStyle'
>

export function InterviewAnswerForm({
  session,
  profile,
}: {
  session: SessionProps
  profile: UserLearningProfile
}) {
  const router = useRouter()
  const { id: sessionId, ...sessionForUI } = session

  async function handleSubmit(
    payload: Parameters<React.ComponentProps<typeof InterviewAnswerFormUI>['onSubmit']>[0],
  ) {
    const response = await apiFetch(API_ROUTES.sessions.answer(sessionId), {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  return <InterviewAnswerFormUI session={sessionForUI} profile={profile} onSubmit={handleSubmit} />
}
