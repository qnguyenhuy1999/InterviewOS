import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { FastifyRequest } from 'fastify'

import { DEMO_USER_EMAIL } from '../constants/demo-user'

type RequestWithUser = FastifyRequest & {
  user?: unknown
}

type CurrentUserPayload = {
  email: string
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserPayload => {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const headerValue = request.headers['x-interviewos-user-email']
    const email =
      typeof headerValue === 'string' && headerValue.length > 0 ? headerValue : DEMO_USER_EMAIL

    if (
      request.user &&
      typeof request.user === 'object' &&
      'email' in request.user &&
      typeof request.user.email === 'string'
    ) {
      return { email: request.user.email }
    }

    return { email }
  },
)
