import type { DashboardFixture } from './DashboardPage.types'

export const dashboardFixture: DashboardFixture = {
  greeting: 'Good morning, Diego',
  subtitle: "You're on a 12-day streak. Here's what to focus on today.",
  reviewQueueLabel: 'Open review queue',
  metrics: [
    {
      label: 'Interview readiness',
      value: '76',
      hint: '+4 this week',
    },
    {
      label: 'Technical mastery',
      value: '68',
      hint: 'Across all topics',
    },
    {
      label: 'English score',
      value: '81',
      hint: 'B2 - Upper Int.',
    },
    {
      label: 'Review streak',
      value: '6 days',
      hint: '9 reviews due',
    },
  ],
  focusChips: [
    { label: 'Closures' },
    { label: 'Async flow' },
    { label: 'SQL indexes' },
    { label: 'System design tradeoffs' },
  ],
  primaryAction: {
    eyebrow: 'Next best action',
    title: 'Practice 3 questions on the React commit phase',
    description:
      'You scored 65 in your last React session and missed the commit phase twice. A short 15-minute practice will close the gap.',
    ctaLabel: 'Start practice',
  },
  studyProgress: {
    title: 'Continue studying',
    description: 'Pick up where you left off.',
    topic: 'React commit phase',
    progressLabel: '60%',
    progressValue: 60,
    ctaLabel: 'View path',
  },
  quickActions: [
    { label: 'Create note' },
    { label: 'Start interview' },
    { label: 'Browse notebook' },
  ],
  notes: [
    {
      id: 'note-1',
      title: 'React reconciliation & the fiber architecture',
      domain: 'React',
      updatedLabel: '2 hours ago',
      difficulty: 'Hard',
    },
    {
      id: 'note-2',
      title: 'Node.js event loop phases',
      domain: 'Node.js',
      updatedLabel: 'yesterday',
      difficulty: 'Medium',
    },
    {
      id: 'note-3',
      title: 'NestJS dependency injection in practice',
      domain: 'NestJS',
      updatedLabel: '3 days ago',
      difficulty: 'Medium',
    },
  ],
  weakConcepts: [
    {
      id: 'weak-1',
      title: 'React commit phase',
      subtitle: 'React - 4x',
      severity: 'High',
    },
    {
      id: 'weak-2',
      title: 'Memoization tradeoffs',
      subtitle: 'React - 3x',
      severity: 'Medium',
    },
    {
      id: 'weak-3',
      title: 'Event loop microtasks',
      subtitle: 'Node.js - 2x',
      severity: 'Medium',
    },
    {
      id: 'weak-4',
      title: 'Index-only scans',
      subtitle: 'PostgreSQL - 1x',
      severity: 'Low',
    },
  ],
  sessions: [
    {
      id: 'session-1',
      score: 78,
      title: 'React internals',
      meta: 'Today, 09:14 - 32 min - 5 questions',
      techScore: 84,
      englishScore: 72,
    },
    {
      id: 'session-2',
      score: 71,
      title: 'Node.js & async',
      meta: 'Yesterday, 21:02 - 28 min - 4 questions',
      techScore: 74,
      englishScore: 68,
    },
    {
      id: 'session-3',
      score: 65,
      title: 'System Design - Rate limiter',
      meta: 'May 28, 10:40 - 45 min - 3 questions',
      techScore: 70,
      englishScore: 60,
    },
  ],
  englishImprovements: [
    {
      id: 'eng-1',
      title: 'Subject-verb agreement',
      subtitle: '7x across sessions',
    },
    {
      id: 'eng-2',
      title: 'Article usage (a / an / the)',
      subtitle: '5x across sessions',
    },
    {
      id: 'eng-3',
      title: 'Plural already (children, people)',
      subtitle: '3x across sessions',
    },
  ],
}
