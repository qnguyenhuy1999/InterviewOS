import type {
  LearningPathItemStatus,
  ReviewQueueCardView,
  ReviewRating,
  ReviewWeakConceptView,
} from '@interviewos/types'
import {
  CircleCheckIcon,
  Clock3Icon,
  HistoryIcon,
  PlayIcon,
  RotateCcwIcon,
  SkipForwardIcon,
  XIcon,
} from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { EmptyState, PageBody, PageHeader } from '../../../components/ui/page'
import { Progress } from '../../../components/ui/progress'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import { Spinner } from '../../atoms/Spinner'
import { LearningPathListItem } from '../../molecules/LearningPathListItem/LearningPathListItem'
import { REVIEW_ITEM_TYPE_LABEL } from './ReviewPage.constants'
import { reviewPageFixture } from './ReviewPage.fixtures'
import type { ReviewPageProps } from './ReviewPage.types'
import {
  getLearningPathActionLabel,
  getLearningPathActionVariant,
  getReviewRatingClassName,
  getReviewRatingLabel,
  getWeakConceptActions,
  getWeakConceptStatusClassName,
} from './ReviewPage.utils'

// ─── ReviewTypeBadge ──────────────────────────────────────────────────────────

function ReviewTypeBadge({ type }: { type: ReviewQueueCardView['type'] }) {
  return (
    <Badge
      variant="outline"
      className="rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest"
    >
      {REVIEW_ITEM_TYPE_LABEL[type]}
    </Badge>
  )
}

// ─── ReviewRatingBadge ────────────────────────────────────────────────────────

function ReviewRatingBadge({ rating }: { rating: ReviewRating | null }) {
  const label = getReviewRatingLabel(rating)
  return (
    <span className={`${getReviewRatingClassName(label)} font-mono text-xs tabular-nums`}>
      {label}
    </span>
  )
}

// ─── ReviewQueueCard ──────────────────────────────────────────────────────────

