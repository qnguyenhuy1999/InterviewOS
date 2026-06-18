import { API_ROUTES } from '@interviewos/config'
import type { AuthSessionResponse, UserLearningProfile } from '@interviewos/types'
import type { SettingsPageView } from '@interviewos/types'
import { EnglishLevel, QuestionDifficulty } from '@interviewos/types'

import { serverApiClient } from '@/lib/server-api-client'

import { SettingsContainer } from './_components/SettingsContainer'

export default async function SettingsPage() {
  const [profile, session] = await Promise.all([
    serverApiClient<UserLearningProfile | null>(API_ROUTES.users.learningProfile).catch(
      () => null,
    ),
    serverApiClient<AuthSessionResponse>(API_ROUTES.auth.me),
  ])

  const { user } = session

  const data: SettingsPageView = {
    title: 'Settings',
    subtitle: 'Tune your account, learning style, and interview defaults.',
    sections: [
      {
        id: 'profile',
        label: 'Profile',
        title: 'Profile',
        description: 'How you appear across the app.',
        fields: [
          {
            id: 'full-name',
            kind: 'input',
            label: 'Full name',
            value: user.name ?? '',
            inputType: 'text',
          },
          {
            id: 'email',
            kind: 'input',
            label: 'Email',
            value: user.email,
            inputType: 'email',
          },
          {
            id: 'target-role',
            kind: 'input',
            label: 'Target role',
            value: profile?.targetRole ?? '',
            inputType: 'text',
          },
        ],
        footerActions: [
          { id: 'cancel-profile', label: 'Cancel', intent: 'secondary' },
          { id: 'save-profile', label: 'Save changes', intent: 'primary' },
        ],
      },
      {
        id: 'learning_preferences',
        label: 'Learning preferences',
        title: 'Learning preferences',
        description: 'How recommendations are surfaced.',
        fields: [
          {
            id: 'daily-goal',
            kind: 'select',
            label: 'Daily goal',
            value: '2_per_day',
            options: [
              { value: '1_per_day', label: '1 question per day' },
              { value: '2_per_day', label: '2 questions per day' },
              { value: '5_per_day', label: '5 questions per day' },
            ],
          },
          {
            id: 'surface-weak-topics',
            kind: 'toggle',
            label: 'Surface weak topics first',
            description: "Prioritize concepts you've struggled with.",
            checked: true,
          },
          {
            id: 'weekly-digest',
            kind: 'toggle',
            label: 'Email me a weekly digest',
            checked: false,
          },
        ],
        footerActions: [
          { id: 'cancel-learning', label: 'Cancel', intent: 'secondary' },
          { id: 'save-learning', label: 'Save changes', intent: 'primary' },
        ],
      },
      {
        id: 'english_level',
        label: 'English level',
        title: 'English level',
        description: 'We tune feedback strictness to your level.',
        fields: [
          {
            id: 'current-level',
            kind: 'select',
            label: 'Current level',
            value: profile?.englishLevel ?? EnglishLevel.UPPER_INTERMEDIATE,
            options: [
              { value: EnglishLevel.BEGINNER, label: 'A1 - Beginner' },
              { value: EnglishLevel.ELEMENTARY, label: 'A2 - Elementary' },
              { value: EnglishLevel.INTERMEDIATE, label: 'B1 - Intermediate' },
              { value: EnglishLevel.UPPER_INTERMEDIATE, label: 'B2 - Upper Intermediate' },
              { value: EnglishLevel.ADVANCED, label: 'C1 - Advanced' },
              { value: EnglishLevel.NATIVE, label: 'C2 - Native / bilingual' },
            ],
          },
          {
            id: 'pronunciation-tips',
            kind: 'toggle',
            label: 'Show pronunciation tips',
            checked: true,
          },
          {
            id: 'aggressive-grammar-correction',
            kind: 'toggle',
            label: 'Aggressive grammar correction',
            description: 'More nitpicky, faster improvement.',
            checked: false,
          },
        ],
        footerActions: [
          { id: 'cancel-english', label: 'Cancel', intent: 'secondary' },
          { id: 'save-english', label: 'Save changes', intent: 'primary' },
        ],
      },
      {
        id: 'interview_preferences',
        label: 'Interview preferences',
        title: 'Interview preferences',
        description: 'Default values when you start a new session.',
        fields: [
          {
            id: 'default-difficulty',
            kind: 'select',
            label: 'Default difficulty',
            value: QuestionDifficulty.MEDIUM,
            options: [
              { value: QuestionDifficulty.EASY, label: 'Easy' },
              { value: QuestionDifficulty.MEDIUM, label: 'Medium' },
              { value: QuestionDifficulty.HARD, label: 'Hard' },
              { value: QuestionDifficulty.EXPERT, label: 'Expert' },
            ],
          },
          {
            id: 'default-question-count',
            kind: 'select',
            label: 'Default question count',
            value: '5_questions',
            options: [
              { value: '3_questions', label: '3 questions' },
              { value: '5_questions', label: '5 questions' },
              { value: '10_questions', label: '10 questions' },
            ],
          },
          {
            id: 'time-per-question',
            kind: 'input',
            label: 'Time per question (seconds)',
            value: '180',
            inputType: 'number',
          },
        ],
        footerActions: [
          { id: 'cancel-interview', label: 'Cancel', intent: 'secondary' },
          { id: 'save-interview', label: 'Save changes', intent: 'primary' },
        ],
      },
      {
        id: 'ai_provider',
        label: 'AI provider',
        title: 'AI provider',
        description: 'Used to generate questions and feedback.',
        fields: [
          {
            id: 'provider',
            kind: 'select',
            label: 'Provider',
            value: 'interviewos_default',
            options: [
              { value: 'interviewos_default', label: 'InterviewOS default' },
              { value: 'openai', label: 'OpenAI' },
              { value: 'anthropic', label: 'Anthropic' },
            ],
          },
          {
            id: 'api-key',
            kind: 'input',
            label: 'API key',
            description: 'Stored locally, never sent to our servers.',
            value: '',
            inputType: 'password',
          },
        ],
        footerActions: [
          { id: 'cancel-ai-provider', label: 'Cancel', intent: 'secondary' },
          { id: 'save-ai-provider', label: 'Save changes', intent: 'primary' },
        ],
      },
      {
        id: 'account',
        label: 'Account',
        title: 'Account',
        description: 'Manage your plan and personal data.',
        fields: [
          {
            id: 'plan',
            kind: 'value',
            label: 'Plan',
            value: 'Free - 10 sessions/month',
          },
          {
            id: 'export-data',
            kind: 'actions',
            label: 'Export data',
            actions: [{ id: 'download-json', label: 'Download .json', intent: 'secondary' }],
          },
          {
            id: 'delete-account',
            kind: 'actions',
            label: 'Delete account',
            description: 'This cannot be undone.',
            actions: [{ id: 'delete-account-action', label: 'Delete', intent: 'destructive' }],
          },
        ],
      },
    ],
  }

  return <SettingsContainer data={data} />
}
