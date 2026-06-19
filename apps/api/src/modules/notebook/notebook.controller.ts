import { resolveAuthCookieName } from '@interviewos/config'
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { AiThrottle } from '../../common/decorators/throttle.decorator'
import { ApiArrayResponse, ApiEntityResponse } from '../../common/swagger/swagger-helpers'
import {
  CreateNoteDto,
  GenerateQuestionsDto,
  TechnicalNoteDto,
  UpdateNoteDto,
} from './dto/notebook.dto'
import { NotebookService } from './notebook.service'

@ApiTags('notes')
@ApiCookieAuth(resolveAuthCookieName())
@Controller('notes')
export class NotebookController {
  constructor(private readonly notebookService: NotebookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a technical note draft' })
  @ApiBody({ type: CreateNoteDto })
  @ApiEntityResponse(TechnicalNoteDto, { status: 'created' })
  createNote(@CurrentUser() currentUser: AuthenticatedUser, @Body() payload: CreateNoteDto) {
    return this.notebookService.createNote(currentUser, payload)
  }

  @Get()
  @ApiOperation({ summary: 'List the current user technical notes' })
  @ApiArrayResponse(TechnicalNoteDto)
  findNotes(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.notebookService.findNotes(currentUser)
  }

  @Get(':noteId')
  @ApiOperation({ summary: 'Get a technical note by id' })
  @ApiParam({ name: 'noteId', type: String })
  @ApiEntityResponse(TechnicalNoteDto)
  findNoteById(@CurrentUser() currentUser: AuthenticatedUser, @Param('noteId') noteId: string) {
    return this.notebookService.findNoteById(currentUser, noteId)
  }

  @Patch(':noteId')
  @ApiOperation({ summary: 'Update a technical note' })
  @ApiParam({ name: 'noteId', type: String })
  @ApiBody({ type: UpdateNoteDto })
  @ApiEntityResponse(TechnicalNoteDto)
  updateNote(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('noteId') noteId: string,
    @Body() payload: UpdateNoteDto,
  ) {
    return this.notebookService.updateNote(currentUser, noteId, payload)
  }

  @Delete(':noteId')
  @ApiOperation({ summary: 'Archive a technical note' })
  @ApiParam({ name: 'noteId', type: String })
  @ApiEntityResponse(TechnicalNoteDto)
  deleteNote(@CurrentUser() currentUser: AuthenticatedUser, @Param('noteId') noteId: string) {
    return this.notebookService.deleteNote(currentUser, noteId)
  }

  @Post(':noteId/generate')
  @HttpCode(202)
  @AiThrottle()
  @ApiOperation({ summary: 'Generate structured content for a technical note (background job)' })
  @ApiParam({ name: 'noteId', type: String })
  @ApiEntityResponse(TechnicalNoteDto, { status: 'created' })
  generateTechnicalNote(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('noteId') noteId: string,
  ) {
    return this.notebookService.generateTechnicalNote(currentUser, noteId)
  }

  @Post(':noteId/questions')
  @AiThrottle()
  @ApiOperation({ summary: 'Generate interview questions from a technical note' })
  @ApiParam({ name: 'noteId', type: String })
  @ApiBody({ type: GenerateQuestionsDto })
  @ApiEntityResponse(TechnicalNoteDto, { status: 'created' })
  generateQuestions(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('noteId') noteId: string,
    @Body() payload: GenerateQuestionsDto,
  ) {
    return this.notebookService.generateQuestions(currentUser, noteId, payload)
  }
}
