import { EnglishNoteStatus } from '@interviewos/types'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEnum, IsString, MinLength } from 'class-validator'

export class CreateEnglishNoteDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  answerId!: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  originalSentence!: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  correctedSentence!: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  naturalVersion!: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  explanation!: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  grammarTopic!: string

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  recommendedStudyTopics!: string[]

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  practicePatterns!: string[]
}

export class UpdateEnglishNoteStatusDto {
  @ApiProperty({ enum: EnglishNoteStatus })
  @IsEnum(EnglishNoteStatus)
  status!: EnglishNoteStatus
}

export class EnglishNoteResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  answerId!: string

  @ApiProperty()
  originalSentence!: string

  @ApiProperty()
  correctedSentence!: string

  @ApiProperty()
  naturalVersion!: string

  @ApiProperty()
  explanation!: string

  @ApiProperty()
  grammarTopic!: string

  @ApiProperty({ enum: EnglishNoteStatus })
  status!: EnglishNoteStatus

  @ApiProperty({ type: [String] })
  recommendedStudyTopics!: string[]

  @ApiProperty({ type: [String] })
  practicePatterns!: string[]

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date
}
