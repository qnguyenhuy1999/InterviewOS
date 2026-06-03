import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'

export function generateOpaqueToken() {
  return randomBytes(32).toString('hex')
}

export function hashOpaqueToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function hashPassword(password: string): string {
  const salt = randomUUID()
  const derivedKey = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derivedKey}`
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, expected] = storedHash.split(':')
  if (!salt || !expected) {
    return false
  }

  const actual = scryptSync(password, salt, 64)
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'))
}
