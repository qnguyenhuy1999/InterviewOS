import type { InterviewEvaluation } from '@interviewos/types'

import { ScoreBar } from './ScoreBar'

function EvaluationPanel({ evaluation }: { evaluation: InterviewEvaluation }) {
  return (
    <div className="space-y-4 rounded-md border border-border bg-card p-5">
      <h3 className="font-heading text-lg font-medium">Detailed scores</h3>

      {evaluation.rubricScores.length > 0 ? (
        <div className="space-y-3">
          {evaluation.rubricScores.map((item) => (
            <ScoreBar key={item.key} label={item.label} score={item.score} />
          ))}
        </div>
      ) : null}

      {evaluation.evidence.length > 0 ||
      evaluation.weaknesses.length > 0 ||
      evaluation.recommendations.length > 0 ? (
        <details className="group">
          <summary className="cursor-pointer select-none text-sm font-medium text-muted-foreground hover:text-foreground list-none flex items-center gap-1">
            <span className="transition-transform group-open:rotate-90">▶</span>
            <span>Advanced details</span>
          </summary>
          <div className="mt-3 space-y-4">
            {evaluation.evidence.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Evidence</p>
                <div className="space-y-3">
                  {evaluation.evidence.map((item, index) => (
                    <div
                      key={`${item.quote}-${index}`}
                      className="rounded-lg border border-border bg-background p-3"
                    >
                      <p className="text-sm font-medium">{item.quote}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {evaluation.weaknesses.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Weaknesses</p>
                <div className="space-y-3">
                  {evaluation.weaknesses.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="rounded-lg border border-border bg-background p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{item.title}</p>
                        <span className="text-xs text-muted-foreground">{item.severity}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {evaluation.recommendations.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Recommendations</p>
                <div className="space-y-3">
                  {evaluation.recommendations.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="rounded-lg border border-border bg-background p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{item.title}</p>
                        <span className="text-xs text-muted-foreground">{item.priority}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </details>
      ) : null}
    </div>
  )
}

export { EvaluationPanel }
