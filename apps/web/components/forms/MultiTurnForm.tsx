'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { apiFetch } from '@/lib/api-client'

type Turn = {
  id: string
  role: 'CANDIDATE' | 'INTERVIEWER'
  content: string
  turnNumber: number
  decision?: string | null
}

export function MultiTurnForm({
  sessionId,
  initialTurns,
  isComplete,
}: {
  sessionId: string
  initialTurns: Turn[]
  isComplete: boolean
}) {
  const router = useRouter()
  const [turns, setTurns] = useState<Turn[]>(initialTurns)
  const [complete, setComplete] = useState(isComplete)
  const [pending, setPending] = useState(false)
  const [ending, setEnding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const answer = textareaRef.current?.value.trim()
    if (!answer || pending) return

    setPending(true)
    setError(null)

    try {
      const res = await apiFetch(`/sessions/${sessionId}/turns`, {
        method: 'POST',
        body: JSON.stringify({ answer }),
      })
      if (!res.ok) throw new Error(await res.text())

      const data = (await res.json()) as {
        candidateTurn: Turn
        interviewerTurn: Turn | null
        decision: string
        isComplete: boolean
      }

      const next: Turn[] = [...turns, data.candidateTurn]
      if (data.interviewerTurn) next.push(data.interviewerTurn)
      setTurns(next)

      if (data.isComplete) {
        setComplete(true)
      }

      if (textareaRef.current) textareaRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer.')
    } finally {
      setPending(false)
    }
  }

  async function handleEnd() {
    setEnding(true)
    setError(null)
    try {
      const res = await apiFetch(`/sessions/${sessionId}/end`, { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      setComplete(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end session.')
    } finally {
      setEnding(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        {turns.map((turn) => (
          <div
            key={turn.id}
            className={`flex ${turn.role === 'CANDIDATE' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                turn.role === 'CANDIDATE'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-card-foreground'
              }`}
            >
              <p className="whitespace-pre-wrap">{turn.content}</p>
              <p
                className={`mt-1 text-xs ${
                  turn.role === 'CANDIDATE' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                }`}
              >
                {turn.role === 'CANDIDATE' ? 'You' : 'Interviewer'} · Turn {turn.turnNumber}
              </p>
            </div>
          </div>
        ))}

        {pending && (
          <div className="flex justify-start">
            <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {complete ? (
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            Session complete. Your evaluation is being generated.
          </p>
          <a
            href={`/interview/session/${sessionId}/review`}
            className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            View review
          </a>
        </div>
      ) : (
        <form onSubmit={(e) => { void handleEnd(); e.preventDefault() }} className="hidden" />
      )}

      {!complete && (
        <form onSubmit={(e) => { void handleSubmit(e) }} className="space-y-3">
          <textarea
            ref={textareaRef}
            rows={4}
            placeholder="Type your answer..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {pending ? 'Sending...' : 'Send answer'}
            </button>
            <button
              type="button"
              onClick={() => { void handleEnd() }}
              disabled={ending || pending}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-60"
            >
              {ending ? 'Ending...' : 'End session'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
