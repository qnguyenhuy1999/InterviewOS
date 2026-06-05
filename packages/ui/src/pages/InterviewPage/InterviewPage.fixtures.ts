import { InterviewType } from '@interviewos/types'

import { INTERVIEW_PAGE_ALL_TOPICS_VALUE } from './InterviewPage.constants'
import type { InterviewPageFixture } from './InterviewPage.types'

export const interviewPageFixture: InterviewPageFixture = {
  selectedTopic: INTERVIEW_PAGE_ALL_TOPICS_VALUE,
  sessions: [
    {
      id: 'session-react-internals',
      type: InterviewType.TECHNICAL,
      startedAt: new Date('2026-06-05T09:14:00'),
      endedAt: new Date('2026-06-05T09:46:00'),
      note: { title: 'React internals' },
      metrics: {
        overallScore: 78,
        technicalScore: 84,
        englishScore: 72,
        durationMinutes: 32,
      },
    },
    {
      id: 'session-node-async',
      type: InterviewType.TECHNICAL,
      startedAt: new Date('2026-06-04T21:02:00'),
      endedAt: new Date('2026-06-04T21:30:00'),
      note: { title: 'Node.js & async' },
      metrics: {
        overallScore: 71,
        technicalScore: 74,
        englishScore: 68,
        durationMinutes: 28,
      },
    },
    {
      id: 'session-rate-limiter',
      type: InterviewType.SYSTEM_DESIGN,
      startedAt: new Date('2026-05-28T10:40:00'),
      endedAt: new Date('2026-05-28T11:25:00'),
      note: { title: 'System Design - Rate limiter' },
      metrics: {
        overallScore: 65,
        technicalScore: 70,
        englishScore: 60,
        durationMinutes: 45,
      },
    },
    {
      id: 'session-behavioral-round',
      type: InterviewType.BEHAVIORAL,
      startedAt: new Date('2026-05-24T18:11:00'),
      endedAt: new Date('2026-05-24T18:33:00'),
      note: { title: 'Behavioral round' },
      metrics: {
        overallScore: 82,
        technicalScore: 86,
        englishScore: 78,
        durationMinutes: 22,
      },
    },
  ],
}
