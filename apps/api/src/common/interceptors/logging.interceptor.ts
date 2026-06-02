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

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${request.method} ${request.url} ${response.statusCode}`)
      }),
    )
  }
}
