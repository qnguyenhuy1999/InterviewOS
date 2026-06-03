import { z } from 'zod'

export const startInterviewSessionSchema = z.object({
  generatedQuestionId: z.string().min(1),
})

export const interviewAnswerSchema = z.object({
  answer: z.string().min(1),
})

export type StartInterviewSessionInput = z.infer<typeof startInterviewSessionSchema>
export type InterviewAnswerInput = z.infer<typeof interviewAnswerSchema>
