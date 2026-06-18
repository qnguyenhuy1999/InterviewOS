import { Progress } from '../../../../components/ui/progress'
import type { ReviewPageReadyState } from '../ReviewPage.types'

function WeakConceptMastery({ concept }: { concept: ReviewPageReadyState['data']['weakConcepts'][number] }) {
  return (
    <div className="flex min-w-36 items-center gap-2.5">
      <Progress value={concept.masteryPercent} className="h-1.5 max-w-28" />
      <span className="font-mono text-xs font-medium tabular-nums text-muted-foreground">
        {concept.masteryPercent}%
      </span>
    </div>
  )
}

export { WeakConceptMastery }
