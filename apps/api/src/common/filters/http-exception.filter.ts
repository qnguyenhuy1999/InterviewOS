import {
  ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { FastifyReply, FastifyRequest } from 'fastify'

interface ZodIssue { path: (string | number)[]; message: string }
interface ZodLike { errors: ZodIssue[] }

function isZodError(e: unknown): e is ZodLike {
  return (
    typeof e === 'object' &&
    e !== null &&
    'errors' in e &&
    Array.isArray((e as ZodLike).errors) &&
    (e as ZodLike).errors.every(
      (issue) => typeof issue === 'object' && 'message' in issue && 'path' in issue,
    )
  )
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp()
    const response = context.getResponse<FastifyReply>()
    const request = context.getRequest<FastifyRequest>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const payload = exception.getResponse()

      response.status(status).send({
        error: HttpStatus[status] ?? 'Error',
        message: typeof payload === 'string' ? payload : payload,
        path: request.url,
        statusCode: status,
        timestamp: new Date().toISOString(),
      })
      return
    }

    if (isZodError(exception)) {
      response.status(HttpStatus.BAD_REQUEST).send({
        error: 'Bad Request',
        message: exception.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        path: request.url,
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      })
      return
    }

    const message = exception instanceof Error ? exception.message : String(exception)
    this.logger.error(`Unhandled exception: ${message}`)

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
      path: request.url,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    })
  }
}
