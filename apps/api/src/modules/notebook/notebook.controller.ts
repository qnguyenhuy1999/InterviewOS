import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { NotebookService } from './notebook.service'

@Controller('notes')
export class NotebookController {
  constructor(private readonly notebookService: NotebookService) {}

  @Post()
  createNote(@Body() payload: Record<string, unknown>) {
    return this.notebookService.createNote(payload)
  }

  @Get()
  findNotes() {
    return this.notebookService.findNotes()
  }

  @Get(':noteId')
  findNoteById(@Param('noteId') noteId: string) {
    return this.notebookService.findNoteById(noteId)
  }

  @Patch(':noteId')
  updateNote(@Param('noteId') noteId: string, @Body() payload: Record<string, unknown>) {
    return this.notebookService.updateNote(noteId, payload)
  }

  @Delete(':noteId')
  deleteNote(@Param('noteId') noteId: string) {
    return this.notebookService.deleteNote(noteId)
  }
}
