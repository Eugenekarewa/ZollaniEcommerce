import { PrismaClient } from '@prisma/client';

// Prevent multiple Prisma instances during Next.js hot-reload
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  });
}

export const db: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
