import {objectType, extendType, stringArg, nonNull, enumType} from 'nexus'
import { Roles } from "constants/roles";

export const Role = enumType({
  name: 'Role',
  members: Object.keys(Roles)
})

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('id')
    t.string('name')
    t.string('email')
    t.string('image')
    t.field('role', { type: Role })
    t.date('createdAt')
    t.date('updatedAt')
  },
})

export const UserQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('user', {
      type: 'User',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: (_, args, ctx) => {
        return ctx.prisma.user.findUnique({
          where: { id: String(args.userId) },
        })
      },
    })
  },
})

// export const UserMutations = extendType({
//   type: 'Mutation',
//   definition: (t) => {
//     t.field('createOneUser', {
//       type: 'User',
//       args: {
//         name: stringArg(),
//         email: nonNull(stringArg()),
//       },
//       resolve: (_, { name, email }, ctx) => {
//         return ctx.prisma.user.create({
//           data: {
//             name,
//             email,
//           },
//         })
//       },
//     })
//   },
// })
