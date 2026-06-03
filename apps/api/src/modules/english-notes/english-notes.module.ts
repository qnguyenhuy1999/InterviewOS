import { Module } from '@nestjs/common'

import { UsersModule } from '../users/users.module'
import { EnglishNotesController } from './english-notes.controller'
import { EnglishNotesRepository } from './english-notes.repository'
import { EnglishNotesService } from './english-notes.service'

@Module({
  imports: [UsersModule],
  controllers: [EnglishNotesController],
  providers: [EnglishNotesService, EnglishNotesRepository],
  exports: [EnglishNotesService, EnglishNotesRepository],
})
export class EnglishNotesModule {}
