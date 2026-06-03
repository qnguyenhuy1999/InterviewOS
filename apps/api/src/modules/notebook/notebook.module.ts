import { Module } from '@nestjs/common'

import { AIModule } from '../../ai/ai.module'
import { UsersModule } from '../users/users.module'
import { NotebookController } from './notebook.controller'
import { NotebookRepository } from './notebook.repository'
import { NotebookService } from './notebook.service'

@Module({
  imports: [UsersModule, AIModule],
  controllers: [NotebookController],
  providers: [NotebookService, NotebookRepository],
  exports: [NotebookService, NotebookRepository],
})
export class NotebookModule {}
