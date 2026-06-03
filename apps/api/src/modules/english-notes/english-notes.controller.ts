import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'

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

  @Patch(':englishNoteId/status')
  updateEnglishNoteStatus(
    @CurrentUser() currentUser: unknown,
    @Param('englishNoteId') englishNoteId: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.englishNotesService.updateEnglishNoteStatus(currentUser, englishNoteId, payload)
  }
}
