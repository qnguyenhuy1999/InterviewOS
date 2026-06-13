import clsx from 'clsx'

import type { IconIntent, IconProps, IconSize } from './Icon.types'

const SIZE_MAP: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
}

const INTENT_COLOR_MAP: Record<IconIntent, string> = {
  default: 'var(--color-text-primary)',
  muted: 'var(--color-text-muted)',
  accent: 'var(--color-accent-teal)',
  success: 'var(--color-status-live)',
  warning: 'var(--color-status-warn)',
  error: 'var(--color-status-error)',
}

export function Icon({
  icon: IconComponent,
  size = 'md',
  intent = 'default',
  className,
  'aria-label': ariaLabel,
}: IconProps) {
  const px = SIZE_MAP[size]
  const color = INTENT_COLOR_MAP[intent]

  return (
    <span
      className={clsx('inline-flex shrink-0 items-center justify-center', className)}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <IconComponent width={px} height={px} style={{ color }} strokeWidth={1.5} />
    </span>
  )
}
