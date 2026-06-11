'use client'

import { API_ROUTES } from '@interviewos/config'
import { StartPracticeButton as StartPracticeButtonUI } from '@interviewos/ui/organisms/StartPracticeButton'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'
import { APP_ROUTES } from '@/lib/app-routes'

export function StartPracticeButton({ generatedQuestionId }: { generatedQuestionId: string }) {
  const router = useRouter()

  async function handleStartPractice() {
    const response = await apiFetch(API_ROUTES.sessions.list, {
      method: 'POST',
      body: JSON.stringify({ generatedQuestionId }),
    })
    if (!response.ok) throw new Error(await response.text())
    const session = (await response.json()) as { id: string }
    router.push(APP_ROUTES.interviewSession(session.id))
    router.refresh()
  }

  return <StartPracticeButtonUI onStartPractice={handleStartPractice} />
}
