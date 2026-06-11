'use client'

import { API_ROUTES } from '@interviewos/config'
import { ReviewRatingActions as ReviewRatingActionsUI } from '@interviewos/ui/organisms/ReviewRatingActions'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'

export function ReviewRatingActions({ reviewItemId }: { reviewItemId: string }) {
  const router = useRouter()

  async function handleRate(rating: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY') {
    const response = await apiFetch(API_ROUTES.review.rate(reviewItemId), {
      method: 'POST',
      body: JSON.stringify({ rating }),
    })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  return <ReviewRatingActionsUI onRate={handleRate} />
}
