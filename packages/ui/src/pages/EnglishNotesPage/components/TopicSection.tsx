import { Badge } from '../../../../components/ui/badge'
import type { EnglishNotesPageProps } from '../EnglishNotesPage.types'
import type { EnglishTopicGroup } from '../EnglishNotesPage.utils'
import { EnglishNoteRow } from './EnglishNoteRow'

type TopicSectionProps = {
  topic: EnglishTopicGroup
  renderNoteActions?: EnglishNotesPageProps['renderNoteActions']
}

export function TopicSection({ topic, renderNoteActions }: TopicSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">{topic.name}</p>
          <p className="text-xs text-muted-foreground">{topic.total} corrections</p>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1 font-mono tabular-nums">
          {topic.masteryPercentage}% mastery
        </Badge>
      </div>

      <div className="space-y-3">
        {topic.notes.map((note) => (
          <EnglishNoteRow
            key={note.id}
            {...note}
            renderActions={renderNoteActions ? renderNoteActions(note) : undefined}
          />
        ))}
      </div>
    </section>
  )
}
