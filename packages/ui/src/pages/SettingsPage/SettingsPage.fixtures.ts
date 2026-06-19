import { EnglishLevel, QuestionDifficulty } from '@interviewos/types'

import type { SettingsPageFixture } from './SettingsPage.types'

export const settingsPageFixture: SettingsPageFixture = {
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
          value: 'Diego Almeida',
          inputType: 'text',
        },
        {
          id: 'email',
          kind: 'input',
          label: 'Email',
          value: 'diego@interviewos.dev',
          inputType: 'email',
        },
        {
          id: 'target-role',
          kind: 'input',
          label: 'Target role',
          value: 'Senior Backend Engineer',
          inputType: 'text',
        },
      ],
      footerActions: [
        { id: 'cancel-profile', label: 'Reset profile', intent: 'secondary' },
        { id: 'save-profile', label: 'Save profile', intent: 'primary' },
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
        { id: 'cancel-learning', label: 'Reset learning preferences', intent: 'secondary' },
        { id: 'save-learning', label: 'Save learning preferences', intent: 'primary' },
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
          value: EnglishLevel.UPPER_INTERMEDIATE,
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
        { id: 'cancel-english', label: 'Reset English preferences', intent: 'secondary' },
        { id: 'save-english', label: 'Save English preferences', intent: 'primary' },
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
            { value: QuestionDifficulty.EASY, label: 'easy' },
            { value: QuestionDifficulty.MEDIUM, label: 'medium' },
            { value: QuestionDifficulty.HARD, label: 'hard' },
            { value: QuestionDifficulty.EXPERT, label: 'expert' },
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
        { id: 'cancel-interview', label: 'Reset interview defaults', intent: 'secondary' },
        { id: 'save-interview', label: 'Save interview defaults', intent: 'primary' },
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
          value: 'sk-****',
          inputType: 'password',
        },
      ],
      footerActions: [
        { id: 'cancel-ai-provider', label: 'Clear provider changes', intent: 'secondary' },
        { id: 'save-ai-provider', label: 'Save provider settings', intent: 'primary' },
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
