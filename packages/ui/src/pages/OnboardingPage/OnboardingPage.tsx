import { BrainCircuitIcon, MicIcon, SparklesIcon, TrendingUpIcon } from 'lucide-react'
import type * as React from 'react'

import { Badge } from '../../../components/ui/badge'
import { Card, CardContent } from '../../../components/ui/card'
import { Separator } from '../../../components/ui/separator'
import type { OnboardingPageProps } from './OnboardingPage.types'

const BENEFITS: Array<{
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}> = [
  {
    icon: BrainCircuitIcon,
    title: 'AI-powered gap analysis',
    description: 'We surface exactly which concepts to revisit before your next interview.',
  },
  {
    icon: MicIcon,
    title: 'Realistic interview practice',
    description: 'Simulate full interview sessions with live feedback on clarity and depth.',
  },
  {
    icon: SparklesIcon,
    title: 'Spaced repetition review',
    description: 'A smart review queue keeps key topics fresh at exactly the right moment.',
  },
  {
    icon: TrendingUpIcon,
    title: 'Readiness score over time',
    description: "Track your trajectory so you know when you're genuinely interview-ready.",
  },
]

function BenefitItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3.5">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/8 text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function Root({ reason, children }: OnboardingPageProps) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      {/* Ambient gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(var(--primary)/0.08),transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 right-0 h-[480px] w-[480px] -translate-y-1/3 translate-x-1/4 rounded-full bg-[radial-gradient(circle,oklch(var(--accent)/0.06),transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-svh max-w-6xl grid-cols-1 gap-0 px-4 py-10 md:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16 xl:gap-24">
        {/* Left panel — value proposition */}
        <div className="flex flex-col justify-center gap-8 lg:py-8">
          {/* Logo / wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <BrainCircuitIcon className="size-4" aria-hidden="true" />
            </div>
            <span className="font-heading text-base font-semibold tracking-tight">InterviewOS</span>
          </div>

          {/* Step badge */}
          <div>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/8 font-mono text-xs font-medium text-primary"
            >
              Step 1 of 1 — Profile setup
            </Badge>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.625rem] lg:leading-[1.15]">
              Build your personal
              <br />
              <span className="text-primary">interview engine</span>
            </h1>
            <p className="max-w-sm text-base leading-7 text-muted-foreground">
              A two-minute profile unlocks a fully adaptive learning loop tuned to your target role
              and skill gaps.
            </p>
          </div>

          {/* Benefits list */}
          <div className="space-y-4">
            {BENEFITS.map((benefit) => (
              <BenefitItem key={benefit.title} {...benefit} />
            ))}
          </div>

          {/* Social proof footnote */}
          <p className="text-xs text-muted-foreground/60">
            Your profile is private. It is used only to personalise your learning path.
          </p>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-col justify-center">
          <Card className="relative overflow-hidden border-border/60 shadow-xl shadow-black/[0.04]">
            {/* Subtle top accent line */}
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              aria-hidden="true"
            />

            <CardContent className="px-6 py-7 md:px-8 md:py-8">
              {/* Card header */}
              <div className="mb-6 space-y-1.5">
                <h2 className="font-heading text-xl font-semibold tracking-tight">
                  Set up your profile
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tell us about your background so we can calibrate your plan.
                </p>
              </div>

              {/* Reason banner */}
              {reason ? (
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200/60 bg-amber-50/60 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/8 dark:text-amber-300">
                  <SparklesIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{reason}</span>
                </div>
              ) : null}

              <Separator className="mb-6 opacity-50" />

              {/* Form slot */}
              {children}
            </CardContent>
          </Card>

          {/* Below-card hint */}
          <p className="mt-4 text-center text-xs text-muted-foreground/50">
            You can update any of these later from your settings.
          </p>
        </div>
      </div>
    </div>
  )
}

const OnboardingPage = Root

export default OnboardingPage
