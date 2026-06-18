import { Button } from '../../../../components/ui/button'
import { EmptyState } from '../../../../components/ui/page'
import type {
  InterviewPageActions,
  InterviewPageReadyState,
} from '../InterviewPage.types'
import { filterInterviewSessions } from '../InterviewPage.utils'
import { InterviewHighlights } from './InterviewHighlights'
import { SessionsTable } from './SessionsTable'
import { TopicFilter } from './TopicFilter'

function ReadyBody({
  state,
  actions,
  selectedTopic,
  onTopicChange,
}: {
  state: InterviewPageReadyState
  actions: InterviewPageActions
  selectedTopic: string
  onTopicChange?: (topic: string) => void
}) {
  const { sessions } = state
  const visibleSessions = filterInterviewSessions(sessions, selectedTopic)

  return (
    <div className="space-y-6">
      <InterviewHighlights sessions={visibleSessions.length > 0 ? visibleSessions : sessions} />
      {onTopicChange ? (
        <div className="rounded-md border border-border/80 bg-card p-4 shadow-sm">
          <TopicFilter
            sessions={sessions}
            selectedTopic={selectedTopic}
            onTopicChange={onTopicChange}
          />
        </div>
      ) : null}
      {visibleSessions.length === 0 ? (
        <EmptyState
          className="min-h-72"
          title="No sessions match this topic"
          description="Clear the filter or start a new interview to build more history."
          action={
            <Button asChild>
              <a href={actions.startInterviewHref}>Start interview</a>
            </Button>
          }
        />
      ) : (
        <SessionsTable sessions={visibleSessions} actions={actions} />
      )}
    </div>
  )
}

export { ReadyBody }
