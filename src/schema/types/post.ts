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
import { Role } from 'constants/role';
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

export const PostList = objectType({
  name: 'PostList',
  definition(t) {
    t.id('nextCursor');
    t.field('data', {
      type: nonNull(list(nonNull('Post'))),
    });
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
      type: nonNull('PostList'),
      args: {
        where: PostWhereInput,
        take: arg({ type: 'Int', default: 10 }),
        cursor: 'ID',
        cursorDirection: arg({ type: 'CursorDirection', default: 'after' }),
      },
      async resolve(root, { where, take, cursor, cursorDirection }, ctx) {
        const posts = await ctx.prisma.post.findMany({
          take: take! + 1,
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
            createdAt: cursorDirection === 'after' ? 'desc' : 'asc',
          },
        });

        const [lastPost] = posts.splice(take!, 1);
        return {
          nextCursor: lastPost?.id ? lastPost.id : null,
          data: posts,
        };
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

        const create: Prisma.PostCreateArgs = {
          data: {
            group: {
              connect: {
                id: args.group,
              },
            },
            author: {
              connect: {
                id: session!.user.id,
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
                addedById: session!.user.id,
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

        const postToUpdate = await ctx.prisma.post.findUnique({
          where: {
            id: args.post,
          },
        });

        if (!postToUpdate) {
          throw new ApolloError('Post not found');
        }

        if (postToUpdate.authorId !== session!.user.id && !ctx.superUser) {
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
        const user = session!.user;

        const postToDelete = await ctx.prisma.post.findUnique({
          where: {
            id: args.post,
          },
        });

        if (!postToDelete) {
          throw new ApolloError('Post not found');
        }

        if (
          postToDelete.authorId !== user.id &&
          user.role !== Role.MODERATOR &&
          user.role !== Role.ADMIN &&
          !ctx.superUser
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
