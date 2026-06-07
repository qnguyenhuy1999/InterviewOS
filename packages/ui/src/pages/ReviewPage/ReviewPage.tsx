import type {
  LearningPathItemStatus,
  ReviewQueueCardView,
  ReviewRating,
  ReviewWeakConceptView,
} from '@interviewos/types'
import {
  CircleCheckIcon,
  Clock3Icon,
  PlayIcon,
  RotateCcwIcon,
  SkipForwardIcon,
  XIcon,
} from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { EmptyState } from '../../../components/ui/page'
import { Progress } from '../../../components/ui/progress'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { Spinner } from '../../../components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table'
import { cn } from '../../../lib/utils'
import ConsoleLayout from '../../layouts/ConsoleLayout'
import { consoleLayoutNavigationFixture } from '../../layouts/ConsoleLayout/ConsoleLayout.fixtures'
import type { ConsoleLayoutNavGroup } from '../../layouts/ConsoleLayout/ConsoleLayout.types'
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

const reviewNavigationFixture: ConsoleLayoutNavGroup[] = consoleLayoutNavigationFixture.map(
  (group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive: item.label === 'Review',
    })),
  }),
)

function ReviewTypeBadge({ type }: { type: ReviewQueueCardView['type'] }) {
  return (
    <Badge
      variant="outline"
      className="rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em]"
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

function ReviewQueueCard({ item }: { item: ReviewQueueCardView }) {
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
        {item.availableRatings.map((rating) => (
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
  empty,
  data = reviewPageFixture,
}: {
  empty?: boolean
  data?: ReviewPageProps['data']
}) {
  if (empty) {
    return (
      <EmptyState
        className="min-h-80"
        title="No reviews scheduled yet"
        description="Finish an interview, notebook session, or English drill to build your first review queue."
        action={<Button>Start a study session</Button>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 xl:grid-cols-3">
        {data.queue.map((item) => (
          <ReviewQueueCard key={item.id} item={item} />
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
                  className: 'rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em]',
                },
              ]}
              title={item.title}
              description={item.detail}
              priorityValue={item.priorityScore}
              action={<LearningPathActionButtons status={item.status} />}
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
                <TableHead className="w-[34%]">Concept</TableHead>
                <TableHead>Occurrences</TableHead>
                <TableHead>Mastery</TableHead>
                <TableHead>Status</TableHead>
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
                    <WeakConceptActions concept={concept} />
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
        <Spinner className="size-7" />
      </Card>
    </div>
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-[60vh] border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load review queue</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

function Root({ data = reviewPageFixture, loading, empty, error }: ReviewPageProps) {
  return (
    <ConsoleLayout
      title={data.title}
      navigation={reviewNavigationFixture}
      headerActions={
        <Badge
          variant="secondary"
          className={cn(
            'hidden rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground md:inline-flex',
          )}
        >
          {data.dueLabel}
        </Badge>
      }
    >
      <div className="mb-6 border-b pb-6">
        <h2 className="font-heading text-4xl font-semibold tracking-tight">{data.title}</h2>
        <p className="mt-2 text-base text-muted-foreground">{data.subtitle}</p>
      </div>
      {error ? (
        <ErrorBody message={error} />
      ) : loading ? (
        <LoadingBody />
      ) : (
        <ReviewBody empty={empty} data={data} />
      )}
      <Separator className="mt-8 opacity-0" />
    </ConsoleLayout>
  )
}

const ReviewPage = Object.assign(Root, {
  ReviewQueueCard,
  WeakConceptActions,
})

export default ReviewPage
