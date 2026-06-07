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
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => (
        <Badge
          key={item}
          variant={variant}
          className={cn('h-8 rounded-full px-3 text-sm font-medium', badgeClassName)}
        >
          {item}
        </Badge>
      ))}
      {trailing}
    </div>
  )
}

export { TagList }
