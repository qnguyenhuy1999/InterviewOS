import { Injectable } from '@nestjs/common'

import { UsersRepository } from '../users/users.repository'
import { EnglishNotesRepository } from './english-notes.repository'

type CurrentUserLike = {
  id?: string
}

@Injectable()
export class EnglishNotesService {
  constructor(
    private readonly englishNotesRepository: EnglishNotesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findEnglishNotes(currentUser: unknown) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    return this.englishNotesRepository.findEnglishNotes(user.id)
  }

  async createEnglishNote(currentUser: unknown, payload: Record<string, unknown>) {
    const user = await this.usersRepository.ensureUserById(this.resolveUserId(currentUser))
    return this.englishNotesRepository.createEnglishNote(user.id, {
      answerId: String(payload.answerId ?? ''),
      originalSentence: String(payload.originalSentence ?? ''),
      correctedSentence: String(payload.correctedSentence ?? ''),
      naturalVersion: String(payload.naturalVersion ?? ''),
      explanation: String(payload.explanation ?? ''),
      grammarTopic: String(payload.grammarTopic ?? ''),
      recommendedStudyTopics: Array.isArray(payload.recommendedStudyTopics)
        ? payload.recommendedStudyTopics.map(String)
        : [],
      practicePatterns: Array.isArray(payload.practicePatterns)
        ? payload.practicePatterns.map(String)
        : [],
    })
  }

  private resolveUserId(currentUser: unknown): string | undefined {
    return (currentUser as CurrentUserLike | undefined)?.id
  }
}
