import { z } from 'zod'

const booleanEnvSchema = z
  .preprocess(
    (value) => (typeof value === 'string' ? value.trim().toLowerCase() : value),
    z.union([z.boolean(), z.enum(['true', 'false', '1', '0'])]),
  )
  .transform((value) => value === true || value === 'true' || value === '1')

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  AUTH_COOKIE_NAME: z.string().min(1).default('interviewos_session'),
  AUTH_SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(30).default(7),
  PASSWORD_RESET_TTL_MINUTES: z.coerce.number().int().min(5).max(1440).default(30),
  EMAIL_VERIFICATION_TTL_HOURS: z.coerce.number().int().min(1).max(168).default(24),
  WEB_APP_URL: z.string().url().default('http://localhost:3000'),
  EMAIL_PROVIDER: z.enum(['console', 'noop']).default('console'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_GATEWAY_BASE_URL: z.string().url().optional(),
  OPENAI_MODEL: z.string().min(1).default('gpt-5.4-mini'),
  OPENAI_ORGANIZATION: z.string().min(1).optional(),
  OPENAI_PROJECT: z.string().min(1).optional(),
  AI_PROVIDER: z.enum(['mock', 'openai']).default('mock'),
  AI_OBSERVABILITY_ENABLED: booleanEnvSchema.default(false),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export type Env = z.infer<typeof envSchema>
