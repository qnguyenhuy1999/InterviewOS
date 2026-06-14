import { Layers3Icon, NotebookPenIcon, SparklesIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { PageBody, PageHeader, SectionCard } from '../../../components/ui/page'
import type { NotebookComposerPageProps } from './NotebookComposerPage.types'

const DEFAULT_TITLE = 'Create a note'
const DEFAULT_DESCRIPTION =
  'Start from rough notes, then decide whether this entry should inherit your onboarding defaults or deliberately override them.'

const GUIDES = [
  {
    icon: NotebookPenIcon,
    title: 'Capture the raw thought first',
    description: 'Focus on the idea, bug, or concept before polishing structure and terminology.',
  },
  {
    icon: Layers3Icon,
    title: 'Use defaults when they save time',
    description: 'Role, level, and stack inherit from onboarding unless this note needs a custom lens.',
  },
  {
    icon: SparklesIcon,
    title: 'Shape it for future practice',
    description: 'Good notes become interview prompts, review cards, and faster revision later.',
  },
]

function Root({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  profileStateLabel,
  children,
}: NotebookComposerPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <PageBody>
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <SectionCard
            title="Draft the note"
            description="Capture the content first. You can refine tags, difficulty, and interview readiness as you go."
          >
            <div className="space-y-4">
              {profileStateLabel ? (
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/20 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
                >
                  {profileStateLabel}
                </Badge>
              ) : null}
              {children}
            </div>
          </SectionCard>

          <div className="space-y-4">
            <Card className="gap-0 border-border/70 py-0 shadow-elevated">
              <CardHeader className="border-b py-4">
                <CardTitle className="font-heading text-xl font-semibold tracking-tight">
                  What makes a strong note
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 py-4">
                {GUIDES.map(({ icon: Icon, title: guideTitle, description: guideDescription }) => (
                  <div key={guideTitle} className="flex gap-3">
                    <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{guideTitle}</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {guideDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-accent-soft py-0 shadow-elevated">
              <CardContent className="space-y-2 px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Downstream use
                </p>
                <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  Notes feed interview practice.
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Clear concepts, examples, and pitfalls make better questions and better spaced
                  repetition later.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBody>
    </>
  )
}

const NotebookComposerPage = Root

export default NotebookComposerPage
