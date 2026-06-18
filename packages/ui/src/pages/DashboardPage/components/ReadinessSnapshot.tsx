import { ArrowRightIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card'
import { Progress } from '../../../../components/ui/progress'
import type { DashboardPageActions, ReadyDashboardState } from '../DashboardPage.types'
import { formatPercent } from '../DashboardPage.utils'

type ReadinessSnapshotProps = {
  state: ReadyDashboardState
  actions: DashboardPageActions
}

export function ReadinessSnapshot({ state, actions }: ReadinessSnapshotProps) {
  if (!state.readiness) return null

  return (
    <Card className="py-0">
      <CardHeader className="border-b py-4">
        <div>
          <CardTitle className="text-lg font-semibold">Readiness snapshot</CardTitle>
          <CardDescription>
            A roll-up of the areas feeding your overall interview readiness.
          </CardDescription>
        </div>
        <CardAction>
          <Button asChild variant="link" size="sm" className="h-auto px-0">
            <a href={actions.readinessHref}>
              Open readiness
              <ArrowRightIcon aria-hidden="true" />
            </a>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-6 py-5 md:grid-cols-[160px_1fr]">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Overall
          </p>
          <p className="font-mono text-5xl font-semibold tracking-tight tabular-nums text-foreground">
            {state.readiness.overallScore}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatPercent(state.readiness.confidenceLevel)} confidence
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {state.readiness.breakdown.map((item) => (
            <div key={item.dimension} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-mono font-semibold tabular-nums text-foreground">
                  {item.score}
                </span>
              </div>
              <Progress value={Math.min(item.score, 100)} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
