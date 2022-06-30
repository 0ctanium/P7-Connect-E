import { PrismaClient } from '@prisma/client/edge';

export const prisma = global.prisma || new PrismaClient();
export default prisma;

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
