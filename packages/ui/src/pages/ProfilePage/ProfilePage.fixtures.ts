import { ExperienceLevel } from '@interviewos/types'

import type { ProfileFixture } from './ProfilePage.types'

export const profileFixture: ProfileFixture = {
  title: 'Profile',
  subtitle: 'Your account, learning profile, and resume insights.',
  account: {
    title: 'Account',
    name: {
      label: 'Name',
      value: 'Diego Almeida',
    },
    email: {
      label: 'Email',
      value: 'diego@interviewos.dev',
    },
    isEmailVerified: true,
    verifiedLabel: 'Verified',
  },
  learningProfile: {
    title: 'Learning profile',
    description: 'Used to tailor every interview, question, and review.',
    targetRole: {
      label: 'Target role',
      value: 'Senior Backend Engineer',
    },
    currentLevel: {
      label: 'Current level',
      value: ExperienceLevel.SENIOR,
    },
    preferredOutputStyle: {
      label: 'Preferred output style',
      value: 'CONCISE_EXAMPLES',
    },
    techStack: {
      label: 'Tech stack',
      items: ['TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'React'],
      inputPlaceholder: 'Add a tech...',
    },
    interviewGoals: {
      label: 'Interview goals',
      items: ['Pass FAANG loop', 'Improve English fluency'],
      inputPlaceholder: 'Add a goal...',
    },
  },
  resume: {
    title: 'Resume',
    description: 'Upload your latest resume to get tailored feedback.',
    upload: {
      dropzoneTitle: 'Drag and drop your resume',
      dropzoneDescription: 'PDF or DOCX',
      ctaLabel: 'Browse files',
      acceptedFileTypes: ['PDF', 'DOCX'],
      maxFileSizeMb: 5,
    },
    latest: {
      fileName: 'Diego_Almeida_Resume.pdf',
      uploadedLabel: 'Uploaded May 30, 2026',
      strengths: [
        'Strong backend architecture',
        'Clear ownership of large systems',
        'Mentoring track record',
      ],
      gaps: ['Limited public speaking', 'No system-design publications'],
      keySkills: ['TypeScript', 'NestJS', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kafka'],
      recommendations: [
        'Quantify impact in your last 2 roles.',
        'Add a system design case study to your portfolio.',
        'Highlight cross-team leadership wins.',
      ],
    },
  },
  currentLevelOptions: [
    { value: ExperienceLevel.JUNIOR, label: 'Junior' },
    { value: ExperienceLevel.MID, label: 'Mid' },
    { value: ExperienceLevel.SENIOR, label: 'Senior' },
    { value: ExperienceLevel.STAFF, label: 'Staff' },
    { value: ExperienceLevel.PRINCIPAL, label: 'Principal' },
  ],
  preferredOutputStyleOptions: [
    { value: 'CONCISE_EXAMPLES', label: 'Concise + examples' },
    { value: 'DETAILED_BREAKDOWN', label: 'Detailed breakdown' },
    { value: 'INTERVIEWER_STYLE', label: 'Interviewer style' },
  ],
}
