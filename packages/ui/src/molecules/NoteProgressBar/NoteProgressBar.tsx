import { cn } from '../../../lib/utils'

type NoteProgressBarProps = {
  value: number
  label?: string
  className?: string
}

function NoteProgressBar({
  value,
  label = 'Reading progress',
  className,
}: NoteProgressBarProps) {
  const normalizedValue = Math.min(100, Math.max(0, Math.round(value)))

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground">{normalizedValue}%</p>
      </div>
      <div
        aria-label={`${label}: ${normalizedValue}%`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={normalizedValue}
        role="progressbar"
        className="h-2 overflow-hidden rounded-full bg-foreground/6"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  )
}

export { NoteProgressBar }
