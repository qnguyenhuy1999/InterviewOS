import {
  EnglishNoteStatus,
  LearningPathItemStatus,
  NoteStatus,
  ReviewRating,
  WeakConceptStatus,
} from '@interviewos/types'
import { z } from 'zod'

export const noteStatusSchema = z.object({
  status: z.nativeEnum(NoteStatus),
})

export const englishNoteStatusSchema = z.object({
  status: z.nativeEnum(EnglishNoteStatus),
})

export const weakConceptStatusSchema = z.object({
  status: z.nativeEnum(WeakConceptStatus),
})

export const reviewRatingSchema = z.object({
  rating: z.nativeEnum(ReviewRating),
})

export const learningPathActionSchema = z.object({
  action: z.enum(['start', 'complete', 'snooze', 'skip']),
})

export const learningPathStatusSchema = z.nativeEnum(LearningPathItemStatus)
