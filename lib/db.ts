import { PrismaClient, Prisma } from '@prisma/client';

/**
 * PrismaClient is attached to `global` object in development to prevent
 * exhausting database connection limit
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prismaClient =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;

export { prismaClient, Prisma };
