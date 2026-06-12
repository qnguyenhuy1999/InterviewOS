import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoots = ['src', 'components']
const disallowedPatterns = [
  /gradient\(/,
  /bg-linear-to-[\w-]+/,
]

function getSourceFiles(dirPath: string): string[] {
  return readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      return getSourceFiles(entryPath)
    }

    if (!/\.(ts|tsx|css)$/.test(entry.name) || entry.name.endsWith('.test.ts')) {
      return []
    }

    return [entryPath]
  })
}

test('ui package source uses primitive color surfaces instead of gradients', () => {
  const offenders = sourceRoots.flatMap((sourceRoot) =>
    getSourceFiles(path.join(rootDir, sourceRoot)).flatMap((filePath) => {
      const contents = readFileSync(filePath, 'utf8')

      return disallowedPatterns.some((pattern) => pattern.test(contents))
        ? [path.relative(rootDir, filePath)]
        : []
    }),
  )

  assert.deepEqual(offenders, [])
})
