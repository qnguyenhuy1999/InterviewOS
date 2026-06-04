import { Controller, Get } from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AnalyticsService } from './analytics.service'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('progress')
  getProgress(@CurrentUser() currentUser: unknown) {
    return this.analyticsService.getProgress(currentUser)
  }

  @Get('interviews')
  getInterviewAnalytics(@CurrentUser() currentUser: unknown) {
    return this.analyticsService.getInterviewAnalytics(currentUser)
  }
}
