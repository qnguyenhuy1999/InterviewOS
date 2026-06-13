import clsx from 'clsx'

import type { TimerProps, TimerState } from './Timer.types'

function formatSeconds(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function resolveState(
  variant: TimerProps['variant'],
  seconds: number,
  criticalThreshold: number,
  explicitState?: TimerState,
): TimerState {
  if (explicitState) return explicitState
  if (seconds <= 0) return 'expired'
  if (variant === 'elapsed') return 'running'
  if (seconds <= criticalThreshold) return 'critical'
  return 'running'
}

function getColor(
  variant: TimerProps['variant'],
  state: TimerState,
  seconds: number,
  warningThreshold: number,
): string {
  if (variant === 'elapsed') return 'var(--color-text-secondary)'
  if (state === 'expired') return 'var(--color-status-error)'
  if (variant === 'countdown' && seconds <= warningThreshold) return 'var(--color-status-warn)'
  if (variant === 'warning') {
    return 'var(--color-status-warn)'
  }
  return 'var(--color-text-primary)'
}

function getAriaLabel(variant: TimerProps['variant'], seconds: number): string {
  if (variant === 'elapsed') return `Elapsed time: ${formatSeconds(seconds)}`
  if (variant === 'countdown') return `Time remaining: ${formatSeconds(seconds)}`
  return `Timer: ${formatSeconds(seconds)}`
}

export function Timer({
  variant,
  seconds,
  warningThreshold = 300,
  criticalThreshold = 60,
  state: explicitState,
  compact = false,
  className,
}: TimerProps) {
  const state = resolveState(variant, seconds, criticalThreshold, explicitState)
  const displaySeconds = state === 'expired' ? 0 : seconds
  const color = getColor(variant, state, seconds, warningThreshold)
  const ariaLabel = getAriaLabel(variant, seconds)

  return (
    <span
      className={clsx(
        state === 'critical' && 'animate-pulse-critical',
        compact ? 'text-xs' : 'text-sm',
        className,
      )}
      style={{
        fontFamily: 'var(--font-mono-interview)',
        color,
        display: 'inline-block',
        letterSpacing: 'var(--tracking-wide)',
        fontWeight: 500,
      }}
      aria-live="polite"
      aria-label={ariaLabel}
    >
      {formatSeconds(displaySeconds)}
    </span>
  )
}
