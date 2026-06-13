import clsx from 'clsx'
import type * as React from 'react'

import type { ScorePipProps } from './ScorePip.types'

const SIZE_MAP = {
  sm: 8,
  md: 12,
  lg: 16,
} as const

export function ScorePip({ value, state = 'filled', size = 'md', className }: ScorePipProps) {
  const px = SIZE_MAP[size]

  const baseStyle: React.CSSProperties = {
    width: px,
    height: px,
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0,
  }

  if (state === 'filled') {
    baseStyle.backgroundColor = `var(--color-score-${value})`
  } else if (state === 'empty') {
    baseStyle.backgroundColor = 'transparent'
    baseStyle.border = '1.5px solid var(--color-border-interview)'
  } else {
    // partial: half opacity fill
    baseStyle.backgroundColor = `var(--color-score-${value})`
    baseStyle.opacity = 0.45
  }

  return (
    <span
      className={clsx(className)}
      style={baseStyle}
      aria-label={`Score ${value} ${state}`}
      role="img"
    />
  )
}
