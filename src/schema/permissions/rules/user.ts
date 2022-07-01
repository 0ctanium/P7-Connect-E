import { getSession } from 'next-auth/react';
import { rule } from 'graphql-shield';
import { Role } from 'constants/role';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { checkSessionAuthenticated, checkSessionRole } from 'lib/session';

type Ctx = { req: MicroRequest };

export const user = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return checkSessionAuthenticated(await getSession(ctx));
  }
);

export const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return checkSessionRole(await getSession(ctx), Role.ADMIN);
  }
);

export const isModerator = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return checkSessionRole(await getSession(ctx), Role.MODERATOR);
  }
);
