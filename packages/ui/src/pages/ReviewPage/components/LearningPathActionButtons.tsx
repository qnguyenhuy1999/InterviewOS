import type { LearningPathItemStatus } from '@interviewos/types'
import { PlayIcon, RotateCcwIcon, SkipForwardIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { getLearningPathActionLabel, getLearningPathActionVariant } from '../ReviewPage.utils'

function LearningPathActionButtons({ status }: { status: LearningPathItemStatus }) {
  return (
    <div className="flex items-center gap-1.5">
      <Button variant={getLearningPathActionVariant(status)} size="sm" className="min-w-20">
        <PlayIcon className="size-3.5" aria-hidden="true" />
        {getLearningPathActionLabel(status)}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full text-muted-foreground hover:text-foreground"
      >
        <RotateCcwIcon className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Replay learning path item</span>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full text-muted-foreground hover:text-foreground"
      >
        <SkipForwardIcon className="size-3.5" aria-hidden="true" />
        <span className="sr-only">Skip learning path item</span>
      </Button>
    </div>
  )
}

export { LearningPathActionButtons }
