'use client'

import { API_ROUTES } from '@interviewos/config'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'

const ratings = ['AGAIN', 'HARD', 'GOOD', 'EASY'] as const

export function ReviewRatingActions({ reviewItemId }: { reviewItemId: string }) {
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)

  async function rate(rating: (typeof ratings)[number]) {
    setPending(rating)

    try {
      const response = await apiFetch(API_ROUTES.review.rate(reviewItemId), {
        method: 'POST',
        body: JSON.stringify({ rating }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      router.refresh()
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ratings.map((rating) => (
        <button
          key={rating}
          type="button"
          disabled={pending !== null}
          onClick={() => {
            void rate(rating)
          }}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium disabled:opacity-60"
        >
          {pending === rating ? 'Saving...' : rating.replaceAll('_', ' ')}
        </button>
      ))}
    </div>
  )
}
