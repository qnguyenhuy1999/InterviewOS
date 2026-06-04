import { formatDate } from '@/lib/format'
import { serverApiClient } from '@/lib/server-api-client'

type Turn = {
  id: string
  role: 'CANDIDATE' | 'INTERVIEWER'
  content: string
  turnNumber: number
  decision?: string | null
  topicTags?: string[]
}

type DimensionScore = {
  name: string
  score: number
  feedback?: string
}

type Evaluation = {
  id: string
  status: string
  overallScore: number | null
  dimensionScores: DimensionScore[] | null
  strengths: string[]
  improvements: string[]
  coachingNotes: string | null
  weakConcepts: string[]
}

type Session = {
  id: string
  type: string
  mode: string | null
  status: string
  createdAt: string
  endedAt: string | null
}

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
    serverApiClient<Evaluation>(`/sessions/${id}/evaluation`).catch(() => null),
  ])

  if (!session) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load this session.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-medium">Session Review</h2>
        <p className="text-sm text-muted-foreground">
          {session.type} · Started {formatDate(session.createdAt)}
          {session.endedAt ? ` · Ended ${formatDate(session.endedAt)}` : ''}
        </p>
      </div>

      {evaluation ? (
        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-heading text-lg font-medium">Evaluation</h3>
            {evaluation.overallScore != null && (
              <div className="text-right">
                <p className="font-heading text-3xl font-medium">{evaluation.overallScore}</p>
                <p className="text-xs text-muted-foreground">/ 100</p>
              </div>
            )}
          </div>

          {evaluation.dimensionScores && evaluation.dimensionScores.length > 0 && (
            <div className="space-y-3">
              {evaluation.dimensionScores.map((dim) => (
                <ScoreBar key={dim.name} label={dim.name} score={dim.score} />
              ))}
            </div>
          )}

          {evaluation.strengths.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Strengths</p>
              <ul className="space-y-1">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-green-500">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {evaluation.improvements.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Areas to improve</p>
              <ul className="space-y-1">
                {evaluation.improvements.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-500">↑</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {evaluation.coachingNotes && (
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Coaching note
              </p>
              <p className="mt-1 text-sm">{evaluation.coachingNotes}</p>
            </div>
          )}

          {evaluation.weakConcepts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {evaluation.weakConcepts.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
          {session.status === 'PUBLISHED'
            ? 'Evaluation is being generated. Refresh in a moment.'
            : 'End the session to trigger evaluation.'}
        </section>
      )}

      <section className="space-y-3">
        <h3 className="font-heading text-base font-medium">Conversation</h3>
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
                    className={`mt-1 flex items-center gap-2 text-xs ${
                      turn.role === 'CANDIDATE'
                        ? 'text-primary-foreground/60'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span>{turn.role === 'CANDIDATE' ? 'You' : 'Interviewer'}</span>
                    {turn.topicTags && turn.topicTags.length > 0 && (
                      <span>· {turn.topicTags.join(', ')}</span>
                    )}
                    {turn.decision && turn.decision !== 'CONTINUE' && (
                      <span>· {turn.decision}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-4 text-sm">
        <a href={`/interview/session/${id}`} className="text-primary hover:underline">
          ← Back to session
        </a>
        <a href="/interview" className="text-muted-foreground hover:underline">
          All sessions
        </a>
      </div>
    </div>
  )
}
