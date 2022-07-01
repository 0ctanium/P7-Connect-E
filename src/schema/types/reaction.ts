import { extendType, nonNull, objectType } from 'nexus';
import { getSession } from 'next-auth/react';

export const Reaction = objectType({
  name: 'Reaction',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('icon');

    t.nonNull.id('userId');
    t.field('user', {
      type: 'User',
      resolve(root, args, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            id: root.userId,
          },
        });
      },
    });

    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
  },
});

export const ReactionMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('setPostReaction', {
      type: 'Reaction',
      args: {
        post: nonNull('ID'),
        icon: nonNull('String'),
      },
      async resolve(root, args, ctx) {
        const session = await getSession(ctx);

        return ctx.prisma.reaction.upsert({
          where: {
            postId_userId: {
              postId: args.post,
              userId: session!.user.id,
            },
          },
          create: {
            post: {
              connect: {
                id: args.post,
              },
            },
            user: {
              connect: {
                id: session!.user.id,
              },
            },
            icon: args.icon,
          },
          update: {
            icon: args.icon,
          },
        });
      },
    });

    t.field('removePostReaction', {
      type: 'Reaction',
      args: {
        post: nonNull('ID'),
      },
      async resolve(root, args, ctx) {
        const session = await getSession(ctx);

        return ctx.prisma.reaction.delete({
          where: {
            postId_userId: {
              postId: args.post,
              userId: session!.user.id,
            },
          },
        });
      },
    });
  },
});
