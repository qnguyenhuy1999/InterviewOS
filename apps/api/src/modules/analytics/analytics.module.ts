import { Module } from '@nestjs/common'

import { ReviewModule } from '../review/review.module'
import { UsersModule } from '../users/users.module'
import { AnalyticsController } from './analytics.controller'
import { AnalyticsRepository } from './analytics.repository'
import { AnalyticsService } from './analytics.service'

@Module({
  imports: [ReviewModule, UsersModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository],
})
export class AnalyticsModule {}
