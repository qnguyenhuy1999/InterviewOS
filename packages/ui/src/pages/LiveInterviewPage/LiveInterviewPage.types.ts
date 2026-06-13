import type { PanelQuestion } from '../../organisms/QuestionPanel'

export interface LiveInterviewPageProps {
  candidateName: string
  role: string
  company?: string
  questions: PanelQuestion[]
  sessionId: string
}
