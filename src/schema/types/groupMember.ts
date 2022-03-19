import {objectType} from "nexus";

export const GroupMember = objectType({
  name: 'GroupMember',
  definition(t) {
    t.nonNull.field('role', { type: "Role" })
    t.nonNull.string('userId')
    t.field('user', {
      type: "User",
      resolve(root, args, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            id: root.userId
          }
        })
      }
    })

    t.nonNull.string('groupId')
    t.field('group', {
      type: "Group",
      resolve(root, args, ctx) {
        return ctx.prisma.group.findUnique({
          where: {
            id: root.groupId
          }
        })
      }
    })

    t.nonNull.field('assignedAt', { type: "DateTime" })
    t.nonNull.string('assignedById')
    t.field('assignedBy', {
      type: "User",
      resolve(root, args, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            id: root.assignedById
          }
        })
      }
    })
  }
})
