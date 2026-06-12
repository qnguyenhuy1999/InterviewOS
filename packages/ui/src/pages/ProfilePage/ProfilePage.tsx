import { CheckCircle2Icon, CircleAlertIcon, FileTextIcon } from 'lucide-react'
import type * as React from 'react'

import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { EmptyState, PageBody, PageHeader, SectionCard } from '../../../components/ui/page'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { Skeleton } from '../../../components/ui/skeleton'
import { TagList } from '../../molecules/TagList/TagList'
import { FileUploadDropzone } from '../../organisms/FileUploadDropzone/FileUploadDropzone'
import { PROFILE_INSIGHT_HEADING_CLASS_NAME } from './ProfilePage.constants'
import { profileFixture } from './ProfilePage.fixtures'
import type {
  ProfilePageProps,
  ProfileResumeInsight,
  ProfileSelectOption,
} from './ProfilePage.types'
import { getProfileAcceptedFileLabel, getProfileVerifiedBadgeClassName } from './ProfilePage.utils'

function Field({
  label,
  value,
  trailing,
}: {
  label: string
  value: string
  trailing?: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-center gap-2.5">
        <Input value={value} readOnly className="h-9 rounded-lg px-3 text-sm" />
        {trailing}
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
}: {
  label: string
  value: string
  options: ProfileSelectOption[]
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <Select value={value}>
        <SelectTrigger className="h-9 w-full rounded-lg px-3 text-left text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function TagField({
  label,
  items,
  inputPlaceholder,
}: {
  label: string
  items: string[]
  inputPlaceholder: string
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2">
        <TagList
          items={items}
          trailing={<span className="text-xs text-muted-foreground">{inputPlaceholder}</span>}
        />
      </div>
    </div>
  )
}

function ResumeUploadCard({
  title,
  description,
  ctaLabel,
}: {
  title: string
  description: string
  ctaLabel: string
}) {
  return (
    <FileUploadDropzone
      title={title}
      description={description}
      actionLabel={ctaLabel}
      className="border-dashed bg-muted py-0"
      contentClassName="flex min-h-72 flex-col items-center justify-center gap-4 p-5 text-center"
    />
  )
}

function ProfileHighlights({ profile }: { profile: NonNullable<ProfilePageProps['profile']> }) {
  const highlights = [
    {
      label: 'Target role',
      value: profile.learningProfile.targetRole.value,
      hint: `${profile.learningProfile.currentLevel.label}: ${profile.learningProfile.currentLevel.value}`,
    },
    {
      label: 'Focus areas',
      value: profile.learningProfile.interviewGoals.items.length,
      hint: profile.learningProfile.interviewGoals.items.join(' • '),
    },
    {
      label: 'Resume status',
      value: profile.resume.latest ? 'Analyzed' : 'Missing',
      hint: profile.resume.latest?.uploadedLabel ?? 'Upload a file to unlock insights',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {highlights.map((item) => (
        <div key={item.label} className="rounded-md border border-border/80 p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">{item.label}</p>
          <p className="mt-2 font-heading text-xl font-semibold tracking-tight">{item.value}</p>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.hint}</p>
        </div>
      ))}
    </div>
  )
}

