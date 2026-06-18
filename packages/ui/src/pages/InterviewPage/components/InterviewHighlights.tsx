import { FilterIcon, MicIcon, PlayIcon } from 'lucide-react'

import { StatCard } from '../../../../components/ui/page'
import type { InterviewPageSession } from '../InterviewPage.types'
import {
  getInterviewSessionMetrics,
  getInterviewTopicLabel,
} from '../InterviewPage.utils'

function InterviewHighlights({ sessions }: { sessions: InterviewPageSession[] }) {
  const totalSessions = sessions.length
  const averageScore =
    totalSessions === 0
      ? 0
      : Math.round(
          sessions.reduce(
            (total, session) => total + (getInterviewSessionMetrics(session).overallScore ?? 0),
            0,
          ) / totalSessions,
        )
  const bestSession = sessions.reduce<InterviewPageSession | null>(
    (best, session) =>
      best === null ||
      (getInterviewSessionMetrics(session).overallScore ?? 0) >
        (getInterviewSessionMetrics(best).overallScore ?? 0)
        ? session
        : best,
    null,
  )
  const totalMinutes = sessions.reduce(
    (total, session) => total + getInterviewSessionMetrics(session).durationMinutes,
    0,
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Sessions run"
        value={totalSessions}
        hint="Completed practice rounds in this history."
        icon={MicIcon}
      />
      <StatCard
        label="Average score"
        value={averageScore}
        hint="Overall score across the visible sessions."
        icon={PlayIcon}
      />
      <StatCard
        label="Best round"
        value={bestSession ? getInterviewSessionMetrics(bestSession).overallScore : 'N/A'}
        hint={bestSession ? getInterviewTopicLabel(bestSession) : 'No scored sessions yet.'}
        icon={FilterIcon}
      />
      <StatCard
        label="Practice time"
        value={`${totalMinutes} min`}
        hint="Total time spent in interview mode."
        icon={MicIcon}
      />
    </div>
  )
}

export { InterviewHighlights }
