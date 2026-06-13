import { useState } from 'react'
import { InterviewLayout } from '../../layouts/InterviewLayout'
import { CandidateHeader } from '../../organisms/CandidateHeader'
import { NotesPad } from '../../organisms/NotesPad'
import { QuestionPanel } from '../../organisms/QuestionPanel'
import type { LiveInterviewPageProps } from './LiveInterviewPage.types'

export function LiveInterviewPage({
  candidateName,
  role,
  company,
  questions,
  sessionId,
}: LiveInterviewPageProps) {
  const [activeId, setActiveId] = useState(questions[0]?.id)
  const [notes, setNotes] = useState('')

  return (
    <InterviewLayout
      topBar={
        <CandidateHeader
          candidateName={candidateName}
          role={role}
          company={company}
          status="live"
          elapsedSeconds={0}
        />
      }
      leftPanel={
        <QuestionPanel
          questions={questions}
          activeId={activeId}
          onSelect={setActiveId}
          className="h-full"
        />
      }
      centerPanel={
        <div className="flex h-full items-center justify-center text-sm text-gray-400">
          Video / Main Content
        </div>
      }
      rightPanel={
        <NotesPad
          sessionId={sessionId}
          initialContent={notes}
          onChange={setNotes}
          className="h-full"
        />
      }
    />
  )
}

export default LiveInterviewPage
