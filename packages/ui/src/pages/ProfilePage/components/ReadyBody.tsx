import { CheckCircle2Icon, CircleAlertIcon, FileTextIcon } from 'lucide-react'

import { Badge } from '../../../../components/ui/badge'
import { EmptyState, SectionCard } from '../../../../components/ui/page'
import type { ProfilePageProps } from '../ProfilePage.types'
import {
  getProfileAcceptedFileLabel,
  getProfileVerifiedBadgeClassName,
} from '../ProfilePage.utils'
import { Field } from './Field'
import { ProfileHighlights } from './ProfileHighlights'
import { ResumeInsightCard } from './ResumeInsightCard'
import { ResumeUploadCard } from './ResumeUploadCard'
import { SelectField } from './SelectField'
import { TagField } from './TagField'

type ReadyBodyProps = {
  profile: NonNullable<ProfilePageProps['profile']>
}

export function ReadyBody({ profile }: ReadyBodyProps) {
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
