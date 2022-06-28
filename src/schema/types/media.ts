import { objectType } from 'nexus';

export const Media = objectType({
  name: 'Media',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('mimeType');
    t.nonNull.string('encoding');
    t.nonNull.string('url');

    t.nonNull.id('addedById');
    t.field('addedBy', {
      type: 'User',
      resolve(root, args, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            id: root.userId,
          },
        });
      },
    });

    t.id('postId');
    t.field('post', {
      type: 'Post',
      resolve(root, args, ctx) {
        return ctx.prisma.post.findUnique({
          where: {
            id: root.postId,
          },
        });
      },
    });

    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
  },
});
