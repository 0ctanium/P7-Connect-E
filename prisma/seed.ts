import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function main() {
  try {
    console.info(`Start seeding ...`)

    // seed...

    console.info(`Seeding finished.`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
