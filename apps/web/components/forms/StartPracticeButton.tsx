'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'

export function StartPracticeButton({ generatedQuestionId }: { generatedQuestionId: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function startPractice() {
    setPending(true)
    try {
      const response = await apiFetch('/sessions', {
        method: 'POST',
        body: JSON.stringify({ generatedQuestionId }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const session = (await response.json()) as { id: string }
      router.push(`/interview/session/${session.id}`)
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        void startPractice()
      }}
      className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
    >
      {pending ? 'Starting...' : 'Practice this question'}
    </button>
  )
}
