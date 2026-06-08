import type { DashboardProgress } from '@interviewos/types'
import { LanguagesIcon, MicIcon, NotebookTextIcon, PlusIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { EmptyState, PageBody } from '../../../components/ui/page'
import { Progress } from '../../../components/ui/progress'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { Spinner } from '../../../components/ui/spinner'
import { dashboardFixture } from './DashboardPage.fixtures'
import type {
  DashboardEnglishImprovement,
  DashboardInterviewSession,
  DashboardMetric,
  DashboardNoteSummary,
  DashboardPageProps,
  DashboardWeakConcept,
} from './DashboardPage.types'
import { getDashboardToneClass } from './DashboardPage.utils'

function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card className="gap-2 py-4" size="sm">
      <CardHeader className="gap-1">
        <CardDescription className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {metric.label}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tracking-tight">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{metric.hint}</p>
      </CardContent>
    </Card>
  )
}

function NoteRow({ note }: { note: DashboardNoteSummary }) {
  const tone = note.difficulty === 'Hard' ? 'high' : note.difficulty === 'Medium' ? 'medium' : 'low'

  return (
    <div className="flex items-center justify-between gap-3 py-4">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className="mt-2 inline-flex size-1.5 shrink-0 rounded-full bg-primary/80"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="truncate text-base font-medium">{note.title}</p>
          <p className="text-sm text-muted-foreground">
            {note.domain} - {note.updatedLabel}
          </p>
        </div>
      </div>
      <span className={getDashboardToneClass(tone)}>{note.difficulty}</span>
    </div>
  )
}

function WeakConceptRow({ concept }: { concept: DashboardWeakConcept }) {
  const tone =
    concept.severity === 'High' ? 'high' : concept.severity === 'Medium' ? 'medium' : 'low'

  return (
    <div className="flex items-start justify-between gap-3 py-4">
      <div>
        <p className="text-base font-medium">{concept.title}</p>
        <p className="text-sm text-muted-foreground">{concept.subtitle}</p>
      </div>
      <span className={getDashboardToneClass(tone)}>{concept.severity}</span>
    </div>
  )
}

function SessionRow({ session }: { session: DashboardInterviewSession }) {
  return (
    <div className="flex items-center justify-between gap-3 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-semibold">
          {session.score}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-medium">{session.title}</p>
          <p className="text-sm text-muted-foreground">{session.meta}</p>
        </div>
      </div>
      <div className="shrink-0 text-right text-sm text-muted-foreground">
        <p>
          Tech <span className="font-medium text-foreground">{session.techScore}</span>
        </p>
        <p>
          EN <span className="font-medium text-foreground">{session.englishScore}</span>
        </p>
      </div>
    </div>
  )
}

function EnglishImprovementRow({ improvement }: { improvement: DashboardEnglishImprovement }) {
  return (
    <div className="flex items-start gap-3 py-4">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <LanguagesIcon className="size-4" />
      </div>
      <div>
        <p className="text-base font-medium">{improvement.title}</p>
        <p className="text-sm text-muted-foreground">{improvement.subtitle}</p>
      </div>
    </div>
  )
}

