import { MicroRequest } from 'apollo-server-micro/dist/types'
import { ServerResponse } from 'http'
import {ContextFunction} from "apollo-server-core";
import redis from "services/redis";
import prisma from "services/prisma";

export interface Context {
  prisma: typeof prisma
  cache: typeof redis
  res: ServerResponse
  req: MicroRequest
}

export const createContext: ContextFunction<Context> = async ({ res, req }) => {
  const cache = redis

  return { prisma, cache, res, req }
}
