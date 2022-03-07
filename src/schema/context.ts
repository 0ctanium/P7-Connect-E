import { PrismaClient } from '@prisma/client'
import { MicroRequest } from 'apollo-server-micro/dist/types'
import { ServerResponse } from 'http'
import {ContextFunction} from "apollo-server-core";

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  res: ServerResponse
  req: MicroRequest
}

export const createContext: ContextFunction<Context> = ({ res, req }) => {
  return { prisma, res, req }
}