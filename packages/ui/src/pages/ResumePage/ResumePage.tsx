import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  FileTextIcon,
  RefreshCcwIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
  UploadCloudIcon,
  UploadIcon,
  ZapIcon,
} from 'lucide-react'

import { Button } from '../../../components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { PageBody, PageHeader } from '../../../components/ui/page'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { Spinner } from '../../atoms/Spinner'
import { TagList } from '../../molecules/TagList/TagList'
import { FileUploadDropzone } from '../../organisms/FileUploadDropzone/FileUploadDropzone'
import { resumePageFixture } from './ResumePage.fixtures'
import type {
  ResumeAnalysisAttribute,
  ResumeCurrentFile,
  ResumePageProps,
  ResumeSuggestedTopic,
} from './ResumePage.types'

// ─── Sub-components ──────────────────────────────────────────────────────────

function CurrentResumeRow({ item }: { item: ResumeCurrentFile }) {
  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3.5 transition-colors hover:border-border hover:bg-muted/60 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground shadow-sm">
          <FileTextIcon className="size-4.5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-snug">{item.fileName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{item.metadataLabel}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto shrink-0 gap-1 px-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {item.actionLabel}
        <ChevronRightIcon className="size-3.5" />
      </Button>
    </div>
  )
}

function AnalysisRow({ item }: { item: ResumeAnalysisAttribute }) {
  return (
    <div className="group flex items-center justify-between gap-4 py-3 text-sm">
      <span className="text-muted-foreground transition-colors group-hover:text-foreground/80">
        {item.label}
      </span>
      <span className="font-semibold tabular-nums text-foreground">{item.value}</span>
    </div>
  )
}

function TopicRow({ item }: { item: ResumeSuggestedTopic }) {
  return (
    <div className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3.5 transition-all hover:border-border hover:bg-muted/50 hover:shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ZapIcon className="size-3.5" />
        </div>
        <p className="text-sm font-medium leading-snug">{item.title}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-7 shrink-0 gap-1.5 rounded-full px-3 text-xs opacity-0 transition-opacity group-hover:opacity-100"
      >
        {item.actionLabel}
        <ArrowRightIcon className="size-3" />
      </Button>
    </div>
  )
}

// ─── Highlight stat cards ─────────────────────────────────────────────────────

const STAT_ICONS = [TargetIcon, SparklesIcon, TrendingUpIcon]

