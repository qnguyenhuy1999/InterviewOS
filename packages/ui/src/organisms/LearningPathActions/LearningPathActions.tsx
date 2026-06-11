'use client'

import { useState } from 'react'

import { Button } from '../../../components/ui/button'

const actions = [
  ['start', 'Start'],
  ['complete', 'Complete'],
  ['snooze', 'Snooze'],
  ['skip', 'Skip'],
] as const

type LearningPathActionType = 'start' | 'complete' | 'snooze' | 'skip'

interface LearningPathActionsProps {
  onAction: (action: LearningPathActionType) => Promise<void>
}

export function LearningPathActions({ onAction }: LearningPathActionsProps) {
  const [pending, setPending] = useState<string | null>(null)

  async function run(action: (typeof actions)[number][0]) {
    setPending(action)
    try {
      await onAction(action)
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(([action, label]) => (
        <Button
          key={action}
          variant="outline"
          size="sm"
          type="button"
          disabled={pending !== null}
          onClick={() => {
            void run(action)
          }}
        >
          {pending === action ? 'Saving...' : label}
        </Button>
      ))}
    </div>
  )
}
