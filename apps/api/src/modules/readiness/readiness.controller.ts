import { Controller, Get, Post, Query } from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ReadinessService } from './readiness.service'

type CurrentUserLike = { id: string }

@Controller('readiness')
export class ReadinessController {
  constructor(private readonly readinessService: ReadinessService) {}

  @Get()
  findLatest(@CurrentUser() currentUser: unknown) {
    return this.readinessService.findLatest((currentUser as CurrentUserLike).id)
  }

  @Get('history')
  findHistory(@CurrentUser() currentUser: unknown, @Query('limit') limit?: string) {
    return this.readinessService.findHistory(
      (currentUser as CurrentUserLike).id,
      limit ? Number(limit) : undefined,
    )
  }

  @Post('compute')
  compute(@CurrentUser() currentUser: unknown) {
    return this.readinessService.computeAndSave((currentUser as CurrentUserLike).id)
  }
}
