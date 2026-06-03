import type { FastifyReply, FastifyRequest } from 'fastify'

export type AuthenticatedUser = {
  id: string
  sessionId: string
  email: string
  name: string | null
  emailVerifiedAt: Date | null
}

export type AuthenticatedRequest = FastifyRequest & {
  user?: AuthenticatedUser
}

export type AuthenticatedReply = FastifyReply
