import { BriefcaseBusinessIcon, Clock3Icon, TargetIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { EmptyState, PageBody, PageHeader, SectionCard } from '../../../components/ui/page'
import type { InterviewStartPageProps } from './InterviewStartPage.types'

const DEFAULT_TITLE = 'Start interview'
const DEFAULT_DESCRIPTION =
  'Use your onboarding defaults, optionally anchor the session to a note, and start with role and stack context that matches the job you are targeting.'

const CHECKLIST = [
  {
    icon: TargetIcon,
    title: 'Target the right role',
    description: 'Adjust role, level, and tech stack only when this session needs a different angle.',
  },
  {
    icon: BriefcaseBusinessIcon,
    title: 'Attach a note when useful',
    description: 'A note gives the interviewer a sharper domain or concept focus from the first turn.',
  },
  {
    icon: Clock3Icon,
    title: 'Set enough turns',
    description: 'Use shorter sessions for quick reps and longer ones when you want a fuller signal.',
  },
]

function ErrorBody({ message, backHref }: { message: string; backHref?: string }) {
  return (
    <EmptyState
      className="min-h-96 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load interview setup</span>}
      description={message}
      action={
        backHref ? (
          <Button asChild variant="outline">
            <a href={backHref}>Back to sessions</a>
          </Button>
        ) : undefined
      }
    />
  )
}

function Root({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  modeLabel,
  children,
  backHref,
  errorMessage,
}: InterviewStartPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <PageBody>
        {errorMessage ? (
          <ErrorBody message={errorMessage} backHref={backHref} />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <SectionCard
              title="Session configuration"
              description="Calibrate the setup once, then let the interview run with clean context."
            >
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/20 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
                >
                  {modeLabel}
                </Badge>
                {children}
              </div>
            </SectionCard>

            <div className="space-y-4">
              <Card className="gap-0 border-border/70 py-0 shadow-elevated">
                <CardHeader className="border-b py-4">
                  <CardTitle className="font-heading text-xl font-semibold tracking-tight">
                    Before you press start
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-4">
                  {CHECKLIST.map(({ icon: Icon, title: itemTitle, description: itemDescription }) => (
                    <div key={itemTitle} className="flex gap-3">
                      <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-primary">
                        <Icon className="size-4" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{itemTitle}</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {itemDescription}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-accent-soft py-0 shadow-elevated">
                <CardContent className="space-y-2 px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Outcome
                  </p>
                  <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                    Better setup creates better feedback.
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    The clearer the initial context, the more useful the question sequence, weak
                    concept capture, and post-session review become.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </PageBody>
    </>
  )
}

const InterviewStartPage = Root

export default InterviewStartPage
