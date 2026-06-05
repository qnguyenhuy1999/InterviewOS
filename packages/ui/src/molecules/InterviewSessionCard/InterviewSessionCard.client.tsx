'use client'

import { PlayIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import { CardFooter } from '../../../components/ui/card'

type ActionsProps = {
  onResume?: () => void
  onReview?: () => void
  isCompleted?: boolean
}

export default function InterviewSessionCardActions({
  onResume,
  onReview,
  isCompleted,
}: ActionsProps) {
  if (!onResume && !onReview) return null
  return (
    <CardFooter className="gap-2 border-t pt-3">
      {onResume && !isCompleted && (
        <Button size="xs" onClick={onResume}>
          <PlayIcon /> Resume
        </Button>
      )}
      {onReview && isCompleted && (
        <Button size="xs" variant="outline" onClick={onReview}>
          Review
        </Button>
      )}
    </CardFooter>
  )
}
