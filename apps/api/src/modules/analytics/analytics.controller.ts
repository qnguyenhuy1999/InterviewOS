import { resolveAuthCookieName } from '@interviewos/config'
import { Controller, Get } from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ApiEntityResponse } from '../../common/swagger/swagger-helpers'
import { DashboardProgressDto } from '../review/dto/review.dto'
import { AnalyticsService } from './analytics.service'
import { InterviewAnalyticsResponseDto } from './dto/analytics.dto'

@ApiTags('analytics')
@ApiCookieAuth(resolveAuthCookieName())
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('progress')
  @ApiOperation({ summary: 'Get dashboard progress metrics' })
  @ApiEntityResponse(DashboardProgressDto)
  getProgress(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.analyticsService.getProgress(currentUser)
  }

  @Get('interviews')
  @ApiOperation({ summary: 'Create and return an interview analytics snapshot' })
  @ApiEntityResponse(InterviewAnalyticsResponseDto)
  getInterviewAnalytics(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.analyticsService.getInterviewAnalytics(currentUser)
  }
}
