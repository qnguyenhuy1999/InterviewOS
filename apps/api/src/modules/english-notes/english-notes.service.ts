import { Injectable, NotImplementedException } from '@nestjs/common'

import { EnglishNotesRepository } from './english-notes.repository'

@Injectable()
export class EnglishNotesService {
  constructor(private readonly englishNotesRepository: EnglishNotesRepository) {}

  findEnglishNotes() {
    void this.englishNotesRepository
    throw new NotImplementedException()
  }

  createEnglishNote(_payload: Record<string, unknown>) {
    void this.englishNotesRepository
    throw new NotImplementedException()
  }
}
