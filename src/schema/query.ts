import {nonNull, objectType, stringArg} from "nexus";
import prisma from 'lib/prisma'

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('user', {
      type: 'User',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: (_, args) => {
        return prisma.user.findUnique({
          where: { id: String(args.userId) },
        })
      },
    })


    t.list.field('users', {
      type: 'User',
      resolve: (_parent, _args) => {
        return prisma.user.findMany()
      },
    })

  },
})
