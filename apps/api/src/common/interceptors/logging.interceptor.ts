import { randomUUID } from 'node:crypto'

import {
  CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { tap } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler) {
    const http = context.switchToHttp()
    const request = http.getRequest<FastifyRequest>()
    const response = http.getResponse<FastifyReply>()
    const requestId = randomUUID()
    const startedAt = Date.now()

    response.header('X-Request-ID', requestId)

    return next.handle().pipe(
      tap({
        next: () => {
          const latencyMs = Date.now() - startedAt
          this.logger.log(
            `${request.method} ${request.url} ${response.statusCode} ${latencyMs}ms [${requestId}]`,
          )
        },
        error: (err: unknown) => {
          const latencyMs = Date.now() - startedAt
          this.logger.error(
            `${request.method} ${request.url} ${latencyMs}ms [${requestId}] - ${err instanceof Error ? err.message : 'Unknown error'}`,
          )
        },
      }),
    )
  }
}
