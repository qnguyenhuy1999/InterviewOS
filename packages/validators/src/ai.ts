import { QuestionDifficulty } from '@interviewos/types'
import { z } from 'zod'

export const technicalNoteContentSchema = z.object({
  purpose: z.string().min(1),
  quickReference: z.array(z.string().min(1)).min(1),
  coreConcepts: z.array(z.string().min(1)).min(1),
  mentalModel: z.string().min(1),
  productionUsage: z.array(z.string().min(1)).min(1),
  practicalExamples: z.array(z.string().min(1)).min(1),
  commonPitfalls: z.array(z.string().min(1)).min(1),
  debuggingChecklist: z.array(z.string().min(1)).min(1),
  productionChecklist: z.array(z.string().min(1)).min(1),
  seniorInterviewSignals: z.array(z.string().min(1)).min(1),
  directAnswer: z.string().min(1),
  deepTheory: z.string().min(1),
  internals: z.array(z.string().min(1)).min(1),
  edgeCases: z.array(z.string().min(1)).min(1),
  tradeoffs: z.array(z.string().min(1)).min(1),
  commonMistakes: z.array(z.string().min(1)).min(1),
  interviewFollowUps: z.array(z.string().min(1)).min(1),
  summary: z.string().min(1),
})

export const technicalNoteResultSchema = z.object({
  title: z.string().min(1),
  content: technicalNoteContentSchema,
  sections: z
    .array(
      z.object({
        heading: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .min(1),
})

export const improveTechnicalNoteResultSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  improvements: z.array(z.string().min(1)),
})

export const generatedQuestionsResultSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1),
        category: z.string().min(1),
        expectedAnswer: z.string().min(1),
        difficulty: z.nativeEnum(QuestionDifficulty),
        expectedConcepts: z.array(z.string().min(1)).min(1),
        sourceSection: z.string().min(1),
      }),
    )
    .min(1),
})

export const interviewAnswerResultSchema = z.object({
  technicalScore: z.number().int().min(0).max(100),
  englishScore: z.number().int().min(0).max(100),
  clarityScore: z.number().int().min(0).max(100),
  overallScore: z.number().int().min(0).max(100),
  summary: z.string().min(1),
  strengths: z.array(z.string().min(1)),
  improvements: z.array(z.string().min(1)),
  weakConcepts: z.array(z.string().min(1)),
  nextRecommendedQuestion: z.object({
    question: z.string().min(1),
    difficulty: z.nativeEnum(QuestionDifficulty),
    reason: z.string().min(1),
  }),
  recommendedLearning: z.object({
    title: z.string().min(1),
    reason: z.string().min(1),
    action: z.string().min(1),
  }),
})

export const englishFeedbackResultSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  feedback: z.string().min(1),
  notes: z.array(
    z.object({
      userSentence: z.string().min(1),
      correctedSentence: z.string().min(1),
      naturalVersion: z.string().min(1),
      explanation: z.string().min(1),
      grammarTopic: z.string().min(1),
      recommendedTopics: z.array(z.string().min(1)),
      practicePatterns: z.array(z.string().min(1)),
    }),
  ),
  weakTopics: z.array(z.string().min(1)),
})

export const recommendationResultSchema = z.object({
  recommendations: z.array(
    z.object({
      topic: z.string().min(1),
      reason: z.string().min(1),
      priority: z.number().int().min(1),
      action: z.string().min(1),
    }),
  ),
})

export const resumeAnalysisResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  strengths: z.array(z.string().min(1)),
  gaps: z.array(z.string().min(1)),
  recommendations: z.array(z.string().min(1)),
  keySkillsFound: z.array(z.string().min(1)),
})
