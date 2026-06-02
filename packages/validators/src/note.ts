import { NoteStatus, NoteType } from '@interviewos/types'
import { z } from 'zod'

export const noteCreateSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().optional(),
  noteType: z.nativeEnum(NoteType),
  tags: z.array(z.string()).default([]),
})

export const noteUpdateSchema = noteCreateSchema.partial().extend({
  status: z.nativeEnum(NoteStatus).optional(),
})

export type NoteCreateInput = z.infer<typeof noteCreateSchema>
export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>
