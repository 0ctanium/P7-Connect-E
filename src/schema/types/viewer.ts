import {arg, extendType, list, nonNull, objectType} from "nexus";
import {getSession} from "next-auth/react";
import {ApolloError, AuthenticationError} from "apollo-server-micro";

export const Viewer = objectType({
    name: 'Viewer',
    definition(t) {
        t.id('id')
        t.string('email')
        t.string('image')
        t.string('name')
        t.field('role', { type: 'Role' })
        t.nonNull.field('expires',  { type: 'DateTime' })

        t.field('user', {
            type: 'User',
            resolve(root, args, ctx) {
                return ctx.prisma.user.findUnique({
                    where: {
                        id: root.id || undefined
                    }
                })
            }
        })

        t.field('groups', {
            type: nonNull(list("GroupMember")),
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
                    cursor: cursor && root.id ? {
                        groupId_userId: {
                            userId: root.id,
                            groupId: cursor
                        }
                    } : undefined,
                    where: {
                        userId: root.id || undefined
                    }
                })
            }
        })
    }
})

export const ViewerQuery = extendType({
    type: 'Query',
    definition(t) {
        t.field('viewer', {
            type: Viewer,
            async resolve(root, args, ctx) {
                const session = await getSession(ctx)

                if(!session) {
                    throw new AuthenticationError("No active session")
                }


                return {
                    ...session.user,
                    expires: session.expires
                }
            }
        })
    }
})
