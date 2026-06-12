import path from 'path'

export function resolveApiEnvFilePath(currentDir = __dirname): string {
  return path.resolve(currentDir, '../../../.env')
}

export const apiEnvFilePath = resolveApiEnvFilePath(__dirname)
