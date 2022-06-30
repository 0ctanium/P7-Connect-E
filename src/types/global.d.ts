import { PrismaClient } from '@prisma/client/edge';
import Redis from 'ioredis';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  var redis: Redis.Redis | undefined;
}
