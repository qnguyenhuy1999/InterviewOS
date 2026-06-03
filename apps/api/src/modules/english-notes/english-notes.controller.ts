import { Body, Controller, Get, Post } from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { EnglishNotesService } from './english-notes.service'

@Controller('english-notes')
export class EnglishNotesController {
  constructor(private readonly englishNotesService: EnglishNotesService) {}

  @Get()
  findEnglishNotes(@CurrentUser() currentUser: unknown) {
    return this.englishNotesService.findEnglishNotes(currentUser)
  }

  @Post()
  createEnglishNote(@CurrentUser() currentUser: unknown, @Body() payload: Record<string, unknown>) {
    return this.englishNotesService.createEnglishNote(currentUser, payload)
  }
}
