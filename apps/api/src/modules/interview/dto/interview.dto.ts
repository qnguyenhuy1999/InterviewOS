import {
  EnglishLevel,
  ExperienceLevel,
  InterviewType,
  NoteStatus,
  QuestionDifficulty,
  TurnDecision,
  TurnRole,
} from '@interviewos/types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator'

export class InterviewAdvancedSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  targetRole?: string

  @ApiPropertyOptional({ enum: ExperienceLevel })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  targetLevel?: ExperienceLevel

  @ApiPropertyOptional({ enum: EnglishLevel })
  @IsOptional()
  @IsEnum(EnglishLevel)
  englishLevel?: EnglishLevel

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[]

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interviewGoals?: string[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  preferredOutputStyle?: string
}

export class CreateInterviewSessionDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  generatedQuestionId!: string
}

export class SubmitInterviewAnswerDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  answer!: string

  @ApiPropertyOptional({ type: () => InterviewAdvancedSettingsDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => InterviewAdvancedSettingsDto)
  advancedSettings?: InterviewAdvancedSettingsDto
}

export class StartMultiTurnSessionDto {
  @ApiProperty({ enum: InterviewType })
  @IsEnum(InterviewType)
  type!: InterviewType

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  companyModeSlug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  noteId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  overrideRole?: string

  @ApiPropertyOptional({ enum: ExperienceLevel })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  overrideLevel?: ExperienceLevel

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  overrideStack?: string[]

  @ApiPropertyOptional({ minimum: 1, maximum: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(30)
  maxTurns?: number
}

export class SubmitTurnDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  answer!: string
}

export class InterviewQuestionAnswerDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  questionId!: string

  @ApiProperty()
  rawAnswer!: string

  @ApiProperty({ type: Number, nullable: true })
  technicalScore!: number | null

  @ApiProperty({ type: Number, nullable: true })
  englishScore!: number | null

  @ApiProperty({ type: Number, nullable: true })
  clarityScore!: number | null

  @ApiProperty({ type: Number, nullable: true })
  overallScore!: number | null

  @ApiProperty({ type: String, nullable: true })
  aiFeedback!: string | null

  @ApiProperty({ type: Object, nullable: true, additionalProperties: true })
  technicalFeedback!: Record<string, unknown> | null

  @ApiProperty({ type: Object, nullable: true, additionalProperties: true })
  englishFeedback!: Record<string, unknown> | null

  @ApiProperty({ type: Object, nullable: true, additionalProperties: true })
  nextRecommendedQuestion!: Record<string, unknown> | null

  @ApiProperty({ type: Object, nullable: true, additionalProperties: true })
  recommendedLearning!: Record<string, unknown> | null

  @ApiProperty({ type: [String] })
  weakConcepts!: string[]

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date
}

export class InterviewQuestionDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  sessionId!: string

  @ApiProperty()
  question!: string

  @ApiProperty()
  category!: string

  @ApiProperty({ enum: QuestionDifficulty })
  difficulty!: QuestionDifficulty

  @ApiProperty()
  order!: number

  @ApiProperty({ type: [String] })
  expectedConcepts!: string[]

  @ApiProperty()
  sourceSection!: string

  @ApiProperty({ type: [String] })
  topicTags!: string[]

  @ApiPropertyOptional({ type: () => InterviewQuestionAnswerDto, nullable: true })
  answer?: InterviewQuestionAnswerDto | null
}

export class CompanyModeReferenceDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  slug!: string

  @ApiProperty()
  name!: string
}

export class InterviewEvaluationDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  sessionId!: string

  @ApiProperty()
  status!: string

  @ApiProperty({ type: Number, nullable: true })
  overallScore!: number | null

  @ApiProperty({ type: String, nullable: true })
  summary!: string | null

  @ApiProperty({ type: Number, nullable: true })
  confidence!: number | null

  @ApiProperty({ type: Object, additionalProperties: true })
  dimensionScores!: Record<string, unknown>

  @ApiProperty({ type: Object, nullable: true, additionalProperties: true })
  starScores!: Record<string, unknown> | null

  @ApiProperty({ type: Object, nullable: true, additionalProperties: true })
  designScores!: Record<string, unknown> | null

  @ApiProperty({ type: [Object] })
  rubricScores!: Record<string, unknown>[]

  @ApiProperty({ type: [Object] })
  evidence!: Record<string, unknown>[]

  @ApiProperty({ type: [Object] })
  weaknesses!: Record<string, unknown>[]

  @ApiProperty({ type: [Object] })
  recommendations!: Record<string, unknown>[]

  @ApiProperty({ type: [String] })
  strengths!: string[]

  @ApiProperty({ type: [String] })
  improvements!: string[]

  @ApiProperty({ type: [String] })
  coachingNotes!: string[]

  @ApiProperty({ type: [String] })
  weakConcepts!: string[]

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date
}

