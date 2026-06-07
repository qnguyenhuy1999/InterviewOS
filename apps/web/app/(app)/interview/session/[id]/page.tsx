import type { InterviewSessionDetail, UserLearningProfile } from '@interviewos/types'
import { InterviewSessionPage } from '@interviewos/ui'
import type { InterviewSessionPageTurn } from '@interviewos/ui'

import { InterviewAnswerForm } from '@/components/forms/InterviewAnswerForm'
import { MultiTurnForm } from '@/components/forms/MultiTurnForm'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [session, profile] = await Promise.all([
    serverApiClient<InterviewSessionDetail>(`/sessions/${id}`).catch(() => null),
    serverApiClient<UserLearningProfile | null>('/users/me/profile').catch(() => null),
  ])

  const isMultiTurn = session?.mode === 'MULTI_TURN' || session?.mode === 'COMPANY'
  const turns =
    isMultiTurn && session
      ? await serverApiClient<InterviewSessionPageTurn[]>(`/sessions/${id}/turns`).catch(
          () => [] as InterviewSessionPageTurn[],
        )
      : []

  return (
    <InterviewSessionPage
      session={session}
      turns={turns}
      renderMultiTurnForm={({ sessionId, turns: t, isComplete }) => (
        <MultiTurnForm sessionId={sessionId} initialTurns={t} isComplete={isComplete} />
      )}
      renderAnswerForm={({ session: s }) =>
        profile ? <InterviewAnswerForm session={s} profile={profile} /> : null
      }
    />
  )
}
