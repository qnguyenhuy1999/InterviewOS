import type { InterviewEvaluation, InterviewSessionDetail } from '@interviewos/types'

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

type Session = InterviewSessionDetail

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [session, turns, evaluation] = await Promise.all([
    serverApiClient<Session>(`/sessions/${id}`).catch(() => null),
    serverApiClient<Turn[]>(`/sessions/${id}/turns`).catch(() => [] as Turn[]),
    serverApiClient<InterviewEvaluation>(`/sessions/${id}/evaluation`).catch(() => null),
  ])

  if (!session) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load this session.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-medium">Session Review</h2>
        <p className="text-sm text-muted-foreground">
          {session.type} · Started {formatDate(session.createdAt)}
          {session.endedAt ? ` · Ended ${formatDate(session.endedAt)}` : ''}
        </p>
      </div>

      {evaluation ? (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_320px]">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg font-medium">Evaluation</h3>
                {evaluation.summary ? (
                  <p className="mt-1 text-sm text-muted-foreground">{evaluation.summary}</p>
                ) : null}
              </div>
              {evaluation.overallScore != null && (
                <div className="text-right">
                  <p className="font-heading text-3xl font-medium">{evaluation.overallScore}</p>
                  <p className="text-xs text-muted-foreground">/ 100</p>
                </div>
              )}
            </div>

            {evaluation.rubricScores.length > 0 && (
              <div className="space-y-3">
                {evaluation.rubricScores.map((item) => (
                  <ScoreBar key={item.key} label={item.label} score={item.score} />
                ))}
              </div>
            )}

            {evaluation.evidence.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Evidence</p>
                <div className="space-y-3">
                  {evaluation.evidence.map((item, index) => (
                    <div key={`${item.quote}-${index}`} className="rounded-xl border border-border bg-background/60 p-3">
                      <p className="text-sm font-medium">{item.quote}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {evaluation.weaknesses.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Weaknesses</p>
                <div className="space-y-3">
                  {evaluation.weaknesses.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="rounded-xl border border-border bg-background/60 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{item.title}</p>
                        <span className="text-xs text-muted-foreground">{item.severity}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {evaluation.recommendations.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Recommendations</p>
                <div className="space-y-3">
                  {evaluation.recommendations.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="rounded-xl border border-border bg-background/60 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{item.title}</p>
                        <span className="text-xs text-muted-foreground">{item.priority}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-heading text-base font-medium">Confidence</h3>
              <p className="mt-3 font-heading text-3xl font-medium">{evaluation.confidence ?? '--'}</p>
              <p className="text-xs text-muted-foreground">Model confidence</p>
            </section>

            {session.readinessImpact ? (
              <section className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-heading text-base font-medium">Readiness impact</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <Metric label="Overall" value={session.readinessImpact.overallDelta} />
                  <Metric label="Technical" value={session.readinessImpact.technicalDelta} />
                  <Metric label="Behavioral" value={session.readinessImpact.behavioralDelta} />
                  <Metric label="System design" value={session.readinessImpact.systemDesignDelta} />
                  <Metric label="Communication" value={session.readinessImpact.communicationDelta} />
                </div>
              </section>
            ) : null}

            {session.summary ? (
              <section className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-heading text-base font-medium">Replay summary</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {session.summary.keyTakeaways.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
          {session.status === 'PUBLISHED'
            ? 'Evaluation is being generated. Refresh in a moment.'
            : 'End the session to trigger evaluation.'}
        </section>
      )}

      <section className="space-y-3">
        <h3 className="font-heading text-base font-medium">Conversation replay</h3>
        {turns.length === 0 ? (
          <p className="text-sm text-muted-foreground">No turns recorded.</p>
        ) : (
          <div className="space-y-3">
            {turns.map((turn) => (
              <div
                key={turn.id}
                className={`flex ${turn.role === 'CANDIDATE' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                    turn.role === 'CANDIDATE'
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-card'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{turn.content}</p>
                  <div
                    className={`mt-1 flex flex-wrap items-center gap-2 text-xs ${
                      turn.role === 'CANDIDATE'
                        ? 'text-primary-foreground/60'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span>{turn.role === 'CANDIDATE' ? 'You' : 'Interviewer'}</span>
                    <span>Turn {turn.turnNumber}</span>
                    {turn.topicTags && turn.topicTags.length > 0 ? <span>{turn.topicTags.join(', ')}</span> : null}
                    {turn.decision ? <span>{turn.decision}</span> : null}
                  </div>
                  {turn.reasoning ? (
                    <p className="mt-2 text-xs opacity-80">Reasoning: {turn.reasoning}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-4 text-sm">
        <a href={`/interview/session/${id}`} className="text-primary hover:underline">
          Back to session
        </a>
        <a href="/interview" className="text-muted-foreground hover:underline">
          All sessions
        </a>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value > 0 ? `+${value}` : value}</span>
    </div>
  )
}