export class InterviewSummaryDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  sessionId!: string

  @ApiProperty()
  generatedFromVersion!: number

  @ApiProperty()
  headline!: string

  @ApiProperty({ type: [String] })
  keyTakeaways!: string[]

  @ApiProperty({ type: [String] })
  strengths!: string[]

  @ApiProperty({ type: [String] })
  weaknesses!: string[]

  @ApiProperty({ type: [String] })
  recommendations!: string[]

  @ApiProperty({ type: [Object], nullable: true })
  transcript!: Record<string, unknown>[] | null

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date
}

export class InterviewReadinessImpactDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  sessionId!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  overallDelta!: number

  @ApiProperty()
  technicalDelta!: number

  @ApiProperty()
  behavioralDelta!: number

  @ApiProperty()
  systemDesignDelta!: number

  @ApiProperty()
  communicationDelta!: number

  @ApiProperty()
  consistencyDelta!: number

  @ApiProperty({ type: Object, nullable: true, additionalProperties: true })
  snapshot!: Record<string, unknown> | null

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date
}

export class InterviewSessionResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty({ enum: InterviewType })
  type!: InterviewType

  @ApiProperty({ enum: NoteStatus })
  status!: NoteStatus

  @ApiProperty({ type: String, nullable: true })
  noteId!: string | null

  @ApiProperty({ type: String, nullable: true })
  sourceQuestionId!: string | null

  @ApiProperty({ type: String, nullable: true })
  overrideRole!: string | null

  @ApiPropertyOptional({ enum: ExperienceLevel, nullable: true })
  overrideLevel!: ExperienceLevel | null

  @ApiProperty({ type: [String] })
  overrideStack!: string[]

  @ApiProperty({ type: [String] })
  overrideGoals!: string[]

  @ApiPropertyOptional({ enum: EnglishLevel, nullable: true })
  overrideEnglishLevel!: EnglishLevel | null

  @ApiProperty({ type: String, nullable: true })
  preferredOutputStyle!: string | null

  @ApiPropertyOptional()
  mode?: string

  @ApiProperty({ type: String, nullable: true })
  companyModeId?: string | null

  @ApiProperty({ type: String, nullable: true })
  parentSessionId?: string | null

  @ApiPropertyOptional()
  version?: number

  @ApiPropertyOptional()
  maxTurns?: number

  @ApiPropertyOptional()
  currentTurnNum?: number

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  lastActivityAt?: Date | null

  @ApiProperty({ type: Object, nullable: true, additionalProperties: true })
  contextSnapshot?: Record<string, unknown> | null

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  startedAt!: Date | null

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  endedAt!: Date | null

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date

  @ApiProperty({ type: [InterviewQuestionDto] })
  questions!: InterviewQuestionDto[]

  @ApiProperty({ type: Object, nullable: true, additionalProperties: true })
  note?: Record<string, unknown> | null

  @ApiPropertyOptional({ type: () => CompanyModeReferenceDto, nullable: true })
  companyMode?: CompanyModeReferenceDto | null

  @ApiPropertyOptional({ type: () => InterviewEvaluationDto, nullable: true })
  evaluation?: InterviewEvaluationDto | null

  @ApiPropertyOptional({ type: () => InterviewSummaryDto, nullable: true })
  summary?: InterviewSummaryDto | null

  @ApiPropertyOptional({ type: () => InterviewReadinessImpactDto, nullable: true })
  readinessImpact?: InterviewReadinessImpactDto | null
}

export class InterviewTurnReferenceDto {
  @ApiProperty()
  label!: string

  @ApiProperty()
  value!: string
}

export class InterviewTurnEvaluationDto {
  @ApiPropertyOptional({ type: [String] })
  strengths?: string[]

  @ApiPropertyOptional({ type: [String] })
  risks?: string[]

  @ApiPropertyOptional({ type: Number, nullable: true })
  confidence?: number | null
}

export class InterviewTurnDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  sessionId!: string

  @ApiProperty()
  turnNumber!: number

  @ApiProperty({ enum: TurnRole })
  role!: TurnRole

  @ApiProperty()
  content!: string

  @ApiPropertyOptional({ enum: TurnDecision, nullable: true })
  decision!: TurnDecision | null

  @ApiProperty({ type: [String] })
  topicTags!: string[]

  @ApiProperty({ type: String, nullable: true })
  reasoning?: string | null

  @ApiPropertyOptional({ type: [InterviewTurnReferenceDto], nullable: true })
  references?: InterviewTurnReferenceDto[] | null

  @ApiPropertyOptional({ type: () => InterviewTurnEvaluationDto, nullable: true })
  evaluation?: InterviewTurnEvaluationDto | null

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date
}

export class SubmitTurnResponseDto {
  @ApiProperty({ type: () => InterviewTurnDto })
  candidateTurn!: InterviewTurnDto

  @ApiPropertyOptional({ type: () => InterviewTurnDto, nullable: true })
  interviewerTurn!: InterviewTurnDto | null

  @ApiProperty({ enum: TurnDecision })
  decision!: TurnDecision

  @ApiProperty()
  turnNumber!: number

  @ApiProperty()
  isComplete!: boolean
}
