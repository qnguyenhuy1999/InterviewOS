import { API_ROUTES } from '@interviewos/config'
import type { InterviewSessionDetail, UserLearningProfile } from '@interviewos/types'
import type {
  InterviewSessionPageSession,
  InterviewSessionPageTurn,
} from '@interviewos/ui/pages/InterviewSessionPage'
import InterviewSessionPage from '@interviewos/ui/pages/InterviewSessionPage'

import { InterviewAnswerForm } from '@/components/forms/InterviewAnswerForm'
import { MultiTurnForm } from '@/components/forms/MultiTurnForm'
import { serverApiClient } from '@/lib/server-api-client'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [session, profile] = await Promise.all([
    serverApiClient<InterviewSessionDetail>(API_ROUTES.sessions.byId(id)).catch(() => null),
    serverApiClient<UserLearningProfile | null>(API_ROUTES.users.learningProfile).catch(
      () => null,
    ),
  ])

  const isMultiTurn = session?.mode === 'MULTI_TURN' || session?.mode === 'COMPANY'
  const turns =
    isMultiTurn && session
      ? await serverApiClient<InterviewSessionPageTurn[]>(API_ROUTES.sessions.turns(id)).catch(
          () => [] as InterviewSessionPageTurn[],
        )
      : []
  const sessionView = session ? mapSessionToPageSession(session) : null

  return (
    <InterviewSessionPage
      session={sessionView}
      turns={turns}
      renderMultiTurnForm={({ sessionId, turns: t, isComplete }) => (
        <MultiTurnForm sessionId={sessionId} initialTurns={t} isComplete={isComplete} />
      )}
      renderAnswerForm={() => (profile && session ? <InterviewAnswerForm session={session} profile={profile} /> : null)}
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
