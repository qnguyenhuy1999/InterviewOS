'use client'

import { EnglishNoteStatus } from '@interviewos/types'
import type EnglishNotesPage from '@interviewos/ui/pages/EnglishNotesPage'
import EnglishNotesPageUI from '@interviewos/ui/pages/EnglishNotesPage'
import type React from 'react'

import { StatusSelect } from '@/app/_components/forms/StatusSelect'

type Props = Omit<React.ComponentProps<typeof EnglishNotesPage>, 'renderNoteActions'>

export default function EnglishNotesPageClient(props: Props) {
  return (
    <EnglishNotesPageUI
      {...props}
      renderNoteActions={(note) => (
        <StatusSelect
          endpoint={`/english-notes/${note.id}/status`}
          value={note.status}
          options={Object.values(EnglishNoteStatus)}
        />
      )}
    />
  )
}
