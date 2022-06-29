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
import { uploadMedia } from '../../lib/media';
import { Prisma } from '@prisma/client';

export const ReactionCount = objectType({
  name: 'ReactionCount',
  definition(t) {
    t.nonNull.string('icon');
    t.nonNull.int('_count');
  },
});

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.id('id');

    t.nonNull.string('text');
    // t.list.string("media")

    t.nonNull.field('reactionCount', {
      type: list(nonNull(ReactionCount)),
      async resolve(root, args, ctx) {
        // @ts-expect-error
        return ctx.prisma.reaction.groupBy({
          where: {
            postId: root.id,
          },
          by: ['icon'],
          _count: true,
        });
      },
    });

    t.field('viewerReaction', {
      type: 'Reaction',
      async resolve(root, args, ctx) {
        const session = await getSession(ctx);
        if (!session?.user?.id)
          throw new AuthenticationError('You must be authenticated');

        return ctx.prisma.reaction.findUnique({
          where: {
            postId_userId: {
              postId: root.id,
              userId: session.user.id,
            },
          },
        });
      },
    });

    t.field('media', {
      type: nonNull(list(nonNull('Media'))),
      resolve(root, args, ctx) {
        return ctx.prisma.media.findMany({
          where: {
            postId: root.id,
          },
        });
      },
    });

    t.nonNull.id('authorId');
    t.field('author', {
      type: 'User',
      resolve(root, args, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            id: root.authorId,
          },
        });
      },
    });

    t.nonNull.id('groupId');
    t.field('group', {
      type: 'Group',
      resolve(root, args, ctx) {
        return ctx.prisma.group.findUnique({
          where: {
            id: root.groupId,
          },
        });
      },
    });

    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
  },
});

export const PostWhereInput = inputObjectType({
  name: 'PostWhereInput',
  definition(t) {
    t.id('group');
    t.id('user');
  },
});

export const PostQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('post', {
      type: 'Post',
      args: {
        id: 'ID',
      },
      resolve(root, args, ctx) {
        return ctx.prisma.post.findUnique({
          where: {
            id: args.id || undefined,
          },
        });
      },
    });

    t.field('posts', {
      type: nonNull(list(nonNull('Post'))),
      args: {
        where: PostWhereInput,
        take: arg({ type: 'Int', default: 20 }),
        cursor: 'ID',
      },
      resolve(root, { where, take, cursor }, ctx) {
        return ctx.prisma.post.findMany({
          skip: cursor ? 1 : undefined,
          take: take || undefined,
          cursor: cursor
            ? {
                id: cursor,
              }
            : undefined,
          where: {
            groupId: where?.group || undefined,
            authorId: where?.user || undefined,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      },
    });

    t.field('postCount', {
      type: 'Int',
      args: {
        where: PostWhereInput,
      },
      resolve(root, args, ctx) {
        return ctx.prisma.user.count();
      },
    });
  },
});

export const PostMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createPost', {
      type: 'Post',
      args: {
        group: nonNull('ID'),
        text: nonNull('String'),
        media: arg({
          type: list('Upload'),
        }),
      },
      async resolve(root, args, ctx) {
        const session = await getSession(ctx);
        if (!session?.user?.id)
          throw new AuthenticationError('You must be authenticated');

        const create: Prisma.PostCreateArgs = {
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
          },
        };

        if (args.media) {
          const media = await Promise.all(
            args.media.map((m) => uploadMedia(m, 'posts'))
          );

          create.data.medias = {
            createMany: {
              data: media.map((m) => ({
                addedById: session?.user?.id,
                encoding: m.file.encoding,
                mimeType: m.file.mimetype,
                url: m.bucket.Location,
              })),
            },
          };
        }

        return ctx.prisma.post.create(create);
      },
    });

    t.field('editPost', {
      type: 'Post',
      args: {
        post: nonNull('ID'),
        text: nonNull('String'),
      },
      async resolve(root, args, ctx) {
        const session = await getSession(ctx);
        if (!session?.user?.id)
          throw new AuthenticationError('You must be authenticated');

        const postToUpdate = await ctx.prisma.post.findUnique({
          where: {
            id: args.post,
          },
        });

        if (!postToUpdate) {
          throw new ApolloError('Post not found');
        }

        if (
          postToUpdate.authorId !== session.user.id &&
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
