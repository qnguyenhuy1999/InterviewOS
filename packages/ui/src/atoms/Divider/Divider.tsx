import clsx from 'clsx'

import type { DividerProps } from './Divider.types'

export function Divider({ orientation = 'horizontal', label, className }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={clsx('inline-block self-stretch', className)}
        style={{
          width: 1,
          backgroundColor: 'var(--color-border-interview)',
          flexShrink: 0,
        }}
        role="separator"
        aria-orientation="vertical"
      />
    )
  }

  if (label) {
    return (
      <div
        className={clsx('flex items-center gap-3', className)}
        role="separator"
        aria-label={label}
      >
        <div
          className="flex-1"
          style={{ height: 1, backgroundColor: 'var(--color-border-interview)' }}
        />
        <span
          className="shrink-0 text-xs"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}
        >
          {label}
        </span>
        <div
          className="flex-1"
          style={{ height: 1, backgroundColor: 'var(--color-border-interview)' }}
        />
      </div>
    )
  }

  return (
    <div
      className={clsx('w-full', className)}
      style={{ height: 1, backgroundColor: 'var(--color-border-interview)' }}
      role="separator"
      aria-orientation="horizontal"
    />
  )
}
