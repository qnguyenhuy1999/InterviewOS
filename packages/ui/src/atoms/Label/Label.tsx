import clsx from 'clsx'

import type { LabelProps } from './Label.types'

export function Label({ children, htmlFor, variant, className }: LabelProps) {
  if (variant === 'hint') {
    return (
      <p
        className={clsx('text-xs', className)}
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
      >
        {children}
      </p>
    )
  }

  return (
    <label
      htmlFor={htmlFor}
      className={clsx('inline-flex items-baseline gap-1 text-sm font-medium', className)}
      style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-display)' }}
    >
      {children}
      {variant === 'required' && (
        <span aria-hidden="true" style={{ color: 'var(--color-status-error)' }}>
          *
        </span>
      )}
      {variant === 'optional' && (
        <span className="text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>
          (optional)
        </span>
      )}
    </label>
  )
}
