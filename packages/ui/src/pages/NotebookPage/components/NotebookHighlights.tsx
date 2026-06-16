import { NoteStatus } from '@interviewos/types'
import { BookOpenIcon, LayoutGridIcon, ListIcon, PlusIcon } from 'lucide-react'

import { StatCard } from '../../../../components/ui/page'
import type { NotebookPageNote } from '../NotebookPage.types'
import { getEnumLabel } from '../NotebookPage.utils'

export function NotebookHighlights({ notes }: { notes: NotebookPageNote[] }) {
  const readyCount = notes.filter((n) => n.status === NoteStatus.INTERVIEW_READY).length
  const needsPracticeCount = notes.filter((n) => n.status === NoteStatus.NEEDS_PRACTICE).length
  const uniqueTopicCount = new Set(notes.map((n) => n.topic?.trim() || getEnumLabel(n.type))).size
  const totalQuestions = notes.reduce((total, n) => total + n.questionCount, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Notes captured"
        value={notes.length}
        hint="Technical, behavioral, and system-design entries in your notebook."
        icon={BookOpenIcon}
      />
      <StatCard
        label="Interview-ready"
        value={readyCount}
        hint={`${Math.round((readyCount / Math.max(notes.length, 1)) * 100)}% of your notebook is shaped for drills.`}
        icon={LayoutGridIcon}
      />
      <StatCard
        label="Topics covered"
        value={uniqueTopicCount}
        hint="Distinct subject areas represented across all notes."
        icon={ListIcon}
      />
      <StatCard
        label="Needs practice"
        value={needsPracticeCount}
        hint={`${totalQuestions} total questions generated — ${needsPracticeCount} notes still need a drill run.`}
        icon={PlusIcon}
      />
    </div>
  )
}
