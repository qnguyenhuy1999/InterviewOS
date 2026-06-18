import type { InterviewEvaluation } from '@interviewos/types'

function NarrativeFeedbackPanel({ evaluation }: { evaluation: InterviewEvaluation }) {
  const hasStrengths = evaluation.strengths.length > 0
  const hasImprovements = evaluation.improvements.length > 0
  const hasCoaching = evaluation.coachingNotes.length > 0

  if (!evaluation.summary && !hasStrengths && !hasImprovements && !hasCoaching) return null

  return (
    <div className="space-y-4 rounded-md border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-heading text-lg font-medium">Feedback summary</h3>
        {evaluation.overallScore != null ? (
          <div className="text-right shrink-0">
            <p className="font-heading text-3xl font-medium">{evaluation.overallScore}</p>
            <p className="text-xs text-muted-foreground">/ 100</p>
          </div>
        ) : null}
      </div>

      {evaluation.summary ? (
        <p className="text-sm text-muted-foreground leading-relaxed">{evaluation.summary}</p>
      ) : null}

      {hasStrengths ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-success">What you did well</p>
          <ul className="space-y-1">
            {evaluation.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasImprovements ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-warning">Areas to improve</p>
          <ul className="space-y-1">
            {evaluation.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasCoaching ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Coaching notes</p>
          <ul className="space-y-1">
            {evaluation.coachingNotes.map((note, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {note}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export { NarrativeFeedbackPanel }
