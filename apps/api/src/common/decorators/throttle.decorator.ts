import { Throttle } from '@nestjs/throttler'

export const AuthThrottle = () => Throttle({ auth: { ttl: 60_000, limit: 10 } })
export const AiThrottle = () => Throttle({ ai: { ttl: 60_000, limit: 20 } })
