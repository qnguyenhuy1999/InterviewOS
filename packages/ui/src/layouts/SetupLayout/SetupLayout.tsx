import { cn } from '../../../lib/utils'
import type { SetupLayoutProps, SetupStep } from './SetupLayout.types'

function StepItem({ step, isCurrent }: { step: SetupStep; isCurrent: boolean }) {
  const isCompleted = step.status === 'completed'
  const isPending = step.status === 'pending'

  return (
    <li
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
        isCurrent && 'bg-[var(--color-accent-teal-dim)] text-[var(--color-text-primary)]',
        !isCurrent && 'text-[var(--color-text-secondary)]',
      )}
    >
      <span
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
          isCompleted &&
            'border-[var(--color-accent-teal)] bg-[var(--color-accent-teal)] text-white',
          isCurrent &&
            'border-[var(--color-accent-teal)] bg-transparent text-[var(--color-accent-teal)]',
          isPending && 'border-[var(--color-border-interview)] text-[var(--color-text-muted)]',
        )}
        aria-hidden="true"
      >
        {isCompleted ? (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2,6 5,9 10,3" />
          </svg>
        ) : null}
      </span>
      <span className={cn('truncate font-medium', isPending && 'font-normal')}>{step.label}</span>
    </li>
  )
}

export function SetupLayout({ steps, currentStep, children, footer }: SetupLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-[var(--color-surface-base)]">
      <aside
        className={cn(
          'hidden w-60 shrink-0 flex-col border-r border-[var(--color-border-interview)]',
          'bg-[var(--color-surface-raised)] md:flex',
        )}
      >
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Setup
          </p>
          <ol className="flex flex-col gap-1" aria-label="Setup steps">
            {steps.map((step) => (
              <StepItem key={step.id} step={step} isCurrent={step.id === currentStep} />
            ))}
          </ol>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>

        {footer && (
          <div
            className={cn(
              'sticky bottom-0 z-10 border-t border-[var(--color-border-interview)]',
              'bg-[var(--color-surface-raised)] px-6 py-4',
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
