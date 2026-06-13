import { cn } from '../../../lib/utils'
import type { WaitingRoomLayoutProps } from './WaitingRoomLayout.types'

export function WaitingRoomLayout({
  interviewerName,
  scheduledTime,
  candidateName,
}: WaitingRoomLayoutProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-col items-center justify-center',
        'bg-[var(--color-surface-base)] px-6',
      )}
      role="main"
      aria-label="Waiting room"
    >
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="relative flex items-center justify-center">
          <span
            className={cn(
              'absolute size-16 rounded-full bg-[var(--color-status-live)]',
              'animate-ping opacity-20',
            )}
            aria-hidden="true"
          />
          <span
            className={cn('relative size-4 rounded-full bg-[var(--color-status-live)]')}
            aria-label="Live indicator"
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          {candidateName && (
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              Hi <span className="text-[var(--color-text-primary)]">{candidateName}</span>
            </p>
          )}
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
            Interview starting soon
          </h1>
          <p className="text-base text-[var(--color-text-secondary)]">
            with{' '}
            <span className="font-medium text-[var(--color-text-primary)]">{interviewerName}</span>
          </p>
        </div>

        <div
          className={cn(
            'rounded-lg border border-[var(--color-border-interview)]',
            'bg-[var(--color-surface-raised)] px-6 py-3',
          )}
        >
          <time
            className="text-sm font-medium text-[var(--color-text-secondary)]"
            dateTime={scheduledTime}
          >
            Scheduled for <span className="text-[var(--color-text-primary)]">{scheduledTime}</span>
          </time>
        </div>
      </div>
    </div>
  )
}
