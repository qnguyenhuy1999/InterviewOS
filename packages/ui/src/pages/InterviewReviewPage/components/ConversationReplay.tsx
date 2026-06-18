import { SectionCard } from '../../../../components/ui/page'
import type { InterviewReviewPageTurn } from '../InterviewReviewPage.types'

function ConversationReplay({ turns }: { turns: InterviewReviewPageTurn[] }) {
  return (
    <SectionCard
      title="Conversation replay"
      description="The recorded interviewer and candidate turns."
    >
      {turns.length === 0 ? (
        <p className="text-sm text-muted-foreground">No turns recorded.</p>
      ) : (
        <div className="space-y-3">
          {turns.map((turn) => (
            <div
              key={turn.id}
              className={`flex ${turn.role === 'CANDIDATE' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`w-fit max-w-3xl rounded-xl px-4 py-3 text-sm ${
                  turn.role === 'CANDIDATE'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-card'
                }`}
              >
                <p className="whitespace-pre-wrap">{turn.content}</p>
                <div
                  className={`mt-1 flex flex-wrap items-center gap-2 text-xs ${
                    turn.role === 'CANDIDATE'
                      ? 'text-primary-foreground/60'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span>{turn.role === 'CANDIDATE' ? 'You' : 'Interviewer'}</span>
                  <span>Turn {turn.turnNumber}</span>
                  {turn.topicTags && turn.topicTags.length > 0 ? (
                    <span>{turn.topicTags.join(', ')}</span>
                  ) : null}
                  {turn.decision ? <span>{turn.decision}</span> : null}
                </div>
                {turn.reasoning ? (
                  <p className="mt-2 text-xs opacity-80">Reasoning: {turn.reasoning}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}

export { ConversationReplay }
