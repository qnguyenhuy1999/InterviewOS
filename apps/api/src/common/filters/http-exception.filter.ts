import {
  ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import type { FastifyReply, FastifyRequest } from 'fastify'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
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

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
      path: request.url,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    })
  }
}
