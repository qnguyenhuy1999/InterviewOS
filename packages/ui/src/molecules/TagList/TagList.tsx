import type * as React from 'react'

import { Badge } from '../../../components/ui/badge'
import { cn } from '../../../lib/utils'

type TagListProps = {
  items: string[]
  className?: string
  badgeClassName?: string
  variant?: React.ComponentProps<typeof Badge>['variant']
  trailing?: React.ReactNode
}

function TagList({
  items,
  className,
  badgeClassName,
  variant = 'secondary',
  trailing,
}: TagListProps) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((item) => (
        <Badge
          key={item}
          variant={variant}
          className={cn('h-7 rounded-full px-2.5 text-xs font-medium', badgeClassName)}
        >
          {item}
        </Badge>
      ))}
      {trailing}
    </div>
  )
}

export { TagList }
