import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SuccessResponseDto {
  @ApiProperty()
  success!: boolean
}

export class MessageResponseDto extends SuccessResponseDto {
  @ApiProperty()
  message!: string
}

export class ValidationIssueDto {
  @ApiProperty({ type: [String] })
  path!: string[]

  @ApiProperty()
  message!: string
}

export class ApiErrorResponseDto {
  @ApiProperty()
  statusCode!: number

  @ApiProperty()
  error!: string

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
      { type: 'object', additionalProperties: true },
    ],
  })
  message!: string | string[] | Record<string, unknown>

  @ApiProperty()
  path!: string

  @ApiProperty()
  timestamp!: string

  @ApiPropertyOptional({ type: [ValidationIssueDto] })
  details?: ValidationIssueDto[]
}
