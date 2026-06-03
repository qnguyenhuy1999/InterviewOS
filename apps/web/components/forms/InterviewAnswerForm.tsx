'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { absoluteApiPath } from '@/lib/api-client'

export function InterviewAnswerForm({ sessionId }: { sessionId: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)

    try {
      const response = await fetch(absoluteApiPath(`/sessions/${sessionId}/answer`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: String(formData.get('answer') ?? ''),
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      router.refresh()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to submit answer.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      action={(formData) => {
        void handleSubmit(formData)
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="answer">
          Your answer
        </label>
        <textarea
          id="answer"
          name="answer"
          rows={10}
          placeholder="Write your interview answer in English. Focus on structure, tradeoffs, and one concrete example."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {pending ? 'Evaluating answer...' : 'Submit answer'}
      </button>
    </form>
  )
}
