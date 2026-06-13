import type { LucideProps } from 'lucide-react'
import type * as React from 'react'

export type IconSize = 'sm' | 'md' | 'lg'
export type IconIntent = 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error'

export interface IconProps {
  icon: React.ComponentType<LucideProps>
  size?: IconSize
  intent?: IconIntent
  className?: string
  'aria-label'?: string
}