function ResumeHighlights({ data = resumePageFixture }: { data?: ResumePageProps['data'] }) {
  const matchValue =
    data.analysis.items.find((item) => item.label.toLowerCase().includes('match'))?.value ?? 'N/A'

  const summaryItems = [
    {
      label: 'Job match',
      value: matchValue,
      hint: 'Based on your latest uploaded resume.',
      icon: STAT_ICONS[0],
      accent: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200/60 dark:border-emerald-800/40',
    },
    {
      label: 'Skills found',
      value: data.extractedSkills.items.length,
      hint: 'Extracted from your experience.',
      icon: STAT_ICONS[1],
      accent: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/40',
      border: 'border-violet-200/60 dark:border-violet-800/40',
    },
    {
      label: 'Practice topics',
      value: data.suggestedTopics.items.length,
      hint: 'Ready to turn into interview drills.',
      icon: STAT_ICONS[2],
      accent: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      border: 'border-sky-200/60 dark:border-sky-800/40',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {summaryItems.map(({ label, value, hint, icon: Icon, accent, bg, border }) => (
        <div
          key={label}
          className={`relative overflow-hidden rounded-xl border ${border} ${bg} px-5 py-4 transition-shadow hover:shadow-md`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
              </p>
              <p className={`mt-1.5 font-heading text-3xl font-bold tracking-tight ${accent}`}>
                {value}
              </p>
            </div>
            <div className={`rounded-lg p-2 ${bg} border ${border}`}>
              <Icon className={`size-4 ${accent}`} />
            </div>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{hint}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Upload zone ──────────────────────────────────────────────────────────────

function UploadPrompt({ data = resumePageFixture }: { data?: ResumePageProps['data'] }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 px-6 py-10 text-center transition-all hover:border-primary/40 hover:bg-muted/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.04)_0%,transparent_70%)]" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-xl border border-border/60 bg-background shadow-sm">
          <UploadCloudIcon className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{data.upload.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{data.upload.description}</p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            {data.upload.supportedFormatsLabel}
          </p>
        </div>
        <Button size="sm" className="rounded-full px-6">
          {data.upload.actionLabel}
        </Button>
      </div>
    </div>
  )
}

// ─── String list section ──────────────────────────────────────────────────────

function StringListSection({
  title,
  subtitle,
  items,
  variant = 'default',
}: {
  title: string
  subtitle: string
  items: string[]
  variant?: 'default' | 'strength' | 'gap' | 'improvement'
}) {
  if (items.length === 0) return null

  const variantConfig = {
    default: { icon: null, iconBg: '', iconColor: '' },
    strength: {
      icon: CheckCircle2Icon,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-500',
    },
    gap: {
      icon: AlertCircleIcon,
      iconBg: 'bg-rose-50 dark:bg-rose-950/40',
      iconColor: 'text-rose-500',
    },
    improvement: {
      icon: TrendingUpIcon,
      iconBg: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-500',
    },
  }

  const { icon: Icon, iconBg, iconColor } = variantConfig[variant]

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className={`flex size-7 items-center justify-center rounded-lg ${iconBg}`}>
              <Icon className={`size-3.5 ${iconColor}`} />
            </div>
          )}
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <TagList items={items} badgeClassName="px-3 py-1 text-xs" />
      </CardContent>
    </Card>
  )
}

// ─── Main body ────────────────────────────────────────────────────────────────

function ResumeBody({
  data = resumePageFixture,
  renderUploadArea,
}: Pick<ResumePageProps, 'data' | 'renderUploadArea'>) {
  return (
    <div className="space-y-6">
      <ResumeHighlights data={data} />

      {renderUploadArea ?? <UploadPrompt data={data} />}

      {/* Resume file + analysis */}
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-base font-semibold">{data.currentResume.title}</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">{data.currentResume.subtitle}</p>
            </div>
            <CardAction>
              <Button variant="outline" size="sm" className="h-8 rounded-full px-4 text-xs">
                {data.currentResume.actionLabel}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="py-4">
            <div className="space-y-2.5">
              {data.currentResume.items.map((item) => (
                <CurrentResumeRow key={item.id} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-base font-semibold">{data.analysis.title}</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">{data.analysis.subtitle}</p>
            </div>
            <CardAction>
              <Button variant="outline" size="sm" className="h-8 rounded-full px-4 text-xs">
                <RefreshCcwIcon className="size-3" />
                {data.analysis.actionLabel}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="divide-y py-0">
            {data.analysis.items.map((item) => (
              <AnalysisRow key={item.label} item={item} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Strengths, gaps, improvements, skills */}
      <div className="grid gap-5 xl:grid-cols-2">
        <StringListSection
          title={data.strengths.title}
          subtitle={data.strengths.subtitle}
          items={data.strengths.items}
          variant="strength"
        />
        <StringListSection
          title={data.gaps.title}
          subtitle={data.gaps.subtitle}
          items={data.gaps.items}
          variant="gap"
        />
        <StringListSection
          title={data.improvements.title}
          subtitle={data.improvements.subtitle}
          items={data.improvements.items}
          variant="improvement"
        />

        {/* Extracted skills */}
        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/40">
                <SparklesIcon className="size-3.5 text-violet-500" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  {data.extractedSkills.title}
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {data.extractedSkills.subtitle}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            {data.extractedSkills.items.length > 0 ? (
              <TagList items={data.extractedSkills.items} badgeClassName="px-3 py-1 text-xs" />
            ) : (
              <p className="text-xs text-muted-foreground">
                No skills extracted from this analysis yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Suggested topics */}
        <Card className="gap-0 py-0 xl:col-span-2">
          <CardHeader className="border-b py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/40">
                <ZapIcon className="size-3.5 text-sky-500" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  {data.suggestedTopics.title}
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {data.suggestedTopics.subtitle}
                </p>
              </div>
            </div>
            <CardAction>
              <Button variant="outline" size="sm" className="h-8 rounded-full px-4 text-xs">
                <SparklesIcon className="size-3" />
                {data.suggestedTopics.actionLabel}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="py-4">
            {data.suggestedTopics.items.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {data.suggestedTopics.items.map((item) => (
                  <TopicRow key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No tailored practice topics available yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Optional extended sections */}
      {(data.missingKeywords || data.bulletRewriteSuggestions || data.interviewPreparation) && (
        <div className="grid gap-5 xl:grid-cols-2">
          {data.missingKeywords && (
            <StringListSection
              title={data.missingKeywords.title}
              subtitle={data.missingKeywords.subtitle}
              items={data.missingKeywords.items}
            />
          )}
          {data.bulletRewriteSuggestions && (
            <StringListSection
              title={data.bulletRewriteSuggestions.title}
              subtitle={data.bulletRewriteSuggestions.subtitle}
              items={data.bulletRewriteSuggestions.items}
            />
          )}
          {data.interviewPreparation && (
            <StringListSection
              title={data.interviewPreparation.title}
              subtitle={data.interviewPreparation.subtitle}
              items={data.interviewPreparation.items}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingBody() {
  return (
    <div className="space-y-6">
      {/* Stat cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-muted/20 px-5 py-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-14" />
              </div>
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <Skeleton className="mt-3 h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Upload zone skeleton */}
      <Skeleton className="h-40 w-full rounded-2xl" />

      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="gap-0 py-0">
            <CardHeader className="border-b py-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4.5 w-36" />
                <Skeleton className="h-3 w-52" />
              </div>
              <CardAction>
                <Skeleton className="h-8 w-20 rounded-full" />
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-2.5 py-4">
              {Array.from({ length: 3 }).map((__, rowIndex) => (
                <Skeleton key={rowIndex} className="h-14 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="min-h-48 items-center justify-center">
        <Spinner size="lg" />
      </Card>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyBody({
  data = resumePageFixture,
  emptyAction,
}: Pick<ResumePageProps, 'data' | 'emptyAction'>) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-background shadow-sm">
        <UploadIcon className="size-7 text-muted-foreground" />
      </div>
      <div className="max-w-sm">
        <p className="text-base font-semibold text-foreground">{data.emptyState.title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {data.emptyState.description}
        </p>
      </div>
      {emptyAction ?? (
        <Button size="sm" className="rounded-full px-6">
          {data.emptyState.actionLabel}
        </Button>
      )}
    </div>
  )
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorBody({ message }: { message: string }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-5 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10">
        <AlertCircleIcon className="size-6 text-destructive" />
      </div>
      <div className="max-w-sm">
        <p className="text-base font-semibold text-destructive">Failed to load resume workspace</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{message}</p>
      </div>
      <Button variant="destructive" size="sm" className="rounded-full px-6">
        Try again
      </Button>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function Root({
  data = resumePageFixture,
  loading,
  empty,
  error,
  renderUploadArea,
  emptyAction,
}: ResumePageProps) {
  return (
    <>
      <PageHeader title={data.title} description={data.subtitle} />
      <PageBody>
        {error ? (
          <ErrorBody message={error} />
        ) : loading ? (
          <LoadingBody />
        ) : empty ? (
          <EmptyBody data={data} emptyAction={emptyAction} />
        ) : (
          <ResumeBody data={data} renderUploadArea={renderUploadArea} />
        )}
      </PageBody>
      <Separator className="mt-8 opacity-0" />
    </>
  )
}

const ResumePage = Object.assign(Root, {
  AnalysisRow,
  CurrentResumeRow,
  TopicRow,
  UploadPanel: FileUploadDropzone,
})

export default ResumePage
