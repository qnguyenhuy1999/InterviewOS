'use client'

import { Button } from '../../../components/ui/button'
import { PageBody, PageHeader } from '../../../components/ui/page'
import { LearningPathListItem } from '../../molecules/LearningPathListItem/LearningPathListItem'
import { EmptyBody } from './components/EmptyBody'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { ReadyBody } from './components/ReadyBody'
import type { LearningPathPageProps } from './LearningPathPage.types'

function Root({
  state,
  reviewQueueHref,
  focusModeHref,
  retryHref,
  renderItemActions,
}: LearningPathPageProps) {
  return (
    <>
      <PageHeader
        title="Learning path"
        description="A prioritized queue of what to study next, based on recent weakness signals and review outcomes."
        actions={
          focusModeHref ? (
            <Button asChild variant="outline" size="lg">
              <a href={focusModeHref}>Focus mode</a>
            </Button>
          ) : undefined
        }
      />

      <PageBody>
        {state.kind === 'error' ? (
          <ErrorBody message={state.message} retryHref={retryHref} />
        ) : state.kind === 'loading' ? (
          <LoadingBody />
        ) : state.kind === 'empty' ? (
          <EmptyBody reviewQueueHref={reviewQueueHref} />
        ) : (
          <ReadyBody state={state} renderItemActions={renderItemActions} />
        )}
      </PageBody>
    </>
  )
}

const LearningPathPage = Object.assign(Root, {
  LearningPathListItem,
})

export default LearningPathPage
