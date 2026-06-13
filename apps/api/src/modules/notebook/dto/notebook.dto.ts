import {
  EnglishLevel,
  ExperienceLevel,
  NoteStatus,
  NoteType,
  QuestionDifficulty,
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
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator'

export class NoteAdvancedSettingsDto {
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

export class CreateNoteDto {
  @ApiProperty({ maxLength: 200 })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string

  @ApiPropertyOptional({ type: String, maxLength: 120, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  topic?: string | null

  @ApiProperty()
  @IsString()
  @MinLength(1)
  roughNotes!: string

  @ApiPropertyOptional({ enum: NoteType, default: NoteType.CONCEPT })
  @IsOptional()
  @IsEnum(NoteType)
  type: NoteType = NoteType.CONCEPT

  @ApiPropertyOptional({ type: () => NoteAdvancedSettingsDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => NoteAdvancedSettingsDto)
  advancedSettings?: NoteAdvancedSettingsDto
}

export class UpdateNoteDto {
  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string

  @ApiPropertyOptional({ type: String, maxLength: 120, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  topic?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  roughNotes?: string

  @ApiPropertyOptional({ enum: NoteType })
  @IsOptional()
  @IsEnum(NoteType)
  type?: NoteType

  @ApiPropertyOptional({ enum: NoteStatus })
  @IsOptional()
  @IsEnum(NoteStatus)
  status?: NoteStatus

  @ApiPropertyOptional({ type: () => NoteAdvancedSettingsDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => NoteAdvancedSettingsDto)
  advancedSettings?: NoteAdvancedSettingsDto
}

export class GenerateQuestionsDto {
  @ApiPropertyOptional({ type: Number, minimum: 1, maximum: 10, default: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  count = 5

  @ApiPropertyOptional({ enum: QuestionDifficulty })
  @IsOptional()
  @IsEnum(QuestionDifficulty)
  difficulty?: QuestionDifficulty
}

export class TechnicalNoteContentSectionDto {
  @ApiProperty()
  heading!: string

  @ApiProperty()
  content!: string
}

export class TechnicalNoteContentDto {
  @ApiProperty()
  purpose!: string

  @ApiProperty({ type: [String] })
  quickReference!: string[]

  @ApiProperty({ type: [String] })
  coreConcepts!: string[]

  @ApiProperty()
  mentalModel!: string

  @ApiProperty({ type: [String] })
  productionUsage!: string[]

  @ApiProperty({ type: [String] })
  practicalExamples!: string[]

  @ApiProperty({ type: [String] })
  commonPitfalls!: string[]

  @ApiProperty({ type: [String] })
  debuggingChecklist!: string[]

  @ApiProperty({ type: [String] })
  productionChecklist!: string[]

  @ApiProperty({ type: [String] })
  seniorInterviewSignals!: string[]
}

export class NoteGeneratedQuestionDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  noteId!: string

  @ApiProperty()
  question!: string

  @ApiProperty()
  category!: string

  @ApiProperty({ type: String, nullable: true })
  expectedAnswer!: string | null

  @ApiProperty({ enum: QuestionDifficulty })
  difficulty!: QuestionDifficulty

  @ApiProperty({ type: [String] })
  expectedConcepts!: string[]

  @ApiProperty()
  sourceSection!: string
}

export class TechnicalNoteDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  title!: string

  @ApiProperty({ type: String, nullable: true })
  topic!: string | null

  @ApiProperty()
  rawInput!: string

  @ApiProperty({ enum: NoteType })
  type!: NoteType

  @ApiProperty({ enum: NoteStatus })
  status!: NoteStatus

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

  @ApiPropertyOptional({ type: () => TechnicalNoteContentDto, nullable: true })
  structuredContent!: TechnicalNoteContentDto | null

  @ApiProperty({ type: [TechnicalNoteContentSectionDto] })
  sections!: TechnicalNoteContentSectionDto[]

  @ApiProperty({ type: [NoteGeneratedQuestionDto] })
  questions!: NoteGeneratedQuestionDto[]

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date
}
