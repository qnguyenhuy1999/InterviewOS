import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ApiArrayResponse, ApiEntityResponse } from '../../common/swagger/swagger-helpers'
import {
  CreateEnglishNoteDto,
  EnglishNoteResponseDto,
  UpdateEnglishNoteStatusDto,
} from './dto/english-notes.dto'
import { EnglishNotesService } from './english-notes.service'

@ApiTags('english-notes')
@ApiCookieAuth('interviewos_session')
@Controller('english-notes')
export class EnglishNotesController {
  constructor(private readonly englishNotesService: EnglishNotesService) {}

  @Get()
  @ApiOperation({ summary: 'List english improvement notes' })
  @ApiArrayResponse(EnglishNoteResponseDto)
  findEnglishNotes(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.englishNotesService.findEnglishNotes(currentUser)
  }

  @Post()
  @ApiOperation({ summary: 'Create an english improvement note' })
  @ApiBody({ type: CreateEnglishNoteDto })
  @ApiEntityResponse(EnglishNoteResponseDto, { status: 'created' })
  createEnglishNote(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() payload: CreateEnglishNoteDto,
  ) {
    return this.englishNotesService.createEnglishNote(currentUser, payload)
  }

  @Patch(':englishNoteId/status')
  @ApiOperation({ summary: 'Update english note status' })
  @ApiParam({ name: 'englishNoteId', type: String })
  @ApiBody({ type: UpdateEnglishNoteStatusDto })
  @ApiEntityResponse(EnglishNoteResponseDto)
  updateEnglishNoteStatus(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('englishNoteId') englishNoteId: string,
    @Body() payload: UpdateEnglishNoteStatusDto,
  ) {
    return this.englishNotesService.updateEnglishNoteStatus(currentUser, englishNoteId, payload)
  }
}
