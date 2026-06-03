import { Module } from '@nestjs/common'

import { AIModule } from '../../ai/ai.module'
import { UsersModule } from '../users/users.module'
import { RecommendationsController } from './recommendations.controller'
import { RecommendationsRepository } from './recommendations.repository'
import { RecommendationsService } from './recommendations.service'

@Module({
  imports: [UsersModule, AIModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService, RecommendationsRepository],
  exports: [RecommendationsService, RecommendationsRepository],
})
export class RecommendationsModule {}
