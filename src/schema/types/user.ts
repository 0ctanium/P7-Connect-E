import {objectType, extendType, enumType, nonNull, inputObjectType} from 'nexus'
import { Role } from "constants/role";
import { AccountProvider as Providers } from "constants/provider";
import {Prisma} from "@prisma/client";

export const RoleEnum = enumType({
  name: 'Role',
  members: Object.values(Role)
})

export const AccountProvider = enumType({
  name: 'AccountProvider',
  members: Object.values(Providers)
})

const aliveTimout = 5 * 60 * 1000 // 5 minutes
export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.image()
    t.model.role()
    t.model.email()
    t.model.emailVerified()
    t.model.accounts({
      filtering: false,
      pagination: false
    })
    t.boolean('online', {
      async resolve(root, args, ctx) {
        const now = new Date()

        const alive = await ctx.cache.get(`session:${root.id}`)
        // if the last time user alive was set is prior than the aliveTimeout, display the user as offline
        return !!(alive && now.getTime() - aliveTimout < parseInt(alive))
      }
    })
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const Account = objectType({
  name: 'Account',
  definition(t) {
    t.model.id()
    t.model.provider({
      description: `Values: ${Object.values(Providers).join(', ')}`
    })
    t.model.createdAt()
    t.model.updatedAt()
    t.model.user()
  },
})

export const UserQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.crud.user()
    t.crud.users({
      filtering: true,
      pagination: true
    })
    t.field('userCount', {
      type: "Int",
      args: {
        where: "UserWhereInput"
      },
      resolve(root, args, ctx, info) {
        return ctx.prisma.user.count({
          where: args.where as Prisma.UserWhereInput
        })
      }
    })
  },
})

export const UserUpdateInput = inputObjectType({
  name: 'UserUpdateInput',
  definition(t) {
    t.field('role', { type: RoleEnum })
    t.string('name')
  }
})

export const UserMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('updateOneUser', {
      type: "User",
      args: {
        where: nonNull('UserWhereUniqueInput'),
        data: nonNull(UserUpdateInput)
      },
      resolve(root, { where, data }, ctx, info) {
        return ctx.prisma.user.update({
          where: where as Prisma.UserWhereUniqueInput,
          data: data as Prisma.UserUpdateInput
        })
      }
    })
    t.crud.deleteOneUser()
  },
})
