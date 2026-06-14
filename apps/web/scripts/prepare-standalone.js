import { cpSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const standaloneDir = join(root, '.next', 'standalone', 'apps', 'web')
const staticSrc = join(root, '.next', 'static')
const staticDest = join(standaloneDir, '.next', 'static')
const publicSrc = join(root, 'public')
const publicDest = join(standaloneDir, 'public')

if (!existsSync(standaloneDir)) {
  console.error('Standalone output not found. Run `next build` first.')
  process.exit(1)
}

if (existsSync(staticSrc)) {
  mkdirSync(staticDest, { recursive: true })
  cpSync(staticSrc, staticDest, { recursive: true })
  console.log('Copied .next/static → standalone')
}

if (existsSync(publicSrc)) {
  mkdirSync(publicDest, { recursive: true })
  cpSync(publicSrc, publicDest, { recursive: true })
  console.log('Copied public → standalone')
}

console.log('Standalone build ready.')
