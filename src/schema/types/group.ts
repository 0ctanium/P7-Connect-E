import {extendType, objectType} from "nexus";

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.description()
    t.model.confidentiality()
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
  },
})


export const GroupMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.crud.createOneGroup()
    t.crud.updateOneGroup()
    t.crud.deleteOneGroup()
    t.crud.deleteManyGroup()
  },
})
