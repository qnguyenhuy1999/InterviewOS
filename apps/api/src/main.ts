import 'reflect-metadata'

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: 1 }),
  )
  await app.register(fastifyCookie)
  await app.register(fastifyMultipart, {
    limits: {
      files: 1,
      fileSize: 5 * 1024 * 1024,
    },
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new LoggingInterceptor())
  const configService = app.get(ConfigService)
  const corsOrigin = configService.get<string>('app.webAppUrl')
  if (!corsOrigin || corsOrigin === '*') {
    logger.error('app.webAppUrl is not configured or set to wildcard — refusing to start')
    process.exit(1)
  }
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  const env = configService.get<string>('app.env', 'development')
  if (env !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('InterviewOS API')
      .setDescription('REST API for InterviewOS local development and integration testing.')
      .setVersion('0.1.0')
      .addCookieAuth('interviewos_session')
      .build()
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
      deepScanRoutes: true,
    })
    SwaggerModule.setup('swagger', app, swaggerDocument, {
      jsonDocumentUrl: 'swagger/json',
    })
    await persistSwaggerDocument(swaggerDocument, logger)
  }

  const port = configService.get<number>('port', 3001)
  await app.listen(port, '0.0.0.0')
  if (env !== 'production') {
    logger.log(`Swagger UI available at http://localhost:${port}/swagger`)
    logger.log(`Swagger JSON available at http://localhost:${port}/swagger/json`)
  }
}

void bootstrap()

async function persistSwaggerDocument(document: object, logger: Logger) {
  try {
    const outputDirectory = path.resolve(__dirname, '../openapi')
    await mkdir(outputDirectory, { recursive: true })
    await writeFile(
      path.join(outputDirectory, 'swagger.json'),
      JSON.stringify(document, null, 2),
      'utf8',
    )
  } catch (err) {
    logger.warn(
      `Could not persist swagger.json: ${err instanceof Error ? err.message : String(err)}`,
    )
  }
}
