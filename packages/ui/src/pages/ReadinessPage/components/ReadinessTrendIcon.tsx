import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react'

import { getReadinessTrend } from '../ReadinessPage.utils'

function ReadinessTrendIcon({ delta }: { delta: number }) {
  const trend = getReadinessTrend(delta)

  if (trend === 'UP') return <ArrowUpIcon className="size-4" />
  if (trend === 'DOWN') return <ArrowDownIcon className="size-4" />
  return <MinusIcon className="size-4" />
}

export { ReadinessTrendIcon }
