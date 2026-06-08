import { API_ROUTES } from '@interviewos/config'
import type { ResumeAnalysis, ResumePageView } from '@interviewos/types'
import ResumePage from '@interviewos/ui/pages/ResumePage'

import { ResumeUploadForm } from '@/components/forms/ResumeUploadForm'
import { APP_ROUTES } from '@/lib/app-routes'
import { requireLearningProfile } from '@/lib/learning-profile-guard'
import { loadRouteData } from '@/lib/route-state'
import { serverApiClient } from '@/lib/server-api-client'

export default async function ResumeRoute() {
  await requireLearningProfile({
    reason: 'Complete onboarding before uploading a resume.',
    next: APP_ROUTES.resume,
  })

  const state = await loadRouteData(() => serverApiClient<ResumeAnalysis | null>(API_ROUTES.resume.latest), {
    fallbackMessage: 'Unable to load your latest resume analysis.',
    isEmpty: (analysis) => analysis === null,
  })

  const data = createResumePageView(state.kind === 'ready' ? state.data : null)

  return (
    <ResumePage
      data={data}
      empty={state.kind === 'empty'}
      error={state.kind === 'error' ? state.message : undefined}
      renderUploadArea={
        <ResumeUploadForm upload={data.upload} hasExistingAnalysis={state.kind === 'ready'} />
      }
      emptyAction={
        <ResumeUploadForm
          upload={data.upload}
          hasExistingAnalysis={false}
          renderAs="button"
        />
      }
    />
  )
}

function createResumePageView(analysis: ResumeAnalysis | null): ResumePageView {
  const fileName = analysis?.fileName ?? 'Uploaded resume'
  const analyzedLabel = analysis ? formatAnalyzedAt(analysis.analyzedAt) : 'No analysis yet'
  const metadataLabel = analysis ? `Latest analysis · ${analyzedLabel}` : 'Upload a file to begin'
  const strengths = analysis?.strengths ?? []
  const gaps = analysis?.gaps ?? []
  const improvements = analysis?.recommendations ?? []
  const skills = analysis?.keySkillsFound ?? []

  return {
    title: 'Resume',
    subtitle: 'Upload your resume so practice, readiness, and topic suggestions stay grounded in your actual background.',
    upload: {
      title: analysis ? 'Refresh your latest resume analysis' : 'Upload your resume',
      description:
        'Upload a PDF, DOCX, or TXT file up to 5 MB. The latest analysis updates your practice context and interview guidance.',
      supportedFormatsLabel: 'PDF, DOCX, or TXT up to 5 MB.',
      actionLabel: analysis ? 'Replace and analyze' : 'Choose file',
    },
    currentResume: {
      title: 'Current resume',
      subtitle: analysis ? 'The latest uploaded file and analysis timestamp.' : 'No file uploaded yet.',
      actionLabel: 'Latest upload',
      items: analysis
        ? [
            {
              id: analysis.id,
              fileName,
              metadataLabel,
              actionLabel: 'Latest',
            },
          ]
        : [],
    },
    analysis: {
      title: 'Analysis snapshot',
      subtitle: 'Only fields returned by the current API response are shown here.',
      actionLabel: 'Latest analysis',
      items: analysis
        ? [
            { label: 'Role match score', value: `${analysis.score}%` },
            { label: 'Target role', value: analysis.targetRole },
            { label: 'Target level', value: humanizeEnum(analysis.targetLevel) },
            { label: 'Strength signals', value: String(strengths.length) },
            { label: 'Gap signals', value: String(gaps.length) },
          ]
        : [],
    },
    strengths: {
      title: 'Strengths',
      subtitle: 'Signals the model already sees as aligned with your target role.',
      actionLabel: 'Review strengths',
      items: strengths,
    },
    gaps: {
      title: 'Gaps',
      subtitle: 'Areas to close before the next interview loop.',
      actionLabel: 'Review gaps',
      items: gaps,
    },
    improvements: {
      title: 'Suggested improvements',
      subtitle: 'Resume and positioning suggestions taken directly from the latest analysis.',
      actionLabel: 'Review improvements',
      items: improvements,
    },
    extractedSkills: {
      title: 'Detected skills',
      subtitle: 'Skills explicitly found in the uploaded resume.',
      actionLabel: 'Review skills',
      items: skills,
    },
    suggestedTopics: {
      title: 'Interview preparation suggestions',
      subtitle: 'Use these prompts to guide the next practice round.',
      actionLabel: 'Prepare',
      items: improvements.map((item, index) => ({
        id: `prep-${index}`,
        title: item,
        actionLabel: 'Practice',
      })),
    },
    missingKeywords: null,
    bulletRewriteSuggestions: null,
    interviewPreparation: skills.length
      ? {
          title: 'Preparation focus',
          subtitle: 'Anchor examples and explanations around the strongest detected skills.',
          actionLabel: 'Review preparation',
          items: skills.slice(0, 5).map((skill) => `Prepare one concrete story around ${skill}.`),
        }
      : null,
    emptyState: {
      title: 'No resume uploaded yet',
      description: 'Upload a resume to unlock role match scoring, strengths, gaps, and tailored interview preparation suggestions.',
      actionLabel: 'Upload resume',
    },
  }
}

function formatAnalyzedAt(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? 'Unknown time' : date.toLocaleString()
}

function humanizeEnum(value: string) {
  return value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}
