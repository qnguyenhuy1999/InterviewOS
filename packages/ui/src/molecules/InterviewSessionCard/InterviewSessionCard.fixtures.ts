import { InterviewType } from '@interviewos/types'

const userId = 'user-001'

export const interviewSessionFixtures = {
  technical: {
    id: 'session-001',
    userId,
    interviewType: InterviewType.TECHNICAL,
    startedAt: new Date('2025-02-10T10:00:00'),
    endedAt: new Date('2025-02-10T11:00:00'),
  },
  inProgress: {
    id: 'session-002',
    userId,
    interviewType: InterviewType.MIXED,
    startedAt: new Date('2025-06-03T09:00:00'),
    endedAt: null as Date | null,
  },
}
