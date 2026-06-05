import { ExperienceLevel } from '@interviewos/types'
import { ApiProperty } from '@nestjs/swagger'

export class ResumeAnalysisResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  resumeText!: string

  @ApiProperty()
  score!: number

  @ApiProperty({ type: [String] })
  strengths!: string[]

  @ApiProperty({ type: [String] })
  gaps!: string[]

  @ApiProperty({ type: [String] })
  recommendations!: string[]

  @ApiProperty({ type: [String] })
  keySkillsFound!: string[]

  @ApiProperty()
  targetRole!: string

  @ApiProperty({ enum: ExperienceLevel })
  targetLevel!: ExperienceLevel

  @ApiProperty({ type: String, nullable: true })
  fileName!: string | null

  @ApiProperty({ type: String, format: 'date-time' })
  analyzedAt!: Date | string
}
