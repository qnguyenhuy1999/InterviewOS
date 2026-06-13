import { cn } from '../../../lib/utils'
import type { DebriefLayoutProps } from './DebriefLayout.types'

export function DebriefLayout({ topBar, scorecardPanel, notesPanel, footer }: DebriefLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-surface-base)]">
      <div
        className={cn(
          'flex h-12 shrink-0 items-center border-b border-[var(--color-border-interview)]',
          'bg-[var(--color-surface-raised)] px-4',
        )}
      >
        {topBar}
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className={cn(
            'w-80 shrink-0 overflow-y-auto border-r border-[var(--color-border-interview)]',
            'bg-[var(--color-surface-raised)]',
          )}
        >
          {scorecardPanel}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-6">{notesPanel}</div>

          {footer && (
            <div
              className={cn(
                'shrink-0 border-t border-[var(--color-border-interview)]',
                'bg-[var(--color-surface-raised)] px-6 py-4',
              )}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
