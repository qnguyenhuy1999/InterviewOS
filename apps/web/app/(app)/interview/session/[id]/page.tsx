import { API_ROUTES } from '@interviewos/config'
import type { InterviewSessionDetail } from '@interviewos/types'
import type {
  InterviewSessionPageSession,
  InterviewSessionPageTurn,
} from '@interviewos/ui/pages/InterviewSessionPage'
import InterviewSessionPage from '@interviewos/ui/pages/InterviewSessionPage'

import { InterviewAnswerForm } from '@/components/forms/InterviewAnswerForm'
import { MultiTurnForm } from '@/components/forms/MultiTurnForm'
import { APP_ROUTES } from '@/lib/app-routes'
import { requireLearningProfile } from '@/lib/learning-profile-guard'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await requireLearningProfile({
    reason: 'Complete onboarding before continuing an interview session.',
    next: APP_ROUTES.interviewSession(id),
  })
  const state = await loadRouteData(
    async () => {
      const session = await serverApiClient<InterviewSessionDetail>(API_ROUTES.sessions.byId(id))

      const isMultiTurn = session.mode === 'MULTI_TURN' || session.mode === 'COMPANY'
      const turns = isMultiTurn
        ? await serverApiClient<InterviewSessionPageTurn[]>(API_ROUTES.sessions.turns(id))
        : []

      return { session, profile, turns }
    },
    { fallbackMessage: 'Unable to load this interview session.' },
  )

  if (state.kind !== 'ready') {
    return <InterviewSessionPage error={state.kind === 'error' ? state.message : undefined} />
  }

  const sessionView = mapSessionToPageSession(state.data.session)

  return (
    <InterviewSessionPage
      session={sessionView}
      turns={state.data.turns}
      reviewHref={APP_ROUTES.interviewReview(id)}
      renderMultiTurnForm={({ sessionId, turns: t, isComplete }) => (
        <MultiTurnForm sessionId={sessionId} initialTurns={t} isComplete={isComplete} />
      )}
      renderAnswerForm={() =>
        <InterviewAnswerForm session={state.data.session} profile={state.data.profile} />
      }
    />
  )
}

function mapSessionToPageSession(session: InterviewSessionDetail): InterviewSessionPageSession {
  return {
    ...session,
    questions: session.questions.map((question) => ({
      id: question.id,
      question: question.question,
      difficulty: question.difficulty,
      category: question.category,
      expectedConcepts: question.expectedConcepts,
      answer: question.answer
        ? {
            rawAnswer: question.answer.rawAnswer,
            overallScore: question.answer.overallScore,
            technicalFeedback: question.answer.technicalFeedback,
            weakConcepts: question.answer.weakConcepts,
          }
        : null,
    })),
  }
}
