'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { apiFetch } from '@/lib/api-client'

export function NoteActions({
  noteId,
  canGenerateQuestions,
}: {
  noteId: string
  canGenerateQuestions: boolean
}) {
  const router = useRouter()
  const [pendingAction, setPendingAction] = useState<'note' | 'questions' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function run(action: 'note' | 'questions') {
    setPendingAction(action)
    setError(null)

    const path = action === 'note' ? `/notes/${noteId}/generate` : `/notes/${noteId}/questions`
    const body = action === 'questions' ? JSON.stringify({ count: 5 }) : undefined

    try {
      const response = await apiFetch(path, {
        method: 'POST',
        body,
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      router.refresh()
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to run action.')
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/notebook/${noteId}/edit`}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium"
        >
          Edit note
        </Link>
        <button
          type="button"
          disabled={pendingAction !== null}
          onClick={() => {
            void run('note')
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {pendingAction === 'note' ? 'Generating note...' : 'Generate AI technical note'}
        </button>
        <button
          type="button"
          disabled={pendingAction !== null || !canGenerateQuestions}
          onClick={() => {
            void run('questions')
          }}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {pendingAction === 'questions'
            ? 'Generating questions...'
            : 'Generate interview questions'}
        </button>
      </div>
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  )
}
