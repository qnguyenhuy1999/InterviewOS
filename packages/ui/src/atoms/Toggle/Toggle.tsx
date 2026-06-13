import clsx from 'clsx'

import type { ToggleProps } from './Toggle.types'

export function Toggle({ checked, onChange, disabled, label, compact, className }: ToggleProps) {
  const trackW = compact ? 28 : 36
  const trackH = compact ? 16 : 20
  const thumbSize = compact ? 12 : 16
  const thumbOffset = compact ? 2 : 2
  const thumbTranslate = trackW - thumbSize - thumbOffset * 2

  return (
    <span className={clsx('inline-flex items-center gap-2', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none',
          disabled && 'cursor-not-allowed opacity-40',
        )}
        style={{
          width: trackW,
          height: trackH,
          backgroundColor: checked ? 'var(--color-accent-teal)' : 'var(--color-surface-raised)',
          boxShadow: 'inset 0 0 0 1px var(--color-border-interview)',
        }}
      >
        <span
          className="pointer-events-none block rounded-full bg-white shadow transition-transform duration-200"
          style={{
            width: thumbSize,
            height: thumbSize,
            transform: `translateX(${checked ? thumbTranslate : 0}px)`,
            marginTop: (trackH - 4 - thumbSize) / 2,
            marginLeft: thumbOffset,
          }}
        />
      </button>
      {label && (
        <span
          className="select-none text-sm"
          style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-display)' }}
        >
          {label}
        </span>
      )}
    </span>
  )
}
