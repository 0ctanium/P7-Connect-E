import {objectType, extendType, enumType, nonNull} from 'nexus'
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
