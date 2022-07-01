import { getSession } from 'next-auth/react';
import { rule } from 'graphql-shield';
import { Role } from 'constants/role';
import { checkSessionAuthenticated, checkSessionRole } from 'lib/session';

export const user = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return ctx.superUser || checkSessionAuthenticated(await getSession(ctx));
  }
);

export const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return ctx.superUser || checkSessionRole(await getSession(ctx), Role.ADMIN);
  }
);

export const isModerator = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return (
      ctx.superUser || checkSessionRole(await getSession(ctx), Role.MODERATOR)
    );
  }
);
