import { FileTextIcon, RefreshCcwIcon, SparklesIcon, UploadIcon } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { EmptyState, PageBody, PageHeader } from '../../../components/ui/page'
import { Separator } from '../../../components/ui/separator'
import { Skeleton } from '../../../components/ui/skeleton'
import { Spinner } from '../../../components/ui/spinner'
import { TagList } from '../../molecules/TagList/TagList'
import { FileUploadDropzone } from '../../organisms/FileUploadDropzone/FileUploadDropzone'
import { resumePageFixture } from './ResumePage.fixtures'
import type {
  ResumeAnalysisAttribute,
  ResumeCurrentFile,
  ResumePageProps,
  ResumeSuggestedTopic,
} from './ResumePage.types'

function CurrentResumeRow({ item }: { item: ResumeCurrentFile }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FileTextIcon className="size-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{item.fileName}</p>
          <p className="text-sm text-muted-foreground">{item.metadataLabel}</p>
        </div>
      </div>
      <Button variant="link" size="sm" className="h-auto shrink-0 px-0 text-foreground">
        {item.actionLabel}
      </Button>
    </div>
  )
}

function AnalysisRow({ item }: { item: ResumeAnalysisAttribute }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 text-sm">
      <span className="text-muted-foreground">{item.label}</span>
      <span className="text-right font-medium text-foreground">{item.value}</span>
    </div>
  )
}

function TopicRow({ item }: { item: ResumeSuggestedTopic }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-background px-4 py-4 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.35)]">
      <p className="text-base font-medium">{item.title}</p>
      <Button variant="outline" size="sm" className="shrink-0 rounded-full">
        {item.actionLabel}
      </Button>
    </div>
  )
}

function ResumeHighlights({ data = resumePageFixture }: { data?: ResumePageProps['data'] }) {
  const matchValue =
    data.analysis.items.find((item) => item.label.toLowerCase().includes('match'))?.value ?? 'N/A'
  const summaryItems = [
    {
      label: 'Current match',
      value: matchValue,
      hint: 'Based on the latest uploaded resume.',
    },
    {
      label: 'Skills detected',
      value: data.extractedSkills.items.length,
      hint: 'Pulled from your current experience signals.',
    },
    {
      label: 'Practice suggestions',
      value: data.suggestedTopics.items.length,
      hint: 'Ready to convert into focused interview drills.',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summaryItems.map((item) => (
        <Card
          key={item.label}
          className="gap-3 border border-border/80 bg-[linear-gradient(180deg,white_0%,color-mix(in_oklch,var(--primary),white_95%)_100%)] py-4 shadow-[0_18px_50px_-38px_color-mix(in_oklch,var(--primary),transparent_45%)]"
          size="sm"
        >
          <CardHeader className="gap-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em]">
              {item.label}
            </CardDescription>
            <CardTitle className="font-heading text-3xl font-semibold tracking-tight">
              {item.value}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <p className="text-sm leading-6 text-muted-foreground">{item.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ResumeBody({ data = resumePageFixture }: { data?: ResumePageProps['data'] }) {
  return (
    <div className="space-y-6">
      <ResumeHighlights data={data} />

      <FileUploadDropzone
        title={data.upload.title}
        description={data.upload.description}
        supportingText={data.upload.supportedFormatsLabel}
        actionLabel={data.upload.actionLabel}
        actionVariant="default"
        actionSize="lg"
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-xl font-semibold">{data.currentResume.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{data.currentResume.subtitle}</p>
            </div>
            <CardAction>
              <Button variant="outline">{data.currentResume.actionLabel}</Button>
            </CardAction>
          </CardHeader>
          <CardContent className="py-4">
            <div className="space-y-3">
              {data.currentResume.items.map((item) => (
                <CurrentResumeRow key={item.id} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-xl font-semibold">{data.analysis.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{data.analysis.subtitle}</p>
            </div>
            <CardAction>
              <Button variant="outline">
                <RefreshCcwIcon />
                {data.analysis.actionLabel}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="divide-y py-4">
            {data.analysis.items.map((item) => (
              <AnalysisRow key={item.label} item={item} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-xl font-semibold">{data.extractedSkills.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{data.extractedSkills.subtitle}</p>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            <TagList items={data.extractedSkills.items} badgeClassName="px-3 py-1" />
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <div>
              <CardTitle className="text-xl font-semibold">{data.suggestedTopics.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{data.suggestedTopics.subtitle}</p>
            </div>
            <CardAction>
              <Button variant="outline">
                <SparklesIcon />
                {data.suggestedTopics.actionLabel}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3 py-4">
            {data.suggestedTopics.items.map((item) => (
              <TopicRow key={item.id} item={item} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoadingBody() {
  return (
    <div className="space-y-6">
      <Card className="py-0">
        <CardContent className="flex min-h-72 flex-col items-center justify-center gap-5 px-6 py-10">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-7 w-56" />
            <Skeleton className="mx-auto h-4 w-80 max-w-full" />
            <Skeleton className="mx-auto h-5 w-44" />
          </div>
          <Skeleton className="h-9 w-32" />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="gap-0 py-0">
            <CardHeader className="border-b py-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
              <CardAction>
                <Skeleton className="h-8 w-24" />
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-3 py-4">
              {Array.from({ length: 4 }).map((__, rowIndex) => (
                <Skeleton key={rowIndex} className="h-16 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="min-h-64 items-center justify-center">
        <Spinner className="size-7" />
      </Card>
    </div>
  )
}

function EmptyBody({ data = resumePageFixture }: { data?: ResumePageProps['data'] }) {
  return (
    <EmptyState
      className="min-h-80"
      icon={UploadIcon}
      title={data.emptyState.title}
      description={data.emptyState.description}
      action={<Button>{data.emptyState.actionLabel}</Button>}
    />
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-[60vh] border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load resume workspace</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

function Root({ data = resumePageFixture, loading, empty, error }: ResumePageProps) {
  return (
    <>
      <PageHeader title={data.title} description={data.subtitle} />
      <PageBody>
        {error ? (
          <ErrorBody message={error} />
        ) : loading ? (
          <LoadingBody />
        ) : empty ? (
          <EmptyBody data={data} />
        ) : (
          <ResumeBody data={data} />
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
