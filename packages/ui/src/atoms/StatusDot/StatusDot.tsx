import clsx from 'clsx'

import type { StatusDotProps, StatusDotVariant } from './StatusDot.types'

const SIZE_MAP = {
  sm: 6,
  md: 8,
  lg: 10,
} as const

const COLOR_MAP: Record<StatusDotVariant, string> = {
  live: 'var(--color-status-live)',
  idle: 'var(--color-status-neutral)',
  away: 'var(--color-status-warn)',
  offline: 'var(--color-text-disabled)',
}

export function StatusDot({
  variant,
  size = 'md',
  label,
  showLabel = false,
  pulse,
  className,
}: StatusDotProps) {
  const px = SIZE_MAP[size]
  const color = COLOR_MAP[variant]
  const shouldPulse = pulse !== undefined ? pulse : variant === 'live'
  const ariaLabel = label ?? variant

  const dot = (
    <span
      className={clsx(shouldPulse && 'animate-pulse-live')}
      style={{
        width: px,
        height: px,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-block',
        flexShrink: 0,
      }}
    />
  )

  if (!showLabel) {
    return (
      <span
        className={clsx('inline-flex items-center', className)}
        aria-label={ariaLabel}
        role="img"
      >
        {dot}
      </span>
    )
  }

  return (
    <span className={clsx('inline-flex items-center gap-1.5', className)} aria-label={ariaLabel}>
      {dot}
      <span
        style={{
          fontSize: 'var(--text-interview-sm)',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-display)',
        }}
      >
        {label ?? variant}
      </span>
    </span>
  )
}
