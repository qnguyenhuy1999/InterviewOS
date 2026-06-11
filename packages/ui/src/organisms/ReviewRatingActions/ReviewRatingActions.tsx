'use client'

import { useState } from 'react'

import { Button } from '../../../components/ui/button'

const ratings = ['AGAIN', 'HARD', 'GOOD', 'EASY'] as const

type ReviewRating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY'

interface ReviewRatingActionsProps {
  onRate: (rating: ReviewRating) => Promise<void>
}

export function ReviewRatingActions({ onRate }: ReviewRatingActionsProps) {
  const [pending, setPending] = useState<string | null>(null)

  async function rate(rating: (typeof ratings)[number]) {
    setPending(rating)
    try {
      await onRate(rating)
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ratings.map((rating) => (
        <Button
          key={rating}
          variant="outline"
          size="sm"
          type="button"
          disabled={pending !== null}
          onClick={() => {
            void rate(rating)
          }}
        >
          {pending === rating ? 'Saving...' : rating.replaceAll('_', ' ')}
        </Button>
      ))}
    </div>
  )
}
