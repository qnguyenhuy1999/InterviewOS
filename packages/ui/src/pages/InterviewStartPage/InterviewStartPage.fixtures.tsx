import { Button } from '../../../components/ui/button'
import type { InterviewStartPageProps } from './InterviewStartPage.types'

export const interviewStartPageFixture: InterviewStartPageProps = {
  modeLabel: 'Standard interview',
  backHref: '#',
  children: (
    <div className="space-y-3">
      <div className="h-12 rounded-xl border border-border/70 bg-muted/40" />
      <div className="h-12 rounded-xl border border-border/70 bg-muted/40" />
      <div className="h-12 rounded-xl border border-border/70 bg-muted/40" />
      <Button>Start interview</Button>
    </div>
  ),
}
