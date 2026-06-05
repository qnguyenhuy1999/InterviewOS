import { ExperienceLevel } from '@interviewos/types'

export const userFixtures = {
  jane: {
    id: 'user-001',
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-03-10'),
  },
  anonymous: {
    id: 'user-002',
    email: 'anon@example.com',
    name: null as string | null,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
  },
}

export const learningProfileFixture = {
  id: 'profile-001',
  userId: userFixtures.jane.id,
  targetRole: 'Frontend Engineer',
  currentLevel: ExperienceLevel.MID,
  targetLevel: ExperienceLevel.SENIOR,
  techStack: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
  interviewGoals: ['System Design', 'Frontend Architecture', 'React Internals'],
  englishLevel: 'ADVANCED',
  preferredOutputStyle: 'concise',
  createdAt: new Date('2024-01-20'),
  updatedAt: new Date('2025-02-01'),
}
