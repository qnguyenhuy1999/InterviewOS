'use client'

import { WeakConceptStatus } from '@interviewos/types'
import { useState } from 'react'

const STATUS_OPTIONS = [
  WeakConceptStatus.IMPROVING,
  WeakConceptStatus.RESOLVED,
  WeakConceptStatus.IGNORED,
] as const

interface WeakConceptStatusActionsProps {
  onUpdateStatus: (status: WeakConceptStatus) => Promise<void>
}

export function WeakConceptStatusActions({ onUpdateStatus }: WeakConceptStatusActionsProps) {
  const [pending, setPending] = useState<WeakConceptStatus | null>(null)

  async function updateStatus(status: WeakConceptStatus) {
    setPending(status)
    try {
      await onUpdateStatus(status)
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
