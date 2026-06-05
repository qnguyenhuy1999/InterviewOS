import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, Max, Min } from 'class-validator'

export class PaginationQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1

  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10
}

export class PaginationMetaDto {
  @ApiProperty({ minimum: 1 })
  page!: number

  @ApiProperty({ minimum: 1 })
  limit!: number

  @ApiProperty({ minimum: 0 })
  total!: number

  @ApiProperty({ minimum: 0 })
  totalPages!: number
}
