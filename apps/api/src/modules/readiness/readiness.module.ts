import { Module } from '@nestjs/common'

import { ReadinessController } from './readiness.controller'
import { ReadinessRepository } from './readiness.repository'
import { ReadinessService } from './readiness.service'

@Module({
  controllers: [ReadinessController],
  providers: [ReadinessService, ReadinessRepository],
  exports: [ReadinessService],
})
export class ReadinessModule {}
