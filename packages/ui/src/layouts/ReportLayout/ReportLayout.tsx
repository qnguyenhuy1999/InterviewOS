import { cn } from '../../../lib/utils'
import type { ReportLayoutProps } from './ReportLayout.types'

export function ReportLayout({ header, sidebar, children }: ReportLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)]">
      <div
        className={cn(
          'sticky top-0 z-10 border-b border-[var(--color-border-interview)]',
          'bg-[var(--color-surface-raised)] px-6 py-4',
        )}
      >
        {header}
      </div>

      <div className="mx-auto flex w-full max-w-6xl gap-8 px-6 py-8">
        <aside className={cn('hidden w-56 shrink-0 lg:block')}>
          <div className="sticky top-20">{sidebar}</div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
