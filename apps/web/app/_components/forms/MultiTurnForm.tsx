'use client'

import { API_ROUTES } from '@interviewos/config'
import { MultiTurnForm as MultiTurnFormUI } from '@interviewos/ui/organisms/MultiTurnForm'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'
import { APP_ROUTES } from '@/lib/app-routes'

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

  async function handleSubmitAnswer(answer: string) {
    const res = await apiFetch(API_ROUTES.sessions.turns(sessionId), {
      method: 'POST',
      body: JSON.stringify({ answer }),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{
      candidateTurn: Turn
      interviewerTurn: Turn | null
      decision: string
      isComplete: boolean
    }>
  }

  async function handleEndSession() {
    const res = await apiFetch(API_ROUTES.sessions.end(sessionId), { method: 'POST' })
    if (!res.ok) throw new Error(await res.text())
    router.refresh()
  }

  return (
    <MultiTurnFormUI
      initialTurns={initialTurns}
      isComplete={isComplete}
      reviewHref={APP_ROUTES.interviewReview(sessionId)}
      onSubmitAnswer={handleSubmitAnswer}
      onEndSession={handleEndSession}
    />
  )
}
