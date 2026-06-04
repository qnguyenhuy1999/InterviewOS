import { Module } from '@nestjs/common'

import { AIModule } from '../../ai/ai.module'
import { EvaluationRepository } from './evaluation.repository'
import { EvaluationService } from './evaluation.service'

@Module({
  imports: [AIModule],
  providers: [EvaluationService, EvaluationRepository],
  exports: [EvaluationService],
})
export class EvaluationModule {}
