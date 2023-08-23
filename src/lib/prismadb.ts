import { PrismaClient } from '@prisma/client'

declare global {
  export var prisma: PrismaClient | undefined
}

const prismadb =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : undefined
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prismadb
}

export { prismadb }
