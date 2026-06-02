import { Injectable, NotImplementedException } from '@nestjs/common'

import { NotebookRepository } from './notebook.repository'

@Injectable()
export class NotebookService {
  constructor(private readonly notebookRepository: NotebookRepository) {}

  createNote(_payload: Record<string, unknown>) {
    void this.notebookRepository
    throw new NotImplementedException()
  }

  findNotes() {
    void this.notebookRepository
    throw new NotImplementedException()
  }

  findNoteById(_noteId: string) {
    void this.notebookRepository
    throw new NotImplementedException()
  }

  updateNote(_noteId: string, _payload: Record<string, unknown>) {
    void this.notebookRepository
    throw new NotImplementedException()
  }

  deleteNote(_noteId: string) {
    void this.notebookRepository
    throw new NotImplementedException()
  }
}
