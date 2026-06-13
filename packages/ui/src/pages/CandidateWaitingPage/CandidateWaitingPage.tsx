import { WaitingRoomLayout } from '../../layouts/WaitingRoomLayout'
import type { CandidateWaitingPageProps } from './CandidateWaitingPage.types'

export function CandidateWaitingPage({
  interviewerName,
  scheduledTime,
  candidateName,
}: CandidateWaitingPageProps) {
  return (
    <WaitingRoomLayout
      interviewerName={interviewerName}
      scheduledTime={scheduledTime}
      candidateName={candidateName}
    />
  )
}

export default CandidateWaitingPage
