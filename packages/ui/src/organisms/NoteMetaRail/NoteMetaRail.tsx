import { BookMarkedIcon, Clock3Icon, FileQuestionIcon } from 'lucide-react'
import type * as React from 'react'

import { Card, CardContent } from '../../../components/ui/card'
import { NoteProgressBar } from '../../molecules/NoteProgressBar/NoteProgressBar'
import type { NoteTocItem } from '../../molecules/NoteToc/NoteToc'
import { NoteToc } from '../../molecules/NoteToc/NoteToc'

type NoteMetaRailProps = {
  progress: number
  activeSection?: string
  tocItems: NoteTocItem[]
  onNavigate?: (id: string) => void
  readingTime: string
  questionCount: number
  topicLabel: string
  mobileTocAction?: React.ReactNode
}

function NoteMetaRail({
  progress,
  activeSection,
  tocItems,
  onNavigate,
  readingTime,
  questionCount,
  topicLabel,
  mobileTocAction,
}: NoteMetaRailProps) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-8">
      <Card className="gap-0 rounded-[1.6rem] border border-border/70 bg-surface-elevated py-0 shadow-[0_24px_60px_-52px_color-mix(in_oklch,var(--foreground),transparent_40%)]">
        <CardContent className="space-y-5 p-4 md:p-5">
          <NoteProgressBar value={progress} />

          <div className="grid gap-3 rounded-2xl border border-border/70 bg-background/72 p-3.5">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Clock3Icon className="size-4 text-muted-foreground" />
              <span>{readingTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <FileQuestionIcon className="size-4 text-muted-foreground" />
              <span>{questionCount} practice questions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <BookMarkedIcon className="size-4 text-muted-foreground" />
              <span>{topicLabel}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 xl:block">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                On this page
              </p>
            </div>
            {mobileTocAction ? <div className="xl:hidden">{mobileTocAction}</div> : null}
          </div>

          <NoteToc
            items={tocItems}
            activeId={activeSection}
            onNavigate={onNavigate}
            className="hidden xl:block"
          />
        </CardContent>
      </Card>
    </aside>
  )
}

export { NoteMetaRail }
