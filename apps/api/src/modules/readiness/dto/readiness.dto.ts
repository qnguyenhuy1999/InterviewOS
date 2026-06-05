import { ApiProperty } from '@nestjs/swagger'

export class ReadinessBreakdownDto {
  @ApiProperty()
  dimension!: string

  @ApiProperty()
  score!: number

  @ApiProperty()
  weight!: number

  @ApiProperty()
  label!: string

  @ApiProperty({ enum: ['UP', 'DOWN', 'STABLE'] })
  trend!: 'UP' | 'DOWN' | 'STABLE'
}

export class ReadinessSnapshotDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  userId!: string

  @ApiProperty()
  overallScore!: number

  @ApiProperty()
  confidenceLevel!: number

  @ApiProperty()
  technicalMastery!: number

  @ApiProperty()
  interviewPerformance!: number

  @ApiProperty()
  behavioralPerformance!: number

  @ApiProperty()
  systemDesignPerformance!: number

  @ApiProperty()
  englishCommunication!: number

  @ApiProperty()
  reviewCompletion!: number

  @ApiProperty()
  learningProgress!: number

  @ApiProperty({ type: [ReadinessBreakdownDto] })
  breakdown!: ReadinessBreakdownDto[]

  @ApiProperty()
  improvementTrend!: number

  @ApiProperty({ type: String, format: 'date-time' })
  computedAt!: Date
}
