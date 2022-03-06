import { shield, and, or } from 'graphql-shield'
import { user, isAdmin, isModerator } from './rules/user'

export const permissions = shield({
  Query: {
    '*': user,
  },
  User: {
    email: and(user, or(isAdmin, isModerator)),
    updatedAt: and(user, or(isAdmin, isModerator))
  }
  // Mutation: {
  //   '*': user,
  // },
})
