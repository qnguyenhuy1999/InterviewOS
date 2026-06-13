import clsx from 'clsx'

import { ScorePip } from '../../atoms/ScorePip'
import type { RatingScaleProps } from './RatingScale.types'
import { DEFAULT_LABELS, getScoreBackgroundColor, getScoreColor } from './RatingScale.utils'

const SCORES = [1, 2, 3, 4, 5] as const

export function RatingScale({
  value,
  labels = DEFAULT_LABELS,
  onChange,
  disabled = false,
  showLabels = false,
  variant = 'numeric',
  className,
}: RatingScaleProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    const current = value ?? 0
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(5, current + 1) as 1 | 2 | 3 | 4 | 5
      if (next >= 1) onChange(next)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      const prev = Math.max(1, current - 1) as 1 | 2 | 3 | 4 | 5
      if (prev >= 1) onChange(prev)
    }
  }

  if (variant === 'compact') {
    return (
      <div
        role="radiogroup"
        className={clsx('flex items-center gap-2', className)}
        onKeyDown={handleKeyDown}
      >
        {SCORES.map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={value === n}
            aria-label={labels[n - 1]}
            disabled={disabled}
            onClick={() => onChange(n)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <ScorePip value={n} state={value === n ? 'filled' : 'empty'} size="lg" />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div
      role="radiogroup"
      className={clsx('flex items-start gap-2', className)}
      onKeyDown={handleKeyDown}
    >
      {SCORES.map((n) => {
        const selected = value === n
        const buttonStyle: React.CSSProperties = selected
          ? {
              backgroundColor: getScoreBackgroundColor(n),
              borderColor: getScoreColor(n),
              color: getScoreColor(n),
            }
          : {
              backgroundColor: 'var(--color-surface-raised)',
              borderColor: 'var(--color-border-interview)',
              color: 'var(--color-text-secondary)',
            }

        return (
          <div key={n} className="flex flex-col items-center gap-1">
            <button
              role="radio"
              aria-checked={selected}
              aria-label={labels[n - 1]}
              disabled={disabled}
              onClick={() => onChange(n)}
              style={{
                ...buttonStyle,
                width: 40,
                height: 40,
                borderRadius: 8,
                border: '1.5px solid',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                fontWeight: 600,
                fontSize: 15,
                transition: 'background-color 150ms, border-color 150ms, color 150ms',
              }}
            >
              {n}
            </button>
            {(variant === 'labeled' || showLabels) && (
              <span
                style={{
                  fontSize: 10,
                  color: selected ? getScoreColor(n) : 'var(--color-text-muted)',
                  textAlign: 'center',
                  maxWidth: 56,
                  lineHeight: 1.3,
                  transition: 'color 150ms',
                }}
              >
                {labels[n - 1]}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
