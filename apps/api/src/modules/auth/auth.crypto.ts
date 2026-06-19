import { createHash, randomBytes, randomUUID, scrypt, scryptSync, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

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
  const expectedBuffer = Buffer.from(expected, 'hex')
  if (expectedBuffer.length !== actual.length) {
    return false
  }

  return timingSafeEqual(actual, expectedBuffer)
}

export async function hashPasswordAsync(password: string): Promise<string> {
  const salt = randomUUID()
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPasswordAsync(password: string, storedHash: string): Promise<boolean> {
  const [salt, expected] = storedHash.split(':')
  if (!salt || !expected) {
    return false
  }

  try {
    const actual = (await scryptAsync(password, salt, 64)) as Buffer
    const expectedBuffer = Buffer.from(expected, 'hex')
    if (expectedBuffer.length !== actual.length) {
      return false
    }

    return timingSafeEqual(actual, expectedBuffer)
  } catch {
    return false
  }
}
