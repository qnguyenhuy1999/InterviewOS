import {
  ArrowRightIcon,
  LanguagesIcon,
  MicIcon,
  NotebookTextIcon,
  SparklesIcon,
} from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card'
import { Separator } from '../../../../components/ui/separator'
import type { DashboardPageActions, ReadyDashboardState } from '../DashboardPage.types'
import { getDashboardMetrics } from '../DashboardPage.utils'
import { ActionItem } from './ActionItem'
import { DashboardHero } from './DashboardHero'
import { MetricCard } from './MetricCard'
import { ReadinessSnapshot } from './ReadinessSnapshot'
import { WeakConceptList } from './WeakConceptList'

type ReadyBodyProps = {
  state: ReadyDashboardState
  actions: DashboardPageActions
}

export function ReadyBody({ state, actions }: ReadyBodyProps) {
  const metrics = getDashboardMetrics(state)

  return (
    <div className="flex flex-col gap-5">
      <DashboardHero state={state} actions={actions} />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[1fr_272px]">
        <Card className="py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-lg font-semibold">Weak concepts to revisit</CardTitle>
              <CardDescription>Topics still dragging recent interview performance.</CardDescription>
            </div>
            <CardAction>
              <Button asChild variant="link" size="sm" className="h-auto px-0">
                <a href={actions.reviewQueueHref}>
                  Review queue
                  <ArrowRightIcon aria-hidden="true" />
                </a>
              </Button>
            </CardAction>
          </CardHeader>
          <WeakConceptList concepts={state.progress.weakConceptTrends} />
        </Card>

        <Card className="py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-lg font-semibold">Quick actions</CardTitle>
              <CardDescription>High-frequency workflows.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 py-4">
            <div className="flex flex-col gap-1.5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Practice
              </p>
              <ActionItem
                href={actions.createNoteHref}
                label="Create note"
                icon={<NotebookTextIcon />}
                primary
              />
              <ActionItem
                href={actions.startInterviewHref}
                label="Start interview"
                icon={<MicIcon />}
              />
              <ActionItem
                href={actions.quickStartHref}
                label="Start quick interview"
                icon={<MicIcon />}
              />
              <ActionItem
                href={actions.reviewQueueHref}
                label="Review queue"
                icon={<SparklesIcon />}
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-1.5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Browse
              </p>
              <ActionItem
                href={actions.allNotesHref}
                label="All notes"
                icon={<NotebookTextIcon />}
              />
              <ActionItem href={actions.allSessionsHref} label="All sessions" icon={<MicIcon />} />
              <ActionItem
                href={actions.englishNotesHref}
                label="English notes"
                icon={<LanguagesIcon />}
              />
              <ActionItem href={actions.readinessHref} label="Readiness" icon={<SparklesIcon />} />
            </div>
          </CardContent>
        </Card>
      </div>

      <ReadinessSnapshot state={state} actions={actions} />
    </div>
  )
}
