import { ExperienceLevel, InterviewType, TurnDecision } from '@interviewos/types'
import { splitCommaSeparated } from '@interviewos/utils'
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

export const startMultiTurnSessionFormSchema = z.object({
  type: z.nativeEnum(InterviewType),
  mode: z.enum(['STANDARD', 'MULTI_TURN', 'COMPANY']),
  companyModeSlug: z.string().trim(),
  noteId: z.string().trim(),
  overrideRole: z.string().trim(),
  overrideLevel: z.nativeEnum(ExperienceLevel),
  overrideStack: z
    .string()
    .trim()
    .refine(
      (value) => splitCommaSeparated(value).length > 0,
      'Enter at least one tech stack item.',
    ),
  maxTurns: z.number().int().min(1).max(30),
})

export type StartMultiTurnSessionFormInput = z.infer<typeof startMultiTurnSessionFormSchema>

export const conductTurnResultSchema = z.object({
  decision: z.nativeEnum(TurnDecision),
  nextQuestion: z.string().min(1),
  reasoning: z.string().min(1),
  topicTags: z.array(z.string().min(1)),
})

export type StartMultiTurnSessionInput = z.infer<typeof startMultiTurnSessionSchema>
export type SubmitTurnInput = z.infer<typeof submitTurnSchema>
