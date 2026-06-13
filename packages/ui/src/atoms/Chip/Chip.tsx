import clsx from 'clsx'

import type { ChipProps } from './Chip.types'

export function Chip({
  label,
  variant = 'filter',
  onRemove,
  disabled = false,
  className,
}: ChipProps) {
  const isRemovable = Boolean(onRemove) && !disabled

  return (
    <span
      data-variant={variant}
      data-disabled={disabled || undefined}
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        'bg-(--color-surface-raised)',
        'border-(--color-border-interview)',
        'text-(--color-text-secondary)',
        'font-(--font-display)',

        !disabled && 'hover:border-(--color-accent-teal)',

        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-default',

        variant === 'filter' && 'pr-2',

        variant === 'skill' && 'border-(--color-accent-teal) bg-(--color-surface-raised)',

        variant === 'topic' && 'bg-(--color-surface) border-(--color-border-subtle)',

        className,
      )}
    >
      <span className="truncate">{label}</span>

      {isRemovable && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={(event) => {
            event.stopPropagation()
            onRemove?.()
          }}
          className={clsx(
            'ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full',
            'text-(--color-text-muted)',
            'transition-opacity',
            'hover:opacity-70',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-(--color-accent-teal)',
            'focus-visible:ring-offset-1',
          )}
        >
          <span aria-hidden="true">x</span>
        </button>
      )}
    </span>
  )
}
