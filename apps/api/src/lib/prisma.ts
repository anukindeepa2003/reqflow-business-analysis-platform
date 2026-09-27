import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';

const globalForPrisma = globalThis as unknown as {
  reqflowPrisma?: PrismaClient;
};

export const prisma = globalForPrisma.reqflowPrisma ?? new PrismaClient();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.reqflowPrisma = prisma;
}
