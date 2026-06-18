import { SectionCard } from '../../../../components/ui/page'
import type { InterviewSessionPageProps, InterviewSessionPageSession } from '../InterviewSessionPage.types'
import { formatInterviewSessionDateLabel } from '../InterviewSessionPage.utils'

function SingleTurnBody({
  session,
  renderAnswerForm,
}: {
  session: InterviewSessionPageSession
  renderAnswerForm?: InterviewSessionPageProps['renderAnswerForm']
}) {
  const question = session.questions[0]
  const answer = question?.answer

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionCard
        title="Question"
        description={`${session.note?.title ?? 'Notebook question'} · Started ${formatInterviewSessionDateLabel(session.createdAt)}`}
      >
        <p className="text-sm text-muted-foreground">
          {question?.question ?? 'Question unavailable'}
        </p>
        <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
          {question?.difficulty ?? 'Unknown'} · {question?.category ?? 'Unknown'} ·{' '}
          {question?.expectedConcepts.join(', ') || 'No concepts'}
        </p>
      </SectionCard>

      <div className="grid gap-6">
        {!answer ? (
          <SectionCard
            title="Practice answer"
            description="Submit your answer to generate feedback and weak concept signals."
          >
            {renderAnswerForm?.({ session }) ?? (
              <p className="text-sm text-muted-foreground">
                Connect an answer form to submit a practice response.
              </p>
            )}
          </SectionCard>
        ) : null}

        {answer?.rawAnswer ? (
          <SectionCard title="Submitted answer" description="Your latest recorded response.">
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{answer.rawAnswer}</p>
          </SectionCard>
        ) : null}

        <SectionCard
          title="Technical feedback"
          description="Structured feedback based on your submitted answer."
        >
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
        </SectionCard>
      </div>
    </div>
  )
}

export { SingleTurnBody }
