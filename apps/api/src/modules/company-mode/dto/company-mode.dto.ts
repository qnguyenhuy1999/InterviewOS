import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CompanyModeDifficultyProfileDto {
  @ApiProperty()
  startingDifficulty!: string

  @ApiProperty({ enum: ['SLOW', 'MEDIUM', 'FAST'] })
  escalationRate!: 'SLOW' | 'MEDIUM' | 'FAST'

  @ApiProperty()
  maxDifficulty!: string
}

export class CompanyModeFollowUpBehaviorDto {
  @ApiProperty()
  maxFollowUpsPerQuestion!: number

  @ApiProperty()
  challengeThreshold!: number

  @ApiProperty()
  clarificationThreshold!: number
}

export class CompanyModeConfigDto {
  @ApiProperty()
  interviewerPersona!: string

  @ApiProperty({ type: () => CompanyModeDifficultyProfileDto })
  difficultyProfile!: CompanyModeDifficultyProfileDto

  @ApiProperty({ type: () => CompanyModeFollowUpBehaviorDto })
  followUpBehavior!: CompanyModeFollowUpBehaviorDto

  @ApiProperty({ type: Object, additionalProperties: true })
  evaluationCriteria!: Record<string, unknown>

  @ApiProperty()
  feedbackStyle!: string

  @ApiPropertyOptional({ type: [String] })
  questionBank?: string[]

  @ApiPropertyOptional({ type: Object, additionalProperties: true })
  emphasis?: Record<string, unknown>

  @ApiPropertyOptional({ type: Object, additionalProperties: true })
  interviewStyle?: Record<string, unknown>
}

export class CompanyModeResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  slug!: string

  @ApiProperty()
  name!: string

  @ApiProperty({ type: () => CompanyModeConfigDto })
  config!: CompanyModeConfigDto

  @ApiProperty()
  isActive!: boolean

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date
}
