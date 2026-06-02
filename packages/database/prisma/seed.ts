import { prisma } from '../src/client'

async function main() {
  console.log('Prisma seed placeholder: no seed data configured.')
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
