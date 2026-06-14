import { BrainCircuitIcon, CheckCircle2Icon, SparklesIcon, TargetIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Card, CardContent } from '../../../components/ui/card'
import type { AuthPageProps } from './AuthPage.types'

const DEFAULT_FEATURES = [
  {
    title: 'Focused prep loops',
    description: 'Practice sessions, weak concepts, and review prompts stay connected.',
  },
  {
    title: 'Resume-grounded coaching',
    description: 'Interview guidance tracks the role, level, and stack you are targeting.',
  },
  {
    title: 'Measurable momentum',
    description: 'Readiness signals show whether you are actually improving between sessions.',
  },
]

const DEFAULT_HIGHLIGHTS = [
  {
    label: 'Adaptive plan',
    value: '24/7',
    detail: 'Your queue updates after every interview, note, and review decision.',
  },
  {
    label: 'Signal types',
    value: '4',
    detail: 'Practice, readiness, review, and resume context stay in one system.',
  },
]

function Root({
  eyebrow,
  title,
  description,
  children,
  footer,
  brandLabel = 'InterviewOS',
  reassurance = 'Secure sign-in keeps your prep history, notes, and readiness data in sync.',
  features = DEFAULT_FEATURES,
  highlights = DEFAULT_HIGHLIGHTS,
}: AuthPageProps) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-accent-soft/50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-16 left-[-6rem] size-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[-5rem] bottom-[-4rem] size-80 rounded-full bg-warning/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-svh max-w-7xl gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-14">
        <div className="flex flex-col justify-between gap-10 lg:py-6">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elevated">
                <BrainCircuitIcon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-heading text-lg font-semibold tracking-tight">{brandLabel}</p>
                <p className="text-sm text-muted-foreground">Interview prep operating system</p>
              </div>
            </div>

            <div className="space-y-4">
              <Badge
                variant="outline"
                className="rounded-full border-primary/20 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary backdrop-blur"
              >
                {eyebrow}
              </Badge>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-balance font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
                  {title}
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                  {description}
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = index === 0 ? TargetIcon : index === 1 ? SparklesIcon : CheckCircle2Icon

                return (
                  <Card
                    key={feature.title}
                    className="border-border/70 bg-background/80 py-0 shadow-elevated backdrop-blur"
                  >
                    <CardContent className="space-y-3 px-5 py-5">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-accent-soft text-primary">
                        <Icon className="size-4" aria-hidden="true" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="font-medium text-foreground">{feature.title}</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-border/70 bg-background/80 px-5 py-5 shadow-elevated backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-3 font-heading text-4xl font-semibold tracking-tight text-foreground">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-end">
          <Card className="w-full max-w-xl overflow-hidden border-border/70 bg-background/95 py-0 shadow-elevated backdrop-blur">
            <CardContent className="space-y-6 px-6 py-6 md:px-8 md:py-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Account access
                </p>
                <p className="text-sm leading-6 text-muted-foreground">{reassurance}</p>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-accent-soft/70 p-4">
                {children}
              </div>

              {footer ? <div className="text-center">{footer}</div> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const AuthPage = Root

export default AuthPage
