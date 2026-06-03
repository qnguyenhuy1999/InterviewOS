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
      authCookieName: parsed.AUTH_COOKIE_NAME,
      authSessionTtlDays: parsed.AUTH_SESSION_TTL_DAYS,
      webAppUrl: parsed.WEB_APP_URL,
    },
    database: {
      url: parsed.DATABASE_URL,
    },
    openai: {
      apiKey: parsed.OPENAI_API_KEY,
      gatewayBaseUrl: parsed.OPENAI_GATEWAY_BASE_URL,
      model: parsed.OPENAI_MODEL,
      organization: parsed.OPENAI_ORGANIZATION,
      project: parsed.OPENAI_PROJECT,
    },
    port: 3001,
    redis: {
      url: parsed.REDIS_URL,
    },
  }
}
