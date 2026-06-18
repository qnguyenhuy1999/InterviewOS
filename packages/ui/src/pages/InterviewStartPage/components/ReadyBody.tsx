import { Badge } from '../../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { SectionCard } from '../../../../components/ui/page'
import { INTERVIEW_START_PAGE_CHECKLIST } from '../InterviewStartPage.constants'
import type { InterviewStartPageProps } from '../InterviewStartPage.types'

function ReadyBody({
  modeLabel,
  children,
}: Pick<InterviewStartPageProps, 'modeLabel' | 'children'>) {
  return (
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
            {INTERVIEW_START_PAGE_CHECKLIST.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-3">
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{description}</p>
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
  )
}

export { ReadyBody }
