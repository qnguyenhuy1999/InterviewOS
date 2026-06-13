import { cn } from '../../../lib/utils'
import type { AuthLayoutProps } from './AuthLayout.types'

export function AuthLayout({ children, brandName = 'InterviewOS', subtitle }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-col items-center justify-center',
        'bg-[var(--color-surface-base)] px-4 py-12',
      )}
    >
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <div
          className={cn(
            'flex size-12 items-center justify-center rounded-xl',
            'bg-[var(--color-accent-teal)] text-white',
          )}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">{brandName}</h1>
        {subtitle && <p className="text-sm text-[var(--color-text-secondary)]">{subtitle}</p>}
      </div>

      <div
        className={cn(
          'w-full max-w-sm rounded-xl border border-[var(--color-border-interview)]',
          'bg-[var(--color-surface-raised)] p-8',
          'shadow-[var(--shadow-interview-md)]',
        )}
      >
        {children}
      </div>
    </div>
  )
}
