import type {
  ReviewLearningPathView,
  ReviewPageView,
  ReviewWeakConceptView,
  UserWeakConcept,
} from '@interviewos/types'

type ReviewPageApiPayload = Omit<ReviewPageView, 'learningPath' | 'queue' | 'weakConcepts'> & {
  learningPath?: ReviewLearningPathView[]
  queue?: ReviewPageView['queue']
  weakConcepts?: ReviewWeakConceptView[]
}

export function normalizeReviewPageData(
  review: ReviewPageApiPayload,
  weakConcepts: UserWeakConcept[],
): ReviewPageView {
  const weakConceptsById = new Map(weakConcepts.map((item) => [item.id, item]))

  return {
    ...review,
    queue: review.queue ?? [],
    learningPath: review.learningPath ?? [],
    weakConcepts: (review.weakConcepts ?? []).map((concept) => ({
      ...concept,
      lastSeenAt: weakConceptsById.get(concept.id)?.lastSeenAt ?? concept.lastSeenAt ?? null,
    })),
  }
}
