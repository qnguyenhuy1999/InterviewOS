'use client'

import { useState } from 'react'

import { Button } from '../../../components/ui/button'

interface StartPracticeButtonProps {
  onStartPractice: () => Promise<void>
}

export function StartPracticeButton({ onStartPractice }: StartPracticeButtonProps) {
  const [pending, setPending] = useState(false)

  async function startPractice() {
    setPending(true)
    try {
      await onStartPractice()
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      type="button"
      disabled={pending}
      onClick={() => {
        void startPractice()
      }}
    >
      {pending ? 'Starting...' : 'Practice this question'}
    </Button>
  )
}
