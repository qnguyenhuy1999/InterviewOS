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
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
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
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: false,
      forbidUnknownValues: true,
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new LoggingInterceptor())
  const configService = app.get(ConfigService)
  app.enableCors({
    origin: configService.get<string>('app.webAppUrl', 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

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
  await persistSwaggerDocument(swaggerDocument)

  const port = configService.get<number>('port', 3001)
  await app.listen(port, '0.0.0.0')
  logger.log(`Swagger UI available at http://localhost:${port}/swagger`)
  logger.log(`Swagger JSON available at http://localhost:${port}/swagger/json`)
}

void bootstrap()

async function persistSwaggerDocument(document: object) {
  const outputDirectory = path.resolve(__dirname, '../openapi')
  await mkdir(outputDirectory, { recursive: true })
  await writeFile(
    path.join(outputDirectory, 'swagger.json'),
    JSON.stringify(document, null, 2),
    'utf8',
  )
}
