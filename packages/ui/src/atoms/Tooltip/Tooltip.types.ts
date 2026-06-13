import type * as React from 'react'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: React.ReactNode
  children?: React.ReactElement
  placement?: TooltipPlacement
  shortcut?: string
  delay?: number
  className?: string
}
