import { ReviewRating, WeakConceptStatus } from '@interviewos/types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsIn } from 'class-validator'

export class ReviewRatingDto {
  @ApiProperty({ enum: ReviewRating })
  @IsEnum(ReviewRating)
  rating!: ReviewRating
}

export class LearningPathActionDto {
  @ApiProperty({ enum: ['start', 'complete', 'snooze', 'skip'] })
  @IsIn(['start', 'complete', 'snooze', 'skip'])
  action!: 'start' | 'complete' | 'snooze' | 'skip'
}

export class WeakConceptStatusDto {
  @ApiProperty({ enum: WeakConceptStatus })
  @IsEnum(WeakConceptStatus)
  status!: WeakConceptStatus
}

export class ReviewItemResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  type!: string

  @ApiProperty()
  sourceId!: string

  @ApiProperty()
  sourceLabel!: string

  @ApiProperty()
  weaknessScore!: number

  @ApiProperty()
  masteryScore!: number

  @ApiProperty({ type: String, format: 'date-time' })
  nextReviewAt!: Date

  @ApiProperty()
  reviewIntervalDays!: number

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  lastReviewedAt!: Date | null

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  lastFailureAt!: Date | null

  @ApiProperty({ type: String, nullable: true })
  lastRating!: string | null

  @ApiPropertyOptional({ type: Object, additionalProperties: true })
  metadata?: Record<string, unknown>

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date
}

export class ReviewQueueEntryDto {
  @ApiProperty({ type: () => ReviewItemResponseDto })
  item!: ReviewItemResponseDto

  @ApiProperty()
  priorityScore!: number

  @ApiProperty({ type: [String] })
  reasons!: string[]
}

export class ReviewQueueResponseDto {
  @ApiProperty({ type: [ReviewQueueEntryDto] })
  items!: ReviewQueueEntryDto[]

  @ApiProperty()
  dueCount!: number
}

export class ReviewAttemptDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  reviewItemId!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  rating!: string

  @ApiProperty()
  masteryBefore!: number

  @ApiProperty()
  masteryAfter!: number

  @ApiProperty()
  reviewIntervalDays!: number

  @ApiProperty({ type: String, format: 'date-time' })
  nextReviewAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date
}

export class LearningPathItemResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  type!: string

  @ApiProperty()
  title!: string

  @ApiProperty()
  reason!: string

  @ApiProperty()
  actionPath!: string

  @ApiProperty()
  status!: string

  @ApiProperty()
  priorityScore!: number

  @ApiProperty({ type: String, format: 'date-time' })
  availableAt!: Date

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  snoozedUntil!: Date | null

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  startedAt!: Date | null

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  completedAt!: Date | null

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  skippedAt!: Date | null

  @ApiProperty({ type: String, nullable: true })
  sourceReviewItemId!: string | null

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date
}

export class WeakConceptResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  concept!: string

  @ApiProperty()
  occurrenceCount!: number

  @ApiProperty()
  status!: string

  @ApiProperty({ type: String, format: 'date-time' })
  lastSeenAt!: Date

  @ApiProperty({ type: [String] })
  sourceAnswerIds!: string[]
}

export class WeakConceptTrendDto {
  @ApiProperty()
  concept!: string

  @ApiProperty()
  occurrenceCount!: number

  @ApiProperty()
  status!: string
}

export class DashboardProgressDto {
  @ApiProperty()
  interviewReadiness!: number

  @ApiProperty()
  technicalMastery!: number

  @ApiProperty()
  englishScore!: number

  @ApiProperty()
  reviewStreak!: number

  @ApiProperty()
  questionsPracticed!: number

  @ApiProperty()
  notesMastered!: number

  @ApiProperty()
  dueReviews!: number

  @ApiProperty({ type: [WeakConceptTrendDto] })
  weakConceptTrends!: WeakConceptTrendDto[]
}
