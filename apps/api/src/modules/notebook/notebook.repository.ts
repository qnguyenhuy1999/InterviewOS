import { Injectable, NotImplementedException } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class NotebookRepository {
  constructor(private readonly prisma: PrismaService) {}

  createNote(_payload: Record<string, unknown>) {
    void this.prisma
    // Scaffold boundary: future Prisma access for notebook belongs here.
    throw new NotImplementedException()
  }

  findNotes() {
    void this.prisma
    // Scaffold boundary: future Prisma access for notebook belongs here.
    throw new NotImplementedException()
  }

  findNoteById(_noteId: string) {
    void this.prisma
    // Scaffold boundary: future Prisma access for notebook belongs here.
    throw new NotImplementedException()
  }

  updateNote(_noteId: string, _payload: Record<string, unknown>) {
    void this.prisma
    // Scaffold boundary: future Prisma access for notebook belongs here.
    throw new NotImplementedException()
  }

  deleteNote(_noteId: string) {
    void this.prisma
    // Scaffold boundary: future Prisma access for notebook belongs here.
    throw new NotImplementedException()
  }
}