function ReviewQueueCard({
  item,
  renderRatingActions,
}: {
  item: ReviewQueueCardView
  renderRatingActions?: React.ReactNode
}) {
  return (
    <Card className="group gap-0 border border-border/70 py-0 transition-shadow duration-150 hover:shadow-elevated">
      <CardHeader className="gap-4 border-b py-4">
        {/* Type + last rating */}
        <div className="flex items-center justify-between gap-3">
          <ReviewTypeBadge type={item.type} />
          <ReviewRatingBadge rating={item.lastRating} />
        </div>

        {/* Title */}
        <CardTitle className="font-heading text-lg font-semibold leading-snug tracking-tight">
          {item.title}
        </CardTitle>

        {/* Mastery */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Mastery</span>
            <span className="font-mono font-semibold tabular-nums text-foreground">
              {item.masteryPercent}%
            </span>
          </div>
          <Progress value={item.masteryPercent} className="h-1.5" />
        </div>

        {/* Weakness + next review */}
        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock3Icon className="size-3.5" aria-hidden="true" />
            <span>Next: {item.nextReviewLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Weakness</span>
            <span className="font-mono text-sm font-semibold tabular-nums text-destructive">
              {item.weaknessScore}
            </span>
          </div>
        </div>
      </CardHeader>

      {/* Rating actions */}
      <CardContent className="grid grid-cols-2 gap-2 py-3 sm:grid-cols-4">
        {renderRatingActions ??
          item.availableRatings.map((rating) => (
            <Button
              key={rating}
              variant="outline"
              size="sm"
              className="justify-center text-[11px] font-semibold uppercase tracking-widest"
            >
              {rating}
            </Button>
          ))}
      </CardContent>
    </Card>
  )
}

// ─── LearningPathActionButtons ────────────────────────────────────────────────

function LearningPathActionButtons({ status }: { status: LearningPathItemStatus }) {
  return (
    <div className="flex items-center gap-1.5">
      <Button variant={getLearningPathActionVariant(status)} size="sm" className="min-w-20">
        <PlayIcon className="size-3.5" aria-hidden="true" />
        {getLearningPathActionLabel(status)}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full text-muted-foreground hover:text-foreground"
      >
        <RotateCcwIcon className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Replay learning path item</span>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full text-muted-foreground hover:text-foreground"
      >
        <SkipForwardIcon className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Skip learning path item</span>
      </Button>
    </div>
  )
}

// ─── WeakConceptMastery ───────────────────────────────────────────────────────

function WeakConceptMastery({ concept }: { concept: ReviewWeakConceptView }) {
  return (
    <div className="flex min-w-36 items-center gap-2.5">
      <Progress value={concept.masteryPercent} className="h-1.5 max-w-28" />
      <span className="font-mono text-xs font-medium tabular-nums text-muted-foreground">
        {concept.masteryPercent}%
      </span>
    </div>
  )
}

// ─── WeakConceptLastSeen ──────────────────────────────────────────────────────

function WeakConceptLastSeen({ concept }: { concept: ReviewWeakConceptView }) {
  if (!concept.lastSeenAt) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const date =
    concept.lastSeenAt instanceof Date ? concept.lastSeenAt : new Date(concept.lastSeenAt)
  const label = Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <HistoryIcon className="size-3.5" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

// ─── WeakConceptActions ───────────────────────────────────────────────────────

function WeakConceptActions({ concept }: { concept: ReviewWeakConceptView }) {
  const actions = getWeakConceptActions(concept.status)
  const canResolve = actions.includes('resolve')
  const canIgnore = actions.includes('ignore')

  return (
    <div className="flex items-center justify-end gap-2">
      {canResolve && (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto gap-1.5 px-2 py-1 text-xs font-medium text-success hover:bg-success-soft hover:text-success"
        >
          <CircleCheckIcon className="size-3.5" aria-hidden="true" />
          Resolve
        </Button>
      )}
      {canIgnore && (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-error-soft hover:text-destructive"
        >
          <XIcon className="size-3.5" aria-hidden="true" />
          Ignore
        </Button>
      )}
    </div>
  )
}

// ─── ReviewBody ───────────────────────────────────────────────────────────────

function ReviewBody({
  state,
  startStudyHref,
  renderRatingActions,
  renderLearningPathActions,
  renderWeakConceptActions,
}: {
  state:
    | Extract<ReviewPageProps['state'], { kind: 'ready' }>
    | Extract<ReviewPageProps['state'], { kind: 'empty' }>
  startStudyHref: string
  renderRatingActions?: ReviewPageProps['renderRatingActions']
  renderLearningPathActions?: ReviewPageProps['renderLearningPathActions']
  renderWeakConceptActions?: ReviewPageProps['renderWeakConceptActions']
}) {
  if (state.kind === 'empty') {
    return (
      <EmptyState
        className="min-h-80"
        title="No reviews scheduled yet"
        description="Finish an interview, notebook session, or English drill to build your first review queue."
        action={
          <Button asChild>
            <a href={startStudyHref}>Start a study session</a>
          </Button>
        }
      />
    )
  }

  const { data } = state

  return (
    <div className="flex flex-col gap-5">
      {/* ── Queue cards ────────────────────────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-3">
        {data.queue.map((item) => (
          <ReviewQueueCard
            key={item.id}
            item={item}
            renderRatingActions={renderRatingActions ? renderRatingActions(item) : undefined}
          />
        ))}
      </div>

      {/* ── Learning path ───────────────────────────────────────── */}
      <Card className="gap-0 py-0">
        <CardHeader className="border-b py-4">
          <div>
            <CardTitle className="font-heading text-lg font-semibold">Learning path</CardTitle>
            <p className="mt-0.5 text-sm text-muted-foreground">
              What to study next, ranked by priority.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-1 py-2">
          {data.learningPath.map((item) => (
            <LearningPathListItem
              key={item.id}
              badges={[
                {
                  label: item.typeLabel,
                  variant: 'outline',
                  className:
                    'rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest',
                },
              ]}
              title={item.title}
              description={item.detail}
              priorityValue={item.priorityScore}
              action={
                renderLearningPathActions ? (
                  renderLearningPathActions(item)
                ) : (
                  <LearningPathActionButtons status={item.status} />
                )
              }
            />
          ))}
        </CardContent>
      </Card>

      {/* ── Weak concepts table ─────────────────────────────────── */}
      <Card className="gap-0 py-0">
        <CardHeader className="border-b py-4">
          <div>
            <CardTitle className="font-heading text-lg font-semibold">Weak concepts</CardTitle>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Patterns across sessions. Mark them resolved as you improve.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5 text-[11px] font-semibold uppercase tracking-widest">
                  Concept
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest">
                  Occurrences
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest">
                  Mastery
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest">
                  Status
                </TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-widest">
                  Last seen
                </TableHead>
                <TableHead className="pr-5 text-right text-[11px] font-semibold uppercase tracking-widest">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.weakConcepts.map((concept) => (
                <TableRow
                  key={concept.id}
                  className="transition-colors duration-100 hover:bg-muted/40"
                >
                  <TableCell className="py-3 pl-5 font-medium whitespace-normal text-foreground">
                    {concept.concept}
                  </TableCell>
                  <TableCell className="py-3 font-mono tabular-nums text-muted-foreground">
                    {concept.occurrenceCount}
                  </TableCell>
                  <TableCell className="py-3">
                    <WeakConceptMastery concept={concept} />
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`${getWeakConceptStatusClassName(concept.status)} text-xs font-medium`}
                    >
                      {concept.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <WeakConceptLastSeen concept={concept} />
                  </TableCell>
                  <TableCell className="py-3 pr-5">
                    {renderWeakConceptActions ? (
                      renderWeakConceptActions(concept)
                    ) : (
                      <WeakConceptActions concept={concept} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── LoadingBody ──────────────────────────────────────────────────────────────

function LoadingBody() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="gap-0 py-0">
            <CardHeader className="gap-4 border-b py-4">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-1.5 w-full" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-10" />
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 py-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((__, j) => (
                <Skeleton key={j} className="h-8 w-full rounded-md" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="min-h-56 items-center justify-center">
        <Spinner size="lg" />
      </Card>
    </div>
  )
}

// ─── ErrorBody ────────────────────────────────────────────────────────────────

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-96 border-destructive/20 bg-error-soft"
      title={<span className="text-destructive">Failed to load review queue</span>}
      description={message}
      action={
        retryHref ? (
          <Button asChild variant="destructive">
            <a href={retryHref}>Retry</a>
          </Button>
        ) : undefined
      }
    />
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function Root({
  state,
  retryHref,
  startStudyHref,
  renderRatingActions,
  renderLearningPathActions,
  renderWeakConceptActions,
}: ReviewPageProps) {
  const headerData = state.kind === 'ready' ? state.data : reviewPageFixture

  return (
    <>
      <PageHeader title={headerData.title} description={headerData.subtitle} />

      <PageBody>
        {state.kind === 'error' ? (
          <ErrorBody message={state.message} retryHref={retryHref} />
        ) : state.kind === 'loading' ? (
          <LoadingBody />
        ) : (
          <ReviewBody
            state={state}
            startStudyHref={startStudyHref}
            renderRatingActions={renderRatingActions}
            renderLearningPathActions={renderLearningPathActions}
            renderWeakConceptActions={renderWeakConceptActions}
          />
        )}
      </PageBody>

      <Separator className="mt-8 opacity-0" />
    </>
  )
}

const ReviewPage = Object.assign(Root, {
  ReviewQueueCard,
  WeakConceptActions,
})

export default ReviewPage
