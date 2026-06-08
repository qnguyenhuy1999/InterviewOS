import type { InterviewSessionPageProps } from './InterviewSessionPage.types'

function formatDate(d: string | Date | null | undefined): string {
  if (!d) return 'Unknown'
  return new Date(d).toLocaleDateString()
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : `${value}`
}

function ProgressRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function InterviewSessionPage({
  session,
  turns = [],
  reviewHref,
  renderMultiTurnForm,
  renderAnswerForm,
}: InterviewSessionPageProps) {
  if (!session) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load this interview session.
      </div>
    )
  }

  const isMultiTurn = session.mode === 'MULTI_TURN' || session.mode === 'COMPANY'

  if (isMultiTurn) {
    const isComplete = session.status === 'PUBLISHED'
    const completedTurns = turns.filter((t) => t.role === 'CANDIDATE').length
    const maxTurns = session.maxTurns ?? 0

    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_320px]">
          <section className="space-y-3 rounded-md border border-border bg-card p-5">
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-medium">Interview Room</h2>
              <p className="text-sm text-muted-foreground">
                {session.type} ·{' '}
                {session.mode === 'COMPANY'
                  ? (session.companyMode?.name ?? 'Company mode')
                  : 'Practice mode'}{' '}
                · Started {formatDate(session.createdAt)}
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
              {renderMultiTurnForm?.({ sessionId: session.id, turns, isComplete })}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-md border border-border bg-card p-5">
              <h3 className="font-heading text-base font-medium">Progress</h3>
              <div className="mt-4 space-y-3">
                <ProgressRow label="Version" value={`v${session.version ?? 1}`} />
                <ProgressRow label="Status" value={session.status} />
                <ProgressRow
                  label="Turns"
                  value={maxTurns > 0 ? `${completedTurns}/${maxTurns}` : `${completedTurns}`}
                />
                <ProgressRow
                  label="Last activity"
                  value={formatDate(session.lastActivityAt ?? session.updatedAt)}
                />
              </div>
            </section>

            {session.readinessImpact ? (
              <section className="rounded-md border border-border bg-card p-5">
                <h3 className="font-heading text-base font-medium">Readiness impact</h3>
                <div className="mt-4 space-y-3">
                  <ProgressRow
                    label="Overall"
                    value={signed(session.readinessImpact.overallDelta)}
                  />
                  <ProgressRow
                    label="Technical"
                    value={signed(session.readinessImpact.technicalDelta)}
                  />
                  <ProgressRow
                    label="Behavioral"
                    value={signed(session.readinessImpact.behavioralDelta)}
                  />
                  <ProgressRow
                    label="System design"
                    value={signed(session.readinessImpact.systemDesignDelta)}
                  />
                  <ProgressRow
                    label="Communication"
                    value={signed(session.readinessImpact.communicationDelta)}
                  />
                </div>
              </section>
            ) : null}

            {isComplete && reviewHref ? (
              <a
                href={reviewHref}
                className="block rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
              >
                Open session review
              </a>
            ) : null}
          </aside>
        </div>
      </div>
    )
  }

  // Single-turn layout
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
        <p className="text-sm text-muted-foreground">
          {question?.question ?? 'Question unavailable'}
        </p>
        <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
          {question?.difficulty ?? 'Unknown'} · {question?.category ?? 'Unknown'} ·{' '}
          {question?.expectedConcepts.join(', ') ?? 'No concepts'}
        </p>
      </section>

      <div className="grid gap-6">
        {!answer ? (
          <section className="rounded-lg border border-border p-4">
            <h3 className="mb-3 font-heading text-base font-medium">Practice answer</h3>
            {renderAnswerForm?.({ session })}
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

export default InterviewSessionPage
