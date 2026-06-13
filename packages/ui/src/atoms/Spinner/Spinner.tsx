import clsx from 'clsx'

import type { SpinnerProps, SpinnerSize } from './Spinner.types'

const SIZE_MAP: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
}

export function Spinner({ size = 'md', label = 'Loading…', className }: SpinnerProps) {
  const px = SIZE_MAP[size]
  const r = (px / 2) * 0.7
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * 0.25

  return (
    <span
      className={clsx('inline-flex items-center justify-center', className)}
      role="status"
      aria-label={label}
    >
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        fill="none"
        aria-hidden="true"
        style={{ animation: 'spin 0.8s linear infinite' }}
      >
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          stroke="var(--color-surface-raised)"
          strokeWidth={2.5}
        />
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          stroke="var(--color-accent-teal)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
    </span>
  )
}
