import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  AUTH_COOKIE_NAME: z.string().min(1).default('interviewos_session'),
  AUTH_SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(30).default(7),
  WEB_APP_URL: z.string().url().default('http://localhost:3000'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_GATEWAY_BASE_URL: z.string().url().optional(),
  OPENAI_MODEL: z.string().min(1).default('gpt-5.4-mini'),
  OPENAI_ORGANIZATION: z.string().min(1).optional(),
  OPENAI_PROJECT: z.string().min(1).optional(),
  AI_PROVIDER: z.enum(['mock', 'openai']).default('mock'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export type Env = z.infer<typeof envSchema>
