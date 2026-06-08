'use client'

import { API_ROUTES } from '@interviewos/config'
import { RotateCcwIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'

export function ReadinessRefreshButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleClick() {
    setPending(true)

    try {
      const response = await apiFetch(API_ROUTES.readiness.compute, { method: 'POST' })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void handleClick()
      }}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium disabled:opacity-60"
    >
      <RotateCcwIcon className="size-4" />
      {pending ? 'Refreshing...' : 'Recompute readiness'}
    </button>
  )
}
