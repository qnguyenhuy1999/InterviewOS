import type * as React from 'react'

export type LabelVariant = 'required' | 'optional' | 'hint'

export interface LabelProps {
  children: React.ReactNode
  htmlFor?: string
  variant?: LabelVariant
  className?: string
}
