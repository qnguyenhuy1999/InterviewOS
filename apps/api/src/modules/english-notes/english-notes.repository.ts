import { Injectable, NotImplementedException } from '@nestjs/common'

import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class EnglishNotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findEnglishNotes() {
    void this.prisma
    // Scaffold boundary: future Prisma access for english notes belongs here.
    throw new NotImplementedException()
  }

  createEnglishNote(_payload: Record<string, unknown>) {
    void this.prisma
    // Scaffold boundary: future Prisma access for english notes belongs here.
    throw new NotImplementedException()
  }
}
