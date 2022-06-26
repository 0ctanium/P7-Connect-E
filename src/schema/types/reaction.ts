import {
  arg,
  extendType,
  inputObjectType,
  list,
  nonNull,
  objectType,
} from 'nexus';
import { getSession } from 'next-auth/react';
import { ApolloError, AuthenticationError } from 'apollo-server-micro';
import { Role } from '../../constants';

export const Reaction = objectType({
  name: 'Reaction',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('icon');

    t.nonNull.id('userId');
    t.field('userId', {
      type: 'User',
      resolve(root, args, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            id: root.authorId,
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
      type: 'Post',
      args: {
        post: nonNull('ID'),
        icon: nonNull('String'),
      },
      async resolve(root, args, ctx) {
        const session = await getSession(ctx);
        if (!session?.user?.id)
          throw new AuthenticationError('You must be authenticated');

        return ctx.prisma.post.create({
          data: {
            group: {
              connect: {
                id: args.group,
              },
            },
            author: {
              connect: {
                id: session.user.id,
              },
            },
            text: args.text,
            // media
          },
        });
      },
    });

    t.field('editPost', {
      type: 'Post',
      args: {
        post: nonNull('ID'),
        text: nonNull('String'),
        // media: arg({
        //   type: list('Upload'),
        // }),
      },
      async resolve(root, args, ctx) {
        const session = await getSession(ctx);
        if (!session?.user?.id)
          throw new AuthenticationError('You must be authenticated');

        const postToDelete = await ctx.prisma.post.findUnique({
          where: {
            id: args.post,
          },
        });

        if (!postToDelete) {
          throw new ApolloError('Post not found');
        }

        if (
          postToDelete.authorId !== session.user.id &&
          session.user.role !== Role.MODERATOR &&
          session.user.role !== Role.ADMIN
        ) {
          throw new ApolloError("You don't have the permission to do this");
        }

        return ctx.prisma.post.update({
          where: {
            id: args.post,
          },
          data: {
            text: args.text,
            // media
          },
        });
      },
    });

    t.field('deletePost', {
      type: 'ID',
      args: {
        post: nonNull('ID'),
      },
      async resolve(root, args, ctx) {
        const session = await getSession(ctx);
        if (!session?.user)
          throw new AuthenticationError('You must be authenticated');

        const postToDelete = await ctx.prisma.post.findUnique({
          where: {
            id: args.post,
          },
        });

        if (!postToDelete) {
          throw new ApolloError('Post not found');
        }

        if (
          postToDelete.authorId !== session.user.id &&
          session.user.role !== Role.MODERATOR &&
          session.user.role !== Role.ADMIN
        ) {
          throw new ApolloError("You don't have the permission to do this");
        }

        await ctx.prisma.post.delete({
          where: {
            id: args.post,
          },
        });
        return args.post;
      },
    });
  },
});
