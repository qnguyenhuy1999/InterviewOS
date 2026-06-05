import { ApiProperty } from '@nestjs/swagger'

export class AnalyticsTrendDto {
  @ApiProperty()
  completed!: number

  @ApiProperty({ type: Number, nullable: true })
  averageScore!: number | null
}

export class InterviewAnalyticsResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  interviewsCompleted!: number

  @ApiProperty({ type: Number, nullable: true })
  averageScore!: number | null

  @ApiProperty({ type: [String] })
  weakConcepts!: string[]

  @ApiProperty({ type: [String] })
  strongConcepts!: string[]

  @ApiProperty({ type: () => AnalyticsTrendDto })
  trend7d!: AnalyticsTrendDto

  @ApiProperty({ type: () => AnalyticsTrendDto })
  trend30d!: AnalyticsTrendDto

  @ApiProperty({ type: () => AnalyticsTrendDto })
  trend90d!: AnalyticsTrendDto

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date
}
