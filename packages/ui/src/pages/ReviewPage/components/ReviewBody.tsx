import { Button } from '../../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { EmptyState } from '../../../../components/ui/page'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import { LearningPathListItem } from '../../../molecules/LearningPathListItem/LearningPathListItem'
import type {
  ReviewPageEmptyState,
  ReviewPageProps,
  ReviewPageReadyState,
} from '../ReviewPage.types'
import { getWeakConceptStatusClassName } from '../ReviewPage.utils'
import { LearningPathActionButtons } from './LearningPathActionButtons'
import { ReviewQueueCard } from './ReviewQueueCard'
import { WeakConceptActions } from './WeakConceptActions'
import { WeakConceptLastSeen } from './WeakConceptLastSeen'
import { WeakConceptMastery } from './WeakConceptMastery'

function ReviewBody({
  state,
  startStudyHref,
  renderRatingActions,
  renderLearningPathActions,
  renderWeakConceptActions,
}: {
  state: ReviewPageReadyState | ReviewPageEmptyState
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
                <TableHead className="pl-5 text-xs font-semibold uppercase tracking-widest">
                  Concept
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-widest">
                  Occurrences
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-widest">
                  Mastery
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-widest">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-widest">
                  Last seen
                </TableHead>
                <TableHead className="pr-5 text-right text-xs font-semibold uppercase tracking-widest">
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

export { ReviewBody }
