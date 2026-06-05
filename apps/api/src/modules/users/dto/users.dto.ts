import { EnglishLevel, ExperienceLevel } from '@interviewos/types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateMeDto {
  @ApiPropertyOptional({ minLength: 1 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string
}

export class UpsertUserLearningProfileDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  targetRole!: string

  @ApiProperty({ enum: ExperienceLevel })
  @IsEnum(ExperienceLevel)
  currentLevel!: ExperienceLevel

  @ApiProperty({ enum: ExperienceLevel })
  @IsEnum(ExperienceLevel)
  targetLevel!: ExperienceLevel

  @ApiProperty({ enum: EnglishLevel })
  @IsEnum(EnglishLevel)
  englishLevel!: EnglishLevel

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  techStack!: string[]

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  interviewGoals!: string[]

  @ApiProperty()
  @IsString()
  @MinLength(1)
  preferredOutputStyle!: string
}

export class UserDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ format: 'email' })
  email!: string

  @ApiProperty({ type: String, nullable: true })
  emailVerifiedAt!: Date | null

  @ApiProperty({ type: String, nullable: true })
  name!: string | null

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date
}

export class UserLearningProfileResponseDto extends UpsertUserLearningProfileDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date
}
