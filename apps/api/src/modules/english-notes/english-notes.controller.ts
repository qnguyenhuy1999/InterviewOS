import { Body, Controller, Get, Post } from '@nestjs/common'

import { EnglishNotesService } from './english-notes.service'

@Controller('english-notes')
export class EnglishNotesController {
  constructor(private readonly englishNotesService: EnglishNotesService) {}

  @Get()
  findEnglishNotes() {
    return this.englishNotesService.findEnglishNotes()
  }

  @Post()
  createEnglishNote(@Body() payload: Record<string, unknown>) {
    return this.englishNotesService.createEnglishNote(payload)
  }
}
