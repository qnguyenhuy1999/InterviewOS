'use client'

import type ReviewPage from '@interviewos/ui/pages/ReviewPage'
import ReviewPageUI from '@interviewos/ui/pages/ReviewPage'
import type React from 'react'

import { LearningPathActions } from '@/app/_components/forms/LearningPathActions'
import { ReviewRatingActions } from '@/app/_components/forms/ReviewRatingActions'
import { WeakConceptStatusActions } from '@/app/_components/forms/WeakConceptStatusActions'

type Props = Omit<
  React.ComponentProps<typeof ReviewPage>,
  'renderRatingActions' | 'renderLearningPathActions' | 'renderWeakConceptActions'
>

export default function ReviewPageClient(props: Props) {
  return (
    <ReviewPageUI
      {...props}
      renderRatingActions={(item) => <ReviewRatingActions reviewItemId={item.reviewItemId} />}
      renderLearningPathActions={(item) => <LearningPathActions itemId={item.id} />}
      renderWeakConceptActions={(concept) => (
        <WeakConceptStatusActions weakConceptId={concept.id} />
      )}
    />
  )
}
