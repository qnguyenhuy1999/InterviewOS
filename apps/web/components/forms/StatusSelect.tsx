'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'

export function StatusSelect({
  endpoint,
  value,
  options,
}: {
  endpoint: string
  value: string
  options: string[]
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function updateStatus(nextValue: string) {
    setPending(true)

    try {
      const response = await apiFetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextValue }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(event) => {
        void updateStatus(event.target.value)
      }}
      className="rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-60"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.replaceAll('_', ' ')}
        </option>
      ))}
    </select>
  )
}
