'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type SubmitTurnInput, submitTurnSchema } from '@interviewos/validators'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type Turn = {
  id: string
  role: 'CANDIDATE' | 'INTERVIEWER'
  content: string
  turnNumber: number
  decision?: string | null
}

type SubmitAnswerResult = {
  candidateTurn: Turn
  interviewerTurn: Turn | null
  decision: string
  isComplete: boolean
}

interface MultiTurnFormProps {
  initialTurns: Turn[]
  isComplete: boolean
  reviewHref: string
  onSubmitAnswer: (answer: string) => Promise<SubmitAnswerResult>
  onEndSession: () => Promise<void>
}

export function MultiTurnForm({
  initialTurns,
  isComplete,
  reviewHref,
  onSubmitAnswer,
  onEndSession,
}: MultiTurnFormProps) {
  const [turns, setTurns] = useState<Turn[]>(initialTurns)
  const [complete, setComplete] = useState(isComplete)
  const [ending, setEnding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubmitTurnInput>({
    resolver: zodResolver(submitTurnSchema),
    defaultValues: {
      answer: '',
    },
  })

  async function handleAnswerSubmit(values: SubmitTurnInput) {
    setError(null)

    try {
      const data = await onSubmitAnswer(values.answer)

      const next: Turn[] = [...turns, data.candidateTurn]
      if (data.interviewerTurn) next.push(data.interviewerTurn)
      setTurns(next)

      if (data.isComplete) {
        setComplete(true)
      }

      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer.')
    }
  }

  async function handleEnd() {
    setEnding(true)
    setError(null)
    try {
      await onEndSession()
      setComplete(true)
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
              className={`w-fit max-w-3xl rounded-xl px-4 py-3 text-sm ${
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

        {isSubmitting && (
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
            href={reviewHref}
            className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            View review
          </a>
        </div>
      ) : (
        <form onSubmit={(e) => { void handleEnd(); e.preventDefault() }} className="hidden" />
      )}

      {!complete && (
        <form onSubmit={handleSubmit(handleAnswerSubmit)} className="space-y-3" noValidate>
          <textarea
            rows={4}
            placeholder="Type your answer..."
            {...register('answer')}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          {errors.answer?.message ? (
            <p className="text-sm text-destructive">{errors.answer.message}</p>
          ) : null}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Send answer'}
            </button>
            <button
              type="button"
              onClick={() => { void handleEnd() }}
              disabled={ending || isSubmitting}
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
