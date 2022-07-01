import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
import { ContextFunction } from 'apollo-server-core';
import { redis } from 'services/redis';
import { prisma } from 'services/prisma';

export interface Context {
  /**
   * bypass graphql-shield rules
   */
  superUser?: boolean;

  prisma: typeof prisma;
  cache: typeof redis;
  res?: ServerResponse;
  req?: MicroRequest;
}

export const createApolloContext: ContextFunction<
  Partial<Context> | null
> = async (ctx) => {
  const { res, req, superUser = false } = ctx || {};
  const cache = redis;

  return { prisma, cache, res, req, superUser };
};
