import type { InterviewSession, UserLearningProfile } from '@interviewos/types'

import { InterviewAnswerForm } from '@/components/forms/InterviewAnswerForm'
import { formatDate } from '@/lib/format'
import { serverApiClient } from '@/lib/server-api-client'

type SessionDetail = InterviewSession & {
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
          {question?.difficulty ?? 'Unknown'} · {question?.category ?? 'Unknown'} ·{' '}
          {question?.expectedConcepts.join(', ') ?? 'No concepts'}
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
          <h3 className="mb-2 font-heading text-base font-medium">Technical Feedback</h3>
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

        <section className="rounded-lg border border-border p-4">
          <h3 className="mb-2 font-heading text-base font-medium">English Feedback</h3>
          {answer?.englishFeedback ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{answer.englishFeedback.summary}</p>
              <p>Overall score: {answer.englishFeedback.overallScore}</p>
              <p>
                Highlighted topics: {answer.englishFeedback.highlightedTopics.join(', ') || 'None'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              English feedback will appear after evaluation.
            </p>
          )}
        </section>

        <section className="rounded-lg border border-border p-4">
          <h3 className="mb-2 font-heading text-base font-medium">Next Recommended Question</h3>
          {answer?.nextRecommendedQuestion ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{answer.nextRecommendedQuestion.question}</p>
              <p>
                {answer.nextRecommendedQuestion.difficulty} ·{' '}
                {answer.nextRecommendedQuestion.reason}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              The next recommended question will appear here.
            </p>
          )}
        </section>

        <section className="rounded-lg border border-border p-4">
          <h3 className="mb-2 font-heading text-base font-medium">Recommended Learning</h3>
          {answer?.recommendedLearning ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{answer.recommendedLearning.title}</p>
              <p>{answer.recommendedLearning.reason}</p>
              <p>{answer.recommendedLearning.action}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Personalized recommendations will appear here.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
