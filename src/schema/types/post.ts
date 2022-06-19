import {arg, extendType, inputObjectType, list, nonNull, objectType} from "nexus";
import {getSession} from "next-auth/react";
import {s3} from "../../services/s3";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;
import {AuthenticationError} from "apollo-server-micro";

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.id("id")

    t.nonNull.string("text")
    // t.list.string("media")

    t.nonNull.id('authorId')
    t.field('author', {
      type: 'User',
      resolve(root, args, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            id: root.authorId
          }
        })
      }
    })

    t.nonNull.id('groupId')
    t.field('group', {
      type: 'Group',
      resolve(root, args, ctx) {
        return ctx.prisma.group.findUnique({
          where: {
            id: root.groupId
          }
        })
      }
    })

    t.nonNull.field('createdAt', { type: "DateTime" })
    t.nonNull.field('updatedAt', { type: "DateTime" })
  },
})

export const PostWhereInput = inputObjectType({
  name: 'PostWhereInput',
  definition(t) {
    t.id('group')
    t.id('user')
  }
})

export const PostQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('post', {
      type: 'Post',
      args: {
        id: 'ID'
      },
      resolve(root, args, ctx) {
        return ctx.prisma.post.findUnique({
          where: {
            id: args.id || undefined
          }
        })
      }
    })

    t.field('posts', {
      type: nonNull(list(nonNull("Post"))),
      args: {
        where: PostWhereInput,
        take: arg({ type: "Int", default: 20 }),
        cursor: "ID"
      },
      resolve(root, { where, take, cursor }, ctx) {
        return ctx.prisma.post.findMany({
          skip: cursor ? 1 : undefined,
          take: take || undefined,
          cursor: cursor ? {
            id: cursor
          } : undefined,
          where: {
            groupId: where?.group || undefined,
            authorId: where?.user || undefined,
          },
          orderBy: {
            createdAt: 'desc',
          }
        })
      }
    })



    t.field('postCount', {
      type: "Int",
      args: {
        where: PostWhereInput,
      },
      resolve(root, args, ctx) {
        return ctx.prisma.user.count()
      }
    })
  }
})

export const PostMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createPost', {
      type: 'Post',
      args: {
        group: nonNull("ID"),
        text: nonNull("String"),
        media: arg({
          type: list("Upload")
        })
      },
      async resolve(root, args, ctx) {
        const session = await getSession(ctx)
        if(!session?.user?.id) throw new AuthenticationError("You must be authenticated")

        // let media = undefined
        // if(args.media) {
        //   media = await Promise.all(args.media.map(async (m) => {
        //     const { createReadStream, filename } = await m;
        //     const d = await new Promise<SendData>(((resolve, reject) => {
        //       s3.upload({
        //         Bucket: process.env.OWN_AWS_BUCKET_NAME,
        //         Key: filename,
        //         Body: createReadStream()
        //       }, (err: Error, data: SendData) => {
        //         if (err) {
        //           reject(err)
        //         }
        //         resolve(data)
        //       })
        //     }))
        //     return d.Location
        //   }))
        // }



        return ctx.prisma.post.create({
          data: {
            group: {
              connect: {
                id: args.group
              }
            },
            author: {
              connect: {
                id: session.user.id
              }
            },
            text: args.text,
            // media
          }
        })
      }
    })
  },
})
