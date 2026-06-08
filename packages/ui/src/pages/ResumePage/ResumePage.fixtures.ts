import type { ResumePageFixture } from './ResumePage.types'

export const resumePageFixture: ResumePageFixture = {
  title: 'Resume',
  subtitle: 'Upload your resume so we can tailor interview practice to your actual background.',
  upload: {
    title: 'Drop your resume here',
    description: 'Upload the latest version to refresh your profile and recommendations.',
    supportedFormatsLabel: 'PDF or DOCX, up to 5 MB.',
    actionLabel: 'Choose file',
  },
  currentResume: {
    title: 'Current resume',
    subtitle: 'Last uploaded May 22, 2026.',
    actionLabel: 'Replace',
    items: [
      {
        id: 'resume-file-1',
        fileName: 'diego-almeida-resume.pdf',
        metadataLabel: '214 KB · 2 pages',
        actionLabel: 'View',
      },
    ],
  },
  analysis: {
    title: 'Analysis',
    subtitle: 'Refreshed automatically when you upload a new file.',
    actionLabel: 'Re-analyze',
    items: [
      { label: 'Experience', value: '6 years' },
      { label: 'Primary role', value: 'Backend Engineer' },
      { label: 'Domain', value: 'Fintech, SaaS' },
      { label: 'Match for target', value: '82%' },
    ],
  },
  strengths: {
    title: 'Strengths',
    subtitle: 'Areas that already align well with your target role.',
    actionLabel: 'Review strengths',
    items: ['TypeScript', 'System thinking', 'Backend ownership'],
  },
  gaps: {
    title: 'Gaps',
    subtitle: 'Signals to close before your next round of interviews.',
    actionLabel: 'Review gaps',
    items: ['Cloud scaling stories', 'Security examples'],
  },
  improvements: {
    title: 'Suggested improvements',
    subtitle: 'Concrete changes that improve the resume and your interview story.',
    actionLabel: 'Review improvements',
    items: ['Add impact metrics to platform work', 'Clarify leadership scope on recent projects'],
  },
  extractedSkills: {
    title: 'Extracted skills',
    subtitle: 'Detected from the current resume analysis.',
    actionLabel: 'Review skills',
    items: [
      'React',
      'TypeScript',
      'Node.js',
      'NestJS',
      'PostgreSQL',
      'Redis',
      'Docker',
      'AWS (ECS, S3, RDS)',
      'GraphQL',
      'Jest',
    ],
  },
  suggestedTopics: {
    title: 'Suggested interview topics',
    subtitle: 'Generated from your recent resume analysis.',
    actionLabel: 'Refresh topics',
    items: [
      { id: 'topic-1', title: 'React reconciliation', actionLabel: 'Practice' },
      { id: 'topic-2', title: 'Node.js streams', actionLabel: 'Practice' },
      { id: 'topic-3', title: 'NestJS module boundaries', actionLabel: 'Practice' },
      { id: 'topic-4', title: 'Postgres transaction isolation', actionLabel: 'Practice' },
      { id: 'topic-5', title: 'Designing a notification service', actionLabel: 'Practice' },
    ],
  },
  missingKeywords: null,
  bulletRewriteSuggestions: null,
  interviewPreparation: {
    title: 'Interview preparation suggestions',
    subtitle: 'Use these prompts to prepare examples and sharpen your story.',
    actionLabel: 'Review prep',
    items: ['Prepare a STAR example for scaling incidents', 'Review tradeoffs behind your Redis caching decisions'],
  },
  emptyState: {
    title: 'No resume uploaded yet',
    description: 'Upload your first resume to unlock skills extraction and tailored interview topics.',
    actionLabel: 'Upload resume',
  },
}
