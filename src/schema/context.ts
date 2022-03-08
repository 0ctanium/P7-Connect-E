import { PrismaClient } from '@prisma/client'
import { MicroRequest } from 'apollo-server-micro/dist/types'
import { ServerResponse } from 'http'
import {ContextFunction} from "apollo-server-core";
import redis, {RedisClientType} from 'redis';

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  cache: RedisClientType
  res: ServerResponse
  req: MicroRequest
}

export const createContext: ContextFunction<Context> = ({ res, req }) => {
  const cache = redis.createClient();

  return { prisma, cache, res, req }
}
