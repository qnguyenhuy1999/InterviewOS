import { Controller, Get, Post, Query } from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { PaginationQueryDto } from '../../common/dto/pagination.dto'
import {
  ApiEntityResponse,
  ApiNullableEntityResponse,
  ApiPaginatedResponse,
} from '../../common/swagger/swagger-helpers'
import { ReadinessSnapshotDto } from './dto/readiness.dto'
import { ReadinessService } from './readiness.service'

@ApiTags('readiness')
@ApiCookieAuth('interviewos_session')
@Controller('readiness')
export class ReadinessController {
  constructor(private readonly readinessService: ReadinessService) {}

  @Get()
  @ApiOperation({ summary: 'Get the latest readiness snapshot' })
  @ApiNullableEntityResponse(ReadinessSnapshotDto)
  findLatest(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.readinessService.findLatest(currentUser.id)
  }

  @Get('history')
  @ApiOperation({ summary: 'List readiness snapshots with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiPaginatedResponse(ReadinessSnapshotDto)
  findHistory(@CurrentUser() currentUser: AuthenticatedUser, @Query() query: PaginationQueryDto) {
    return this.readinessService.findHistory(currentUser.id, query)
  }

  @Post('compute')
  @ApiOperation({ summary: 'Compute and persist a new readiness snapshot' })
  @ApiEntityResponse(ReadinessSnapshotDto, { status: 'created' })
  compute(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.readinessService.computeAndSave(currentUser.id)
  }
}
