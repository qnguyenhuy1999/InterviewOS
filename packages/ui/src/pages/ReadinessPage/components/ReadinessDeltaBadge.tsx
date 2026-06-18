import { Badge } from '../../../../components/ui/badge'
import { cn } from '../../../../lib/utils'
import {
  getReadinessDeltaLabel,
  getReadinessTrend,
  getReadinessTrendClassName,
} from '../ReadinessPage.utils'
import { ReadinessTrendIcon } from './ReadinessTrendIcon'

function ReadinessDeltaBadge({ delta }: { delta: number }) {
  const trend = getReadinessTrend(delta)
  return (
    <Badge
      variant="outline"
      className={cn('gap-1 px-2.5 py-1 text-xs font-medium', getReadinessTrendClassName(trend))}
    >
      <ReadinessTrendIcon delta={delta} />
      {getReadinessDeltaLabel(delta)}
    </Badge>
  )
}

export { ReadinessDeltaBadge }
