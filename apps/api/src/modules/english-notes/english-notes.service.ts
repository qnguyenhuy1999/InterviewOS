import { englishNoteStatusSchema } from '@interviewos/validators'
import { Injectable } from '@nestjs/common'

import type { AuthenticatedUser } from '../../common/auth/authenticated-request'
import { ReviewService } from '../review/review.service'
import { UsersRepository } from '../users/users.repository'
import type { CreateEnglishNoteDto, UpdateEnglishNoteStatusDto } from './dto/english-notes.dto'
import { EnglishNotesRepository } from './english-notes.repository'

type CurrentUserRef = Pick<AuthenticatedUser, 'id'>

@Injectable()
export class EnglishNotesService {
  constructor(
    private readonly englishNotesRepository: EnglishNotesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly reviewService: ReviewService,
  ) {}

  async findEnglishNotes(currentUser: CurrentUserRef) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    return this.englishNotesRepository.findEnglishNotes(user.id)
  }

  async createEnglishNote(currentUser: CurrentUserRef, payload: CreateEnglishNoteDto) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    return this.englishNotesRepository.createEnglishNote(user.id, {
      answerId: payload.answerId,
      originalSentence: payload.originalSentence,
      correctedSentence: payload.correctedSentence,
      naturalVersion: payload.naturalVersion,
      explanation: payload.explanation,
      grammarTopic: payload.grammarTopic,
      recommendedStudyTopics: payload.recommendedStudyTopics,
      practicePatterns: payload.practicePatterns,
    })
  }

  async updateEnglishNoteStatus(
    currentUser: CurrentUserRef,
    englishNoteId: string,
    payload: UpdateEnglishNoteStatusDto,
  ) {
    const user = await this.usersRepository.ensureUserById(currentUser.id)
    const input = englishNoteStatusSchema.parse(payload)
    const note = await this.englishNotesRepository.updateStatus(user.id, englishNoteId, input.status)
    await this.reviewService.syncEnglishNoteReviews(user.id, [
      {
        id: note.id,
        grammarTopic: note.grammarTopic,
        originalSentence: note.originalSentence,
        status: note.status,
      },
    ])
    return note
  }

}
