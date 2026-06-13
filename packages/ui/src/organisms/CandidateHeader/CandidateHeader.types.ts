export type CandidateHeaderStatus = 'live' | 'paused' | 'ended'

export interface CandidateHeaderProps {
  candidateName: string
  role: string
  company?: string
  stage?: string
  status: CandidateHeaderStatus
  elapsedSeconds?: number
  className?: string
}
