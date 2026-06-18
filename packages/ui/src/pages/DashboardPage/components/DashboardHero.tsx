import { MicIcon, SparklesIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { Card } from '../../../../components/ui/card'
import type { DashboardPageActions, ReadyDashboardState } from '../DashboardPage.types'
import { formatPercent, missLabel } from '../DashboardPage.utils'
import { ReadinessDial } from './ReadinessDial'

type DashboardHeroProps = {
  state: ReadyDashboardState
  actions: DashboardPageActions
}

export function DashboardHero({ state, actions }: DashboardHeroProps) {
  const focusConcept = state.progress.weakConceptTrends[0]
  const readinessScore = state.readiness?.overallScore ?? state.progress.interviewReadiness
  const confidence = state.readiness?.confidenceLevel

  const focusDescription = focusConcept
    ? `${focusConcept.concept} is your highest-priority gap right now - ${missLabel(focusConcept.occurrenceCount)}.`
    : state.progress.dueReviews > 0
      ? `${state.progress.dueReviews} review ${state.progress.dueReviews === 1 ? 'item is' : 'items are'} due. Clear the queue to keep readiness moving.`
      : 'No urgent gaps flagged. Keep the loop moving with a short practice session.'

  return (
    <Card className="relative overflow-hidden bg-surface-elevated py-0">
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/4 via-transparent to-accent-soft/30"
        aria-hidden="true"
      />
      <div className="relative grid lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-5 p-6 lg:p-7">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Today's focus
            </p>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-[26px]">
              Close the highest-impact gap next
            </h2>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              {focusDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button asChild size="lg">
              <a href={actions.startInterviewHref}>
                <MicIcon aria-hidden="true" />
                Start interview
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={actions.reviewQueueHref}>
                <SparklesIcon aria-hidden="true" />
                Review queue
              </a>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 border-t p-6 lg:min-w-[220px] lg:border-t-0 lg:border-l lg:p-7">
          <ReadinessDial score={readinessScore} />
          <div className="text-center">
            {confidence != null && (
              <p className="text-xs text-muted-foreground">
                {formatPercent(confidence)} confidence
              </p>
            )}
            <p className="mt-0.5 text-xs text-muted-foreground/70">
              {state.progress.reviewStreak}d streak · {state.progress.dueReviews} due
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
