import type { InterviewSession } from '@interviewos/types'

import { InterviewAnswerForm } from '@/components/forms/InterviewAnswerForm'
import { apiClient } from '@/lib/api-client'

type SessionDetail = InterviewSession & {
  questions: Array<{
    id: string
    question: string
    difficulty: string
    category: string
    expectedConcepts: string[]
    answer: {
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
  const session = await apiClient<SessionDetail>(`/sessions/${id}`).catch(() => null)

  if (!session) {
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
          {question?.question ?? 'Question unavailable'}
        </p>
      </div>

      <div className="grid gap-6">
        {!answer ? (
          <section className="rounded-lg border border-border p-4">
            <h3 className="mb-3 font-heading text-base font-medium">Practice answer</h3>
            <InterviewAnswerForm sessionId={session.id} />
          </section>
        ) : null}

        <section className="rounded-lg border border-border p-4">
          <h3 className="mb-2 font-heading text-base font-medium">Technical Feedback</h3>
          {answer?.technicalFeedback ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{answer.technicalFeedback.summary}</p>
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
