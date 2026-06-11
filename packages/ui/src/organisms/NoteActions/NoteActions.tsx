'use client'

import { useState } from 'react'

import { Button } from '../../../components/ui/button'
import { FormNotice } from '../../lib/form-ui'

interface NoteActionsProps {
  canGenerateQuestions: boolean
  editNoteHref: string
  onGenerateNote: () => Promise<void>
  onGenerateQuestions: () => Promise<void>
}

export function NoteActions({
  canGenerateQuestions,
  editNoteHref,
  onGenerateNote,
  onGenerateQuestions,
}: NoteActionsProps) {
  const [pendingAction, setPendingAction] = useState<'note' | 'questions' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function run(action: 'note' | 'questions') {
    setPendingAction(action)
    setError(null)

    try {
      if (action === 'note') {
        await onGenerateNote()
      } else {
        await onGenerateQuestions()
      }
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to run action.')
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <a href={editNoteHref}>Edit note</a>
        </Button>
        <Button
          type="button"
          disabled={pendingAction !== null}
          onClick={() => {
            void run('note')
          }}
        >
          {pendingAction === 'note' ? 'Generating note...' : 'Generate AI technical note'}
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={pendingAction !== null || !canGenerateQuestions}
          onClick={() => {
            void run('questions')
          }}
        >
          {pendingAction === 'questions'
            ? 'Generating questions...'
            : 'Generate interview questions'}
        </Button>
      </div>
      {error ? <FormNotice variant="error">{error}</FormNotice> : null}
    </div>
  )
}
