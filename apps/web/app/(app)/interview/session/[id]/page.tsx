import type { InterviewSessionDetail, UserLearningProfile } from '@interviewos/types'

import { InterviewAnswerForm } from '@/components/forms/InterviewAnswerForm'
import { MultiTurnForm } from '@/components/forms/MultiTurnForm'
import { formatDate } from '@/lib/format'
import { serverApiClient } from '@/lib/server-api-client'

type Turn = {
  id: string
  role: 'CANDIDATE' | 'INTERVIEWER'
  content: string
  turnNumber: number
  decision?: string | null
  topicTags?: string[]
  reasoning?: string | null
}

type SessionDetail = InterviewSessionDetail & {
  note: { title: string | null } | null
  questions: Array<{
    id: string
    question: string
    difficulty: string
    category: string
    expectedConcepts: string[]
    answer: {
      rawAnswer: string
      overallScore: number | null
      technicalFeedback: { summary: string; strengths: string[]; improvements: string[] } | null
      englishFeedback: {
        summary: string
        overallScore: number
        highlightedTopics: string[]
      } | null
      nextRecommendedQuestion: { question: string; difficulty: string; reason: string } | null
      recommendedLearning: { title: string; reason: string; action: string } | null
      weakConcepts: string[]
    } | null
  }>
}

function ProgressRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [session, profile] = await Promise.all([
    serverApiClient<SessionDetail>(`/sessions/${id}`).catch(() => null),
    serverApiClient<UserLearningProfile | null>('/users/me/profile').catch(() => null),
  ])

  const isMultiTurn = session?.mode === 'MULTI_TURN' || session?.mode === 'COMPANY'

  if (isMultiTurn && session) {
    const turns = await serverApiClient<Turn[]>(`/sessions/${id}/turns`).catch(() => [] as Turn[])
    const isComplete = session.status === 'PUBLISHED'
    const completedTurns = turns.filter((turn) => turn.role === 'CANDIDATE').length
    const maxTurns = session.maxTurns ?? 0

    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_320px]">
          <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-medium">Interview Room</h2>
              <p className="text-sm text-muted-foreground">
                {session.type} · {session.mode === 'COMPANY' ? session.companyMode?.name ?? 'Company mode' : 'Practice mode'} · Started {formatDate(session.createdAt)}
              </p>
            </div>

            {session.summary?.headline ? (
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Session summary
                </p>
                <p className="mt-1 text-sm">{session.summary.headline}</p>
              </div>
            ) : null}

            <div className="rounded-xl border border-border bg-background/60 p-4">
              <MultiTurnForm
                sessionId={id}
                initialTurns={turns}
                isComplete={isComplete}
              />
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-heading text-base font-medium">Progress</h3>
              <div className="mt-4 space-y-3">
                <ProgressRow label="Version" value={`v${session.version ?? 1}`} />
                <ProgressRow label="Status" value={session.status} />
                <ProgressRow label="Turns" value={maxTurns > 0 ? `${completedTurns}/${maxTurns}` : `${completedTurns}`} />
                <ProgressRow label="Last activity" value={formatDate(session.lastActivityAt ?? session.updatedAt)} />
              </div>
            </section>

            {session.readinessImpact ? (
              <section className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-heading text-base font-medium">Readiness impact</h3>
                <div className="mt-4 space-y-3">
                  <ProgressRow label="Overall" value={signed(session.readinessImpact.overallDelta)} />
                  <ProgressRow label="Technical" value={signed(session.readinessImpact.technicalDelta)} />
                  <ProgressRow label="Behavioral" value={signed(session.readinessImpact.behavioralDelta)} />
                  <ProgressRow label="System design" value={signed(session.readinessImpact.systemDesignDelta)} />
                  <ProgressRow label="Communication" value={signed(session.readinessImpact.communicationDelta)} />
                </div>
              </section>
            ) : null}

            {isComplete ? (
              <a
                href={`/interview/session/${id}/review`}
                className="block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
              >
                Open session review
              </a>
            ) : null}
          </aside>
        </div>
      </div>
    )
  }

  if (!session || !profile) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load this interview session.
      </div>
    )
  }

  const question = session.questions[0]
  const answer = question?.answer

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-medium">Interview Session</h2>
        <p className="text-sm text-muted-foreground">
          {session.note?.title ?? 'Notebook question'} · Started {formatDate(session.createdAt)}
        </p>
      </div>

      <section className="rounded-lg border border-border p-4">
        <h3 className="mb-2 font-heading text-base font-medium">Question</h3>
        <p className="text-sm text-muted-foreground">{question?.question ?? 'Question unavailable'}</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
          {question?.difficulty ?? 'Unknown'} · {question?.category ?? 'Unknown'} · {question?.expectedConcepts.join(', ') ?? 'No concepts'}
        </p>
      </section>

      <div className="grid gap-6">
        {!answer ? (
          <section className="rounded-lg border border-border p-4">
            <h3 className="mb-3 font-heading text-base font-medium">Practice answer</h3>
            <InterviewAnswerForm session={session} profile={profile} />
          </section>
        ) : null}

        {answer?.rawAnswer ? (
          <section className="rounded-lg border border-border p-4">
            <h3 className="mb-2 font-heading text-base font-medium">Submitted answer</h3>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{answer.rawAnswer}</p>
          </section>
        ) : null}

        <section className="rounded-lg border border-border p-4">
          <h3 className="mb-2 font-heading text-base font-medium">Technical feedback</h3>
          {answer?.technicalFeedback ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{answer.technicalFeedback.summary}</p>
              <p>Overall score: {answer.overallScore ?? 'Not scored'}</p>
              <p>Strengths: {answer.technicalFeedback.strengths.join(', ')}</p>
              <p>Improvements: {answer.technicalFeedback.improvements.join(', ')}</p>
              <p>Weak concepts: {answer.weakConcepts.join(', ') || 'None captured'}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Submit your answer to receive technical feedback.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

function signed(value: number) {
  return value > 0 ? `+${value}` : `${value}`
}
