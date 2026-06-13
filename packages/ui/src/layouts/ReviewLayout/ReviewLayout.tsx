import { cn } from '../../../lib/utils'
import type { ReviewLayoutProps } from './ReviewLayout.types'

export function ReviewLayout({
  topBar,
  videoPanel,
  transcriptPanel,
  sidePanel,
  defaultTranscriptWidth = 360,
}: ReviewLayoutProps) {
  const transcriptWidthPct = Math.round((defaultTranscriptWidth / 1440) * 100)

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
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-hidden bg-black">{videoPanel}</div>
        </div>

        <div
          className={cn(
            'flex shrink-0 flex-col border-l border-[var(--color-border-interview)]',
            'bg-[var(--color-surface-raised)]',
          )}
          style={{ width: `${transcriptWidthPct}%`, minWidth: 280, maxWidth: 480 }}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-y-auto">{transcriptPanel}</div>
            <div className="shrink-0 border-t border-[var(--color-border-interview)]">
              {sidePanel}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
