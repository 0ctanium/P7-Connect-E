import { PrismaClient } from '@prisma/client'
import { MicroRequest } from 'apollo-server-micro/dist/types'
import { ServerResponse } from 'http'
import {ContextFunction} from "apollo-server-core";
import {RedisClientType, createClient} from 'redis';

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  cache: RedisClientType
  res: ServerResponse
  req: MicroRequest
}

export const createContext: ContextFunction<Context> = async ({ res, req }) => {
  const cache = createClient();

  cache.on('error', (err) => console.error('Redis Client Error', err));

  await cache.connect();

  return { prisma, cache, res, req }
}
