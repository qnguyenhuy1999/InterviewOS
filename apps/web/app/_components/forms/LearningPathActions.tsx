'use client'

import { API_ROUTES } from '@interviewos/config'
import { LearningPathActions as LearningPathActionsUI } from '@interviewos/ui/organisms/LearningPathActions'
import { useRouter } from 'next/navigation'

import { apiFetch } from '@/lib/api-client'

export function LearningPathActions({ itemId }: { itemId: string }) {
  const router = useRouter()

  async function handleAction(action: 'start' | 'complete' | 'snooze' | 'skip') {
    const response = await apiFetch(API_ROUTES.review.learningPathAction(itemId), {
      method: 'POST',
      body: JSON.stringify({ action }),
    })
    if (!response.ok) throw new Error(await response.text())
    router.refresh()
  }

  return <LearningPathActionsUI onAction={handleAction} />
}
