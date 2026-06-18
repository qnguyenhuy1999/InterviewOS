import type { InterviewEvaluation } from '@interviewos/types'

function NextBestActionPanel({ evaluation }: { evaluation: InterviewEvaluation }) {
  const topRecommendation = evaluation.recommendations[0]
  const topWeakConcept = evaluation.weakConcepts[0]

  if (!topRecommendation && !topWeakConcept) return null

  return (
    <div className="rounded-md border border-primary/20 bg-accent-soft p-5 space-y-3">
      <h3 className="font-heading text-base font-medium">Next best action</h3>
      {topWeakConcept ? (
        <p className="text-sm text-muted-foreground">
          You struggled with <span className="font-medium text-foreground">{topWeakConcept}</span>.
          Focus your next study session on this concept.
        </p>
      ) : null}
      {topRecommendation ? (
        <div className="rounded-md border border-border bg-card p-3 space-y-1">
          <p className="text-sm font-medium">{topRecommendation.title}</p>
          <p className="text-xs text-muted-foreground">{topRecommendation.detail}</p>
        </div>
      ) : null}
    </div>
  )
}

export { NextBestActionPanel }
