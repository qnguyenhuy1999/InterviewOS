import { Controller, Get } from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { RecommendationsService } from './recommendations.service'

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  getRecommendations(@CurrentUser() currentUser: unknown) {
    return this.recommendationsService.getRecommendations(currentUser)
  }
}
