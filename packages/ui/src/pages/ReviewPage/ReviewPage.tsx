'use client'

import { PageBody, PageHeader } from '../../../components/ui/page'
import { Separator } from '../../../components/ui/separator'
import { ErrorBody } from './components/ErrorBody'
import { LoadingBody } from './components/LoadingBody'
import { ReviewBody } from './components/ReviewBody'
import { ReviewQueueCard } from './components/ReviewQueueCard'
import { WeakConceptActions } from './components/WeakConceptActions'
import { reviewPageFixture } from './ReviewPage.fixtures'
import type { ReviewPageProps } from './ReviewPage.types'

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
