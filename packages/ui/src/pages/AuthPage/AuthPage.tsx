import {
  BrainCircuitIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
} from 'lucide-react'

import { Badge } from '../../../components/ui/badge'
import { Card, CardContent } from '../../../components/ui/card'
import type { AuthPageProps } from './AuthPage.types'

// ─── Static data ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: TargetIcon,
    title: 'Focused prep loops',
    description:
      'Practice sessions, weak concepts, and review prompts stay connected so nothing falls through the cracks.',
  },
  {
    icon: SparklesIcon,
    title: 'Resume-grounded coaching',
    description:
      "Guidance adapts to the role, level, and stack you're targeting — not a one-size template.",
  },
  {
    icon: CheckCircle2Icon,
    title: 'Measurable readiness',
    description:
      "Signals that show whether you're actually improving between sessions, not just grinding.",
  },
]

const STATS = [
  {
    value: '24/7',
    label: 'Adaptive plan',
    detail: 'Your queue updates after every interview, note, and review decision.',
  },
  {
    value: '4x',
    label: 'Signal types',
    detail: 'Practice, readiness, review, and resume context — one system.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated">
      <div className="flex size-8 items-center justify-center rounded-xl border border-border/60 bg-accent-soft text-primary transition-colors group-hover:border-primary/20 group-hover:bg-primary/10">
        <Icon className="size-3.5" />
      </div>
      <div className="space-y-1">
        <p className="font-heading text-xs font-semibold tracking-tight text-foreground">{title}</p>
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function StatCard({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-4 py-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 font-heading text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{detail}</p>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AuthPage({
  eyebrow = 'Now in early access',
  title,
  description,
  children,
  footer,
  brandLabel = 'InterviewOS',
  reassurance = 'Your prep history, notes, and readiness data stay in sync across every session.',
  features = FEATURES,
  highlights = STATS,
}: AuthPageProps) {
  return (
    // Viewport lock — exactly one screen, no scroll
    <div className="fixed inset-0 overflow-x-hidden bg-background">
      {/* ── Ambient background ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-[480px] rounded-full bg-primary/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-16 size-[420px] rounded-full bg-accent/6 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklch, var(--primary) 12%, transparent) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 30% 20%, black 0%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 30% 20%, black 0%, transparent 100%)',
        }}
      />

      {/* ── Full-height two-column grid ── */}
      <div className="relative mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 xl:px-14">
        {/* ══ LEFT — product story ══ */}
        <div className="flex flex-col justify-center gap-8 lg:h-full lg:py-10">
          {/* Brand lockup */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elevated">
              <BrainCircuitIcon className="size-4.5" />
            </div>
            <div>
              <p className="font-heading text-base font-semibold tracking-tight text-foreground">
                {brandLabel}
              </p>
              <p className="text-[11px] text-muted-foreground">Interview prep operating system</p>
            </div>
          </div>

          {/* Hero copy */}
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="gap-1.5 rounded-full border-primary/25 bg-accent-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              {eyebrow}
            </Badge>

            <h1 className="font-heading text-3xl font-semibold leading-[1.06] tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
              {title ?? (
                <>
                  Prep smarter.{' '}
                  <span className="bg-linear-to-r from-primary to-accent-strong bg-clip-text text-transparent">
                    Land the right role.
                  </span>
                </>
              )}
            </h1>

            <p className="max-w-[460px] text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
              {description ??
                'InterviewOS connects your practice sessions, resume context, and readiness signals into one adaptive system that actually remembers where you left off.'}
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-2.5 sm:grid-cols-3">
            {features.map((f) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.description}
              />
            ))}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {highlights.map((h) => (
              <StatCard key={h.label} value={h.value} label={h.label} detail={h.detail} />
            ))}
          </div>
        </div>

        {/* ══ RIGHT — auth form, self-centered ══ */}
        <div className="flex items-center justify-center lg:h-full lg:justify-end">
          <Card className="w-full max-w-[400px] overflow-hidden border-border/70 bg-card/95 py-0 shadow-elevated backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

            <CardContent className="space-y-6 px-7 py-7">
              {/* Header */}
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Account access
                </p>
                <p className="text-xs leading-5 text-muted-foreground">{reassurance}</p>
              </div>

              {/* Auth slot */}
              <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                {children}
              </div>

              {footer && <div className="text-center text-xs text-muted-foreground">{footer}</div>}

              {/* Trust row */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground/60">
                <ShieldCheckIcon className="size-3 text-success" />
                Encrypted &amp; secure · SOC 2 compliant
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
