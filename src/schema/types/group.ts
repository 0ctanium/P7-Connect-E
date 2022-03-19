import {extendType, inputObjectType, nonNull, objectType} from "nexus";
import {Prisma} from "@prisma/client";
import path from "path";
import * as fs from "fs";
import {s3} from "../../services/s3";
import {ManagedUpload} from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.description()
    t.model.privacy()
    t.model.official()

    t.model.onlyAdminCanPublish()
    t.model.postNeedToBeApproved()
    t.model.everyOneCanApproveMembers()

    t.model.banner()

    t.model.members({
      filtering: true,
      pagination: true,
    })

    t.int('memberCount', {
      resolve(root, args, ctx) {
        return ctx.prisma.groupMember.count({
          where: {
            groupId: root.id
          }
        })
      }
    })

    t.model.posts()

    t.model.archived()


    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const GroupQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.group()
    t.crud.groups({
      pagination: true,
      filtering: true,
      // ordering: true,
    })
    t.field('groupCount', {
      type: "Int",
      args: {
        where: "GroupWhereInput"
      },
      resolve(root, args, ctx, info) {
        return ctx.prisma.user.count({
          where: args.where as Prisma.GroupWhereInput
        })
      }
    })
  },
})

export const GroupUpdateInput = inputObjectType({
  name: 'GroupUpdateInput',
  definition(t) {
    t.string('name')
    t.string('description')
    t.field('privacy', { type: 'GroupPrivacy' })
    t.boolean('everyOneCanApproveMembers')
    t.boolean('postNeedToBeApproved')
    t.boolean('onlyAdminCanPublish')
    t.field('banner', { type: "Upload" })
  }
})


export const GroupMutations = extendType({
  type: 'Mutation',
  definition: (t) => {

    t.crud.createOneGroup({
      computedInputs: {
        id: () => undefined,
        archived: () => undefined,

        members: () => undefined,
        posts: () => undefined,
        medias: () => undefined,
      }
    })
    t.field('updateOneGroup', {
      type: 'Group',
      args: {
        data: nonNull(GroupUpdateInput),
        where: nonNull("GroupWhereInput")
      },
      async resolve(root, { where, data }, ctx) {
        const data = await new Promise<SendData>(((resolve, reject) => {
          const { createReadStream, filename } = args.data.banner;
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

        console.log(data)

        ctx.prisma.group.update({
          where,
          data: {
            ...data,
            banner: data.banner && ({

            })
          }
        })


        return null
      }
    })
    // t.crud.updateOneGroup({
    //   computedInputs: {
    //     id: () => undefined,
    //
    //     members: () => undefined,
    //     posts: () => undefined,
    //     medias: () => undefined,
    //   }
    // })

    t.crud.deleteOneGroup()
    t.crud.deleteManyGroup()
  },
})
