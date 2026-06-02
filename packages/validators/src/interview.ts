import { z } from 'zod'

export const interviewAnswerSchema = z.object({
  questionId: z.string().uuid(),
  transcript: z.string().min(1),
})

export type InterviewAnswerInput = z.infer<typeof interviewAnswerSchema>
