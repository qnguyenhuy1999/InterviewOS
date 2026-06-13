import clsx from 'clsx'

import type { ProgressBarProps } from './ProgressBar.types'

export function ProgressBar({
  variant = 'determinate',
  value = 0,
  steps = 5,
  completedSteps = 0,
  label,
  showValue,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-display)' }}
            >
              {label}
            </span>
          )}
          {showValue && variant === 'determinate' && (
            <span
              className="text-xs tabular-nums"
              style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono-interview)' }}
            >
              {clampedValue}%
            </span>
          )}
        </div>
      )}

      {variant === 'stepped' ? (
        <div
          className="flex gap-1"
          role="progressbar"
          aria-valuenow={completedSteps}
          aria-valuemin={0}
          aria-valuemax={steps}
        >
          {Array.from({ length: steps }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full transition-colors duration-300"
              style={{
                height: 4,
                backgroundColor:
                  i < completedSteps ? 'var(--color-accent-teal)' : 'var(--color-surface-raised)',
              }}
            />
          ))}
        </div>
      ) : (
        <div
          className="relative w-full overflow-hidden rounded-full"
          style={{ height: 4, backgroundColor: 'var(--color-surface-raised)' }}
          role="progressbar"
          aria-valuenow={variant === 'determinate' ? clampedValue : undefined}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          {variant === 'determinate' && (
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
              style={{
                width: `${clampedValue}%`,
                backgroundColor: 'var(--color-accent-teal)',
              }}
            />
          )}
          {variant === 'indeterminate' && (
            <div
              className="absolute inset-y-0 rounded-full"
              style={{
                width: '40%',
                backgroundColor: 'var(--color-accent-teal)',
                animation: 'progressbar-slide 1.4s ease-in-out infinite',
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
