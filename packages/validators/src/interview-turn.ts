import { ExperienceLevel, InterviewType, TurnDecision } from '@interviewos/types'
import { z } from 'zod'

export const startMultiTurnSessionSchema = z.object({
  type: z.nativeEnum(InterviewType),
  companyModeSlug: z.string().min(1).optional(),
  noteId: z.string().min(1).optional(),
  overrideRole: z.string().min(1).optional(),
  overrideLevel: z.nativeEnum(ExperienceLevel).optional(),
  overrideStack: z.array(z.string().min(1)).optional(),
  maxTurns: z.number().int().min(1).max(30).optional(),
})

export const submitTurnSchema = z.object({
  answer: z.string().min(1),
})

export const conductTurnResultSchema = z.object({
  decision: z.nativeEnum(TurnDecision),
  nextQuestion: z.string().min(1),
  reasoning: z.string().min(1),
  topicTags: z.array(z.string().min(1)),
})

export type StartMultiTurnSessionInput = z.infer<typeof startMultiTurnSessionSchema>
export type SubmitTurnInput = z.infer<typeof submitTurnSchema>
