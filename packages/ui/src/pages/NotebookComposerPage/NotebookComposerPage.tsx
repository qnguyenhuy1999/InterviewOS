import { Layers3Icon, NotebookPenIcon, SparklesIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { PageBody, PageHeader, SectionCard } from '../../../components/ui/page'
import { Separator } from '../../../components/ui/separator'
import type { NotebookComposerPageProps } from './NotebookComposerPage.types'

// ─── Constants ────────────────────────────────────────────────────────────────

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
    description:
      'Role, level, and stack inherit from onboarding unless this note needs a custom lens.',
  },
  {
    icon: SparklesIcon,
    title: 'Shape it for future practice',
    description: 'Good notes become interview prompts, review cards, and faster revision later.',
  },
]

// ─── GuideItem ────────────────────────────────────────────────────────────────

function GuideItem({
  icon: Icon,
  title,
  description,
  isLast,
}: {
  icon: React.ElementType
  title: string
  description: string
  isLast: boolean
}) {
  return (
    <div className="group flex gap-3">
      {/* Icon + connector line */}
      <div className="flex flex-col items-center">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-primary ring-1 ring-primary/20 transition-colors duration-150 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary/60">
          <Icon className="size-4" aria-hidden="true" />
        </div>
        {!isLast && <div className="mt-1.5 w-px grow bg-linear-to-b from-border to-transparent" />}
      </div>

      {/* Text */}
      <div className={`space-y-0.5 ${isLast ? 'pb-0' : 'pb-5'}`}>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

// ─── SidebarCard ─────────────────────────────────────────────────────────────

function GuidesCard() {
  return (
    <Card className="gap-0 border-border/70 py-0 shadow-elevated">
      <CardHeader className="border-b py-4">
        <CardTitle className="font-heading text-base font-semibold tracking-tight">
          What makes a strong note
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-5">
        {GUIDES.map(({ icon, title, description }, i) => (
          <GuideItem
            key={title}
            icon={icon}
            title={title}
            description={description}
            isLast={i === GUIDES.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  )
}

function DownstreamCard() {
  return (
    <Card className="relative overflow-hidden border-primary/20 bg-accent-soft py-0 shadow-elevated">
      {/* Decorative background glyph */}
      <SparklesIcon
        className="pointer-events-none absolute -right-3 -bottom-3 size-24 rotate-12 text-primary/10"
        aria-hidden="true"
      />
      <CardContent className="relative space-y-2 px-5 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
          Downstream use
        </p>
        <p className="font-heading text-xl font-semibold tracking-tight text-foreground">
          Notes feed interview practice.
        </p>
        <Separator className="border-primary/15" />
        <p className="text-sm leading-6 text-muted-foreground">
          Clear concepts, examples, and pitfalls make better questions and sharper spaced repetition
          later.
        </p>
      </CardContent>
    </Card>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

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
          {/* ── Left: composer ─────────────────────────────────── */}
          <SectionCard
            title="Draft the note"
            description="Capture the content first. You can refine tags, difficulty, and interview readiness as you go."
          >
            <div className="space-y-4">
              {profileStateLabel ? (
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/20 bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary"
                >
                  {profileStateLabel}
                </Badge>
              ) : null}
              {children}
            </div>
          </SectionCard>

          {/* ── Right: sidebar ─────────────────────────────────── */}
          <div className="space-y-4">
            <GuidesCard />
            <DownstreamCard />
          </div>
        </div>
      </PageBody>
    </>
  )
}

const NotebookComposerPage = Root
export default NotebookComposerPage
