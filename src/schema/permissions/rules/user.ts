import { getSession } from 'next-auth/react'
import { rule } from 'graphql-shield'
import {Roles} from "../../../constants";
import {MicroRequest} from "apollo-server-micro/dist/types";

type Ctx = { req : MicroRequest }

export const user = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
  const session = await getSession(ctx)

  return Boolean(session)
})

export const isAdmin = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
  const session = await getSession(ctx)

  return session?.user.role === Roles.ADMIN
})

export const isModerator = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
  const session = await getSession(ctx)

  return session?.user.role === Roles.MODERATOR
})
