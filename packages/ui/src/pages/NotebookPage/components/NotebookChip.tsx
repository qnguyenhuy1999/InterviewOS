import { NoteStatus } from '@interviewos/types'
import type { ReactNode } from 'react'

import { Badge } from '../../../../components/ui/badge'
import { cn } from '../../../../lib/utils'

export function NotebookChip({
  children,
  variant = 'default',
  status,
  className,
}: {
  children: ReactNode
  variant?: 'default' | 'status' | 'accent' | 'muted'
  status?: NoteStatus
  className?: string
}) {
  const statusOverride: Partial<Record<NoteStatus, string>> = {
    [NoteStatus.INTERVIEW_READY]: 'border-success/25 bg-success/10 text-success',
    [NoteStatus.NEEDS_PRACTICE]:
      'border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    [NoteStatus.DRAFT]: 'border-border/70 bg-muted/50 text-muted-foreground',
  }

  const variantClassName: Record<'default' | 'status' | 'accent' | 'muted', string> = {
    default: 'border-border/70 bg-background/80 text-muted-foreground',
    status: 'border-success/25 bg-success/10 text-success',
    accent: 'border-primary/20 bg-primary/10 text-primary',
    muted: 'border-border/70 bg-muted/50 text-muted-foreground',
  }

  const resolvedClass = status
    ? (statusOverride[status] ?? variantClassName[variant])
    : variantClassName[variant]

  return (
    <Badge
      variant="outline"
      className={cn('h-6 rounded-full text-xs font-semibold uppercase', resolvedClass, className)}
    >
      {children}
    </Badge>
  )
}
