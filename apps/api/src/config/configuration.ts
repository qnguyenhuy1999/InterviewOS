import { envSchema } from '@interviewos/config'

export default () => {
  const parsed = envSchema.parse(process.env)

  return {
    ai: {
      provider: parsed.AI_PROVIDER,
    },
    app: {
      env: parsed.NODE_ENV,
      jwtSecret: parsed.JWT_SECRET,
    },
    database: {
      url: parsed.DATABASE_URL,
    },
    port: 3001,
    redis: {
      url: parsed.REDIS_URL,
    },
  }
}
