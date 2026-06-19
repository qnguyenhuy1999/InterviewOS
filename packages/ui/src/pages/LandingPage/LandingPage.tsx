import { ArrowRightIcon, BrainCircuitIcon, ChevronRightIcon } from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { FeatureCard } from './components/FeatureCard'
import { ReadinessTerminal } from './components/ReadinessTerminal'
import { LANDING_PAGE_FEATURES, LANDING_PAGE_STATS } from './LandingPage.constants'
import type { LandingPageProps } from './LandingPage.types'

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function LandingPage({
  eyebrow = 'Interview prep, systematized',
  headline,
  description,
  signInHref = '/login',
  getStartedHref = '/register',
  features = LANDING_PAGE_FEATURES,
  stats = LANDING_PAGE_STATS,
}: LandingPageProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* ── Ambient blobs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 size-[600px] rounded-full bg-primary/6 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 size-[500px] rounded-full bg-accent/5 blur-3xl"
      />

      {/* ── Dot grid ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 70% 30%, black 0%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 50% at 70% 30%, black 0%, transparent 100%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 xl:px-14">
        {/* ── Nav ── */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <BrainCircuitIcon className="size-4" />
            </div>
            <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
              InterviewOS
            </span>
          </div>
          <a
            href={signInHref}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </a>
        </header>

        {/* ── Hero ── */}
        <section
          aria-labelledby="landing-hero-heading"
          className="grid items-center gap-12 pb-20 pt-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:pb-28"
        >
          {/* Left — value prop */}
          <div className="flex flex-col gap-7">
            <Badge
              variant="outline"
              className="w-fit gap-1.5 rounded-full border-primary/20 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              {eyebrow}
            </Badge>

            <h1
              id="landing-hero-heading"
              className="font-heading text-4xl font-semibold leading-[1.06] tracking-tight text-foreground md:text-5xl lg:text-[3.25rem]"
            >
              {headline ?? (
                <>
                  Every gap,{' '}
                  <span className="bg-linear-to-r from-primary to-accent-strong bg-clip-text text-transparent">
                    closed.
                  </span>{' '}
                  Every signal,{' '}
                  <span className="bg-linear-to-r from-primary to-accent-strong bg-clip-text text-transparent">
                    tracked.
                  </span>
                </>
              )}
            </h1>

            <p className="max-w-[500px] text-base leading-7 text-muted-foreground">
              {description ??
                'InterviewOS connects your practice sessions, resume context, and readiness signals — so you always know exactly what to work on next.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={getStartedHref}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
              >
                Start for free
                <ArrowRightIcon className="size-3.5" />
              </a>
              <a
                href={signInHref}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent-soft"
              >
                Sign in
                <ChevronRightIcon className="size-3.5 text-muted-foreground" />
              </a>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap gap-6 pt-1">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="font-heading text-xl font-semibold tracking-tight text-foreground">
                    {s.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — terminal */}
          <div className="flex items-center justify-center lg:justify-end">
            <ReadinessTerminal />
          </div>
        </section>

        {/* ── Features ── */}
        <section aria-labelledby="landing-features-heading" className="sm:pb-20 pb-0">
          <p id="landing-features-heading" className="sr-only">
            Features
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {features.map((f) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.description}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
