import type { LiveInterviewPageProps } from './LiveInterviewPage.types'

export const liveInterviewPageFixture: LiveInterviewPageProps = {
  candidateName: 'Alex Kim',
  role: 'Frontend Engineer',
  company: 'Acme Corp',
  sessionId: 'session-live-001',
  questions: [
    {
      id: 'q1',
      question: 'Explain the virtual DOM and how React uses it.',
      category: 'technical',
      difficulty: 'medium',
      timeEstimate: 5,
      isActive: true,
    },
    {
      id: 'q2',
      question: 'How does CSS specificity work?',
      category: 'technical',
      difficulty: 'easy',
      timeEstimate: 3,
    },
    {
      id: 'q3',
      question: 'Describe a challenging project you worked on.',
      category: 'behavioral',
      difficulty: 'medium',
      timeEstimate: 5,
    },
    {
      id: 'q4',
      question: 'Design a frontend caching strategy for a dashboard.',
      category: 'system-design',
      difficulty: 'hard',
      timeEstimate: 10,
    },
    {
      id: 'q5',
      question: 'What are React hooks rules and why do they exist?',
      category: 'technical',
      difficulty: 'medium',
      timeEstimate: 4,
    },
    {
      id: 'q6',
      question: 'Walk me through how you would optimize a slow React app.',
      category: 'technical',
      difficulty: 'hard',
      timeEstimate: 8,
    },
  ],
}
