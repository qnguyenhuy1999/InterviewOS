'use client'

import { API_ROUTES } from '@interviewos/config'
import { WeakConceptStatus } from '@interviewos/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'

const STATUS_OPTIONS = [
  WeakConceptStatus.IMPROVING,
  WeakConceptStatus.RESOLVED,
  WeakConceptStatus.IGNORED,
] as const

export function WeakConceptStatusActions({ weakConceptId }: { weakConceptId: string }) {
  const router = useRouter()
  const [pending, setPending] = useState<WeakConceptStatus | null>(null)

  async function updateStatus(status: WeakConceptStatus) {
    setPending(status)

    try {
      const response = await apiFetch(API_ROUTES.review.weakConceptStatus(weakConceptId), {
        method: 'PATCH',
        body: JSON.stringify({ status }),
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
    <div className="flex flex-wrap justify-end gap-2">
      {STATUS_OPTIONS.map((status) => (
        <button
          key={status}
          type="button"
          disabled={pending !== null}
          onClick={() => {
            void updateStatus(status)
          }}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium disabled:opacity-60"
        >
          {pending === status ? 'Saving...' : status.replaceAll('_', ' ')}
        </button>
      ))}
    </div>
  )
}
