import { AuthenticatedUser } from '@interviewos/types'
import { Controller, Get } from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ApiEntityResponse } from '../../common/swagger/swagger-helpers'
import { RecommendationSummaryDto } from './dto/recommendations.dto'
import { RecommendationsService } from './recommendations.service'

@ApiTags('recommendations')
@ApiCookieAuth('interviewos_session')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current learning recommendations summary' })
  @ApiEntityResponse(RecommendationSummaryDto)
  getRecommendations(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.recommendationsService.getRecommendations(currentUser)
  }
}
