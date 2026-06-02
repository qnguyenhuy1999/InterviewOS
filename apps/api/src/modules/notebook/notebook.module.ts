import { Module } from '@nestjs/common'

import { NotebookController } from './notebook.controller'
import { NotebookRepository } from './notebook.repository'
import { NotebookService } from './notebook.service'

@Module({
  controllers: [NotebookController],
  providers: [NotebookService, NotebookRepository],
})
export class NotebookModule {}
