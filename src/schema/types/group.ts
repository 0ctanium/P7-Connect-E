import {arg, extendType, inputObjectType, list, nonNull, objectType} from "nexus";
import { Prisma } from "@prisma/client";
import {s3} from "services/s3";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;
import {ApolloError} from "apollo-server-micro";

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('name')
    t.string('description')
    t.nonNull.field('privacy', { type: "GroupPrivacy" })
    t.nonNull.boolean('official')

    t.nonNull.boolean('onlyAdminCanPublish')
    t.nonNull.boolean('postNeedToBeApproved')
    t.nonNull.boolean('everyOneCanApproveMembers')

    t.string('banner')

    t.nonNull.field('members', {
      type: list(nonNull("GroupMember")),
      args: {
        skip: arg({ type: "Int", default: 0 }),
        take: arg({ type: "Int", default: 20 }),
        cursor: "ID"
      },
      resolve(root, { skip, take, cursor }, ctx) {
        if(take && take > 100) {
          throw new ApolloError("You cannot take more than 100 items")
        }

        return ctx.prisma.groupMember.findMany({
          skip: skip || undefined,
          take: take || undefined,
          cursor: cursor ? {
            groupId_userId: {
              groupId: root.id,
              userId: cursor,
            }
          } : undefined,
          where: {
            groupId: root.id
          },
        })
      }
    })

    t.nonNull.int('memberCount', {
      resolve(root, args, ctx) {
        return ctx.prisma.groupMember.count({
          where: {
            groupId: root.id
          }
        })
      }
    })

    t.nonNull.field('posts', {
      type: list(nonNull("Post")),
      args: {
        skip: arg({ type: "Int", default: 0 }),
        take: arg({ type: "Int", default: 20 }),
        cursor: "ID"
      },
      resolve(root, { skip, take, cursor }, ctx) {
        if(take && take > 100) {
          throw new ApolloError("You cannot take more than 100 items")
        }

        return ctx.prisma.post.findMany({
          skip: skip || undefined,
          take: take || undefined,
          cursor: cursor ? {
            id: cursor
          } : undefined,
          where: {
            groupId: root.id
          },
        })
      }
    })

    t.boolean('archived')

    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})

export const GroupQueries = extendType({
  type: 'Query',
  definition: (t) => {

    t.field('group', {
      type: 'Group',
      args: {
        id: 'ID'
      },
      resolve(root, args, ctx) {
        return ctx.prisma.group.findUnique({
          where: {
            id: args.id || undefined
          }
        })
      }
    })

    t.field('groups', {
      type: nonNull(list(nonNull("Group"))),
      args: {
        skip: arg({ type: "Int", default: 0 }),
        take: arg({ type: "Int", default: 20 }),
        cursor: "ID"
      },
      resolve(root, { skip, take, cursor }, ctx) {
        if(take && take > 100) {
          throw new ApolloError("You cannot take more than 100 items")
        }

        return ctx.prisma.group.findMany({
          skip: skip || undefined,
          take: take || undefined,
          cursor: cursor ? {
            id: cursor
          } : undefined,
        })
      }
    })

    t.field('groupCount', {
      type: nonNull("Int"),
      resolve(root, args, ctx) {
        return ctx.prisma.group.count()
      }
    })
  },
})


export const GroupCreateInput = inputObjectType({
  name: 'GroupCreateInput',
  definition(t) {
    t.nonNull.string('name')
    t.string('description')
    t.nonNull.field('privacy', { type: "GroupPrivacy" })

    t.boolean('official', { default: false })
    t.boolean('everyOneCanApproveMembers')
    t.boolean('postNeedToBeApproved')
    t.boolean('onlyAdminCanPublish')
    t.field('banner', { type: "Upload" })
  }
})

export const GroupUpdateInput = inputObjectType({
  name: 'GroupUpdateInput',
  definition(t) {
    t.string('name')
    t.string('description')
    t.field('privacy', { type: "GroupPrivacy" })
    t.boolean('official')
    t.boolean('archived')
    t.boolean('everyOneCanApproveMembers')
    t.boolean('postNeedToBeApproved')
    t.boolean('onlyAdminCanPublish')
    t.field('banner', { type: "Upload" })
  }
})


export const GroupMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createOneGroup', {
      type: 'Group',
      args: {
        data: nonNull(GroupCreateInput),
      },
      async resolve(root, { data }, ctx) {
        if(data.banner) {
          const { createReadStream, filename } = await data.banner;
          const d = await new Promise<SendData>(((resolve, reject) => {
            s3.upload({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: filename,
              Body: createReadStream()
            }, (err: Error, data: SendData) => {
              if (err) {
                reject(err)
              }
              resolve(data)
            })
          }))
          data.banner = d.Location
        }

        return ctx.prisma.group.create({
          data: data as Prisma.GroupCreateInput,
        })
      }
    })

    t.field('updateOneGroup', {
      type: 'Group',
      args: {
        data: nonNull(GroupUpdateInput),
        id: nonNull("ID")
      },
      async resolve(root, { id, data }, ctx) {
        if(data.banner) {
          const { createReadStream, filename } = await data.banner;
          const d = await new Promise<SendData>(((resolve, reject) => {
            s3.upload({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: filename,
              Body: createReadStream()
            }, (err: Error, data: SendData) => {
              if (err) {
                reject(err)
              }
              resolve(data)
            })
          }))
          data.banner = d.Location
        }

        return ctx.prisma.group.update({
          where: {
            id
          },
          data: data as Prisma.GroupUpdateInput,
        })
      }
    })
  },
})