function DashboardBody({ empty }: { empty?: boolean }) {
  const progressItems = [
    {
      title: dashboardFixture.studyProgress.topic,
      progressLabel: dashboardFixture.studyProgress.progressLabel,
      progressValue: dashboardFixture.studyProgress.progressValue,
    },
    {
      title: 'Node.js event loop',
      progressLabel: '35%',
      progressValue: 35,
    },
    {
      title: 'System design - rate limiter',
      progressLabel: '20%',
      progressValue: 20,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)]">
        <Card className="py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-xl font-semibold">Continue studying</CardTitle>
              <CardDescription className="text-sm">
                {dashboardFixture.studyProgress.description}
              </CardDescription>
            </div>
            <CardAction>
              <Button variant="link" size="sm" className="h-auto px-0">
                {dashboardFixture.studyProgress.ctaLabel}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressItems.map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.progressLabel}</p>
                </div>
                <Progress value={item.progressValue} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardHeader className="border-b py-4">
            <CardTitle className="text-xl font-semibold">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 py-4">
            {dashboardFixture.quickActions.map((action, index) => (
              <Button
                key={action.label}
                variant={index === 0 ? 'default' : 'outline'}
                size="lg"
                className="justify-center"
              >
                {index === 0 ? <PlusIcon /> : index === 1 ? <MicIcon /> : <NotebookTextIcon />}
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {empty ? (
        <EmptyState
          className="min-h-80"
          title="No dashboard activity yet"
          description="Start a note, review queue, or interview session to populate this workspace."
          action={<Button>Create first activity</Button>}
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.95fr)]">
          <div className="space-y-6">
            <Card className="py-0">
              <CardHeader className="border-b py-4">
                <CardTitle className="text-xl font-semibold">Recent notes</CardTitle>
                <CardAction>
                  <Button variant="link" size="sm" className="h-auto px-0">
                    All notes
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="divide-y">
                {dashboardFixture.notes.map((note) => (
                  <NoteRow key={note.id} note={note} />
                ))}
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardHeader className="border-b py-4">
                <CardTitle className="text-xl font-semibold">Recent interview sessions</CardTitle>
                <CardAction>
                  <Button variant="link" size="sm" className="h-auto px-0">
                    All sessions
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="divide-y">
                {dashboardFixture.sessions.map((session) => (
                  <SessionRow key={session.id} session={session} />
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="py-0">
              <CardHeader className="border-b py-4">
                <div>
                  <CardTitle className="text-xl font-semibold">Weak concepts</CardTitle>
                  <CardDescription className="text-sm">
                    Where you&apos;ve struggled across sessions.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="divide-y">
                {dashboardFixture.weakConcepts.map((concept) => (
                  <WeakConceptRow key={concept.id} concept={concept} />
                ))}
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardHeader className="border-b py-4">
                <CardTitle className="text-xl font-semibold">English improvements</CardTitle>
                <CardAction>
                  <Button variant="link" size="sm" className="h-auto px-0">
                    View all
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="divide-y">
                {dashboardFixture.englishImprovements.map((improvement) => (
                  <EnglishImprovementRow key={improvement.id} improvement={improvement} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingBody() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)]">
        <Card className="py-0">
          <CardHeader className="border-b py-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardHeader className="border-b py-4">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-3 py-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="min-h-64 items-center justify-center">
        <Spinner className="size-7" />
      </Card>
    </div>
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-[60vh] border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load dashboard</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

const TREND_ICON: Record<string, string> = { UP: '↑', DOWN: '↓', STABLE: '→' }
const TREND_COLOR: Record<string, string> = {
  UP: 'text-green-500',
  DOWN: 'text-red-500',
  STABLE: 'text-muted-foreground',
}

function RealDataBody({
  progress,
  readiness,
}: {
  progress: DashboardProgress
  readiness?: DashboardPageProps['readiness']
}) {
  const metrics: DashboardMetric[] = [
    { label: 'Interview readiness', value: String(progress.interviewReadiness), hint: '' },
    { label: 'Technical mastery', value: String(progress.technicalMastery), hint: '' },
    { label: 'English score', value: String(progress.englishScore), hint: '' },
    { label: 'Review streak', value: String(progress.reviewStreak), hint: '' },
    { label: 'Questions practiced', value: String(progress.questionsPracticed), hint: '' },
    { label: 'Notes mastered', value: String(progress.notesMastered), hint: '' },
    { label: 'Due reviews', value: String(progress.dueReviews), hint: '' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {readiness && (
        <Card className="py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-xl font-semibold">Interview readiness</CardTitle>
            </div>
            <CardAction>
              <div className="text-right">
                <p className="font-heading text-2xl font-semibold">{readiness.overallScore}</p>
                <p
                  className={`text-xs ${
                    TREND_COLOR[
                      readiness.improvementTrend > 0
                        ? 'UP'
                        : readiness.improvementTrend < 0
                          ? 'DOWN'
                          : 'STABLE'
                    ]
                  }`}
                >
                  {
                    TREND_ICON[
                      readiness.improvementTrend > 0
                        ? 'UP'
                        : readiness.improvementTrend < 0
                          ? 'DOWN'
                          : 'STABLE'
                    ]
                  }{' '}
                  {readiness.improvementTrend > 0 ? '+' : ''}
                  {readiness.improvementTrend} pts
                </p>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3">
            {readiness.breakdown.map((item) => (
              <div key={item.dimension} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span
                    className={`flex items-center gap-1 font-medium ${TREND_COLOR[item.trend]}`}
                  >
                    <span className="text-xs">{TREND_ICON[item.trend]}</span>
                    {item.score}
                  </span>
                </div>
                <Progress value={Math.min(item.score, 100)} className="h-1.5" />
              </div>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">
              Confidence: {Math.round(readiness.confidenceLevel * 100)}%
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Root({ loading, empty, error, progress, readiness }: DashboardPageProps) {
  return (
    <PageBody>
      {error ? (
        <ErrorBody message={error} />
      ) : loading ? (
        <LoadingBody />
      ) : progress ? (
        <RealDataBody progress={progress} readiness={readiness} />
      ) : (
        <DashboardBody empty={empty} />
      )}
      <Separator className="mt-8 opacity-0" />
    </PageBody>
  )
}

const DashboardPage = Object.assign(Root, {
  EnglishImprovementRow,
  MetricCard,
  NoteRow,
  SessionRow,
  WeakConceptRow,
})

export default DashboardPage
