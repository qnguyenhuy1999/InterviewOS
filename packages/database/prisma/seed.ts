import { prisma } from '../src/client'

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@interviewos.dev' },
    update: {},
    create: {
      email: 'demo@interviewos.dev',
      name: 'InterviewOS Demo User',
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

  console.log(`Seeded demo user ${user.email} with onboarding profile and one notebook entry.`)
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
