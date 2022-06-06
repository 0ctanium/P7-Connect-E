import {objectType, extendType, nonNull, inputObjectType, list, arg} from 'nexus'
import {Prisma} from "@prisma/client";
import {ApolloError} from "apollo-server-micro";

export const Account = objectType({
  name: 'Account',
  definition(t) {
    t.nonNull.string('provider')

    t.nonNull.field('createdAt', { type: 'DateTime' })
  },
})

const aliveTimout = 5 * 60 * 1000 // 5 minutes
export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id')
    t.string('name')
    t.string('image')
    t.nonNull.field('role', { type: "Role" })
    t.string('email')
    t.field('emailVerified', { type: "DateTime" })
    t.field('accounts', {
      type: nonNull(list(Account)),
      resolve(root, args, ctx) {
        return ctx.prisma.account.findMany({
          where: {
            userId: root.id
          }
        })
      }
    })

    t.nonNull.boolean('online', {
      async resolve(root, args, ctx) {
        const now = new Date()

        const alive = await ctx.cache.get(`session:${root.id}`)
        // if the last time user alive was set is prior than the aliveTimeout, display the user as offline
        return !!(alive && now.getTime() - aliveTimout < parseInt(alive))
      }
    })

    // Relations
    // t.field('posts', {
    //   type: nonNull(list("Post")),
    //   args: {
    //     skip: arg({ type: "Int", default: 0 }),
    //     take: arg({ type: "Int", default: 20 }),
    //     cursor: "ID"
    //   },
    //   resolve(root, { skip, take, cursor }, ctx) {
    //     if(take && take > 100) {
    //       throw new ApolloError("You cannot take more than 100 items")
    //     }
    //
    //     return ctx.prisma.post.findMany({
    //       skip: skip || undefined,
    //       take: take || undefined,
    //       cursor: cursor ? {
    //         id: cursor
    //       } : undefined,
    //       where: {
    //         authorId: root.id || undefined
    //       }
    //     })
    //   }
    // })

    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
  },
})

export const UserQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('user', {
      type: User,
      args: {
        id: 'ID'
      },
      resolve(root, args, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            id: args.id || undefined
          }
        })
      }
    })

    t.field('users', {
      type: nonNull(list(nonNull(User))),
      args: {
        skip: arg({ type: "Int", default: 0 }),
        take: arg({ type: "Int", default: 20 }),
        cursor: "ID"
      },
      resolve(root, { skip, take, cursor }, ctx) {
        if(take && take > 100) {
          throw new ApolloError("You cannot take more than 100 items")
        }

        return ctx.prisma.user.findMany({
          skip: skip || undefined,
          take: take || undefined,
          cursor: cursor ? {
            id: cursor
          } : undefined
        })
      }
    })

    t.field('userCount', {
      type: "Int",
      resolve(root, args, ctx) {
        return ctx.prisma.user.count()
      }
    })
  },
})

export const UserUpdateInput = inputObjectType({
  name: 'UserUpdateInput',
  definition(t) {
    t.field('role', { type: 'Role' })
    t.string('name')
  }
})

export const UserMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('updateOneUser', {
      type: User,
      args: {
        id: nonNull('ID'),
        data: nonNull(UserUpdateInput)
      },
      resolve(root, { id, data }, ctx) {
        return ctx.prisma.user.update({
          where: {
            id
          },
          data: data as Prisma.UserUpdateInput
        })
      }
    })

    t.field('deleteOneUser', {
      type: 'User',
      args: {
        id: nonNull("ID")
      },
      resolve(root, args, ctx) {
        return ctx.prisma.user.delete({
          where: {
            id: args.id
          }
        })
      }
    })

    t.field('deleteManyUser', {
      type: "AffectedRowsOutput",
      args: {
        id: nonNull(list(nonNull("ID")))
      },
      resolve(root, args, ctx) {
        return ctx.prisma.user.deleteMany({
          where: {
            id: {
              in: args.id || undefined
            }
          }
        })
      }
    })
  },
})
