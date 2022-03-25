import { PrismaClient } from '@prisma/client'
import { MicroRequest } from 'apollo-server-micro/dist/types'
import { ServerResponse } from 'http'
import {ContextFunction} from "apollo-server-core";
import {redis} from "services/redis";
import Redis from "ioredis";


const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  cache: Redis.Redis
  res: ServerResponse
  req: MicroRequest
}

export const createContext: ContextFunction<Context> = async ({ res, req }) => {
  const cache = redis()

  return { prisma, cache, res, req }
}
