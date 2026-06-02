import { Module } from '@nestjs/common'

import { EnglishNotesController } from './english-notes.controller'
import { EnglishNotesRepository } from './english-notes.repository'
import { EnglishNotesService } from './english-notes.service'

@Module({
  controllers: [EnglishNotesController],
  providers: [EnglishNotesService, EnglishNotesRepository],
})
export class EnglishNotesModule {}
