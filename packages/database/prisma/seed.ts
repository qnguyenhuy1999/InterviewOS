import { randomUUID, scryptSync } from 'node:crypto'

import { prisma } from '../src/client'

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@interviewos.dev' },
    update: {
      passwordHash: hashPassword('Password123!'),
    },
    create: {
      email: 'demo@interviewos.dev',
      name: 'InterviewOS Demo User',
      passwordHash: hashPassword('Password123!'),
    },
  })

  await prisma.userLearningProfile.upsert({
    where: { userId: user.id },
    update: {
      targetRole: 'Senior Fullstack Engineer',
      currentLevel: 'MID',
      targetLevel: 'SENIOR',
      englishLevel: 'INTERMEDIATE',
      techStack: ['TypeScript', 'React', 'NestJS', 'PostgreSQL'],
      interviewGoals: ['System design depth', 'Stronger spoken English'],
      preferredOutputStyle: 'Concise and production-oriented',
    },
    create: {
      userId: user.id,
      targetRole: 'Senior Fullstack Engineer',
      currentLevel: 'MID',
      targetLevel: 'SENIOR',
      englishLevel: 'INTERMEDIATE',
      techStack: ['TypeScript', 'React', 'NestJS', 'PostgreSQL'],
      interviewGoals: ['System design depth', 'Stronger spoken English'],
      preferredOutputStyle: 'Concise and production-oriented',
    },
  })

  const note = await prisma.technicalNote.upsert({
    where: { id: 'demo-phase1-note' },
    update: {
      deletedAt: null,
    },
    create: {
      id: 'demo-phase1-note',
      userId: user.id,
      title: 'Redis caching strategies',
      rawInput:
        'Cache-aside vs write-through, invalidation pain, stale reads, monitoring, when Redis becomes a bottleneck.',
      type: 'SYSTEM_DESIGN',
      status: 'PUBLISHED',
      structuredContent: {
        purpose:
          'Explain Redis caching in a way that balances correctness, latency, and operational risk.',
        quickReference: ['Cache-aside is flexible.', 'Invalidation is the hard part.'],
        coreConcepts: ['Cache-aside', 'TTL strategy', 'Hot key mitigation'],
        mentalModel: 'Caching is a consistency and operations problem, not just a speed problem.',
        productionUsage: ['Read-heavy APIs', 'Session storage'],
        practicalExamples: ['Product detail caching', 'Rate limiting'],
        commonPitfalls: ['Unbounded key growth', 'Blind cache invalidation'],
        debuggingChecklist: ['Check hit ratio', 'Inspect eviction policy'],
        productionChecklist: ['Set observability', 'Plan cache warmup'],
        seniorInterviewSignals: ['Tradeoff clarity', 'Failure mode awareness'],
      },
    },
  })

  await prisma.technicalNoteSection.deleteMany({
    where: { noteId: note.id },
  })

  await prisma.technicalNoteSection.createMany({
    data: [
      { noteId: note.id, order: 0, heading: 'Purpose', content: 'Why Redis caching matters.' },
      {
        noteId: note.id,
        order: 1,
        heading: 'Core Concepts',
        content: 'Tradeoffs and failure modes.',
      },
      {
        noteId: note.id,
        order: 2,
        heading: 'Production Usage',
        content: 'How it works in real systems.',
      },
    ],
  })

  await prisma.noteGeneratedQuestion.deleteMany({
    where: { noteId: note.id },
  })

  await prisma.noteGeneratedQuestion.create({
    data: {
      noteId: note.id,
      question: 'When would you choose cache-aside over write-through caching?',
      category: 'Architecture Tradeoffs',
      expectedAnswer:
        'Discuss consistency, latency, write amplification, and operational complexity.',
      difficulty: 'MEDIUM',
      expectedConcepts: ['Cache-aside', 'Consistency', 'Invalidation'],
      sourceSection: 'Core Concepts',
    },
  })

  const companyModes = [
    {
      slug: 'google',
      name: 'Google',
      config: {
        interviewerPersona:
          'A senior Google engineer. Rigorous, curious, values elegant algorithmic thinking and scalability.',
        difficultyProfile: {
          startingDifficulty: 'MEDIUM',
          escalationRate: 'FAST',
          maxDifficulty: 'HARD',
        },
        followUpBehavior: {
          maxFollowUpsPerQuestion: 3,
          challengeThreshold: 0.7,
          clarificationThreshold: 0.4,
        },
        evaluationCriteria: {
          weights: {
            problemSolving: 0.35,
            codeQuality: 0.25,
            communication: 0.2,
            systemThinking: 0.2,
          },
          rubric: 'Focus on optimal complexity, clean code, and ability to handle follow-ups.',
        },
        feedbackStyle: 'DIRECT',
      },
    },
    {
      slug: 'amazon',
      name: 'Amazon',
      config: {
        interviewerPersona:
          'An Amazon bar-raiser. Anchors every technical discussion back to Leadership Principles and customer impact.',
        difficultyProfile: {
          startingDifficulty: 'MEDIUM',
          escalationRate: 'MEDIUM',
          maxDifficulty: 'HARD',
        },
        followUpBehavior: {
          maxFollowUpsPerQuestion: 4,
          challengeThreshold: 0.6,
          clarificationThreshold: 0.35,
        },
        evaluationCriteria: {
          weights: {
            leadershipPrinciples: 0.4,
            technicalDepth: 0.3,
            communication: 0.2,
            ownership: 0.1,
          },
          rubric:
            'STAR format expected. Evaluate ownership, bias for action, and customer obsession signals.',
        },
        feedbackStyle: 'COACHING',
      },
    },
    {
      slug: 'meta',
      name: 'Meta',
      config: {
        interviewerPersona:
          'A Meta staff engineer. Interested in systems at scale, product intuition, and move-fast culture.',
        difficultyProfile: {
          startingDifficulty: 'MEDIUM',
          escalationRate: 'MEDIUM',
          maxDifficulty: 'HARD',
        },
        followUpBehavior: {
          maxFollowUpsPerQuestion: 3,
          challengeThreshold: 0.65,
          clarificationThreshold: 0.3,
        },
        evaluationCriteria: {
          weights: { systemDesign: 0.35, codingSpeed: 0.25, productSense: 0.2, communication: 0.2 },
          rubric: 'Reward pragmatism and shipping instinct. Penalize over-engineering.',
        },
        feedbackStyle: 'SOCRATIC',
      },
    },
    {
      slug: 'startup',
      name: 'Startup',
      config: {
        interviewerPersona:
          'A founding engineer at an early-stage startup. Values pragmatism, breadth, and ownership over perfection.',
        difficultyProfile: {
          startingDifficulty: 'EASY',
          escalationRate: 'SLOW',
          maxDifficulty: 'MEDIUM',
        },
        followUpBehavior: {
          maxFollowUpsPerQuestion: 2,
          challengeThreshold: 0.5,
          clarificationThreshold: 0.5,
        },
        evaluationCriteria: {
          weights: { practicality: 0.4, breadth: 0.25, teamFit: 0.2, communication: 0.15 },
          rubric: 'Can they ship? Do they take ownership? Are they collaborative under ambiguity?',
        },
        feedbackStyle: 'COACHING',
      },
    },
    {
      slug: 'enterprise',
      name: 'Enterprise',
      config: {
        interviewerPersona:
          'A principal engineer at a Fortune 500. Values process, reliability, compliance, and clear communication.',
        difficultyProfile: {
          startingDifficulty: 'EASY',
          escalationRate: 'SLOW',
          maxDifficulty: 'MEDIUM',
        },
        followUpBehavior: {
          maxFollowUpsPerQuestion: 2,
          challengeThreshold: 0.55,
          clarificationThreshold: 0.45,
        },
        evaluationCriteria: {
          weights: {
            reliability: 0.35,
            processAdherence: 0.25,
            communication: 0.25,
            technicalDepth: 0.15,
          },
          rubric:
            'Documentation, testing, maintainability, and stakeholder communication matter most.',
        },
        feedbackStyle: 'DIRECT',
      },
    },
  ]

  for (const mode of companyModes) {
    await prisma.companyMode.upsert({
      where: { slug: mode.slug },
      update: { name: mode.name, config: mode.config, isActive: true },
      create: { slug: mode.slug, name: mode.name, config: mode.config, isActive: true },
    })
  }

  console.log(
    `Seeded demo user ${user.email} with password Password123!, onboarding profile, one notebook entry, and 5 company modes.`,
  )
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

function hashPassword(password: string): string {
  const salt = randomUUID()
  const derivedKey = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derivedKey}`
}
