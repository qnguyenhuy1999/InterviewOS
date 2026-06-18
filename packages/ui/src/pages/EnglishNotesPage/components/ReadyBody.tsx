import { EnglishNoteStatus } from '@interviewos/types'
import { BookTextIcon, CheckCircle2Icon, LanguagesIcon, UploadIcon } from 'lucide-react'

import { Button } from '../../../../components/ui/button'
import { SectionCard, StatCard } from '../../../../components/ui/page'
import type { EnglishNotesPageProps, ReadyEnglishNotesState } from '../EnglishNotesPage.types'
import { getEnglishMasteryPercentage, getEnglishTopicGroups } from '../EnglishNotesPage.utils'
import { TopicCoverageCard } from './TopicCoverageCard'
import { TopicSection } from './TopicSection'

type ReadyBodyProps = {
  state: ReadyEnglishNotesState
  renderNoteActions?: EnglishNotesPageProps['renderNoteActions']
}

export function ReadyBody({ state, renderNoteActions }: ReadyBodyProps) {
  const topicGroups = getEnglishTopicGroups(state.notes)
  const masteryPercentage = getEnglishMasteryPercentage(state.notes)
  const masteredCount = state.notes.filter((note) => note.status === EnglishNoteStatus.MASTERED).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total notes" value={state.notes.length} icon={BookTextIcon} />
        <StatCard label="Grammar topics" value={topicGroups.length} icon={LanguagesIcon} />
        <StatCard label="Mastered" value={masteredCount} icon={CheckCircle2Icon} />
        <StatCard
          label="Mastery rate"
          value={`${masteryPercentage}%`}
          hint="Across all captured corrections"
        />
      </div>

      <SectionCard
        title="Topic coverage"
        description="Grouped by grammar topic so repeated patterns stand out quickly."
      >
        <div className="grid gap-3 xl:grid-cols-2">
          {topicGroups.map((topic) => (
            <TopicCoverageCard key={topic.name} topic={topic} />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Corrections"
        description="Review the exact sentence, the corrected version, and the more natural phrasing."
        action={
          <Button variant="outline" size="sm">
            <UploadIcon aria-hidden="true" />
            Export notes
          </Button>
        }
      >
        <div className="space-y-8">
          {topicGroups.map((topic) => (
            <TopicSection key={topic.name} topic={topic} renderNoteActions={renderNoteActions} />
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
