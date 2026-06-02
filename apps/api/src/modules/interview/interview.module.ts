import { Module } from '@nestjs/common'

import { InterviewController } from './interview.controller'
import { InterviewRepository } from './interview.repository'
import { InterviewService } from './interview.service'

@Module({
  controllers: [InterviewController],
  providers: [InterviewService, InterviewRepository],
})
export class InterviewModule {}
