import type { FastifyReply, FastifyRequest } from 'fastify'

export type AuthenticatedUser = {
  sub: string
  email: string
  name: string | null
}

export type AuthenticatedRequest = FastifyRequest & {
  user?: AuthenticatedUser
}

export type AuthenticatedReply = FastifyReply
