import { Module } from '@nestjs/common'

import { ReviewModule } from '../review/review.module'
import { UsersModule } from '../users/users.module'
import { EnglishNotesController } from './english-notes.controller'
import { EnglishNotesRepository } from './english-notes.repository'
import { EnglishNotesService } from './english-notes.service'

@Module({
  imports: [UsersModule, ReviewModule],
  controllers: [EnglishNotesController],
  providers: [EnglishNotesService, EnglishNotesRepository],
  exports: [EnglishNotesService, EnglishNotesRepository],
})
export class EnglishNotesModule {}