function InsightList({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: keyof typeof PROFILE_INSIGHT_HEADING_CLASS_NAME
}) {
  return (
    <div className="space-y-2">
      <p className={`text-xs font-semibold uppercase ${PROFILE_INSIGHT_HEADING_CLASS_NAME[tone]}`}>
        {title}
      </p>
      <ul className="space-y-1.5 pl-5 text-sm text-foreground">
        {items.map((item) => (
          <li key={item} className="list-disc leading-6">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ResumeInsightCard({ insight }: { insight: ProfileResumeInsight }) {
  return (
    <div className="rounded-md border border-border/80 bg-background p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FileTextIcon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{insight.fileName}</p>
          <p className="text-xs text-muted-foreground">{insight.uploadedLabel}</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <InsightList title="Strengths" items={insight.strengths} tone="strengths" />
        <InsightList title="Gaps" items={insight.gaps} tone="gaps" />
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Key skills</p>
          <TagList items={insight.keySkills} />
        </div>
        <InsightList
          title="Recommendations"
          items={insight.recommendations}
          tone="recommendations"
        />
      </div>
    </div>
  )
}

function ProfileBody({ profile }: { profile: NonNullable<ProfilePageProps['profile']> }) {
  const verifiedBadge = (
    <Badge
      variant="outline"
      className={`h-9 rounded-lg px-3 text-sm ${getProfileVerifiedBadgeClassName(
        profile.account.isEmailVerified,
      )}`}
    >
      {profile.account.isEmailVerified ? (
        <CheckCircle2Icon className="size-4" />
      ) : (
        <CircleAlertIcon className="size-4" />
      )}
      {profile.account.verifiedLabel}
    </Badge>
  )

  return (
    <div className="space-y-6">
      <ProfileHighlights profile={profile} />

      <SectionCard title={profile.account.title} className="py-0">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={profile.account.name.label} value={profile.account.name.value} />
          <Field
            label={profile.account.email.label}
            value={profile.account.email.value}
            trailing={verifiedBadge}
          />
        </div>
      </SectionCard>

      <SectionCard
        title={profile.learningProfile.title}
        description={profile.learningProfile.description}
        className="py-0"
      >
        <div className="space-y-5">
          <div className="grid gap-4 xl:grid-cols-3">
            <Field
              label={profile.learningProfile.targetRole.label}
              value={profile.learningProfile.targetRole.value}
            />
            <SelectField
              label={profile.learningProfile.currentLevel.label}
              value={profile.learningProfile.currentLevel.value}
              options={profile.currentLevelOptions}
            />
            <SelectField
              label={profile.learningProfile.preferredOutputStyle.label}
              value={profile.learningProfile.preferredOutputStyle.value}
              options={profile.preferredOutputStyleOptions}
            />
          </div>

          <TagField
            label={profile.learningProfile.techStack.label}
            items={profile.learningProfile.techStack.items}
            inputPlaceholder={profile.learningProfile.techStack.inputPlaceholder}
          />

          <TagField
            label={profile.learningProfile.interviewGoals.label}
            items={profile.learningProfile.interviewGoals.items}
            inputPlaceholder={profile.learningProfile.interviewGoals.inputPlaceholder}
          />
        </div>
      </SectionCard>

      <SectionCard
        title={profile.resume.title}
        description={profile.resume.description}
        className="py-0"
      >
        <div className="grid gap-5 xl:grid-cols-2">
          <ResumeUploadCard
            title={profile.resume.upload.dropzoneTitle}
            description={getProfileAcceptedFileLabel(
              profile.resume.upload.acceptedFileTypes,
              profile.resume.upload.maxFileSizeMb,
            )}
            ctaLabel={profile.resume.upload.ctaLabel}
          />
          {profile.resume.latest ? (
            <ResumeInsightCard insight={profile.resume.latest} />
          ) : (
            <EmptyState
              className="min-h-88 rounded-md border border-dashed bg-muted"
              icon={FileTextIcon}
              title="No resume analysis yet"
              description={profile.resume.description}
            />
          )}
        </div>
      </SectionCard>
    </div>
  )
}

function LoadingBody() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-36 rounded-md" />
      <Skeleton className="h-72 rounded-md" />
      <div className="grid gap-5 xl:grid-cols-2">
        <Skeleton className="h-96 rounded-md" />
        <Skeleton className="h-96 rounded-md" />
      </div>
    </div>
  )
}

function EmptyBody() {
  return (
    <EmptyState
      className="min-h-96"
      title="No profile data yet"
      description="Account details, learning preferences, and resume insights will appear here once your profile is configured."
      action={<Button>Set up profile</Button>}
    />
  )
}

function ErrorBody({ message }: { message: string }) {
  return (
    <EmptyState
      className="min-h-128 border-destructive/20 bg-destructive/5"
      title={<span className="text-destructive">Failed to load profile</span>}
      description={message}
      action={<Button variant="destructive">Retry</Button>}
    />
  )
}

function Root({ loading, empty, error, profile = profileFixture }: ProfilePageProps) {
  return (
    <>
      <PageHeader title={profile.title} description={profile.subtitle} />

      <PageBody>
        {error ? (
          <ErrorBody message={error} />
        ) : loading ? (
          <LoadingBody />
        ) : empty ? (
          <EmptyBody />
        ) : (
          <ProfileBody profile={profile} />
        )}
      </PageBody>
    </>
  )
}

const ProfilePage = Object.assign(Root, {
  Field,
  InsightList,
  ResumeInsightCard,
  ResumeUploadCard,
  SelectField,
  TagField,
})

export default ProfilePage
