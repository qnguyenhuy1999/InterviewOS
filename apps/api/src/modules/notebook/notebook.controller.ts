import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { NotebookService } from './notebook.service'

@Controller('notes')
export class NotebookController {
  constructor(private readonly notebookService: NotebookService) {}

  @Post()
  createNote(@CurrentUser() currentUser: unknown, @Body() payload: Record<string, unknown>) {
    return this.notebookService.createNote(currentUser, payload)
  }

  @Get()
  findNotes(@CurrentUser() currentUser: unknown) {
    return this.notebookService.findNotes(currentUser)
  }

  @Get(':noteId')
  findNoteById(@CurrentUser() currentUser: unknown, @Param('noteId') noteId: string) {
    return this.notebookService.findNoteById(currentUser, noteId)
  }

  @Patch(':noteId')
  updateNote(
    @CurrentUser() currentUser: unknown,
    @Param('noteId') noteId: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.notebookService.updateNote(currentUser, noteId, payload)
  }

  @Delete(':noteId')
  deleteNote(@CurrentUser() currentUser: unknown, @Param('noteId') noteId: string) {
    return this.notebookService.deleteNote(currentUser, noteId)
  }

  @Post(':noteId/generate')
  generateTechnicalNote(@CurrentUser() currentUser: unknown, @Param('noteId') noteId: string) {
    return this.notebookService.generateTechnicalNote(currentUser, noteId)
  }

  @Post(':noteId/questions')
  generateQuestions(
    @CurrentUser() currentUser: unknown,
    @Param('noteId') noteId: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.notebookService.generateQuestions(currentUser, noteId, payload)
  }
}
