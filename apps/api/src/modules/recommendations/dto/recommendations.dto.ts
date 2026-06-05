import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RecommendationPayloadDto {
  @ApiProperty()
  title!: string

  @ApiProperty()
  reason!: string

  @ApiProperty()
  action!: string

  @ApiPropertyOptional({ type: Object, additionalProperties: true })
  metadata?: Record<string, string | number | boolean | null>
}

export class LearningRecommendationDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  type!: string

  @ApiProperty({ type: () => RecommendationPayloadDto })
  payload!: RecommendationPayloadDto

  @ApiProperty()
  status!: string

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date
}

export class RecommendationSummaryDto {
  @ApiPropertyOptional({ type: () => RecommendationPayloadDto, nullable: true })
  nextNoteToReview!: RecommendationPayloadDto | null

  @ApiPropertyOptional({ type: () => RecommendationPayloadDto, nullable: true })
  nextQuestionToPractice!: RecommendationPayloadDto | null

  @ApiPropertyOptional({ type: () => RecommendationPayloadDto, nullable: true })
  nextEnglishTopic!: RecommendationPayloadDto | null

  @ApiPropertyOptional({ type: () => RecommendationPayloadDto, nullable: true })
  nextLearningItem!: RecommendationPayloadDto | null

  @ApiProperty({ type: [LearningRecommendationDto] })
  persisted!: LearningRecommendationDto[]
}
