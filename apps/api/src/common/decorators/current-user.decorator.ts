import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

type RequestWithUser = FastifyRequest & {
  user?: unknown
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): unknown => {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    return request.user
  },
)
