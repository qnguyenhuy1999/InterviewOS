import { InterviewType } from '@interviewos/types'

export const INTERVIEW_PAGE_ALL_TOPICS_VALUE = 'ALL_TOPICS'

export const INTERVIEW_PAGE_TYPE_LABELS: Record<InterviewType, string> = {
  [InterviewType.TECHNICAL]: 'Technical',
  [InterviewType.BEHAVIORAL]: 'Behavioral',
  [InterviewType.SYSTEM_DESIGN]: 'System Design',
  [InterviewType.MIXED]: 'Mixed',
}
