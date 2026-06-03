'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'

const actions = [
  ['start', 'Start'],
  ['complete', 'Complete'],
  ['snooze', 'Snooze'],
  ['skip', 'Skip'],
] as const

export function LearningPathActions({ itemId }: { itemId: string }) {
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)

  async function run(action: (typeof actions)[number][0]) {
    setPending(action)

    try {
      const response = await apiFetch(`/learning-path/${itemId}/action`, {
        method: 'POST',
        body: JSON.stringify({ action }),
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
      {actions.map(([action, label]) => (
        <button
          key={action}
          type="button"
          disabled={pending !== null}
          onClick={() => {
            void run(action)
          }}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium disabled:opacity-60"
        >
          {pending === action ? 'Saving...' : label}
        </button>
      ))}
    </div>
  )
}
