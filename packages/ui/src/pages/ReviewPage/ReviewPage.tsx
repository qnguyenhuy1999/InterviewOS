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

function ReviewTypeBadge({ type }: { type: ReviewQueueCardView['type'] }) {
  return (
    <Badge
      variant="outline"
      className="rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-widest"
    >
      {REVIEW_ITEM_TYPE_LABEL[type]}
    </Badge>
  )
}

function ReviewRatingBadge({ rating }: { rating: ReviewRating | null }) {
  return (
    <span className={getReviewRatingClassName(getReviewRatingLabel(rating))}>
      {getReviewRatingLabel(rating)}
    </span>
  )
}

function ReviewQueueCard({
  item,
  renderRatingActions,
}: {
  item: ReviewQueueCardView
  renderRatingActions?: React.ReactNode
}) {
  return (
    <Card className="gap-0 border py-0 shadow-sm">
      <CardHeader className="gap-4 border-b py-4">
        <div className="flex items-start justify-between gap-3">
          <ReviewTypeBadge type={item.type} />
          <ReviewRatingBadge rating={item.lastRating} />
        </div>
        <div className="space-y-4">
          <CardTitle className="text-xl font-semibold tracking-tight">{item.title}</CardTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>Mastery</span>
              <span className="font-medium text-foreground">{item.masteryPercent}%</span>
            </div>
            <Progress value={item.masteryPercent} className="h-2" />
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Weakness</span>
            <span className="font-semibold text-destructive">{item.weaknessScore}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3Icon className="size-4" />
            <span>Next: {item.nextReviewLabel}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-4">
        {renderRatingActions ??
          item.availableRatings.map((rating) => (
            <Button key={rating} variant="outline" className="justify-center uppercase">
              {rating}
            </Button>
          ))}
      </CardContent>
    </Card>
  )
}

function LearningPathActionButtons({ status }: { status: LearningPathItemStatus }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant={getLearningPathActionVariant(status)} className="min-w-20">
        <PlayIcon className="size-4" />
        {getLearningPathActionLabel(status)}
      </Button>
      <Button variant="ghost" size="icon-sm" className="rounded-full">
        <RotateCcwIcon className="size-4" />
        <span className="sr-only">Replay learning path item</span>
      </Button>
      <Button variant="ghost" size="icon-sm" className="rounded-full">
        <SkipForwardIcon className="size-4" />
        <span className="sr-only">Skip learning path item</span>
      </Button>
    </div>
  )
}

function WeakConceptMastery({ concept }: { concept: ReviewWeakConceptView }) {
  return (
    <div className="flex min-w-36 items-center gap-3">
      <Progress value={concept.masteryPercent} className="h-2 max-w-28" />
      <span className="text-sm font-medium text-muted-foreground">{concept.masteryPercent}%</span>
    </div>
  )
}

function WeakConceptActions({ concept }: { concept: ReviewWeakConceptView }) {
  const actions = getWeakConceptActions(concept.status)
  const canResolve = actions.some((action) => action === 'resolve')
  const canIgnore = actions.some((action) => action === 'ignore')

  return (
    <div className="flex items-center justify-end gap-3">
      {canResolve ? (
        <Button variant="ghost" className="h-auto px-0 text-sm font-medium">
          <CircleCheckIcon className="size-4" />
          Resolve
        </Button>
      ) : null}
      {canIgnore ? (
        <Button variant="ghost" className="h-auto px-0 text-sm font-medium">
          <XIcon className="size-4" />
          Ignore
        </Button>
      ) : null}
    </div>
  )
}

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
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 xl:grid-cols-3">
        {data.queue.map((item) => (
          <ReviewQueueCard
            key={item.id}
            item={item}
            renderRatingActions={renderRatingActions ? renderRatingActions(item) : undefined}
          />
        ))}
      </div>

      <Card className="gap-0 py-0">
        <CardHeader className="border-b py-4">
          <div>
            <CardTitle className="text-xl font-semibold">Learning path</CardTitle>
            <p className="text-sm text-muted-foreground">What to study next, ranked by priority.</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 py-4">
          {data.learningPath.map((item) => (
            <LearningPathListItem
              key={item.id}
              badges={[
                {
                  label: item.typeLabel,
                  variant: 'outline',
                  className:
                    'rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-widest',
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

      <Card className="gap-0 py-0">
        <CardHeader className="border-b py-4">
          <div>
            <CardTitle className="text-xl font-semibold">Weak concepts</CardTitle>
            <p className="text-sm text-muted-foreground">
              Patterns across sessions. Mark them resolved as you improve.
            </p>
          </div>
        </CardHeader>
        <CardContent className="py-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-1/3">Concept</TableHead>
                <TableHead>Occurrences</TableHead>
                <TableHead>Mastery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last seen</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.weakConcepts.map((concept) => (
                <TableRow key={concept.id}>
                  <TableCell className="font-medium whitespace-normal">{concept.concept}</TableCell>
                  <TableCell>{concept.occurrenceCount}</TableCell>
                  <TableCell>
                    <WeakConceptMastery concept={concept} />
                  </TableCell>
                  <TableCell>
                    <span className={getWeakConceptStatusClassName(concept.status)}>
                      {concept.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <WeakConceptLastSeen concept={concept} />
                  </TableCell>
                  <TableCell>
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

function LoadingBody() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="gap-0 py-0">
            <CardHeader className="gap-4 border-b py-4">
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-6 w-18 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-7 w-3/4" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((__, buttonIndex) => (
                <Skeleton key={buttonIndex} className="h-8 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="min-h-64 items-center justify-center">
        <Spinner size="lg" />
      </Card>
    </div>
  )
}

function ErrorBody({ message, retryHref }: { message: string; retryHref?: string }) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
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

function WeakConceptLastSeen({ concept }: { concept: ReviewWeakConceptView }) {
  if (!concept.lastSeenAt) {
    return <span className="text-sm text-muted-foreground">Unknown</span>
  }

  const date =
    concept.lastSeenAt instanceof Date ? concept.lastSeenAt : new Date(concept.lastSeenAt)
  const label = Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString()

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <HistoryIcon className="size-4" />
      <span>{label}</span>
    </div>
  )
}

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
